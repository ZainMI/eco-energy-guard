"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  RefreshCw,
  XCircle,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";
import {
  rescheduleManagedJobAction,
  cancelManagedJobAction,
} from "@/actions/jobs";

type Slot = {
  id: string;
  starts_at: string;
  ends_at: string;
};

type ManagedJobData = {
  ok: boolean;
  message?: string;
  job?: {
    id: string;
    status: string;
  };
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  };
  inspection_slot?: Slot | null;
  available_slots?: Slot[];
};

export default function ManageJobPage() {
  const params = useParams<{ token: string }>();
  const supabase = createClient();

  const [data, setData] = useState<ManagedJobData | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  // Track the user's active viewing month/year on the inline calendar
  const [currentCalendarDate, setCurrentCalendarDate] = useState(
    () => new Date(),
  );

  const status = data?.job?.status;
  const isCancelled = status === "cancelled";
  const isCompleted = status === "completed";
  const canModify = !isCancelled && !isCompleted;

  async function loadJob() {
    setLoading(true);

    const { data: result, error } = await supabase.rpc("get_manage_job", {
      p_token: params.token,
    });

    if (error) {
      setData({ ok: false, message: error.message });
    } else {
      setData(result as ManagedJobData);
    }

    setLoading(false);
  }

  // Extract unique local dates from available slots
  const availableDates = useMemo(() => {
    const slotsList = data?.available_slots || [];
    const dates = slotsList.map((slot) => {
      const d = new Date(slot.starts_at);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
    return Array.from(new Set(dates));
  }, [data?.available_slots]);

  // Filter slots down to the currently chosen date
  const filteredSlots = useMemo(() => {
    if (!selectedDate) return [];
    const slotsList = data?.available_slots || [];
    return slotsList.filter((slot) => {
      const d = new Date(slot.starts_at);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}` === selectedDate;
    });
  }, [selectedDate, data?.available_slots]);

  // Calendar Grid Math
  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 6 = Saturday

    const grid = [];

    // Padding for days from the previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push(null);
    }

    // Days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const dateString = `${year}-${monthStr}-${dayStr}`;
      grid.push({ day, dateString });
    }

    return grid;
  }, [currentCalendarDate]);

  const handlePrevMonth = () => {
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() - 1,
        1,
      ),
    );
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(
      new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() + 1,
        1,
      ),
    );
  };

  async function cancelAppointment() {
    if (!canModify) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) return;

    setWorking(true);
    setMessage("");

    const result = await cancelManagedJobAction(params.token);

    setMessage(result.message);

    if (result.ok) {
      await loadJob();
    }

    setWorking(false);
  }

  async function rescheduleAppointment() {
    if (!canModify) return;

    if (!selectedSlotId) {
      setMessage("Please choose a new inspection time.");
      return;
    }

    setWorking(true);
    setMessage("");

    const result = await rescheduleManagedJobAction(
      params.token,
      selectedSlotId,
    );

    setMessage(result.message);

    if (result.ok) {
      setSelectedDate("");
      setSelectedSlotId("");
      await loadJob();
    }

    setWorking(false);
  }

  useEffect(() => {
    loadJob();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16">
        <Container>
          <p>Loading appointment...</p>
        </Container>
      </section>
    );
  }

  if (!data?.ok) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16">
        <Container>
          <div className="mx-auto max-w-xl rounded-[2rem] border bg-white p-8 text-center shadow-sm">
            <XCircle className="mx-auto h-12 w-12 text-red-500" />
            <h1 className="mt-5 text-3xl font-bold">Link unavailable</h1>
            <p className="mt-3 text-muted-foreground">
              {data?.message || "This manage link is invalid or expired."}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
            >
              Contact Eco Energy Guard
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const customer = data.customer;
  const currentSlot = data.inspection_slot;
  const availableSlots = data.available_slots || [];

  const address = [
    customer?.address,
    customer?.city,
    customer?.state,
    customer?.zip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Manage Appointment
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Inspection Appointment
            </h1>

            <p className="mt-4 text-muted-foreground">
              Hi {customer?.first_name}, you can review your Eco Energy Guard
              inspection below.
            </p>

            {message && (
              <div className="mt-6 rounded-2xl bg-secondary p-4 text-sm">
                {message}
              </div>
            )}

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-stone-50 p-6">
                <CalendarClock className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-xl font-bold">Current Appointment</h2>

                {currentSlot ? (
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(currentSlot.starts_at).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong>{" "}
                      {new Date(currentSlot.starts_at).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      –{" "}
                      {new Date(currentSlot.ends_at).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p>
                      <strong>Address:</strong> {address || "No address listed"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No appointment time is currently attached.
                  </p>
                )}
              </div>

              <div className="rounded-3xl bg-stone-50 p-6">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-xl font-bold">Appointment Status</h2>
                <p className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold capitalize text-primary">
                  {status?.replaceAll("_", " ")}
                </p>
              </div>
            </div>

            {canModify ? (
              <div className="mt-10 rounded-[2rem] border bg-white p-6">
                <h2 className="text-2xl font-bold">Reschedule Inspection</h2>
                <p className="mt-3 text-muted-foreground">
                  Choose a new available date and time window. Eco Energy Guard
                  will review and confirm the updated request.
                </p>

                {availableSlots.length === 0 ? (
                  <p className="mt-5 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                    There are no other available inspection slots right now.
                    Please contact Eco Energy Guard directly.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-start">
                    {/* Step 1: Calendar Grid Selection */}
                    <div>
                      <label className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        1. Select New Date
                      </label>

                      <div className="rounded-2xl border p-4 bg-background shadow-sm">
                        {/* Month Pagination Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-sm text-foreground capitalize">
                            {currentCalendarDate.toLocaleDateString(undefined, {
                              month: "long",
                              year: "numeric",
                            })}
                          </h3>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={handlePrevMonth}
                              className="p-1.5 rounded-lg border hover:bg-muted cursor-pointer"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="p-1.5 rounded-lg border hover:bg-muted cursor-pointer"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Days of the week headers */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
                          <div>Su</div>
                          <div>Mo</div>
                          <div>Tu</div>
                          <div>We</div>
                          <div>Th</div>
                          <div>Fr</div>
                          <div>Sa</div>
                        </div>

                        {/* Day Cells Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {calendarDays.map((cell, idx) => {
                            if (!cell) {
                              return <div key={`empty-${idx}`} />;
                            }

                            const hasSlots = availableDates.includes(
                              cell.dateString,
                            );
                            const isSelected = selectedDate === cell.dateString;

                            return (
                              <button
                                key={cell.dateString}
                                type="button"
                                disabled={!hasSlots}
                                onClick={() => {
                                  setSelectedDate(cell.dateString);
                                  setSelectedSlotId(""); // clear selected time
                                }}
                                className={`h-10 w-full text-sm font-medium rounded-xl flex items-center justify-center transition
                                  ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground font-bold shadow-sm cursor-pointer"
                                      : hasSlots
                                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold cursor-pointer border border-emerald-200"
                                        : "text-stone-300 opacity-45 cursor-not-allowed"
                                  }
                                `}
                              >
                                {cell.day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Time Selection */}
                    <div>
                      <label className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-primary" />
                        2. Available Windows
                      </label>

                      {!selectedDate ? (
                        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-stone-50">
                          Select a highlighted date on the calendar to see
                          available times.
                        </div>
                      ) : filteredSlots.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-stone-50">
                          No windows open on this day.
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          {filteredSlots.map((slot) => (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => setSelectedSlotId(slot.id)}
                              className={`w-full cursor-pointer rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${
                                selectedSlotId === slot.id
                                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                  : "bg-background hover:bg-muted border-stone-200"
                              }`}
                            >
                              <p className="font-semibold text-xs">
                                {new Date(slot.starts_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  },
                                )}{" "}
                                –{" "}
                                {new Date(slot.ends_at).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row border-t pt-6">
                  <button
                    type="button"
                    onClick={rescheduleAppointment}
                    disabled={working || !selectedSlotId}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Request New Time
                  </button>

                  <button
                    type="button"
                    onClick={cancelAppointment}
                    disabled={working}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-red-50 px-7 text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Appointment
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-10 rounded-[2rem] border bg-white p-6">
                <h2 className="text-2xl font-bold">
                  {isCancelled ? "Appointment Cancelled" : "Appointment Closed"}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  This appointment can no longer be modified from this link.
                  Please contact Eco Energy Guard if you need anything else.
                </p>

                <Link
                  href="/contact"
                  className="mt-6 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
                >
                  Contact Eco Energy Guard
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
