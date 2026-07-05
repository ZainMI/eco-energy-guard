import nodemailer from "nodemailer";
import {
  estimateReadyHtml,
  inspectionApprovedHtml,
  installationProposalAcceptedWorkerHtml,
  installationProposalChangesRequestedWorkerHtml,
  installationAssignedWorkerHtml,
  inspectionAssignedHtml,
  inspectionCancelledCustomerHtml,
  inspectionCancelledWorkerHtml,
  inspectionDeniedHtml,
  inspectionRescheduleHtml,
  inspectionRescheduleWorkerHtml,
  installationScheduledCustomerHtml,
} from "@/lib/email/templates";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from =
  process.env.EMAIL_FROM || `Eco Energy Guard <${process.env.SMTP_USER}>`;

export async function sendInspectionApprovedEmail({
  to,
  customerName,
  startsAt,
  endsAt,
  address,
  manageLink,
  icsContent,
}: {
  to: string;
  customerName: string;
  startsAt: string;
  endsAt: string;
  address: string;
  manageLink: string;
  icsContent: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: "Your Eco Energy Guard inspection is confirmed",
    html: inspectionApprovedHtml({
      customerName,
      startsAt,
      endsAt,
      address,
      manageLink,
    }),
    attachments: [
      {
        filename: "inspection.ics",
        content: icsContent,
        contentType: "text/calendar; method=REQUEST",
      },
    ],
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

type ScheduleDay = {
  day_number: number;
  starts_at: string;
  ends_at: string;
};

export async function sendInstallationProposalAcceptedWorkerEmail({
  to,
  workerName,
  customerName,
}: {
  to: string;
  workerName: string;
  customerName: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: `Installation schedule accepted: ${customerName}`,
    html: installationProposalAcceptedWorkerHtml({
      workerName,
      customerName,
    }),
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendInstallationProposalChangesRequestedWorkerEmail({
  to,
  workerName,
  customerName,
  message,
}: {
  to: string;
  workerName: string;
  customerName: string;
  message: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: `Installation schedule changes requested: ${customerName}`,
    html: installationProposalChangesRequestedWorkerHtml({
      workerName,
      customerName,
      message,
    }),
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendInstallationScheduledCustomerEmail({
  to,
  customerName,
  scheduleDays,
  address,
  icsContent,
}: {
  to: string;
  customerName: string;
  scheduleDays: ScheduleDay[];
  address: string;
  icsContent: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: "Your Eco Energy Guard installation is scheduled",
    html: installationScheduledCustomerHtml({
      customerName,
      scheduleDays,
      address,
    }),
    attachments: [
      {
        filename: "installation.ics",
        content: icsContent,
        contentType: "text/calendar; method=REQUEST",
      },
    ],
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendInstallationAssignedWorkerEmail({
  to,
  workerName,
  customerName,
  customerEmail,
  customerPhone,
  scheduleDays,
  address,
  jobLink,
  icsContent,
}: {
  to: string;
  workerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  scheduleDays: ScheduleDay[];
  address: string;
  jobLink: string;
  icsContent: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: `Installation assigned: ${customerName}`,
    html: installationAssignedWorkerHtml({
      workerName,
      customerName,
      customerEmail,
      customerPhone,
      scheduleDays,
      address,
      jobLink,
    }),
    attachments: [
      {
        filename: "installation.ics",
        content: icsContent,
        contentType: "text/calendar; method=REQUEST",
      },
    ],
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendEstimateReadyEmail({
  to,
  customerName,
  estimateAmount,
  customerNotes,
  scheduleLink,
}: {
  to: string;
  customerName: string;
  estimateAmount: number | null;
  customerNotes?: string | null;
  scheduleLink: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: "Your Eco Energy Guard estimate is ready",
    html: estimateReadyHtml({
      customerName,
      estimateAmount,
      customerNotes,
      scheduleLink,
    }),
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendInspectionAssignedEmail({
  to,
  workerName,
  customerName,
  customerEmail,
  customerPhone,
  startsAt,
  endsAt,
  address,
  issueNotes,
  jobLink,
  icsContent,
}: {
  to: string;
  workerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  startsAt: string;
  endsAt: string;
  address: string;
  issueNotes?: string | null;
  jobLink: string;
  icsContent: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: `Inspection assigned: ${customerName}`,
    html: inspectionAssignedHtml({
      workerName,
      customerName,
      customerEmail,
      customerPhone,
      startsAt,
      endsAt,
      address,
      issueNotes,
      jobLink,
    }),
    attachments: [
      {
        filename: "inspection.ics",
        content: icsContent,
        contentType: "text/calendar; method=REQUEST",
      },
    ],
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendInspectionCancelledCustomerEmail({
  to,
  customerName,
  icsContent,
}: {
  to: string;
  customerName: string;
  icsContent: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: "Your Eco Energy Guard inspection has been cancelled",
    html: inspectionCancelledCustomerHtml({ customerName }),
    attachments: [
      {
        filename: "inspection-cancelled.ics",
        content: icsContent,
        contentType: "text/calendar; method=CANCEL",
      },
    ],
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendInspectionCancelledWorkerEmail({
  to,
  workerName,
  customerName,
  address,
  icsContent,
}: {
  to: string;
  workerName: string;
  customerName: string;
  address: string;
  icsContent: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: `Inspection cancelled: ${customerName}`,
    html: inspectionCancelledWorkerHtml({
      workerName,
      customerName,
      address,
    }),
    attachments: [
      {
        filename: "inspection-cancelled.ics",
        content: icsContent,
        contentType: "text/calendar; method=CANCEL",
      },
    ],
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendInspectionRescheduleEmail({
  to,
  customerName,
  manageLink,
}: {
  to: string;
  customerName: string;
  manageLink: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: "Please reschedule your Eco Energy Guard inspection",
    html: inspectionRescheduleHtml({
      customerName,
      manageLink,
    }),
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendInspectionDeniedEmail({
  to,
  customerName,
}: {
  to: string;
  customerName: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: "Eco Energy Guard inspection request update",
    html: inspectionDeniedHtml({
      customerName,
    }),
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}

export async function sendInspectionRescheduleWorkerEmail({
  to,
  workerName,
  customerName,
  manageLink,
}: {
  to: string;
  workerName: string;
  customerName: string;
  manageLink: string;
}) {
  const result = await transporter.sendMail({
    from,
    to,
    subject: `Reschedule requested: ${customerName}`,
    html: inspectionRescheduleWorkerHtml({
      workerName,
      customerName,
    }),
  });

  return {
    accepted: result.accepted.map(String),
    id: result.messageId,
  };
}
