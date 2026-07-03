import Link from "next/link";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Home,
  Mail,
  Phone,
} from "lucide-react";
import Container from "@/components/layout/Container";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us about your home",
    description:
      "Share your contact details, address, and what comfort or energy issues you’re noticing.",
  },
  {
    icon: CalendarClock,
    title: "We review availability",
    description:
      "The team confirms the right inspection window and follows up with next steps.",
  },
  {
    icon: Home,
    title: "Inspection first",
    description:
      "An inspection helps determine the right estimate and whether installation is needed.",
  },
];

export default function BookPage() {
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
              Tell us a little about your home. Our team will review your
              request, confirm availability, and follow up before scheduling any
              installation work.
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
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="Jane"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Last name</label>
                  <input
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="Smith"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Phone</label>
                  <input
                    type="tel"
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="(518) 555-0123"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">Home address</label>
                  <input
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="Street address, city, state"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Preferred date
                  </label>
                  <input
                    type="date"
                    className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Preferred time window
                  </label>
                  <select className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10">
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Flexible</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">
                    What can we help with?
                  </label>
                  <textarea
                    className="mt-2 min-h-36 w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="Tell us about drafts, cold rooms, insulation concerns, or anything else you’ve noticed."
                  />
                </div>
              </div>

              <button
                type="button"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md sm:w-auto"
              >
                Submit Request
              </button>

              <p className="mt-4 text-sm text-muted-foreground">
                Placeholder only for now. Later this can connect to email,
                Cal.com, Google Calendar, or a custom admin workflow.
              </p>
            </form>

            <aside className="space-y-5">
              {steps.map((step) => {
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

                <div className="mt-6 flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Inspection requests are reviewed before installation
                    appointments are scheduled.
                  </p>
                </div>
              </div>

              <Link
                href="/gallery"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border bg-white px-6 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted"
              >
                View Recent Projects
              </Link>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
