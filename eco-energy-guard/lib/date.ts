export const BUSINESS_TIME_ZONE = "America/New_York";

export function formatDateTimeRange(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const date = start.toLocaleDateString("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startTime = start.toLocaleTimeString("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });

  const endTime = end.toLocaleTimeString("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });

  return `${date}, ${startTime} – ${endTime}`;
}
