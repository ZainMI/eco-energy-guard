import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/layout/Container";
import ContactForm from "@/components/forms/ContactForm";
import {
  FREE_INSPECTION_CTA,
  HOURS_DISPLAY,
  PHONE_DISPLAY,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact Eco Energy Guard",
  description:
    "Contact Eco Energy Guard with questions about home energy inspections, insulation, and air sealing in Central Connecticut.",
  alternates: { canonical: "/contact" },
};

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

            <div>
              <ContactForm />

              <div className="mt-5 rounded-2xl bg-secondary p-5">
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
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
import type { Metadata } from "next";
