"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, UserCheck, Wrench } from "lucide-react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";
import { createManualBookingAction } from "@/actions/jobs";
import AddressAutocomplete from "@/components/forms/AddressAutocomplete";
import { distanceMiles } from "@/lib/location";

type TeamMember = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
};

type ScheduleDayRow = {
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
};

// Service area constants for warning - adjust as needed
const SERVICE_CENTER_LAT = 42.6526; // Example: Albany, NY
const SERVICE_CENTER_LNG = -73.7562;
const SERVICE_RADIUS_MILES = 50;

export default function ManualBookingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [serviceAreaWarning, setServiceAreaWarning] = useState("");

  // Form state
  const [bookingType, setBookingType] = useState<"inspection" | "installation">(
    "inspection",
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
  const [manualEstimateAmount, setManualEstimateAmount] = useState<
    number | null
  >(null);
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [scheduleDays, setScheduleDays] = useState<ScheduleDayRow[]>([
    { date: "", startTime: "09:00", endTime: "13:00", notes: "" },
  ]);

  useEffect(() => {
    async function loadTeam() {
      setLoading(true);
      const { data } = await supabase
        .from("users")
        .select("id, full_name, email, role")
        .eq("access_status", "approved")
        .order("full_name", { ascending: true });
      setTeam((data || []) as TeamMember[]);
      setLoading(false);
    }
    loadTeam();
  }, [supabase]);

  async function handleSubmit() {
    setSubmitting(true);
    setMessage("");

    const result = await createManualBookingAction({
      bookingType,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      stateValue,
      zip,
      latitude,
      longitude,
      osmPlaceId,
      scheduleDays,
      manualEstimateAmount,
      teamIds,
    });

    setMessage(result.message);

    if (result.ok && result.jobId) {
      setTimeout(() => {
        router.push(`/admin/jobs/${result.jobId}`);
      }, 1000);
    } else {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-10 sm:py-16">
      <Container>
        <Link
          href="/admin"
          className="inline-flex items-center text-sm font-semibold text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Admin Tool
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Manual Booking
          </h1>
          <p className="mt-4 text-muted-foreground">
            Create a job for a customer directly. This will create a new, booked
            time slot and a corresponding job, bypassing the public booking
            flow.
          </p>
        </div>

        <div className="mt-12 max-w-4xl">
          <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold">Booking Type</label>
                <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType("inspection");
                      if (scheduleDays.length > 1) {
                        setScheduleDays([scheduleDays[0]]);
                      }
                    }}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                      bookingType === "inspection"
                        ? "bg-white shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    <UserCheck className="h-4 w-4" /> Inspection
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType("installation")}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                      bookingType === "installation"
                        ? "bg-white shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    <Wrench className="h-4 w-4" /> Installation
                  </button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold">First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Last Name</label>
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
              </div>

              <div>
                {!address ? (
                  <AddressAutocomplete
                    onSelect={(place) => {
                      setAddress(place.address);
                      setCity(place.city);
                      setStateValue(place.state);
                      setZip(place.zip);
                      setLatitude(place.latitude);
                      setLongitude(place.longitude);
                      setOsmPlaceId(place.osmPlaceId);

                      if (place.latitude && place.longitude) {
                        const distance = distanceMiles(
                          SERVICE_CENTER_LAT,
                          SERVICE_CENTER_LNG,
                          place.latitude,
                          place.longitude,
                        );

                        if (distance > SERVICE_RADIUS_MILES) {
                          setServiceAreaWarning(
                            `This address is ~${Math.round(
                              distance,
                            )} miles away, which is outside the standard ${SERVICE_RADIUS_MILES}-mile service radius.`,
                          );
                        } else {
                          setServiceAreaWarning("");
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="mt-2">
                    <div className="rounded-2xl bg-secondary p-4 font-medium text-foreground">
                      {[address, city, stateValue, zip]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAddress("");
                        setCity("");
                        setStateValue("");
                        setZip("");
                        setServiceAreaWarning("");
                      }}
                      className="mt-2 text-sm font-semibold text-primary transition hover:opacity-80"
                    >
                      Change address
                    </button>
                  </div>
                )}
                {serviceAreaWarning && (
                  <p className="mt-2 text-sm font-semibold text-amber-600">
                    Warning: {serviceAreaWarning}
                  </p>
                )}
              </div>

              {scheduleDays.map((day, index) => (
                <div key={index} className="rounded-2xl border bg-stone-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">
                      {bookingType === "installation"
                        ? `Day ${index + 1}`
                        : "Date & Time"}
                    </p>
                    {bookingType === "installation" && index > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setScheduleDays(
                            scheduleDays.filter((_, i) => i !== index),
                          )
                        }
                        className="text-xs font-semibold text-red-500 hover:text-red-700"
                      >
                        Remove Day
                      </button>
                    )}
                  </div>
                  <div className="mt-4 grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className="text-sm font-semibold">Date</label>
                      <input
                        type="date"
                        value={day.date}
                        onChange={(e) => {
                          const newDays = [...scheduleDays];
                          newDays[index].date = e.target.value;
                          setScheduleDays(newDays);
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => {
                          const newDays = [...scheduleDays];
                          newDays[index].startTime = e.target.value;
                          setScheduleDays(newDays);
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">End Time</label>
                      <input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => {
                          const newDays = [...scheduleDays];
                          newDays[index].endTime = e.target.value;
                          setScheduleDays(newDays);
                        }}
                        className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-semibold">
                      {bookingType === "inspection"
                        ? "Customer Issue Notes"
                        : "Notes for this day (optional)"}
                    </label>
                    <textarea
                      value={day.notes}
                      onChange={(e) => {
                        const newDays = [...scheduleDays];
                        newDays[index].notes = e.target.value;
                        setScheduleDays(newDays);
                      }}
                      className="mt-2 min-h-20 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder={
                        bookingType === "inspection"
                          ? "Notes from the customer..."
                          : "e.g., Morning crew only"
                      }
                    />
                  </div>
                </div>
              ))}

              {bookingType === "installation" && (
                <button
                  type="button"
                  onClick={() =>
                    setScheduleDays([
                      ...scheduleDays,
                      {
                        date: "",
                        startTime: "09:00",
                        endTime: "13:00",
                        notes: "",
                      },
                    ])
                  }
                  className="inline-flex h-11 items-center justify-center rounded-full border bg-white px-6 text-sm font-semibold transition hover:bg-muted"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Installation Day
                </button>
              )}

              {bookingType === "installation" && (
                <div>
                  <label className="text-sm font-semibold">
                    Manual Estimate Amount
                  </label>
                  <input
                    type="number"
                    value={manualEstimateAmount ?? ""}
                    onChange={(e) =>
                      setManualEstimateAmount(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="e.g., 2500"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-semibold">Assign Team</label>
                {bookingType === "installation" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    This team will be assigned to all installation days.
                  </p>
                )}
                {loading ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading team...
                  </p>
                ) : (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {team.map((member) => (
                      <label
                        key={member.id}
                        className="flex cursor-pointer items-center gap-3 rounded-2xl border bg-stone-50 p-4 transition hover:bg-stone-100"
                      >
                        <input
                          type="checkbox"
                          checked={teamIds.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTeamIds([...teamIds, member.id]);
                            } else {
                              setTeamIds(
                                teamIds.filter((id) => id !== member.id),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-semibold">
                            {member.full_name || member.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || loading}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {submitting ? "Creating Booking..." : "Create Booking"}
                </button>

                {message && (
                  <p className="mt-4 rounded-xl bg-secondary p-4 text-sm font-medium">
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
