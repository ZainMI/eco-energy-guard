import Link from "next/link";
import {
  ArrowRight,
  Home,
  ShieldCheck,
  Sparkles,
  ThermometerSun,
} from "lucide-react";
import Container from "@/components/layout/Container";

const services = [
  {
    icon: Home,
    title: "Home Energy Inspections",
    description:
      "A walkthrough to find drafts, insulation gaps, comfort issues, and energy-saving opportunities.",
  },
  {
    icon: ThermometerSun,
    title: "Insulation Upgrades",
    description:
      "Improve comfort and reduce heat loss with attic, wall, basement, and crawlspace insulation solutions.",
  },
  {
    icon: ShieldCheck,
    title: "Air Sealing",
    description:
      "Seal leaks around common problem areas to reduce drafts and make your home feel more consistent.",
  },
  {
    icon: Sparkles,
    title: "Reflective Insulation Technology",
    description:
      "Modern reflective insulation solutions designed to help protect comfort and improve efficiency.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Services
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Energy upgrades that make your home feel better.
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Eco Energy Guard helps homeowners understand where energy is being
              wasted, what improvements matter most, and how to move forward
              with confidence.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h2 className="mt-6 text-2xl font-bold">{service.title}</h2>
                  <p className="mt-4 leading-7 text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Simple Process
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Start with an inspection, then choose the right improvements.
              </h2>
            </div>

            <div className="rounded-3xl border bg-stone-50 p-6 sm:p-8">
              <div className="space-y-5">
                {[
                  "Request a home energy inspection",
                  "Review drafts, insulation, and comfort issues",
                  "Receive practical recommendations",
                  "Schedule installation if the project is a fit",
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
              Request an Inspection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
