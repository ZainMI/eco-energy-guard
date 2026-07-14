import Link from "next/link";
import {
  ArrowRight,
  Home,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
  Zap,
} from "lucide-react";
import Container from "@/components/layout/Container";
import ImagePlaceholder from "@/components/ui/image-placeholder";

const services = [
  {
    id: "foam-air-sealing",
    icon: ShieldCheck,
    title: "Foam Air Sealing",
    description:
      "Stop drafts at the source with professional spray foam applied around penetrations, gaps, rim joists, attic bypasses, and common leakage points throughout your home. Air sealing is often the highest-impact improvement you can make to your home's comfort and efficiency.",
    highlights: [
      "Rim joist and band joist sealing",
      "Attic bypass sealing",
      "Penetration sealing (pipes, wiring, ducts)",
      "Can be paired with blown-in insulation for maximum results",
    ],
  },
  {
    id: "blown-in-insulation",
    icon: Sparkles,
    title: "Blown-in Insulation",
    description:
      "Loose-fill cellulose or fiberglass blown into attics, walls, and hard-to-reach spaces for complete, even coverage. Blown-in insulation fills gaps and settles around obstructions that batt insulation cannot reach, dramatically improving thermal performance.",
    highlights: [
      "Attic floor insulation",
      "Knee wall cavities",
      "Garage ceiling coverage",
      "Reaches difficult and irregular spaces",
    ],
  },
  {
    id: "batt-insulation",
    icon: Home,
    title: "Batt Insulation",
    description:
      "Pre-cut fiberglass or mineral wool batt insulation installed between framing members in walls, floors, and ceilings. Batts are ideal for open framing cavities and provide consistent R-value across large areas.",
    highlights: [
      "Attic floor and ceiling applications",
      "Basement and crawlspace walls",
      "Interior wall sound insulation",
      "Available in multiple R-value ratings",
    ],
  },
  {
    id: "dense-packed",
    icon: ThermometerSun,
    title: "Dense Packed",
    description:
      "High-density cellulose or fiberglass blown at elevated density into enclosed wall cavities, floors, and other tight spaces. Dense packing eliminates convective air movement within cavities and provides effective insulation without opening walls.",
    highlights: [
      "Existing wall cavity insulation without removal",
      "Floors over unconditioned spaces",
      "Closed roof systems",
      "Minimal disruption to finished surfaces",
    ],
  },
  {
    id: "dense-packed-garage-ceilings",
    icon: Zap,
    title: "Dense Packed Garage Ceilings",
    description:
      "Insulate the ceiling assembly above your attached garage to prevent cold floors and temperature extremes in the living spaces above. Garage ceiling insulation is one of the most cost-effective comfort upgrades for homes with attached garages.",
    highlights: [
      "Stops cold transfer to rooms above the garage",
      "Reduces heating and cooling load on upper floors",
      "Minimal disruption to living spaces",
      "Works with existing ceiling assemblies",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Services
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Insulation & air sealing services in Central CT.
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Professional insulation installation and air sealing for
              homeowners throughout Central Connecticut. Free estimates — no
              pressure, just honest recommendations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Get a Free Estimate
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="tel:+18605550000"
                className="inline-flex h-12 items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted"
              >
                (860) XXX-XXXX — Call Now
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── SERVICE CARDS ─── */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="scroll-mt-24 overflow-hidden rounded-[2rem] border bg-white shadow-sm transition hover:shadow-md"
                >
                  <div
                    className={`grid gap-0 lg:grid-cols-2 ${isEven ? "" : "lg:grid-flow-dense"}`}
                  >
                    {/* Image */}
                    <div
                      className={`${isEven ? "" : "lg:col-start-2"}`}
                    >
                      <ImagePlaceholder
                        label={`${service.title} — add photo here`}
                        className="aspect-video h-full min-h-[220px] w-full rounded-none lg:rounded-none"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-7 sm:p-10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                        {service.title}
                      </h2>
                      <p className="mt-4 leading-7 text-muted-foreground">
                        {service.description}
                      </p>
                      <ul className="mt-5 space-y-2">
                        {service.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-2 text-sm font-medium"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/book"
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        Get a Free Estimate
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Simple Process
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Start with a free inspection. Then choose the right improvements.
              </h2>
            </div>

            <div className="rounded-3xl border bg-stone-50 p-6 sm:p-8">
              <div className="space-y-5">
                {[
                  "Call or book a free home energy inspection online",
                  "We assess insulation, identify drafts, and explain findings",
                  "Receive clear, honest recommendations — no pressure",
                  "Schedule installation if the project is a fit",
                  "We help you claim available Energize CT rebates",
                ].map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="pt-1 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/book"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
            >
              Request a Free Inspection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
