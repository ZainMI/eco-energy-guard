"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  acceptInstallationProposalAction,
  requestInstallationProposalChangesAction,
} from "@/actions/jobs";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";

type Proposal = {
  day_number: number;
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
    proposal_status: "proposed" | "accepted" | "changes_requested" | null;
    proposal_change_request: string | null;
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
  proposals?: Proposal[];
};

export default function ScheduleInstallationPage() {
  const params = useParams<{ token: string }>();
  const supabase = createClient();

  const [data, setData] = useState<InstallationSchedulingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [changeMessage, setChangeMessage] = useState("");

  async function loadData() {
    setLoading(true);

    const { data: result, error } = await supabase.rpc(
      "get_installation_proposal_job",
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

  async function acceptSchedule() {
    setWorking(true);
    setMessage("");

    const result = await acceptInstallationProposalAction(params.token);

    setMessage(result.message);

    if (result.ok) {
      await loadData();
    }

    setWorking(false);
  }

  async function requestChanges() {
    setWorking(true);
    setMessage("");

    const result = await requestInstallationProposalChangesAction(
      params.token,
      changeMessage,
    );

    setMessage(result.message);

    if (result.ok) {
      setChangeMessage("");
      setShowChangeForm(false);
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
  const proposals = data.proposals || [];

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
  const proposalAccepted = job?.proposal_status === "accepted";
  const changesRequested = job?.proposal_status === "changes_requested";

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Schedule Installation
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Review your installation schedule.
            </h1>

            <p className="mt-4 text-muted-foreground">
              Hi {customer?.first_name}, your estimate is ready. Please review
              the proposed installation schedule below.
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
            ) : proposalAccepted ? (
              <div className="mt-10 rounded-[2rem] border bg-white p-6">
                <h2 className="text-2xl font-bold">Schedule Accepted</h2>
                <p className="mt-3 text-muted-foreground">
                  Thank you for accepting the schedule. Eco Energy Guard will
                  review and send a final confirmation with calendar invites.
                </p>
              </div>
            ) : changesRequested ? (
              <div className="mt-10 rounded-[2rem] border bg-white p-6">
                <h2 className="text-2xl font-bold">Changes Requested</h2>
                <p className="mt-3 text-muted-foreground">
                  You requested changes to the installation schedule. Eco Energy
                  Guard will review your request and send an updated proposal.
                </p>
                {job.proposal_change_request && (
                  <div className="mt-4 rounded-xl bg-secondary p-4 text-sm">
                    <p className="font-semibold">Your message:</p>
                    <p className="mt-2 text-muted-foreground">
                      {job.proposal_change_request}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-10 rounded-[2rem] border bg-white p-6">
                <h2 className="text-2xl font-bold">
                  Proposed Installation Schedule
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Please review the proposed days and times for your
                  installation.
                </p>

                {proposals.length === 0 ? (
                  <p className="mt-5 rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                    There is no installation schedule proposed yet. Please
                    contact Eco Energy Guard if you believe this is an error.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-3">
                    {proposals.map((day) => (
                      <div
                        key={day.day_number}
                        className="rounded-2xl border bg-background p-4"
                      >
                        <p className="font-semibold">Day {day.day_number}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {new Date(day.starts_at).toLocaleDateString(
                            undefined,
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                          ,{" "}
                          {new Date(day.starts_at).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(day.ends_at).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={acceptSchedule}
                    disabled={working || proposals.length === 0}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Accept Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangeForm(true)}
                    disabled={working || proposals.length === 0}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Request Changes
                  </button>
                </div>

                {showChangeForm && (
                  <div className="mt-8 rounded-2xl border bg-background p-6">
                    <h3 className="font-bold">Request Changes</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Describe what needs to change about the proposed schedule.
                      Eco Energy Guard will get back to you with an updated
                      proposal.
                    </p>
                    <textarea
                      value={changeMessage}
                      onChange={(e) => setChangeMessage(e.target.value)}
                      className="mt-4 min-h-32 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="e.g., 'Can we start later in the day?' or 'I'm unavailable on the 15th.'"
                    />
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={requestChanges}
                        disabled={working || !changeMessage.trim()}
                        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Request
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowChangeForm(false)}
                        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border bg-white px-6 text-sm font-semibold transition hover:bg-muted"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
