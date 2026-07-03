import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  RefreshCw,
  UserX,
} from "lucide-react";
import Container from "@/components/layout/Container";

const requests = [
  {
    name: "Maria Santos",
    service: "Home Energy Inspection",
    date: "Tuesday, 9:00 AM",
    phone: "(518) 555-0182",
    email: "maria@example.com",
    address: "Albany, NY",
    status: "Pending",
  },
  {
    name: "James Walker",
    service: "Insulation Estimate",
    date: "Friday, 1:30 PM",
    phone: "(518) 555-0144",
    email: "james@example.com",
    address: "Troy, NY",
    status: "Approved",
  },
  {
    name: "Linda Chen",
    service: "Air Sealing Consultation",
    date: "Flexible",
    phone: "(518) 555-0199",
    email: "linda@example.com",
    address: "Schenectady, NY",
    status: "Needs Reschedule",
  },
];

const stats = [
  {
    label: "Pending",
    value: "4",
    icon: Clock,
  },
  {
    label: "Approved",
    value: "8",
    icon: CheckCircle2,
  },
  {
    label: "This Week",
    value: "12",
    icon: CalendarClock,
  },
];

export default function AdminPage() {
  return (
    <section className="min-h-screen bg-zinc-950 py-10 text-white sm:py-16">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
              Admin Preview
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Appointment Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Placeholder dashboard for reviewing inspection requests, approving
              appointments, rescheduling customers, and eventually syncing
              accepted bookings to Google Calendar.
            </p>
          </div>

          <button className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500">
            Future Login
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <Icon className="h-6 w-6 text-emerald-400" />
                <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Inspection Requests</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Mock data only. Actions are placeholders for the future booking
                system.
              </p>
            </div>

            <div className="rounded-full bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
              Calendar sync coming later
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {requests.map((request) => (
              <article
                key={request.email}
                className="rounded-3xl border border-white/10 bg-zinc-950/60 p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold">{request.name}</h3>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-300">
                        {request.status}
                      </span>
                    </div>

                    <p className="mt-2 text-zinc-300">{request.service}</p>

                    <div className="mt-4 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-emerald-400" />
                        {request.date}
                      </p>
                      <p>{request.address}</p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-emerald-400" />
                        {request.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-emerald-400" />
                        {request.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                    <button className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-500">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </button>

                    <button className="inline-flex h-10 items-center justify-center rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reschedule
                    </button>

                    <button className="inline-flex h-10 items-center justify-center rounded-full bg-red-500/15 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-500/25">
                      <UserX className="mr-2 h-4 w-4" />
                      Deny
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
