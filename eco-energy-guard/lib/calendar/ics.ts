type CalendarInviteInput = {
  uid: string;
  sequence: number;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  organizerEmail: string;
  attendees: string[];
  method?: "REQUEST" | "CANCEL";
};

function formatDate(date: string) {
  return new Date(date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeText(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function createCalendarInvite(input: CalendarInviteInput) {
  const method = input.method || "REQUEST";

  const attendees = input.attendees
    .filter(Boolean)
    .map((email) => `ATTENDEE;RSVP=TRUE:mailto:${email}`)
    .join("\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Eco Energy Guard//Scheduling//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${method}`,
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `SEQUENCE:${input.sequence}`,
    `DTSTAMP:${formatDate(new Date().toISOString())}`,
    `DTSTART:${formatDate(input.startsAt)}`,
    `DTEND:${formatDate(input.endsAt)}`,
    `SUMMARY:${escapeText(input.title)}`,
    `DESCRIPTION:${escapeText(input.description)}`,
    `LOCATION:${escapeText(input.location)}`,
    `ORGANIZER:mailto:${input.organizerEmail}`,
    method === "CANCEL" ? "STATUS:CANCELLED" : "",
    attendees,
    method === "REQUEST" ? "BEGIN:VALARM" : "",
    method === "REQUEST" ? "TRIGGER:-PT24H" : "",
    method === "REQUEST" ? "ACTION:DISPLAY" : "",
    method === "REQUEST"
      ? "DESCRIPTION:Eco Energy Guard appointment reminder"
      : "",
    method === "REQUEST" ? "END:VALARM" : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\n");
}

export type CalendarScheduleDay = {
  starts_at: string;
  ends_at: string;
};

export function createMultiDayCalendarInvite({
  uid,
  sequence,
  title,
  description,
  location,
  organizerEmail,
  attendees,
  days,
  method = "REQUEST",
}: {
  uid: string;
  sequence: number;
  title: string;
  description: string;
  location: string;
  organizerEmail: string;
  attendees: string[];
  days: CalendarScheduleDay[];
  method?: "REQUEST" | "CANCEL";
}) {
  const attendeesText = attendees
    .filter(Boolean)
    .map((email) => `ATTENDEE;RSVP=TRUE:mailto:${email}`)
    .join("\n");

  const events = days.map((day, index) =>
    [
      "BEGIN:VEVENT",
      `UID:${uid}-day-${index + 1}`,
      `SEQUENCE:${sequence}`,
      `DTSTAMP:${formatDate(new Date().toISOString())}`,
      `DTSTART:${formatDate(day.starts_at)}`,
      `DTEND:${formatDate(day.ends_at)}`,
      `SUMMARY:${escapeText(`${title} - Day ${index + 1}`)}`,
      `DESCRIPTION:${escapeText(description)}`,
      `LOCATION:${escapeText(location)}`,
      `ORGANIZER:mailto:${organizerEmail}`,
      method === "CANCEL" ? "STATUS:CANCELLED" : "",
      attendeesText,
      method === "REQUEST" ? "BEGIN:VALARM" : "",
      method === "REQUEST" ? "TRIGGER:-PT24H" : "",
      method === "REQUEST" ? "ACTION:DISPLAY" : "",
      method === "REQUEST"
        ? "DESCRIPTION:Eco Energy Guard installation reminder"
        : "",
      method === "REQUEST" ? "END:VALARM" : "",
      "END:VEVENT",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Eco Energy Guard//Scheduling//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${method}`,
    ...events,
    "END:VCALENDAR",
  ].join("\n");
}
