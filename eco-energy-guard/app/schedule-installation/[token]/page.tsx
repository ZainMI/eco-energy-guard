"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { requestInstallationAction } from "@/actions/jobs";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";

type Slot = {
  id: string;
  starts_at: string;
  ends_at: string;
};

type InstallationSchedulingData = {
  ok: boolean;
  message?: string;
  job?: {
    id: string;
    status: string;
    manual_estimate_amount: number | null;
    customer_notes: string | null;
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
  available_slots?: Slot[];
};

export default function ScheduleInstallationPage() {
  const params = useParams<{ token: string }>();
  const supabase = createClient();

  const [data, setData] = useState<InstallationSchedulingData | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  // Track the viewed month on the calendar grid
  const [currentCalendarDate, setCurrentCalendarDate] = useState(
    () => new Date(),
  );

  async function loadData() {
    setLoading(true);

    const { data: result, error } = await supabase.rpc(
      "get_installation_scheduling_job",
      {
        p_token: params.token,
      },
    );

    if (error) {
      setData({ ok: false, message: error.message });
    } else {
      setData(result as InstallationSchedulingData);
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

  // Filter slots down to the currently chosen calendar day
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

  // Dynamic Grid Math for rendering the calendar days
  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const grid = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push(null);
    }

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

  async function scheduleInstallation() {
    if (!selectedSlotId) {
      setMessage("Please choose an installation time.");
      return;
    }

    setWorking(true);
    setMessage("");

    const result = await requestInstallationAction(
      params.token,
      selectedSlotId,
    );

    setMessage(result.message);

    if (result.ok) {
      // The user mentioned not to clear the date, but clearing the slot is correct.
      // I will just clear the slotId as per the new logic.
      // The user also mentioned not clearing the date, so I will remove that line.
      setSelectedSlotId("");
      await loadData();
    }

    setWorking(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16">
        <Container>
          <p>Loading installation options...</p>
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
              {data?.message ||
                "This installation scheduling link is invalid or expired."}
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
  const job = data.job;
  const availableSlots = data.available_slots || [];

  const estimateAmount =
    job?.manual_estimate_amount !== null &&
    job?.manual_estimate_amount !== undefined
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(job.manual_estimate_amount)
      : "Provided in your estimate";

  const address = [
    customer?.address,
    customer?.city,
    customer?.state,
    customer?.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const alreadyScheduled = job?.status === "installation_scheduled";

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Schedule Installation
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Choose your installation time.
            </h1>

            <p className="mt-4 text-muted-foreground">
              Hi {customer?.first_name}, your estimate is ready. Choose an
              available installation window below.
            </p>

            {message && (
              <div className="mt-6 rounded-2xl bg-secondary p-4 text-sm">
                {message}
              </div>
            )}

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-stone-50 p-6">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-xl font-bold">Estimate Summary</h2>

                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Estimated amount:</strong> {estimateAmount}
                  </p>

                  {job?.customer_notes && (
                    <p>
                      <strong>Notes:</strong>
                      <br />
                      {job.customer_notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-stone-50 p-6">
                <CalendarClock className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-xl font-bold">Property</h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  {address || "No address listed"}
                </p>

                <p className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold capitalize text-primary">
                  {job?.status?.replaceAll("_", " ")}
                </p>
              </div>
            </div>

            {alreadyScheduled ? (
              <div className="mt-10 rounded-[2rem] border bg-white p-6">
                <h2 className="text-2xl font-bold">Installation Scheduled</h2>
                <p className="mt-3 text-muted-foreground">
                  Your installation has been scheduled. Eco Energy Guard will
                  follow up with confirmation details.
                </p>
              </div>
            ) : (
              <div className="mt-10 rounded-[2rem] border bg-white p-6">
                <h2 className="text-2xl font-bold">
                  Available Installation Times
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Select a preferred window using the calendar.
                </p>

                {availableSlots.length === 0 ? (
                  <p className="mt-5 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                    There are no installation slots available right now. Please
                    contact Eco Energy Guard directly.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-start">
                    {/* Step 1: Calendar Grid Setup */}
                    <div>
                      <label className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        1. Select Installation Date
                      </label>

                      <div className="rounded-2xl border p-4 bg-background shadow-sm">
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

                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
                          <div>Su</div>
                          <div>Mo</div>
                          <div>Tu</div>
                          <div>We</div>
                          <div>Th</div>
                          <div>Fr</div>
                          <div>Sa</div>
                        </div>

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
                                  setSelectedSlotId("");
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

                    {/* Step 2: Available Hour Slots */}
                    <div>
                      <label className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-primary" />
                        2. Available Windows
                      </label>

                      {!selectedDate ? (
                        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-stone-50">
                          Select a highlighted date on the calendar to see
                          available arrival windows.
                        </div>
                      ) : filteredSlots.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-stone-50">
                          No open slots on this day.
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

                <button
                  type="button"
                  onClick={scheduleInstallation}
                  disabled={working || !selectedSlotId}
                  className="mt-8 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Schedule Installation
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
