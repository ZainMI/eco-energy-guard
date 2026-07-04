"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Search,
  UserCog,
  Hourglass,
  Wrench,
  ClipboardCheck,
  XCircle,
} from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";

type Slot = {
  id: string;
  starts_at: string;
  ends_at: string;
};

type JobStatus =
  | "inspection_requested"
  | "reschedule_requested"
  | "inspection_scheduled"
  | "inspection_completed"
  | "estimate_sent"
  | "installation_requested"
  | "installation_scheduled"
  | "completed"
  | "cancelled";

type Job = {
  id: string;
  status: JobStatus;
  created_at: string;
  inspection_slot: Slot | null;
  installation_slot: Slot | null;
  manual_estimate_amount: number | null;
  customers: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
  } | null;
};

const statusLabels: Record<JobStatus, string> = {
  inspection_requested: "Inspection Requested",
  reschedule_requested: "Reschedule Requested",
  inspection_scheduled: "Inspection Scheduled",
  inspection_completed: "Inspection Completed",
  estimate_sent: "Estimate Sent",
  installation_requested: "Installation Requested",
  installation_scheduled: "Installation Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

const nextStepMap: Record<JobStatus, string> = {
  inspection_requested: "Review and approve inspection",
  reschedule_requested: "Customer needs a new inspection time",
  inspection_scheduled: "Complete inspection inputs",
  inspection_completed: "Prepare and send estimate",
  estimate_sent: "Waiting for customer to request installation",
  installation_requested: "Review and approve installation",
  installation_scheduled: "Installation scheduled",
  completed: "Job completed",
  cancelled: "Job cancelled",
};

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Inspection Requests", value: "inspection_requested" },
  { label: "Scheduled Inspections", value: "inspection_scheduled" },
  { label: "Estimates", value: "estimate_sent" },
  { label: "Installation Requests", value: "installation_requested" },
  { label: "Scheduled Installations", value: "installation_scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      const { data } = await supabase
        .from("jobs")
        .select(
          `
          id,
          status,
          created_at,
          manual_estimate_amount,
          customers (
            first_name,
            last_name,
            email,
            phone,
            address,
            city,
            state
          ),
          inspection_slot:inspection_slot_id(id, starts_at, ends_at),
          installation_slot:installation_slot_id(id, starts_at, ends_at)
        `,
        )
        .order("created_at", { ascending: false });

      const typedJobs = (data || []).map((job) => ({
        ...job,
        customers: Array.isArray(job.customers)
          ? (job.customers[0] ?? null)
          : job.customers,
        inspection_slot: Array.isArray(job.inspection_slot)
          ? (job.inspection_slot[0] ?? null)
          : job.inspection_slot,
        installation_slot: Array.isArray(job.installation_slot)
          ? (job.installation_slot[0] ?? null)
          : job.installation_slot,
      })) as Job[];

      setJobs(typedJobs);
      setLoading(false);
    }

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "estimate_sent") {
          return (
            job.status === "estimate_sent" ||
            job.status === "inspection_completed"
          );
        }
        return job.status === activeFilter;
      })
      .filter((job) => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        const customer = job.customers;
        const customerName = customer
          ? `${customer.first_name} ${customer.last_name}`.toLowerCase()
          : "";
        const location = [customer?.address, customer?.city, customer?.state]
          .filter(Boolean)
          .join(", ")
          .toLowerCase();

        return (
          customerName.includes(lowerSearch) ||
          customer?.email?.toLowerCase().includes(lowerSearch) ||
          customer?.phone?.toLowerCase().includes(lowerSearch) ||
          location.includes(lowerSearch) ||
          statusLabels[job.status].toLowerCase().includes(lowerSearch)
        );
      });
  }, [jobs, activeFilter, searchTerm]);

  const stats = useMemo(() => {
    return {
      pendingInspection: jobs.filter((j) => j.status === "inspection_requested")
        .length,
      scheduledInspection: jobs.filter(
        (j) => j.status === "inspection_scheduled",
      ).length,
      estimatesSent: jobs.filter((j) => j.status === "estimate_sent").length,
      pendingInstallation: jobs.filter(
        (j) => j.status === "installation_requested",
      ).length,
      scheduledInstallation: jobs.filter(
        (j) => j.status === "installation_scheduled",
      ).length,
      completed: jobs.filter((j) => j.status === "completed").length,
    };
  }, [jobs]);

  const statCards = [
    {
      label: "Pending Inspection Requests",
      value: stats.pendingInspection,
      icon: Hourglass,
    },
    {
      label: "Scheduled Inspections",
      value: stats.scheduledInspection,
      icon: CalendarClock,
    },
    {
      label: "Estimates Sent",
      value: stats.estimatesSent,
      icon: FileText,
    },
    {
      label: "Installation Requests",
      value: stats.pendingInstallation,
      icon: Wrench,
    },
    {
      label: "Scheduled Installations",
      value: stats.scheduledInstallation,
      icon: Clock,
    },
    {
      label: "Completed Jobs",
      value: stats.completed,
      icon: CheckCircle2,
    },
  ];

  const formatSlot = (slot: Slot | null) => {
    if (!slot) return "Not scheduled";
    const start = new Date(slot.starts_at);
    const end = new Date(slot.ends_at);
    return `${start.toLocaleDateString()} at ${start.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-10 sm:py-16">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Admin Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Jobs & Scheduling
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Manage inspection requests, estimates, installations, and customer
              scheduling.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/users"
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border bg-white px-5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:bg-muted hover:shadow-md"
            >
              <UserCog className="mr-2 h-4 w-4" />
              Manage Users
            </Link>

            <Link
              href="/admin/slots"
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" />
              Manage Slots
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-3xl border bg-white p-5 shadow-sm"
              >
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-[2rem] border bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Jobs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Inspection requests and active customer jobs.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by customer, email, phone, address, or status…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-full border bg-background pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/50 sm:w-80"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-b pb-6">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  activeFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-stone-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-16 text-center text-muted-foreground">
              Loading jobs...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-16 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-5 text-2xl font-bold">No jobs found</h3>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                There are no jobs matching your current search and filter
                criteria.
              </p>
            </div>
          ) : (
            <div className="mt-6 flow-root">
              <div className="-m-4 p-4">
                <div className="grid gap-5">
                  {filteredJobs.map((job) => {
                    const customer = job.customers;
                    const name = customer
                      ? `${customer.first_name} ${customer.last_name}`
                      : "Unknown Customer";

                    const location = [
                      customer?.address,
                      customer?.city,
                      customer?.state,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        key={job.id}
                        className="block cursor-pointer rounded-3xl border bg-stone-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                              <h3 className="text-xl font-bold">{name}</h3>
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                                {statusLabels[job.status]}
                              </span>
                            </div>

                            <div className="mt-4 grid gap-x-6 gap-y-3 text-sm text-muted-foreground sm:grid-cols-2 xl:grid-cols-3">
                              <p>
                                <strong>Email:</strong> {customer?.email}
                              </p>
                              <p>
                                <strong>Phone:</strong>{" "}
                                {customer?.phone || "Not provided"}
                              </p>
                              <p>
                                <strong>Location:</strong>{" "}
                                {location || "Not provided"}
                              </p>
                              <p>
                                <strong>Inspection:</strong>{" "}
                                {formatSlot(job.inspection_slot)}
                              </p>
                              <p>
                                <strong>Installation:</strong>{" "}
                                {formatSlot(job.installation_slot)}
                              </p>
                              <p>
                                <strong>Estimate:</strong>{" "}
                                {job.manual_estimate_amount
                                  ? new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    }).format(job.manual_estimate_amount)
                                  : "Not set"}
                              </p>
                            </div>

                            <div className="mt-4 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
                              <strong>Next step:</strong>{" "}
                              {nextStepMap[job.status]}
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <div className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
                              Open Job
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
