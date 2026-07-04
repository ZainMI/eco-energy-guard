"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CalendarClock,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  ShieldCheck,
  ShieldAlert,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";

type SlotType = "inspection" | "installation";
type SlotMode = "single" | "recurring";
type FilterType = "all" | "inspection" | "installation";

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
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
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
  const [filter, setFilter] = useState<FilterType>("all");

  const [selectedDate, setSelectedDate] = useState("");
  const [currentCalendarDate, setCurrentCalendarDate] = useState(
    () => new Date(),
  );

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

  // Filter slots down globally based on chosen segment filter type (all, inspection, installation)
  const filteredSlotsByType = useMemo(() => {
    if (filter === "all") return slots;
    return slots.filter((slot) => slot.type === filter);
  }, [slots, filter]);

  // Map unique local date strings that currently hold slots matching the filter
  const activeDateStrings = useMemo(() => {
    const dates = filteredSlotsByType.map((slot) => {
      const d = new Date(slot.starts_at);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
    return Array.from(new Set(dates));
  }, [filteredSlotsByType]);

  // Final filtered list of slots to reveal inside the target timeline detail card view
  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return filteredSlotsByType.filter((slot) => {
      const d = new Date(slot.starts_at);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}` === selectedDate;
    });
  }, [selectedDate, filteredSlotsByType]);

  // Calendar Math Builder
  const calendarGrid = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const paddingCells = firstDay.getDay();

    const grid = [];
    for (let i = 0; i < paddingCells; i++) {
      grid.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      const dateString = `${year}-${mStr}-${dStr}`;
      grid.push({ day: d, dateString });
    }

    return grid;
  }, [currentCalendarDate]);

  const prevMonth = () =>
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() - 1,
        1,
      ),
    );
  const nextMonth = () =>
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() + 1,
        1,
      ),
    );

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
        ? "Slot created successfully."
        : `${rows.length} recurring slots created successfully.`,
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this availability slot?",
    );
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
        <div className="border-b pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Admin Management
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
            Availability Workspace
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure windows and view active timeline allocations clean and
            organized via an intuitive calendar deck layout.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] items-start">
          {/* COLUMN 1: Add/Configure Schedules form panel */}
          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Configure Openings
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Slot Mode
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMode("single")}
                    className={`py-2 text-sm font-semibold rounded-lg transition cursor-pointer ${
                      mode === "single"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("recurring")}
                    className={`py-2 text-sm font-semibold rounded-lg transition cursor-pointer ${
                      mode === "recurring"
                        ? "bg-white text-stone-900 shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    Weekly Recurring
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                  Assignment Type
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType("inspection")}
                    className={`py-2 text-sm font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      type === "inspection"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Inspection
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("installation")}
                    className={`py-2 text-sm font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      type === "installation"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    Installation
                  </button>
                </div>
              </div>

              {mode === "single" ? (
                <div>
                  <label className="text-sm font-semibold text-stone-800">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                  />
                </div>
              ) : (
                <div className="space-y-4 rounded-2xl bg-stone-50 p-4 border border-stone-100">
                  <div>
                    <label className="text-sm font-semibold text-stone-800">
                      Repeat Day
                    </label>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {weekdays.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => setWeekday(day.value)}
                          className={`h-9 px-3 text-xs font-semibold rounded-lg transition border cursor-pointer ${
                            weekday === day.value
                              ? "bg-stone-900 text-white border-stone-900"
                              : "bg-white text-stone-600 border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-stone-800">
                      Horizon Span (Weeks)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={weeks}
                      onChange={(event) => setWeeks(Number(event.target.value))}
                      className="mt-2 h-11 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-stone-800">
                    Start Window
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-stone-800">
                    End Window
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-800">
                  Internal Remarks
                </label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-2 min-h-24 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition text-sm"
                  placeholder="Optional annotations..."
                />
              </div>

              <button
                type="button"
                onClick={createSlot}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Publish Availability
              </button>

              {message && (
                <p className="rounded-2xl bg-secondary p-4 text-sm font-medium border">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* COLUMN 2: Calendar Overview & Selected Date Drawer details */}
          <div className="space-y-6">
            {/* Filtering Controls Ribbon Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 border rounded-2xl shadow-sm">
              <div className="flex flex-wrap gap-1">
                {(["all", "inspection", "installation"] as FilterType[]).map(
                  (typeOpt) => (
                    <button
                      key={typeOpt}
                      type="button"
                      onClick={() => {
                        setFilter(typeOpt);
                        setSelectedDate(""); // clear current day lookup view
                      }}
                      className={`px-4 py-1.5 text-xs font-bold rounded-xl transition capitalize cursor-pointer ${
                        filter === typeOpt
                          ? "bg-stone-900 text-white"
                          : "text-stone-500 hover:bg-stone-50"
                      }`}
                    >
                      {typeOpt === "all" ? "All Slots" : `${typeOpt}s`}
                    </button>
                  ),
                )}
              </div>
              <span className="text-xs text-muted-foreground font-semibold px-2">
                {slots.length} Slots Total
              </span>
            </div>

            {/* Interactive Calendar Deck Block */}
            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-base text-stone-900 capitalize">
                  {currentCalendarDate.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-2 rounded-xl border hover:bg-stone-50 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-2 rounded-xl border hover:bg-stone-50 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {calendarGrid.map((cell, idx) => {
                  if (!cell) return <div key={`blank-${idx}`} />;

                  const hasSchedules = activeDateStrings.includes(
                    cell.dateString,
                  );
                  const isViewing = selectedDate === cell.dateString;

                  return (
                    <button
                      key={cell.dateString}
                      type="button"
                      onClick={() => setSelectedDate(cell.dateString)}
                      className={`h-12 w-full text-sm rounded-xl flex flex-col items-center justify-center transition border relative cursor-pointer
                        ${
                          isViewing
                            ? "bg-stone-900 text-white border-stone-900 font-bold shadow-sm"
                            : hasSchedules
                              ? "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100/70 font-bold"
                              : "bg-white text-stone-700 border-stone-100 hover:bg-stone-50"
                        }
                      `}
                    >
                      <span>{cell.day}</span>
                      {hasSchedules && !isViewing && (
                        <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Drawer Details Area */}
            <div>
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-primary" />
                Schedules for:{" "}
                {selectedDate
                  ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      undefined,
                      { dateStyle: "long" },
                    )
                  : "No date picked"}
              </label>

              {loading ? (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Syncing timeline elements...
                </p>
              ) : !selectedDate ? (
                <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
                  Click any calendar tile highlight above to view, modify or
                  disable specific hours windows.
                </div>
              ) : slotsForSelectedDate.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
                  No availability slots listed for this selected date matching
                  the active configuration criteria filter.
                </div>
              ) : (
                <div className="grid gap-3">
                  {slotsForSelectedDate.map((slot) => {
                    const isInspection = slot.type === "inspection";
                    return (
                      <article
                        key={slot.id}
                        className={`rounded-2xl border bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${
                          isInspection
                            ? "border-l-amber-400"
                            : "border-l-emerald-500"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-extrabold border uppercase ${
                                isInspection
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
                              }`}
                            >
                              {slot.type}
                            </span>
                            <span
                              className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[10px] font-bold border ${
                                slot.is_available
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-stone-50 text-stone-400 border-stone-100"
                              }`}
                            >
                              {slot.is_available ? "Open / Active" : "Booked"}
                            </span>
                          </div>

                          <p className="font-bold text-stone-900 text-sm">
                            {new Date(slot.starts_at).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                            {" – "}
                            {new Date(slot.ends_at).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>

                          {slot.notes && (
                            <p className="text-xs text-muted-foreground italic bg-stone-50 p-2 rounded border">
                              {slot.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 sm:self-center self-end">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(slot)}
                            className="h-8 px-3 text-xs font-bold rounded-xl border bg-white transition hover:bg-stone-50 cursor-pointer shadow-sm text-stone-700"
                          >
                            {slot.is_available ? "Block Window" : "Unblock"}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSlot(slot.id)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 cursor-pointer border border-red-100 shadow-sm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
