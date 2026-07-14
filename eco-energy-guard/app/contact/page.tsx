import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/layout/Container";
import {
  FREE_INSPECTION_CTA,
  HOURS_DISPLAY,
  PHONE_DISPLAY,
} from "@/lib/site-content";

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Have questions before booking?
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Reach out to Eco Energy Guard to ask about inspections,
              insulation, air sealing, or next steps for your home.
            </p>
            <p className="mt-4 font-semibold text-foreground">
              {FREE_INSPECTION_CTA}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <Phone className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-xl font-bold">Phone</h2>
                <p className="mt-2 text-muted-foreground">{PHONE_DISPLAY}</p>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <Mail className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-xl font-bold">Email</h2>
                <p className="mt-2 text-muted-foreground">
                  info@ecoenergyguard.com
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <MapPin className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-xl font-bold">Service Area</h2>
                <p className="mt-2 text-muted-foreground">
                  Serving Central Connecticut towns.
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-xl font-bold">Hours</h2>
                <p className="mt-2 text-muted-foreground">{HOURS_DISPLAY}</p>
              </div>
            </div>

            <form className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold">Send a message</h2>
              <p className="mt-3 text-muted-foreground">
                This is currently a placeholder form. Later, it can send emails
                directly or connect to the booking workflow.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
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
                    placeholder="1 (860)-690-5465"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold">Message</label>
                  <textarea
                    className="mt-2 min-h-40 w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <button
                type="button"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md sm:w-auto"
              >
                Send Message
              </button>

              <div className="mt-8 rounded-2xl bg-secondary p-5">
                <p className="text-sm text-muted-foreground">
                  Ready to start? The fastest next step is to request a home
                  energy inspection.
                </p>

                <Link
                  href="/book"
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Request Inspection
                </Link>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
