import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import Container from "@/components/layout/Container";

const towns = [
  // Hartford County
  {
    county: "Hartford County",
    towns: [
      "Hartford",
      "West Hartford",
      "East Hartford",
      "New Britain",
      "Bristol",
      "Newington",
      "Wethersfield",
      "Rocky Hill",
      "Glastonbury",
      "Bloomfield",
      "Farmington",
      "Avon",
      "Simsbury",
      "Plainville",
      "Berlin",
      "Southington",
      "Canton",
      "Burlington",
      "Enfield",
      "Windsor",
    ],
  },
  {
    county: "Middlesex County",
    towns: [
      "Middletown",
      "Meriden",
      "Wallingford",
      "Cromwell",
      "Portland",
      "East Hampton",
      "Haddam",
      "Durham",
      "Middlefield",
      "Chester",
    ],
  },
  {
    county: "New Haven County",
    towns: [
      "Cheshire",
      "North Haven",
      "Hamden",
      "Shelton",
      "Ansonia",
      "Derby",
      "Seymour",
      "Naugatuck",
    ],
  },
];

export default function AreasPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Service Areas
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Insulation services throughout Central Connecticut.
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Eco Energy Guard serves homeowners across Central CT with
              professional insulation and air sealing services. Not sure if we
              serve your town? Give us a call — free estimates for all areas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Book a Free Estimate
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="tel:+18605550000"
                className="inline-flex h-12 items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted"
              >
                <Phone className="mr-2 h-4 w-4" />
                (860) XXX-XXXX
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── TOWNS BY COUNTY ─── */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Coverage Area
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Towns we serve across Central CT.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Don't see your town? Contact us — we may still be able to help.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {towns.map(({ county, towns: townList }) => (
              <div
                key={county}
                className="rounded-[2rem] border bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">{county}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {townList.map((town) => (
                    <span
                      key={town}
                      className="rounded-full border bg-stone-50 px-3 py-1 text-xs font-medium"
                    >
                      {town}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-primary py-16 text-primary-foreground sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Not sure if we cover your area?
            </h2>
            <p className="mt-5 text-lg opacity-90">
              Give us a call or book online and we'll confirm coverage. Free
              estimates with no obligation.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-100"
              >
                Book Online — Free Estimate
              </Link>
              <a
                href="tel:+18605550000"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-8 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="mr-2 h-4 w-4" />
                (860) XXX-XXXX
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
