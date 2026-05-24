import type { Event } from "@/types/database";

export function formatEventDateParts(isoDate: string) {
  const date = new Date(isoDate);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
    full: date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export function toDatetimeLocalValue(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function isUpcoming(event: Event): boolean {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return new Date(event.event_date) >= startOfToday;
}
