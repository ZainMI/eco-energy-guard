import { formatDateTimeRange } from "@/lib/date";

export function inspectionApprovedHtml({
  customerName,
  startsAt,
  endsAt,
  address,
  manageLink,
}: {
  customerName: string;
  startsAt: string;
  endsAt: string;
  address: string;
  manageLink: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Your inspection is confirmed</h1>
      <p>Hi ${customerName},</p>
      <p>Your Eco Energy Guard home energy inspection has been approved and scheduled.</p>

      <div style="background:#f6f3ea; border-radius:16px; padding:20px; margin:24px 0;">
        <p><strong>Time:</strong> ${formatDateTimeRange(startsAt, endsAt)}</p>
        <p><strong>Address:</strong> ${address}</p>
      </div>

      <p>A calendar invite is attached to this email.</p>

      <p>
        Need to make a change?<br />
        <a href="${manageLink}" style="color:#047857; font-weight:bold;">
          Reschedule or cancel your appointment
        </a>
      </p>

      <p>Thank you,<br />Eco Energy Guard</p>
    </div>
  `;
}

export function inspectionAssignedHtml({
  workerName,
  customerName,
  customerEmail,
  customerPhone,
  startsAt,
  endsAt,
  address,
  issueNotes,
  jobLink,
}: {
  workerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  startsAt: string;
  endsAt: string;
  address: string;
  issueNotes?: string | null;
  jobLink: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>You’ve been assigned an inspection</h1>
      <p>Hi ${workerName},</p>
      <p>You’ve been assigned to an Eco Energy Guard home energy inspection.</p>

      <div style="background:#f6f3ea; border-radius:16px; padding:20px; margin:24px 0;">
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Time:</strong> ${formatDateTimeRange(startsAt, endsAt)}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone || "Not provided"}</p>
      </div>

      ${
        issueNotes
          ? `<div style="background:#fff; border:1px solid #ddd; border-radius:16px; padding:20px; margin:24px 0;">
              <p><strong>Customer notes:</strong></p>
              <p>${issueNotes}</p>
            </div>`
          : ""
      }

      <p>A calendar invite is attached to this email.</p>

      <p>
        <a href="${jobLink}" style="color:#047857; font-weight:bold;">
          Open this job in the admin dashboard
        </a>
      </p>
    </div>
  `;
}

export function inspectionRescheduleHtml({
  customerName,
  manageLink,
}: {
  customerName: string;
  manageLink: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Let's find a better inspection time</h1>
      <p>Hi ${customerName},</p>
      <p>We need to reschedule your requested home energy inspection time.</p>
      <p>
        Please choose a new available time here:<br />
        <a href="${manageLink}" style="color:#047857; font-weight:bold;">
          Reschedule your inspection
        </a>
      </p>
      <p>Thank you,<br />Eco Energy Guard</p>
    </div>
  `;
}

export function inspectionDeniedHtml({
  customerName,
}: {
  customerName: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Inspection request update</h1>
      <p>Hi ${customerName},</p>
      <p>Unfortunately, we're unable to approve your requested inspection at this time.</p>
      <p>If you have questions, please contact Eco Energy Guard directly.</p>
      <p>Thank you,<br />Eco Energy Guard</p>
    </div>
  `;
}

export function inspectionCancelledCustomerHtml({
  customerName,
}: {
  customerName: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Your inspection has been cancelled</h1>
      <p>Hi ${customerName},</p>
      <p>Your Eco Energy Guard inspection appointment has been cancelled.</p>
      <p>A calendar cancellation is attached to this email.</p>
      <p>If this was a mistake, please contact Eco Energy Guard directly.</p>
      <p>Thank you,<br />Eco Energy Guard</p>
    </div>
  `;
}

export function inspectionCancelledWorkerHtml({
  workerName,
  customerName,
  address,
}: {
  workerName: string;
  customerName: string;
  address: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Inspection cancelled</h1>
      <p>Hi ${workerName},</p>
      <p>The inspection for <strong>${customerName}</strong> has been cancelled.</p>
      <p><strong>Address:</strong> ${address}</p>
      <p>A calendar cancellation is attached to this email.</p>
    </div>
  `;
}

export function inspectionRescheduleWorkerHtml({
  workerName,
  customerName,
}: {
  workerName: string;
  customerName: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Inspection reschedule requested</h1>
      <p>Hi ${workerName},</p>
      <p>The customer <strong>${customerName}</strong> has requested a new inspection time.</p>
      <p>Please review the request in the admin dashboard.</p>
      <p>Eco Energy Guard</p>
    </div>
  `;
}

export function estimateReadyHtml({
  customerName,
  estimateAmount,
  customerNotes,
  scheduleLink,
}: {
  customerName: string;
  estimateAmount: number | null;
  customerNotes?: string | null;
  scheduleLink: string;
}) {
  const formattedAmount =
    estimateAmount !== null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(estimateAmount)
      : "Provided in your estimate details";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Your Eco Energy Guard estimate is ready</h1>

      <p>Hi ${customerName},</p>

      <p>Thank you for completing your home energy inspection. Your estimate is ready for review.</p>

      <div style="background:#f6f3ea; border-radius:16px; padding:20px; margin:24px 0;">
        <p><strong>Estimated amount:</strong> ${formattedAmount}</p>
        ${
          customerNotes
            ? `<p><strong>Notes:</strong><br />${customerNotes}</p>`
            : ""
        }
      </div>

      <p>If you would like to move forward, please choose an available installation time:</p>

      <p>
        <a href="${scheduleLink}" style="color:#047857; font-weight:bold;">
          Schedule your installation
        </a>
      </p>

      <p>Thank you,<br />Eco Energy Guard</p>
    </div>
  `;
}

type ScheduleDay = {
  day_number: number;
  starts_at: string;
  ends_at: string;
};

function scheduleHtml(days: ScheduleDay[]) {
  return days
    .map(
      (day) => `
        <p>
          <strong>Day ${day.day_number}:</strong>
          ${formatDateTimeRange(day.starts_at, day.ends_at)}
        </p>
      `,
    )
    .join("");
}

export function installationProposalAcceptedWorkerHtml({
  workerName,
  customerName,
}: {
  workerName: string;
  customerName: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Installation schedule accepted</h1>
      <p>Hi ${workerName},</p>
      <p><strong>${customerName}</strong> accepted the proposed installation schedule.</p>
      <p>Please review and approve it in the admin dashboard.</p>
      <p>Eco Energy Guard</p>
    </div>
  `;
}

export function installationProposalChangesRequestedWorkerHtml({
  workerName,
  customerName,
  message,
}: {
  workerName: string;
  customerName: string;
  message: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Installation schedule changes requested</h1>
      <p>Hi ${workerName},</p>
      <p><strong>${customerName}</strong> requested changes to the proposed installation schedule.</p>

      <div style="background:#f6f3ea; border-radius:16px; padding:20px; margin:24px 0;">
        <p>${message}</p>
      </div>

      <p>Please review this in the admin dashboard.</p>
      <p>Eco Energy Guard</p>
    </div>
  `;
}

export function installationScheduledCustomerHtml({
  customerName,
  scheduleDays,
  address,
}: {
  customerName: string;
  scheduleDays: ScheduleDay[];
  address: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>Your installation is scheduled</h1>
      <p>Hi ${customerName},</p>
      <p>Your Eco Energy Guard installation has been approved and scheduled.</p>

      <div style="background:#f6f3ea; border-radius:16px; padding:20px; margin:24px 0;">
        ${scheduleHtml(scheduleDays)}
        <p><strong>Address:</strong> ${address}</p>
      </div>

      <p>Calendar invites are attached to this email.</p>
      <p>Thank you,<br />Eco Energy Guard</p>
    </div>
  `;
}

export function installationAssignedWorkerHtml({
  workerName,
  customerName,
  customerEmail,
  customerPhone,
  scheduleDays,
  address,
  jobLink,
}: {
  workerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  scheduleDays: ScheduleDay[];
  address: string;
  jobLink: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #222;">
      <h1>You’ve been assigned an installation</h1>
      <p>Hi ${workerName},</p>

      <div style="background:#f6f3ea; border-radius:16px; padding:20px; margin:24px 0;">
        <p><strong>Customer:</strong> ${customerName}</p>
        ${scheduleHtml(scheduleDays)}
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${customerPhone || "Not provided"}</p>
      </div>

      <p>Calendar invites are attached to this email.</p>

      <p>
        <a href="${jobLink}" style="color:#047857; font-weight:bold;">
          Open this job in the admin dashboard
        </a>
      </p>
    </div>
  `;
}
