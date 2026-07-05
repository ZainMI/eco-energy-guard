"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Save,
  Send,
  UserCheck,
  Plus,
  FileCheck,
  XCircle,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";
import {
  approveInspectionAction,
  denyInspectionAction,
  approveInstallationAction,
  completeJobAction,
  sendEstimateAction,
  resendLastEmailAction,
  requestInspectionRescheduleAction,
} from "@/actions/jobs";

type JobStatus =
  | "inspection_requested"
  | "reschedule_requested"
  | "installation_requested"
  | "inspection_scheduled"
  | "inspection_completed"
  | "estimate_sent"
  | "installation_scheduled"
  | "installation_proposal_changes_requested"
  | "completed"
  | "cancelled";

type TeamMember = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
};

type Job = {
  id: string;
  status: JobStatus;
  issue_notes: string | null;
  admin_notes: string | null;
  internal_notes: string | null;
  square_footage: number | null;
  insulation_type: string | null;
  labor_hours: number | null;
  materials_notes: string | null;
  rebate_notes: string | null;
  customer_notes: string | null;
  manual_estimate_amount: number | null;
  estimate_sent_at: string | null;
  created_at: string;
  customers: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  } | null;
};

const statusLabels: Record<JobStatus, string> = {
  inspection_requested: "Inspection Requested",
  reschedule_requested: "Reschedule Requested",
  installation_requested: "Installation Requested",
  inspection_scheduled: "Inspection Scheduled",
  inspection_completed: "Inspection Completed",
  estimate_sent: "Estimate Sent",
  installation_scheduled: "Installation Scheduled",
  installation_proposal_changes_requested: "Installation - Changes Requested",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function AdminJobPage() {
  const params = useParams<{ id: string }>();
  const supabase = createClient();

  const [job, setJob] = useState<Job | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [installationProposals, setInstallationProposals] = useState<any[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  type InstallationProposalRow = {
    day_number: number;
    date: string;
    start_time: string;
    end_time: string;
    notes: string;
  };
  const [proposalRows, setProposalRows] = useState<InstallationProposalRow[]>(
    [],
  );

  async function loadJob() {
    setLoading(true);

    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .select(
        `
        *,
        customers (
          first_name,
          last_name,
          email,
          phone,
          address,
          city,
          state,
          zip
        )
      `,
      )
      .eq("id", params.id)
      .single();

    if (jobError) {
      setMessage(jobError.message);
    } else {
      setJob({
        ...jobData,
        customers: Array.isArray(jobData.customers)
          ? (jobData.customers[0] ?? null)
          : jobData.customers,
      } as Job);
    }

    const { data: teamData } = await supabase
      .from("users")
      .select("id, full_name, email, role")
      .order("full_name", { ascending: true });

    setTeam((teamData || []) as TeamMember[]);

    const { data: assignments } = await supabase
      .from("job_assignments")
      .select("user_id")
      .eq("job_id", params.id)
      .eq("assignment_type", "inspection");

    setSelectedTeamIds((assignments || []).map((item) => item.user_id));

    const { data: proposals } = await supabase
      .from("installation_proposals")
      .select("*")
      .eq("job_id", params.id)
      .in("status", ["proposed", "accepted", "changes_requested"])
      .order("day_number", { ascending: true });

    setInstallationProposals(proposals || []);

    setProposalRows(
      (proposals || [])
        .filter((p) => p.status === "proposed" || p.status === "accepted")
        .map((proposal) => ({
          day_number: proposal.day_number,
          date: proposal.starts_at.split("T")[0],
          start_time: new Date(proposal.starts_at).toTimeString().slice(0, 5),
          end_time: new Date(proposal.ends_at).toTimeString().slice(0, 5),
          notes: proposal.notes || "",
        })),
    );

    setLoading(false);
  }

  async function approveInspection() {
    setMessage("");

    const result = await approveInspectionAction(params.id, selectedTeamIds);

    setMessage(result.message);

    if (result.ok) {
      await loadJob();
    }
  }

  async function saveJob() {
    if (!job) return;

    setMessage("");

    const { error } = await supabase
      .from("jobs")
      .update({
        issue_notes: job.issue_notes,
        admin_notes: job.admin_notes,
        internal_notes: job.internal_notes,
        square_footage: job.square_footage,
        insulation_type: job.insulation_type,
        labor_hours: job.labor_hours,
        materials_notes: job.materials_notes,
        rebate_notes: job.rebate_notes,
        customer_notes: job.customer_notes,
        manual_estimate_amount: job.manual_estimate_amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Job saved.");
    await loadJob();
  }

  async function saveInstallationProposal() {
    if (!job) return;

    const validRows = proposalRows.filter(
      (row) => row.date && row.start_time && row.end_time,
    );

    if (!validRows.length) {
      setMessage("Add at least one installation proposal day.");
      return;
    }

    await supabase
      .from("installation_proposals")
      .delete()
      .eq("job_id", job.id)
      .in("status", ["proposed", "changes_requested"]);

    const { error } = await supabase.from("installation_proposals").insert(
      validRows.map((row, index) => ({
        job_id: job.id,
        day_number: index + 1,
        starts_at: new Date(`${row.date}T${row.start_time}`).toISOString(),
        ends_at: new Date(`${row.date}T${row.end_time}`).toISOString(),
        notes: row.notes || null,
        status: "proposed",
      })),
    );

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Installation proposal saved.");
    await loadJob();
  }

  async function approveInstallation() {
    if (!job) return;

    setMessage("");

    const result = await approveInstallationAction(job.id);

    setMessage(result.message);

    if (result.ok) {
      await loadJob();
    }
  }

  async function markInspectionComplete() {
    if (!job) return;

    setMessage("");

    const { error } = await supabase
      .from("jobs")
      .update({
        status: "inspection_completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Inspection marked complete. Estimate stage is now available.");
    await loadJob();
  }

  async function completeJob() {
    if (!job) return;

    const confirmed = window.confirm(
      "Mark this job as completed? This should only be done after the installation is finished.",
    );

    if (!confirmed) return;

    setMessage("");

    const result = await completeJobAction(job.id);

    setMessage(result.message);

    if (result.ok) {
      await loadJob();
    }
  }

  async function sendEstimate() {
    if (!job) return;

    setMessage("");

    await saveJob();

    const result = await sendEstimateAction(job.id);

    setMessage(result.message);

    if (result.ok) {
      await loadJob();
    }
  }

  async function resendLastEmail() {
    if (!job) return;

    const confirmed = window.confirm(
      "Are you sure you want to resend the last email to the customer?",
    );
    if (!confirmed) return;

    setMessage("Resending email...");
    const result = await resendLastEmailAction(job.id);
    setMessage(result.message);
    // No need to reload job data for this action
  }

  useEffect(() => {
    loadJob();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <Container>
          <p>Loading job...</p>
        </Container>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="py-16">
        <Container>
          <h1 className="text-3xl font-bold">Job not found</h1>
          <Link href="/admin" className="mt-6 inline-block text-primary">
            Back to dashboard
          </Link>
        </Container>
      </section>
    );
  }

  const customer = job.customers;
  const customerName = customer
    ? `${customer.first_name} ${customer.last_name}`
    : "Unknown Customer";

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

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Job Workflow
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {customerName}
            </h1>
            <p className="mt-4 text-muted-foreground">
              Current stage: {statusLabels[job.status]}
            </p>
          </div>

          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            {statusLabels[job.status]}
          </span>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={resendLastEmail}
            className="inline-flex items-center rounded-full border bg-white px-4 py-2 text-xs font-semibold text-stone-700 shadow-sm transition hover:bg-muted"
          >
            <Mail className="mr-2 h-3.5 w-3.5" /> Resend Last Email to Customer
          </button>
        </div>

        {message && (
          <div className="mt-8 rounded-2xl border bg-white p-4 text-sm shadow-sm">
            {message}
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-6">
            <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Customer</h2>

              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {customer?.email}
                </p>

                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {customer?.phone || "No phone provided"}
                </p>

                <p>
                  {[
                    customer?.address,
                    customer?.city,
                    customer?.state,
                    customer?.zip,
                  ]
                    .filter(Boolean)
                    .join(", ") || "No address provided"}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Inspection Team</h2>

              <div className="mt-5 grid gap-3">
                {team.map((member) => (
                  <label
                    key={member.id}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border bg-stone-50 p-4"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTeamIds.includes(member.id)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedTeamIds([...selectedTeamIds, member.id]);
                        } else {
                          setSelectedTeamIds(
                            selectedTeamIds.filter((id) => id !== member.id),
                          );
                        }
                      }}
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
            </div>
          </aside>

          <main className="space-y-6">
            {job.status === "inspection_requested" && (
              <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold">
                  Review Inspection Request
                </h2>

                <p className="mt-3 text-muted-foreground">
                  Assign team members, then approve, deny, or request a
                  reschedule.
                </p>

                {job.issue_notes && (
                  <div className="mt-6 rounded-2xl bg-secondary p-5">
                    <p className="text-sm font-semibold">Customer notes</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {job.issue_notes}
                    </p>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={approveInspection}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Approve Inspection
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={async () => {
                      setMessage("");
                      const result = await requestInspectionRescheduleAction(
                        params.id,
                      );
                      setMessage(result.message);
                      if (result.ok) await loadJob();
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Ask to Reschedule
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-red-50 px-7 text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={async () => {
                      setMessage("");
                      const result = await denyInspectionAction(params.id);
                      setMessage(result.message);
                      if (result.ok) await loadJob();
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Deny
                  </button>
                </div>
              </div>
            )}

            {(job.status === "inspection_scheduled" ||
              job.status === "inspection_completed" ||
              job.status === "estimate_sent") && (
              <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold">Inspection Inputs</h2>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label className="text-sm font-semibold">
                      Inspection observations
                    </label>
                    <textarea
                      value={job.admin_notes || ""}
                      onChange={(event) =>
                        setJob({ ...job, admin_notes: event.target.value })
                      }
                      className="mt-2 min-h-28 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="Inspection observations..."
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className="text-sm font-semibold">
                        Square footage
                      </label>
                      <input
                        type="number"
                        value={job.square_footage ?? ""}
                        onChange={(event) =>
                          setJob({
                            ...job,
                            square_footage: event.target.value
                              ? Number(event.target.value)
                              : null,
                          })
                        }
                        className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold">
                        Insulation type
                      </label>
                      <input
                        value={job.insulation_type || ""}
                        onChange={(event) =>
                          setJob({
                            ...job,
                            insulation_type: event.target.value,
                          })
                        }
                        className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                        placeholder="Reflective, blown-in, foam..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold">
                        Labor hours
                      </label>
                      <input
                        type="number"
                        value={job.labor_hours ?? ""}
                        onChange={(event) =>
                          setJob({
                            ...job,
                            labor_hours: event.target.value
                              ? Number(event.target.value)
                              : null,
                          })
                        }
                        className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Materials notes
                    </label>
                    <textarea
                      value={job.materials_notes || ""}
                      onChange={(event) =>
                        setJob({
                          ...job,
                          materials_notes: event.target.value,
                        })
                      }
                      className="mt-2 min-h-28 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Rebate notes
                    </label>
                    <textarea
                      value={job.rebate_notes || ""}
                      onChange={(event) =>
                        setJob({ ...job, rebate_notes: event.target.value })
                      }
                      className="mt-2 min-h-28 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={saveJob}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Inspection
                  </button>

                  {job.status === "inspection_scheduled" && (
                    <button
                      type="button"
                      onClick={markInspectionComplete}
                      className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            )}

            {(job.status === "inspection_completed" ||
              job.status === "estimate_sent" ||
              job.status === "installation_proposal_changes_requested") && (
              <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold">Installation Proposal</h2>
                <p className="mt-3 text-muted-foreground">
                  Add one or more proposed installation days before sending the
                  estimate.
                </p>

                <div className="mt-6 grid gap-4">
                  {proposalRows.map((row, index) => (
                    <div key={index} className="rounded-2xl bg-secondary p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Day {index + 1}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setProposalRows(
                              proposalRows.filter((_, i) => i !== index),
                            )
                          }
                          className="text-xs font-semibold text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) => {
                            const newRows = [...proposalRows];
                            newRows[index].date = e.target.value;
                            setProposalRows(newRows);
                          }}
                          className="h-11 w-full rounded-lg border bg-background px-3"
                        />
                        <input
                          type="time"
                          value={row.start_time}
                          onChange={(e) => {
                            const newRows = [...proposalRows];
                            newRows[index].start_time = e.target.value;
                            setProposalRows(newRows);
                          }}
                          className="h-11 w-full rounded-lg border bg-background px-3"
                        />
                        <input
                          type="time"
                          value={row.end_time}
                          onChange={(e) => {
                            const newRows = [...proposalRows];
                            newRows[index].end_time = e.target.value;
                            setProposalRows(newRows);
                          }}
                          className="h-11 w-full rounded-lg border bg-background px-3"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setProposalRows([
                        ...proposalRows,
                        {
                          day_number: proposalRows.length + 1,
                          date: "",
                          start_time: "09:00",
                          end_time: "13:00",
                          notes: "",
                        },
                      ])
                    }
                    className="inline-flex h-11 items-center justify-center rounded-full border bg-white px-6 text-sm font-semibold transition hover:bg-muted"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Day
                  </button>

                  <button
                    type="button"
                    onClick={saveInstallationProposal}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Installation Proposal
                  </button>
                </div>
              </div>
            )}

            {(job.status === "inspection_completed" ||
              job.status === "estimate_sent") && (
              <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Estimate</h2>
                </div>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label className="text-sm font-semibold">
                      Manual estimate amount
                    </label>
                    <input
                      type="number"
                      value={job.manual_estimate_amount ?? ""}
                      onChange={(event) =>
                        setJob({
                          ...job,
                          manual_estimate_amount: event.target.value
                            ? Number(event.target.value)
                            : null,
                        })
                      }
                      className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="2500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Customer-facing estimate notes
                    </label>
                    <textarea
                      value={job.customer_notes || ""}
                      onChange={(event) =>
                        setJob({
                          ...job,
                          customer_notes: event.target.value,
                        })
                      }
                      className="mt-2 min-h-32 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="This will eventually be included in the estimate email."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold">
                      Internal notes
                    </label>
                    <textarea
                      value={job.internal_notes || ""}
                      onChange={(event) =>
                        setJob({
                          ...job,
                          internal_notes: event.target.value,
                        })
                      }
                      className="mt-2 min-h-32 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="Private notes for the team."
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={saveJob}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Estimate
                  </button>

                  <button
                    type="button"
                    onClick={sendEstimate}
                    className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Estimate
                  </button>
                </div>
              </div>
            )}

            {(job.status === "installation_requested" ||
              job.status === "installation_scheduled" ||
              job.status === "installation_proposal_changes_requested") && (
              <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold">
                  Review Installation Request
                </h2>

                <p className="mt-3 text-muted-foreground">
                  The customer selected an installation time. Review and approve
                  it, or propose a new schedule.
                </p>

                <div className="mt-6 space-y-4">
                  {installationProposals
                    .filter((p) => p.status === "accepted")
                    .map((proposal) => (
                      <div
                        key={proposal.id}
                        className="rounded-2xl bg-secondary p-5"
                      >
                        <p className="text-sm font-semibold">
                          Accepted Installation Schedule
                        </p>
                        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                          <p>
                            <strong>Day {proposal.day_number}:</strong>{" "}
                            {new Date(proposal.starts_at).toLocaleDateString()}{" "}
                            {new Date(proposal.starts_at).toLocaleTimeString(
                              [],
                              { hour: "numeric", minute: "2-digit" },
                            )}{" "}
                            -{" "}
                            {new Date(proposal.ends_at).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}

                  {installationProposals
                    .filter((p) => p.status === "changes_requested")
                    .map((proposal) => (
                      <div
                        key={proposal.id}
                        className="rounded-2xl bg-amber-50 p-5"
                      >
                        <p className="text-sm font-semibold text-amber-800">
                          Customer Requested Changes
                        </p>
                        <p className="mt-2 text-sm text-amber-700">
                          {proposal.change_request_message}
                        </p>
                      </div>
                    ))}

                  <div className="rounded-2xl bg-secondary p-5">
                    <p className="text-sm font-semibold">Inspection Details</p>
                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <p>
                        <strong>Sq. Footage:</strong>{" "}
                        {job.square_footage ?? "N/A"}
                      </p>
                      <p>
                        <strong>Insulation Type:</strong>{" "}
                        {job.insulation_type || "N/A"}
                      </p>
                      <p>
                        <strong>Labor Hours:</strong> {job.labor_hours ?? "N/A"}
                      </p>
                      <p>
                        <strong>Observations:</strong>{" "}
                        {job.admin_notes || "N/A"}
                      </p>
                      <p>
                        <strong>Materials:</strong>{" "}
                        {job.materials_notes || "N/A"}
                      </p>
                      <p>
                        <strong>Rebates:</strong> {job.rebate_notes || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-secondary p-5">
                    <p className="text-sm font-semibold">Estimate Details</p>
                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <p>
                        <strong>Amount:</strong>{" "}
                        {job.manual_estimate_amount
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(job.manual_estimate_amount)
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Customer Notes:</strong>{" "}
                        {job.customer_notes || "N/A"}
                      </p>
                      <p>
                        <strong>Internal Notes:</strong>{" "}
                        {job.internal_notes || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {(job.status === "installation_requested" ||
                  job.status === "installation_proposal_changes_requested" ||
                  installationProposals.some(
                    (p) => p.status === "accepted",
                  )) && (
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={approveInstallation}
                      className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FileCheck className="mr-2 h-4 w-4" />
                      Approve Installation
                    </button>
                  </div>
                )}
              </div>
            )}

            {job.status === "installation_scheduled" && (
              <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-bold">Installation Scheduled</h2>

                <p className="mt-3 text-muted-foreground">
                  Once the installation is finished, mark this job as completed.
                </p>

                <button
                  type="button"
                  onClick={completeJob}
                  className="mt-8 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
                >
                  Complete Job
                </button>
              </div>
            )}

            {["reschedule_requested", "cancelled", "completed"].includes(
              job.status,
            ) && (
              <div className="rounded-[2rem] border bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold">
                  {statusLabels[job.status]}
                </h2>

                <p className="mt-3 text-muted-foreground">
                  This stage will be expanded as the customer manage page,
                  estimate email, and installation scheduling flow are wired.
                </p>
              </div>
            )}
          </main>
        </div>
      </Container>
    </section>
  );
}
