"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Plus, Trash2 } from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";

type SlotType = "inspection" | "installation";
type SlotMode = "single" | "recurring";

type Slot = {
  id: string;
  type: SlotType;
  starts_at: string;
  ends_at: string;
  is_available: boolean;
  notes: string | null;
  created_at: string;
};

const weekdays = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

function getNextDateForWeekday(weekday: number) {
  const today = new Date();
  const date = new Date(today);

  const daysUntil = (weekday - today.getDay() + 7) % 7;
  date.setDate(today.getDate() + daysUntil);

  return date.toISOString().split("T")[0];
}

function buildLocalDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`).toISOString();
}

export default function AdminSlotsPage() {
  const supabase = createClient();

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [mode, setMode] = useState<SlotMode>("single");
  const [type, setType] = useState<SlotType>("inspection");

  const [date, setDate] = useState("");
  const [weekday, setWeekday] = useState(4);
  const [weeks, setWeeks] = useState(8);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  async function loadSlots() {
    setLoading(true);

    const { data, error } = await supabase
      .from("slots")
      .select("*")
      .order("starts_at", { ascending: true });

    if (error) {
      setMessage(error.message);
    } else {
      setSlots((data || []) as Slot[]);
    }

    setLoading(false);
  }

  async function createSlot() {
    setMessage("");

    if (!startTime || !endTime) {
      setMessage("Please choose a start time and end time.");
      return;
    }

    if (startTime >= endTime) {
      setMessage("End time must be after start time.");
      return;
    }

    const rows = [];

    if (mode === "single") {
      if (!date) {
        setMessage("Please choose a date.");
        return;
      }

      rows.push({
        type,
        starts_at: buildLocalDateTime(date, startTime),
        ends_at: buildLocalDateTime(date, endTime),
        notes: notes || null,
        is_available: true,
      });
    }

    if (mode === "recurring") {
      if (!weeks || weeks < 1) {
        setMessage("Please choose at least 1 week.");
        return;
      }

      const firstDate = getNextDateForWeekday(weekday);

      for (let index = 0; index < weeks; index++) {
        const recurringDate = new Date(`${firstDate}T00:00`);
        recurringDate.setDate(recurringDate.getDate() + index * 7);

        const recurringDateString = recurringDate.toISOString().split("T")[0];

        rows.push({
          type,
          starts_at: buildLocalDateTime(recurringDateString, startTime),
          ends_at: buildLocalDateTime(recurringDateString, endTime),
          notes: notes || null,
          is_available: true,
        });
      }
    }

    const { error } = await supabase.from("slots").insert(rows);

    if (error) {
      setMessage(error.message);
      return;
    }

    setDate("");
    setStartTime("");
    setEndTime("");
    setNotes("");

    setMessage(
      mode === "single"
        ? "Slot created."
        : `${rows.length} recurring slots created.`,
    );

    await loadSlots();
  }

  async function toggleAvailability(slot: Slot) {
    const { error } = await supabase
      .from("slots")
      .update({ is_available: !slot.is_available })
      .eq("id", slot.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadSlots();
  }

  async function deleteSlot(slotId: string) {
    const confirmed = window.confirm("Delete this slot?");

    if (!confirmed) return;

    const { error } = await supabase.from("slots").delete().eq("id", slotId);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadSlots();
  }

  useEffect(() => {
    loadSlots();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-10 sm:py-16">
      <Container>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Admin Slots
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Manage Availability
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Add one-time or recurring inspection and installation slots for
            customers to choose from.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Add Slot</h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="text-sm font-semibold">Slot mode</label>
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value as SlotMode)}
                  className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="single">One-time slot</option>
                  <option value="recurring">Recurring weekly slot</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Slot type</label>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value as SlotType)}
                  className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="inspection">Inspection</option>
                  <option value="installation">Installation</option>
                </select>
              </div>

              {mode === "single" ? (
                <div>
                  <label className="text-sm font-semibold">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold">
                      Repeat every
                    </label>
                    <select
                      value={weekday}
                      onChange={(event) =>
                        setWeekday(Number(event.target.value))
                      }
                      className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      {weekdays.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Number of weeks
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={weeks}
                      onChange={(event) => setWeeks(Number(event.target.value))}
                      className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">Start time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">End time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Notes</label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-2 min-h-28 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="Optional internal notes..."
                />
              </div>

              <button
                type="button"
                onClick={createSlot}
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                {mode === "single" ? "Create Slot" : "Create Recurring Slots"}
              </button>

              {message && (
                <p className="rounded-2xl bg-secondary p-4 text-sm">
                  {message}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Slots</h2>

            {loading ? (
              <p className="mt-6 text-muted-foreground">Loading slots...</p>
            ) : slots.length === 0 ? (
              <div className="mt-8 rounded-3xl bg-stone-50 p-8 text-center">
                <CalendarClock className="mx-auto h-10 w-10 text-primary" />
                <h3 className="mt-4 text-xl font-bold">No slots yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Add one-time or recurring availability to begin.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid max-h-[720px] gap-4 overflow-auto pr-1">
                {slots.map((slot) => (
                  <article
                    key={slot.id}
                    className="rounded-3xl border bg-stone-50 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">
                            {slot.type}
                          </span>

                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">
                            {slot.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>

                        <p className="mt-3 font-bold">
                          {new Date(slot.starts_at).toLocaleDateString()}{" "}
                          {new Date(slot.starts_at).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          –{" "}
                          {new Date(slot.ends_at).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>

                        {slot.notes && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {slot.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(slot)}
                          className="inline-flex h-10 items-center justify-center rounded-full border bg-white px-4 text-sm font-semibold transition hover:bg-muted"
                        >
                          {slot.is_available ? "Disable" : "Enable"}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteSlot(slot.id)}
                          className="inline-flex h-10 items-center justify-center rounded-full bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
