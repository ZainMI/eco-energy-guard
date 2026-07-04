"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Home,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";
import AddressAutocomplete from "@/components/forms/AddressAutocomplete";

type Slot = {
  id: string;
  starts_at: string;
  ends_at: string;
};

export default function BookPage() {
  const supabase = createClient();

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  // Track active month/year viewing window for the calendar component
  const [currentCalendarDate, setCurrentCalendarDate] = useState(
    () => new Date(),
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [zip, setZip] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [osmPlaceId, setOsmPlaceId] = useState("");

  const [issueNotes, setIssueNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function loadSlots() {
    setLoadingSlots(true);

    const { data, error } = await supabase
      .from("slots")
      .select("id, starts_at, ends_at")
      .eq("type", "inspection")
      .eq("is_available", true)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true });

    if (!error && data) {
      setSlots(data as Slot[]);
    }

    setLoadingSlots(false);
  }

  // Get unique dates that have available slots
  const availableDates = useMemo(() => {
    const dates = slots.map((slot) => {
      const d = new Date(slot.starts_at);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
    return Array.from(new Set(dates));
  }, [slots]);

  // Filter slots for the currently selected date
  const filteredSlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter((slot) => {
      const d = new Date(slot.starts_at);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const slotDateStr = `${year}-${month}-${day}`;
      return slotDateStr === selectedDate;
    });
  }, [selectedDate, slots]);

  // Calendar Layout Logic
  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const grid = [];

    // Prior-month spaces spacing
    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push(null);
    }

    // Active calendar days populating
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

  async function submitRequest() {
    setMessage("");

    if (!firstName || !lastName || !email || !selectedSlotId) {
      setMessage(
        "Please fill out your name, email, and preferred inspection time.",
      );
      return;
    }

    if (!address) {
      setMessage("Please select or enter your property address.");
      return;
    }

    setSubmitting(true);

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: stateValue || null,
        zip: zip || null,
        latitude,
        longitude,
        osm_place_id: osmPlaceId || null,
      })
      .select("id")
      .single();

    if (customerError || !customer) {
      setMessage(customerError?.message || "Could not create customer.");
      setSubmitting(false);
      return;
    }

    const { error: jobError } = await supabase.from("jobs").insert({
      customer_id: customer.id,
      inspection_slot_id: selectedSlotId,
      status: "inspection_requested",
      issue_notes: issueNotes || null,
    });

    if (jobError) {
      setMessage(jobError.message);
      setSubmitting(false);
      return;
    }

    await supabase
      .from("slots")
      .update({ is_available: false })
      .eq("id", selectedSlotId);

    setSuccess(true);
    setSubmitting(false);
  }

  useEffect(() => {
    loadSlots();
  }, []);

  if (success) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl rounded-[2rem] border bg-white p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
            <h1 className="mt-6 text-4xl font-bold">Request received</h1>
            <p className="mt-4 text-muted-foreground">
              Thanks, {firstName}. Eco Energy Guard will review your inspection
              request and follow up with confirmation or next steps.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground"
            >
              Back Home
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Request an Inspection
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Start with a home energy inspection.
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Choose an available inspection window and tell us a little about
              your home. The team will review your request before confirming.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <form className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">First name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Last name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <AddressAutocomplete
                    onSelect={(place) => {
                      setAddress(place.address);
                      setCity(place.city);
                      setStateValue(place.state);
                      setZip(place.zip);
                      setLatitude(place.latitude);
                      setLongitude(place.longitude);
                      setOsmPlaceId(place.osmPlaceId);
                    }}
                  />

                  {address && (
                    <div className="mt-3 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">
                        Selected address
                      </p>
                      <p className="mt-1">
                        {[address, city, stateValue, zip]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Calendar Layout Schedule Blocks */}
                <div className="sm:col-span-2">
                  {loadingSlots ? (
                    <p className="text-sm text-muted-foreground">
                      Loading availability...
                    </p>
                  ) : slots.length === 0 ? (
                    <p className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                      No inspection slots are currently available. Please
                      contact Eco Energy Guard directly.
                    </p>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] items-start">
                      {/* Step 1: Calendar Selection */}
                      <div>
                        <label className="text-sm font-semibold flex items-center gap-2 mb-3">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          1. Select Date
                        </label>

                        <div className="rounded-2xl border p-4 bg-background shadow-sm">
                          {/* Calendar Month Header Controller */}
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-sm text-foreground capitalize">
                              {currentCalendarDate.toLocaleDateString(
                                undefined,
                                {
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
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

                          {/* Grid Days Header Labels */}
                          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
                            <div>Su</div>
                            <div>Mo</div>
                            <div>Tu</div>
                            <div>We</div>
                            <div>Th</div>
                            <div>Fr</div>
                            <div>Sa</div>
                          </div>

                          {/* Dynamic Days Calendar Grid */}
                          <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((cell, idx) => {
                              if (!cell) {
                                return <div key={`empty-${idx}`} />;
                              }

                              const hasSlots = availableDates.includes(
                                cell.dateString,
                              );
                              const isSelected =
                                selectedDate === cell.dateString;

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

                      {/* Step 2: Time Slots List */}
                      <div>
                        <label className="text-sm font-semibold flex items-center gap-2 mb-3">
                          <Clock className="h-4 w-4 text-primary" />
                          2. Available Times
                        </label>

                        {!selectedDate ? (
                          <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground bg-stone-50">
                            Select a highlighted date on the calendar grid to
                            see available time slots.
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
                                  {new Date(slot.ends_at).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    },
                                  )}
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">
                    What can we help with?
                  </label>
                  <textarea
                    value={issueNotes}
                    onChange={(e) => setIssueNotes(e.target.value)}
                    className="mt-2 min-h-36 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="Tell us about drafts, cold rooms, insulation concerns, or anything else you’ve noticed."
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={submitRequest}
                disabled={submitting}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>

              {message && (
                <p className="mt-4 rounded-2xl bg-secondary p-4 text-sm">
                  {message}
                </p>
              )}
            </form>

            <aside className="space-y-5">
              {[
                {
                  icon: ClipboardList,
                  title: "Request an inspection",
                  description:
                    "Pick an available time and share what you’re noticing in the home.",
                },
                {
                  icon: CalendarClock,
                  title: "Admin review",
                  description:
                    "The team confirms the inspection and can reschedule if needed.",
                },
                {
                  icon: Home,
                  title: "Estimate after inspection",
                  description:
                    "After the visit, the admin can prepare an estimate and send installation scheduling options.",
                },
              ].map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="rounded-3xl border bg-white p-6 shadow-sm"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-xl font-bold">{step.title}</h2>
                    <p className="mt-3 leading-7 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                );
              })}

              <div className="rounded-3xl border bg-secondary p-6">
                <h2 className="text-xl font-bold">
                  Prefer to contact directly?
                </h2>
                <div className="mt-5 space-y-3 text-sm">
                  <p className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    (518) XXX-XXXX
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    info@ecoenergyguard.com
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
