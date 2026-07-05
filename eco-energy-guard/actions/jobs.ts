"use server";

import {
  createCalendarInvite,
  createMultiDayCalendarInvite,
} from "@/lib/calendar/ics";
import { createCustomerManageLink } from "@/lib/customer/links";
import {
  sendEstimateReadyEmail,
  sendInspectionApprovedEmail,
  sendInspectionAssignedEmail,
  sendInspectionCancelledCustomerEmail,
  sendInspectionCancelledWorkerEmail,
  sendInspectionDeniedEmail,
  sendInstallationProposalAcceptedWorkerEmail,
  sendInstallationProposalChangesRequestedWorkerEmail,
  sendInstallationAssignedWorkerEmail,
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

  const { data: proposals } = await supabase
    .from("installation_proposals")
    .select("id")
    .eq("job_id", jobId)
    .eq("status", "proposed");

  if (!proposals?.length) {
    return {
      ok: false,
      message:
        "Please add an installation proposal before sending the estimate.",
    };
  }
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

export async function acceptInstallationProposalAction(
  token: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: beforeData } = await supabase.rpc(
    "get_installation_proposal_job",
    {
      p_token: token,
    },
  );

  if (!beforeData?.ok) {
    return {
      ok: false,
      message: beforeData?.message || "Invalid installation link.",
    };
  }

  const job = beforeData.job;
  const customer = beforeData.customer;
  const customerName = `${customer.first_name} ${customer.last_name}`;

  const { data, error } = await supabase.rpc("accept_installation_proposal", {
    p_token: token,
  });

  if (error || !data?.ok) {
    return {
      ok: false,
      message: error?.message || data?.message || "Unable to accept schedule.",
    };
  }

  const { data: assignments } = await supabase
    .from("job_assignments")
    .select("user_id")
    .eq("job_id", job.id)
    .eq("assignment_type", "installation");

  const assignedUserIds = (assignments || []).map((item) => item.user_id);

  if (assignedUserIds.length) {
    const { data: users } = await supabase
      .from("users")
      .select("email, full_name")
      .in("id", assignedUserIds);

    for (const user of users || []) {
      if (!user.email) continue;

      await sendInstallationProposalAcceptedWorkerEmail({
        to: user.email,
        workerName: user.full_name || user.email,
        customerName,
      });
    }
  }

  return {
    ok: true,
    message:
      "Installation schedule accepted. Eco Energy Guard will review and confirm it.",
  };
}

export async function requestInstallationProposalChangesAction(
  token: string,
  message: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  if (!message.trim()) {
    return {
      ok: false,
      message: "Please describe what needs to change.",
    };
  }

  const { data: beforeData } = await supabase.rpc(
    "get_installation_proposal_job",
    {
      p_token: token,
    },
  );

  if (!beforeData?.ok) {
    return {
      ok: false,
      message: beforeData?.message || "Invalid installation link.",
    };
  }

  const job = beforeData.job;
  const customer = beforeData.customer;
  const customerName = `${customer.first_name} ${customer.last_name}`;
  console.log("here");

  const { data, error } = await supabase.rpc(
    "request_installation_proposal_changes",
    {
      p_token: token,
      p_message: message,
    },
  );

  if (error || !data?.ok) {
    return {
      ok: false,
      message: error?.message || data?.message || "Unable to request changes.",
    };
  }

  const { data: assignments } = await supabase
    .from("job_assignments")
    .select("user_id")
    .eq("job_id", job.id);

  const assignedUserIds = (assignments || []).map((item) => item.user_id);

  if (assignedUserIds.length) {
    const { data: users } = await supabase
      .from("users")
      .select("email, full_name")
      .in("id", assignedUserIds);

    for (const user of users || []) {
      if (!user.email) continue;

      await sendInstallationProposalChangesRequestedWorkerEmail({
        to: user.email,
        workerName: user.full_name || user.email,
        customerName,
        message,
      });
    }
  }

  return {
    ok: true,
    message: "Change request sent to Eco Energy Guard.",
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
    .select("*, customers(*)")
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, message: "Job not found." };

  const customer = Array.isArray(job.customers)
    ? job.customers[0]
    : job.customers;

  if (!customer) return { ok: false, message: "Customer not found." };

  const { data: scheduleDays } = await supabase
    .from("installation_proposals")
    .select("day_number, starts_at, ends_at")
    .eq("job_id", jobId)
    .eq("status", "accepted")
    .order("day_number", { ascending: true });

  if (!scheduleDays?.length) {
    return {
      ok: false,
      message: "No accepted installation schedule found.",
    };
  }

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

  const icsContent = createMultiDayCalendarInvite({
    uid: calendarUid,
    sequence: calendarSequence,
    title: `Eco Energy Guard Installation - ${customerName}`,
    description: `Installation appointment for ${customerName}.`,
    location: address,
    organizerEmail: process.env.SMTP_USER || "info@ecoenergyguard.com",
    attendees: [customer.email, ...teamEmails],
    days: scheduleDays,
    method: "REQUEST",
  });

  try {
    await sendInstallationScheduledCustomerEmail({
      to: customer.email,
      customerName,
      scheduleDays,
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
        scheduleDays,
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

export async function createManualBookingAction(
  formData: any,
): Promise<ActionResult & { jobId?: string }> {
  const access = await requireSchedulerAccess();
  if (!access.ok) return access;

  const {
    bookingType,
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    stateValue,
    zip,
    latitude,
    longitude,
    osmPlaceId,
    scheduleDays,
    manualEstimateAmount,
    teamIds,
  } = formData;

  if (teamIds.length === 0) {
    return { ok: false, message: "Please assign at least one team member." };
  }

  // Validation
  if (
    !bookingType ||
    !firstName ||
    !lastName ||
    !email ||
    !address ||
    !scheduleDays ||
    scheduleDays.length === 0
  ) {
    return { ok: false, message: "Please fill out all required fields." };
  }

  for (const day of scheduleDays) {
    if (!day.date || !day.startTime || !day.endTime) {
      return { ok: false, message: "Please fill out all required fields." };
    }
    if (day.startTime >= day.endTime) {
      return { ok: false, message: "End time must be after start time." };
    }
  }

  const supabase = await createClient();

  // 1. Find or create customer
  let customerId = "";
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .single();

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error: customerError } = await supabase
      .from("customers")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        city,
        state: stateValue,
        zip,
        latitude,
        longitude,
        osm_place_id: osmPlaceId,
      })
      .select("id")
      .single();

    if (customerError || !newCustomer) {
      return {
        ok: false,
        message: customerError?.message || "Could not create customer.",
      };
    }
    customerId = newCustomer.id;
  }

  // 3. Create the job
  const jobPayload: any = {
    customer_id: customerId,
    status:
      bookingType === "inspection" ? "inspection_scheduled" : "estimate_sent", // Start at estimate_sent for manual installation
  };
  if (bookingType === "inspection") {
    // For inspection, there's only one day
    jobPayload.issue_notes = scheduleDays[0].notes;
  } else {
    // For installation, combine notes if needed or handle differently
    jobPayload.customer_notes = scheduleDays
      .map((d: any) => d.notes)
      .filter(Boolean)
      .join("\n");
    jobPayload.manual_estimate_amount = manualEstimateAmount || null;
  }

  const { data: newJob, error: jobError } = await supabase
    .from("jobs")
    .insert(jobPayload)
    .select("id")
    .single();

  if (jobError || !newJob) {
    return { ok: false, message: jobError?.message || "Could not create job." };
  }

  // 2. Create slots and proposals
  if (bookingType === "inspection") {
    const day = scheduleDays[0];
    const starts_at = new Date(`${day.date}T${day.startTime}`).toISOString();
    const ends_at = new Date(`${day.date}T${day.endTime}`).toISOString();

    const { data: newSlot, error: slotError } = await supabase
      .from("slots")
      .insert({
        type: "inspection",
        starts_at,
        ends_at,
        is_available: false,
        notes: "Manual booking",
      })
      .select("id")
      .single();

    if (slotError || !newSlot) {
      // Attempt to clean up created job
      await supabase.from("jobs").delete().eq("id", newJob.id);
      return {
        ok: false,
        message: slotError?.message || "Could not create time slot.",
      };
    }

    await supabase
      .from("jobs")
      .update({ inspection_slot_id: newSlot.id })
      .eq("id", newJob.id);
  } else {
    // Installation
    const proposalPayload = scheduleDays.map((day: any, index: number) => ({
      job_id: newJob.id,
      day_number: index + 1,
      starts_at: new Date(`${day.date}T${day.startTime}`).toISOString(),
      ends_at: new Date(`${day.date}T${day.endTime}`).toISOString(),
      notes: day.notes || null,
      status: "accepted", // Manually booked is auto-accepted
    }));

    await supabase.from("installation_proposals").insert(proposalPayload);

    await supabase
      .from("jobs")
      .update({ status: "installation_requested" }) // Set to a state where it can be approved
      .eq("id", newJob.id);
  }

  // 4. Create job assignments
  const assignments = teamIds.map((userId: string) => ({
    job_id: newJob.id,
    user_id: userId,
    assignment_type: bookingType,
  }));

  await supabase.from("job_assignments").insert(assignments);

  // 5. Send confirmation emails and calendar invites
  try {
    const { data: teamMembers } = await supabase
      .from("users")
      .select("email, full_name")
      .in("id", teamIds);

    if (!teamMembers)
      throw new Error("Could not retrieve team member details.");

    const teamEmails = teamMembers
      .map((m) => m.email)
      .filter(Boolean) as string[];
    const fullAddress = [address, city, stateValue, zip]
      .filter(Boolean)
      .join(", ");
    const customerName = `${firstName} ${lastName}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const jobLink = `${siteUrl}/admin/jobs/${newJob.id}`;

    if (bookingType === "inspection") {
      const day = scheduleDays[0];
      const starts_at = new Date(`${day.date}T${day.startTime}`).toISOString();
      const ends_at = new Date(`${day.date}T${day.endTime}`).toISOString();
      const calendarUid = `inspection-${newJob.id}@ecoenergyguard.com`;
      const token = await createManageToken(newJob.id);
      if (!token)
        throw new Error(
          "Could not create customer manage link for manual booking.",
        );
      const manageLink = createCustomerManageLink(token);
      const icsContent = createCalendarInvite({
        uid: calendarUid,
        sequence: 0,
        title: `Eco Energy Guard Inspection - ${customerName}`,
        description: `Home energy inspection for ${customerName}.`,
        location: fullAddress,
        startsAt: starts_at,
        endsAt: ends_at,
        organizerEmail: process.env.SMTP_USER || "info@ecoenergyguard.com",
        attendees: [email, ...teamEmails],
        method: "REQUEST",
      });

      await sendInspectionApprovedEmail({
        to: email,
        customerName,
        startsAt: starts_at,
        endsAt: ends_at,
        address: fullAddress,
        manageLink: manageLink,
        icsContent,
      });

      for (const member of teamMembers) {
        if (!member.email) continue;
        await sendInspectionAssignedEmail({
          to: member.email,
          workerName: member.full_name || member.email,
          customerName,
          customerEmail: email,
          customerPhone: phone,
          startsAt: starts_at,
          endsAt: ends_at,
          address: fullAddress,
          issueNotes: day.notes,
          jobLink,
          icsContent,
        });
      }

      await supabase
        .from("jobs")
        .update({
          inspection_calendar_uid: calendarUid,
          inspection_calendar_sequence: 0,
        })
        .eq("id", newJob.id);
    } else {
      // Installation
      const calendarUid = `installation-${newJob.id}@ecoenergyguard.com`;
      const icsContent = createMultiDayCalendarInvite({
        uid: calendarUid,
        sequence: 0,
        title: `Eco Energy Guard Installation - ${customerName}`,
        description: `Installation appointment for ${customerName}.`,
        location: fullAddress,
        organizerEmail: process.env.SMTP_USER || "info@ecoenergyguard.com",
        attendees: [email, ...teamEmails],
        days: scheduleDays,
        method: "REQUEST",
      });

      await sendInstallationScheduledCustomerEmail({
        to: email,
        customerName,
        scheduleDays,
        address: fullAddress,
        icsContent,
      });

      for (const member of teamMembers) {
        if (!member.email) continue;
        await sendInstallationAssignedWorkerEmail({
          to: member.email,
          workerName: member.full_name || member.email,
          customerName,
          customerEmail: email,
          customerPhone: phone,
          scheduleDays,
          address: fullAddress,
          jobLink,
          icsContent,
        });
      }

      await supabase
        .from("jobs")
        .update({
          installation_calendar_uid: calendarUid,
          installation_calendar_sequence: 0,
        })
        .eq("id", newJob.id);
    }
  } catch (error) {
    // Don't fail the whole action if emails fail, but report it.
    return {
      ok: true, // The booking was still created
      jobId: newJob.id,
      message:
        "Booking created, but sending confirmation emails failed. Please check the job details and notify the customer manually.",
    };
  }

  return {
    ok: true,
    message:
      "Manual booking created and confirmation emails sent. Redirecting...",
    jobId: newJob.id,
  };
}

export async function resendLastEmailAction(
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
      customers (*)
    `,
    )
    .eq("id", jobId)
    .single();

  if (!job) return { ok: false, message: "Job not found." };

  const customer = Array.isArray(job.customers)
    ? job.customers[0]
    : job.customers;
  if (!customer) return { ok: false, message: "Customer not found." };

  const customerName = `${customer.first_name} ${customer.last_name}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jobLink = `${siteUrl}/admin/jobs/${jobId}`;
  const address = [
    customer.address,
    customer.city,
    customer.state,
    customer.zip,
  ]
    .filter(Boolean)
    .join(", ");

  try {
    switch (job.status) {
      // NOTE: This case still uses the old single-slot logic for inspections.
      // This is correct as inspections are still single-day events.
      case "inspection_scheduled": {
        const { data: slotData } = await supabase
          .from("slots")
          .select("starts_at, ends_at")
          .eq("id", job.inspection_slot_id as string)
          .single();
        const slot = slotData;
        if (!slot) return { ok: false, message: "Inspection slot not found." };

        const token = await createManageToken(jobId);
        if (!token)
          return { ok: false, message: "Could not create manage link." };
        const manageLink = createCustomerManageLink(token);

        const { data: assignments } = await supabase
          .from("job_assignments")
          .select("user_id")
          .eq("job_id", jobId)
          .eq("assignment_type", "inspection");

        const assignedUserIds = (assignments || []).map(
          (assignment) => assignment.user_id,
        );

        const { data: teamMembers } = assignedUserIds.length
          ? await supabase
              .from("users")
              .select("email")
              .in("id", assignedUserIds)
          : { data: [] };

        const teamEmails =
          teamMembers?.map((member) => member.email).filter(Boolean) || [];

        const calendarUid =
          job.inspection_calendar_uid ||
          `inspection-${jobId}@ecoenergyguard.com`;

        const newSequence = (job.inspection_calendar_sequence || 0) + 1;

        const icsContent = createCalendarInvite({
          uid: calendarUid,
          sequence: newSequence,
          title: `Eco Energy Guard Inspection - ${customerName}`,
          description: `Home energy inspection for ${customerName}.\n\nManage appointment: ${manageLink}`,
          location: address,
          startsAt: slot.starts_at,
          endsAt: slot.ends_at,
          organizerEmail: process.env.SMTP_USER || "info@ecoenergyguard.com",
          attendees: [customer.email, ...teamEmails],
          method: "REQUEST",
        });

        await sendInspectionApprovedEmail({
          to: customer.email,
          customerName,
          startsAt: slot.starts_at,
          endsAt: slot.ends_at,
          address,
          manageLink,
          icsContent,
        });

        await supabase
          .from("jobs")
          .update({ inspection_calendar_sequence: newSequence })
          .eq("id", jobId);

        return { ok: true, message: "Inspection approval email resent." };
      }

      case "reschedule_requested": {
        const token = await createManageToken(jobId);
        if (!token)
          return { ok: false, message: "Could not create manage link." };
        const manageLink = createCustomerManageLink(token);

        await sendInspectionRescheduleEmail({
          to: customer.email,
          customerName,
          manageLink,
        });
        return { ok: true, message: "Reschedule request email resent." };
      }

      case "estimate_sent": {
        const token = await createManageToken(jobId);
        if (!token)
          return {
            ok: false,
            message: "Could not create installation scheduling link.",
          };
        const scheduleLink = `${siteUrl}/schedule-installation/${token}`;

        await sendEstimateReadyEmail({
          to: customer.email,
          customerName,
          estimateAmount: job.manual_estimate_amount,
          customerNotes: job.customer_notes,
          scheduleLink,
        });
        return { ok: true, message: "Estimate email resent to customer." };
      }

      case "installation_scheduled": {
        const { data: scheduleDays } = await supabase
          .from("installation_proposals")
          .select("day_number, starts_at, ends_at")
          .eq("job_id", jobId)
          .eq("status", "accepted")
          .order("day_number", { ascending: true });
        if (!scheduleDays?.length)
          return { ok: false, message: "Installation schedule not found." };

        const { data: assignments } = await supabase
          .from("job_assignments")
          .select("user_id")
          .eq("job_id", jobId)
          .eq("assignment_type", "installation");

        const assignedUserIds = (assignments || []).map(
          (assignment) => assignment.user_id,
        );

        const { data: teamMembers } = assignedUserIds.length
          ? await supabase
              .from("users")
              .select("email")
              .in("id", assignedUserIds)
          : { data: [] };

        const teamEmails =
          teamMembers?.map((member) => member.email).filter(Boolean) || [];

        const calendarUid =
          job.installation_calendar_uid ||
          `installation-${jobId}@ecoenergyguard.com`;

        const newSequence = (job.installation_calendar_sequence || 0) + 1;

        const icsContent = createMultiDayCalendarInvite({
          uid: calendarUid,
          sequence: newSequence,
          title: `Eco Energy Guard Installation - ${customerName}`,
          description: `Installation appointment for ${customerName}.`,
          location: address,
          organizerEmail: process.env.SMTP_USER || "info@ecoenergyguard.com",
          attendees: [customer.email, ...teamEmails],
          days: scheduleDays,
          method: "REQUEST",
        });

        await sendInstallationScheduledCustomerEmail({
          to: customer.email,
          customerName,
          scheduleDays,
          address,
          icsContent,
        });

        await supabase
          .from("jobs")
          .update({ installation_calendar_sequence: newSequence })
          .eq("id", jobId);

        return { ok: true, message: "Installation confirmation email resent." };
      }

      case "cancelled": {
        await sendInspectionDeniedEmail({
          to: customer.email,
          customerName,
        });
        return { ok: true, message: "Job cancellation email resent." };
      }

      default:
        return {
          ok: false,
          message: `No email to resend for job status: ${job.status}`,
        };
    }
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to resend email.",
    };
  }
}
