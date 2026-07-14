import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import Container from "@/components/layout/Container";
import {
  FREE_INSPECTION_CTA,
  PHONE_DISPLAY,
  PHONE_HREF,
  towns,
} from "@/lib/site-content";

export default function LocationsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Locations
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Simple insulation service pages for every town we cover.
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              We provide professional insulation and energy-saving services
              across Central Connecticut. Select your town to see local details.
            </p>
            <p className="mt-4 font-semibold text-foreground">
              {FREE_INSPECTION_CTA}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Book a Free Inspection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex h-12 items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted"
              >
                <Phone className="mr-2 h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Town Pages
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Choose your location.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {towns.map((town) => (
              <Link
                key={town.slug}
                href={`/locations/${town.slug}`}
                className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                {town.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
