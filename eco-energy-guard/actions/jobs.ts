"use server";

import { createCalendarInvite } from "@/lib/calendar/ics";
import { createCustomerManageLink } from "@/lib/customer/links";
import {
  sendEstimateReadyEmail,
  sendInspectionApprovedEmail,
  sendInspectionAssignedEmail,
  sendInspectionCancelledCustomerEmail,
  sendInspectionCancelledWorkerEmail,
  sendInspectionDeniedEmail,
  sendInstallationAssignedWorkerEmail,
  sendInstallationRequestedWorkerEmail,
  sendInstallationScheduledCustomerEmail,
  sendInspectionRescheduleEmail,
  sendInspectionRescheduleWorkerEmail,
} from "@/lib/email/smtp";
import { createClient } from "@/lib/supabase/server";

type ActionResult = {
  ok: boolean;
  message: string;
};

async function requireSchedulerAccess(): Promise<ActionResult | { ok: true }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "You must be signed in." };

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["owner", "admin", "employee"].includes(profile.role)) {
    return {
      ok: false,
      message: "You do not have permission to manage scheduling.",
    };
  }

  return { ok: true };
}

async function createManageToken(jobId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("job_tokens")
    .insert({
      job_id: jobId,
      purpose: "manage_job",
      expires_at: null,
    })
    .select("token")
    .single();

  return data?.token || null;
}

export async function approveInspectionAction(
  jobId: string,
  inspectionTeamIds: string[],
): Promise<ActionResult> {
  const access = await requireSchedulerAccess();
  if (!access.ok) return access;

  if (inspectionTeamIds.length === 0) {
    return {
      ok: false,
      message: "Please assign at least one team member.",
    };
  }

  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customers (*),
      slots:inspection_slot_id (*)
    `,
    )
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, message: "Job not found." };

  const customer = Array.isArray(job.customers)
    ? job.customers[0]
    : job.customers;

  const slot = Array.isArray(job.slots) ? job.slots[0] : job.slots;

  if (!customer) return { ok: false, message: "Customer not found." };
  if (!slot) return { ok: false, message: "Inspection slot not found." };

  const { data: teamMembers } = await supabase
    .from("users")
    .select("id, email, full_name")
    .in("id", inspectionTeamIds);

  const validTeamMembers =
    teamMembers?.filter((member) => Boolean(member.email)) || [];

  await supabase
    .from("job_assignments")
    .delete()
    .eq("job_id", jobId)
    .eq("assignment_type", "inspection");

  await supabase.from("job_assignments").insert(
    inspectionTeamIds.map((userId) => ({
      job_id: jobId,
      user_id: userId,
      assignment_type: "inspection",
    })),
  );

  const token = await createManageToken(jobId);

  if (!token) {
    return { ok: false, message: "Could not create customer manage link." };
  }

  const customerName = `${customer.first_name} ${customer.last_name}`;
  const address = [
    customer.address,
    customer.city,
    customer.state,
    customer.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const manageLink = createCustomerManageLink(token);
  const jobLink = `${siteUrl}/admin/jobs/${jobId}`;

  const teamEmails = validTeamMembers.map((member) => member.email as string);

  const calendarUid =
    job.inspection_calendar_uid || `inspection-${jobId}@ecoenergyguard.com`;

  const calendarSequence = job.inspection_calendar_uid
    ? (job.inspection_calendar_sequence || 0) + 1
    : 0;

  const icsContent = createCalendarInvite({
    uid: calendarUid,
    sequence: calendarSequence,
    title: `Eco Energy Guard Inspection - ${customerName}`,
    description: `Home energy inspection for ${customerName}.\n\nManage appointment: ${manageLink}`,
    location: address,
    startsAt: slot.starts_at,
    endsAt: slot.ends_at,
    organizerEmail: process.env.SMTP_USER || "info@ecoenergyguard.com",
    attendees: [customer.email, ...teamEmails],
    method: "REQUEST",
  });

  try {
    const customerEmailResult = await sendInspectionApprovedEmail({
      to: customer.email,
      customerName,
      startsAt: slot.starts_at,
      endsAt: slot.ends_at,
      address,
      manageLink,
      icsContent,
    });

    if (!customerEmailResult.accepted.length) {
      return { ok: false, message: "Customer email could not be sent." };
    }

    for (const member of validTeamMembers) {
      const workerEmailResult = await sendInspectionAssignedEmail({
        to: member.email as string,
        workerName: member.full_name || member.email || "Team member",
        customerName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        startsAt: slot.starts_at,
        endsAt: slot.ends_at,
        address,
        issueNotes: job.issue_notes,
        jobLink,
        icsContent,
      });

      if (!workerEmailResult.accepted.length) {
        return {
          ok: false,
          message: `Worker email could not be sent to ${member.email}.`,
        };
      }
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Email sending failed.",
    };
  }

  await supabase
    .from("jobs")
    .update({
      status: "inspection_scheduled",
      inspection_calendar_uid: calendarUid,
      inspection_calendar_sequence: calendarSequence,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  await supabase
    .from("slots")
    .update({ is_available: false })
    .eq("id", job.inspection_slot_id);

  return {
    ok: true,
    message: "Inspection approved. Customer and team emails were sent.",
  };
}

export async function requestInspectionRescheduleAction(
  jobId: string,
): Promise<ActionResult> {
  const access = await requireSchedulerAccess();
  if (!access.ok) return access;

  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*, customers(*)")
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, message: "Job not found." };

  const customer = Array.isArray(job.customers)
    ? job.customers[0]
    : job.customers;

  if (!customer) return { ok: false, message: "Customer not found." };

  const token = await createManageToken(jobId);
  if (!token) return { ok: false, message: "Could not create manage link." };

  const manageLink = createCustomerManageLink(token);
  const customerName = `${customer.first_name} ${customer.last_name}`;

  try {
    const emailResult = await sendInspectionRescheduleEmail({
      to: customer.email,
      customerName,
      manageLink,
    });

    if (!emailResult.accepted.length) {
      return { ok: false, message: "Customer email could not be sent." };
    }

    const { data: assignments } = await supabase
      .from("job_assignments")
      .select("user_id")
      .eq("job_id", jobId)
      .eq("assignment_type", "inspection");

    const assignedUserIds = (assignments || []).map(
      (assignment) => assignment.user_id,
    );

    if (assignedUserIds.length > 0) {
      const { data: assignedUsers } = await supabase
        .from("users")
        .select("email, full_name")
        .in("id", assignedUserIds);

      for (const member of assignedUsers || []) {
        if (!member.email) continue;

        await sendInspectionRescheduleWorkerEmail({
          to: member.email,
          workerName: member.full_name || member.email,
          customerName,
          manageLink,
        });
      }
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Email sending failed.",
    };
  }

  await supabase
    .from("jobs")
    .update({
      status: "reschedule_requested",
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  if (job.inspection_slot_id) {
    await supabase
      .from("slots")
      .update({ is_available: true })
      .eq("id", job.inspection_slot_id);
  }

  return {
    ok: true,
    message: "Reschedule email sent to customer and assigned team.",
  };
}

export async function denyInspectionAction(
  jobId: string,
): Promise<ActionResult> {
  const access = await requireSchedulerAccess();
  if (!access.ok) return access;

  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*, customers(*)")
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, message: "Job not found." };

  const customer = Array.isArray(job.customers)
    ? job.customers[0]
    : job.customers;

  if (!customer) return { ok: false, message: "Customer not found." };

  const customerName = `${customer.first_name} ${customer.last_name}`;

  try {
    const emailResult = await sendInspectionDeniedEmail({
      to: customer.email,
      customerName,
    });

    if (!emailResult.accepted.length) {
      return { ok: false, message: "Email could not be sent." };
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Email sending failed.",
    };
  }

  await supabase
    .from("jobs")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  if (job.inspection_slot_id) {
    await supabase
      .from("slots")
      .update({ is_available: true })
      .eq("id", job.inspection_slot_id);
  }

  return {
    ok: true,
    message: "Inspection request denied and customer email sent.",
  };
}

export async function cancelManagedJobAction(
  token: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "cancel_managed_job_with_notifications",
    {
      p_token: token,
    },
  );

  if (error || !data?.ok) {
    return {
      ok: false,
      message:
        error?.message || data?.message || "Unable to cancel appointment.",
    };
  }

  const job = data.job;
  const customer = data.customer;
  const slot = data.slot;
  const team = data.team || [];

  const customerName = `${customer.first_name} ${customer.last_name}`;
  const address = [
    customer.address,
    customer.city,
    customer.state,
    customer.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const teamEmails = team
    .map((member: { email?: string }) => member.email)
    .filter(Boolean);

  const calendarUid =
    job.inspection_calendar_uid || `inspection-${job.id}@ecoenergyguard.com`;

  const calendarSequence = (job.inspection_calendar_sequence || 0) + 1;

  const icsContent = createCalendarInvite({
    uid: calendarUid,
    sequence: calendarSequence,
    title: `Eco Energy Guard Inspection - ${customerName}`,
    description: "This inspection has been cancelled.",
    location: address,
    startsAt: slot.starts_at,
    endsAt: slot.ends_at,
    organizerEmail: process.env.SMTP_USER || "info@ecoenergyguard.com",
    attendees: [customer.email, ...teamEmails],
    method: "CANCEL",
  });

  await supabase
    .from("jobs")
    .update({
      inspection_calendar_uid: calendarUid,
      inspection_calendar_sequence: calendarSequence,
    })
    .eq("id", job.id);

  try {
    await sendInspectionCancelledCustomerEmail({
      to: customer.email,
      customerName,
      icsContent,
    });

    for (const member of team) {
      if (!member.email) continue;

      await sendInspectionCancelledWorkerEmail({
        to: member.email,
        workerName: member.full_name || member.email,
        customerName,
        address,
        icsContent,
      });
    }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Appointment cancelled, but email failed.",
    };
  }

  return {
    ok: true,
    message: "Appointment cancelled and cancellation emails sent.",
  };
}

export async function rescheduleManagedJobAction(
  token: string,
  slotId: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: beforeData } = await supabase.rpc("get_manage_job", {
    p_token: token,
  });

  if (!beforeData?.ok) {
    return {
      ok: false,
      message: beforeData?.message || "Invalid manage link.",
    };
  }

  const job = beforeData.job;
  const customer = beforeData.customer;

  const customerName = `${customer.first_name} ${customer.last_name}`;

  const { data: result, error } = await supabase.rpc("reschedule_managed_job", {
    p_token: token,
    p_slot_id: slotId,
  });

  if (error || !result?.ok) {
    return {
      ok: false,
      message: error?.message || result?.message || "Unable to reschedule.",
    };
  }

  const { data: assignments } = await supabase
    .from("job_assignments")
    .select("user_id")
    .eq("job_id", job.id)
    .eq("assignment_type", "inspection");

  const assignedUserIds = (assignments || []).map(
    (assignment) => assignment.user_id,
  );

  if (assignedUserIds.length > 0) {
    const { data: assignedUsers } = await supabase
      .from("users")
      .select("email, full_name")
      .in("id", assignedUserIds);

    for (const member of assignedUsers || []) {
      if (!member.email) continue;

      await sendInspectionRescheduleWorkerEmail({
        to: member.email,
        workerName: member.full_name || member.email,
        customerName,
        manageLink: createCustomerManageLink(token),
      });
    }
  }

  return {
    ok: true,
    message:
      "New inspection time requested. The assigned team has been notified.",
  };
}

export async function sendEstimateAction(jobId: string): Promise<ActionResult> {
  const access = await requireSchedulerAccess();
  if (!access.ok) return access;

  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*, customers(*)")
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, message: "Job not found." };

  const customer = Array.isArray(job.customers)
    ? job.customers[0]
    : job.customers;

  if (!customer) return { ok: false, message: "Customer not found." };

  const token = await createManageToken(jobId);

  if (!token) {
    return {
      ok: false,
      message: "Could not create installation scheduling link.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const scheduleLink = `${siteUrl}/schedule-installation/${token}`;
  const customerName = `${customer.first_name} ${customer.last_name}`;

  const { data: inspectionAssignments } = await supabase
    .from("job_assignments")
    .select("user_id")
    .eq("job_id", jobId)
    .eq("assignment_type", "inspection");

  await supabase
    .from("job_assignments")
    .delete()
    .eq("job_id", jobId)
    .eq("assignment_type", "installation");

  if (inspectionAssignments?.length) {
    await supabase.from("job_assignments").insert(
      inspectionAssignments.map((assignment) => ({
        job_id: jobId,
        user_id: assignment.user_id,
        assignment_type: "installation",
      })),
    );
  }
  try {
    const { data: inspectionAssignments } = await supabase
      .from("job_assignments")
      .select("user_id")
      .eq("job_id", jobId)
      .eq("assignment_type", "inspection");

    await supabase
      .from("job_assignments")
      .delete()
      .eq("job_id", jobId)
      .eq("assignment_type", "installation");

    if (inspectionAssignments?.length) {
      await supabase.from("job_assignments").insert(
        inspectionAssignments.map((assignment) => ({
          job_id: jobId,
          user_id: assignment.user_id,
          assignment_type: "installation",
        })),
      );
    }
    const emailResult = await sendEstimateReadyEmail({
      to: customer.email,
      customerName,
      estimateAmount: job.manual_estimate_amount,
      customerNotes: job.customer_notes,
      scheduleLink,
    });

    if (!emailResult.accepted.length) {
      return { ok: false, message: "Estimate email could not be sent." };
    }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Estimate email failed.",
    };
  }

  await supabase
    .from("jobs")
    .update({
      status: "estimate_sent",
      estimate_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  return {
    ok: true,
    message: "Estimate email sent to customer.",
  };
}

export async function requestInstallationAction(
  token: string,
  slotId: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "schedule_installation_managed_job_with_notifications",
    {
      p_token: token,
      p_slot_id: slotId,
    },
  );

  if (error || !data?.ok) {
    return {
      ok: false,
      message:
        error?.message || data?.message || "Unable to request installation.",
    };
  }

  const customer = data.customer;
  const team = data.team || [];
  const customerName = `${customer.first_name} ${customer.last_name}`;

  try {
    for (const member of team) {
      if (!member.email) continue;

      await sendInstallationRequestedWorkerEmail({
        to: member.email,
        workerName: member.full_name || member.email,
        customerName,
      });
    }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Installation request saved, but team email failed.",
    };
  }

  return {
    ok: true,
    message:
      "Installation time requested. Eco Energy Guard will review and confirm it.",
  };
}

export async function approveInstallationAction(
  jobId: string,
): Promise<ActionResult> {
  const access = await requireSchedulerAccess();
  if (!access.ok) return access;

  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select(
      `
      *,
      customers (*),
      slots:installation_slot_id (*)
    `,
    )
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, message: "Job not found." };

  const customer = Array.isArray(job.customers)
    ? job.customers[0]
    : job.customers;

  const slot = Array.isArray(job.slots) ? job.slots[0] : job.slots;

  if (!customer) return { ok: false, message: "Customer not found." };
  if (!slot) return { ok: false, message: "Installation slot not found." };

  const { data: assignments } = await supabase
    .from("job_assignments")
    .select("user_id")
    .eq("job_id", jobId)
    .eq("assignment_type", "installation");

  const assignedUserIds = (assignments || []).map((item) => item.user_id);

  const { data: teamMembers } = assignedUserIds.length
    ? await supabase
        .from("users")
        .select("email, full_name")
        .in("id", assignedUserIds)
    : { data: [] };

  const teamEmails =
    teamMembers?.map((member) => member.email).filter(Boolean) || [];

  const customerName = `${customer.first_name} ${customer.last_name}`;
  const address = [
    customer.address,
    customer.city,
    customer.state,
    customer.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const calendarUid =
    job.installation_calendar_uid || `installation-${jobId}@ecoenergyguard.com`;

  const calendarSequence = job.installation_calendar_uid
    ? (job.installation_calendar_sequence || 0) + 1
    : 0;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jobLink = `${siteUrl}/admin/jobs/${jobId}`;

  const icsContent = createCalendarInvite({
    uid: calendarUid,
    sequence: calendarSequence,
    title: `Eco Energy Guard Installation - ${customerName}`,
    description: `Installation appointment for ${customerName}.`,
    location: address,
    startsAt: slot.starts_at,
    endsAt: slot.ends_at,
    organizerEmail: process.env.SMTP_USER || "info@ecoenergyguard.com",
    attendees: [customer.email, ...teamEmails],
    method: "REQUEST",
  });

  try {
    await sendInstallationScheduledCustomerEmail({
      to: customer.email,
      customerName,
      startsAt: slot.starts_at,
      endsAt: slot.ends_at,
      address,
      icsContent,
    });

    for (const member of teamMembers || []) {
      if (!member.email) continue;

      await sendInstallationAssignedWorkerEmail({
        to: member.email,
        workerName: member.full_name || member.email,
        customerName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        startsAt: slot.starts_at,
        endsAt: slot.ends_at,
        address,
        jobLink,
        icsContent,
      });
    }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Installation confirmation email failed.",
    };
  }

  await supabase
    .from("jobs")
    .update({
      status: "installation_scheduled",
      installation_calendar_uid: calendarUid,
      installation_calendar_sequence: calendarSequence,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  return {
    ok: true,
    message: "Installation approved and confirmation emails sent.",
  };
}

export async function scheduleInstallationManagedJobAction(
  token: string,
  slotId: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "schedule_installation_managed_job_with_notifications",
    {
      p_token: token,
      p_slot_id: slotId,
    },
  );

  if (error || !data?.ok) {
    return {
      ok: false,
      message:
        error?.message || data?.message || "Unable to schedule installation.",
    };
  }

  const job = data.job;
  const customer = data.customer;
  const slot = data.slot;
  const team = data.team || [];

  const customerName = `${customer.first_name} ${customer.last_name}`;
  const address = [
    customer.address,
    customer.city,
    customer.state,
    customer.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const teamEmails = team
    .map((member: { email?: string }) => member.email)
    .filter(Boolean);

  const calendarUid =
    job.installation_calendar_uid ||
    `installation-${job.id}@ecoenergyguard.com`;

  const calendarSequence = job.installation_calendar_uid
    ? (job.installation_calendar_sequence || 0) + 1
    : 0;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jobLink = `${siteUrl}/admin/jobs/${job.id}`;

  const icsContent = createCalendarInvite({
    uid: calendarUid,
    sequence: calendarSequence,
    title: `Eco Energy Guard Installation - ${customerName}`,
    description: `Installation appointment for ${customerName}.`,
    location: address,
    startsAt: slot.starts_at,
    endsAt: slot.ends_at,
    organizerEmail: process.env.SMTP_USER || "info@ecoenergyguard.com",
    attendees: [customer.email, ...teamEmails],
    method: "REQUEST",
  });

  await supabase
    .from("jobs")
    .update({
      installation_calendar_uid: calendarUid,
      installation_calendar_sequence: calendarSequence,
      updated_at: new Date().toISOString(),
    })
    .eq("id", job.id);

  try {
    await sendInstallationScheduledCustomerEmail({
      to: customer.email,
      customerName,
      startsAt: slot.starts_at,
      endsAt: slot.ends_at,
      address,
      icsContent,
    });

    for (const member of team) {
      if (!member.email) continue;

      await sendInstallationAssignedWorkerEmail({
        to: member.email,
        workerName: member.full_name || member.email,
        customerName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        startsAt: slot.starts_at,
        endsAt: slot.ends_at,
        address,
        jobLink,
        icsContent,
      });
    }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Installation email failed.",
    };
  }

  return {
    ok: true,
    message: "Installation scheduled and confirmation emails sent.",
  };
}

export async function completeJobAction(jobId: string): Promise<ActionResult> {
  const access = await requireSchedulerAccess();
  if (!access.ok) return access;

  const supabase = await createClient();

  const { error } = await supabase
    .from("jobs")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId);

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: "Job marked as completed.",
  };
}
