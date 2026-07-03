import Link from "next/link";
import {
  ArrowRight,
  Home,
  Leaf,
  ShieldCheck,
  ThermometerSun,
} from "lucide-react";
import Container from "@/components/layout/Container";

const services = [
  {
    icon: Home,
    title: "Home Energy Inspections",
    description:
      "Start with a professional walkthrough to identify comfort issues, drafts, insulation gaps, and energy-saving opportunities.",
  },
  {
    icon: ThermometerSun,
    title: "Insulation Upgrades",
    description:
      "Improve year-round comfort with insulation solutions designed to reduce heat loss and energy waste.",
  },
  {
    icon: ShieldCheck,
    title: "Air Sealing",
    description:
      "Seal leaks and drafts around attics, basements, crawlspaces, and common problem areas.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50">
        <Container className="grid items-center gap-12 py-14 sm:py-20 lg:min-h-[720px] lg:grid-cols-2">
          <div>
            <div className="inline-flex rounded-full border bg-white px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm sm:text-sm">
              Locally trusted home energy solutions
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Make your home more comfortable and energy efficient.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Eco Energy Guard helps homeowners find drafts, improve insulation,
              reduce energy waste, and plan upgrades that make the home feel
              better year-round.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Request an Inspection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted"
              >
                Explore Services
              </Link>
            </div>
          </div>

          <div className="relative hidden sm:block">
            <div className="rounded-[2rem] border bg-white p-4 shadow-2xl transition duration-500 hover:-translate-y-1">
              <div className="aspect-[4/3] rounded-[1.5rem] bg-gradient-to-br from-emerald-200 via-amber-100 to-stone-100 p-8">
                <div className="flex h-full flex-col justify-between rounded-3xl bg-white/70 p-8 backdrop-blur">
                  <Leaf className="h-12 w-12 text-primary" />

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                      First step
                    </p>
                    <h2 className="mt-2 text-3xl font-bold">
                      Book a home energy inspection
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                      We’ll review the home, identify opportunities, and help
                      plan the right improvements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-2xl border bg-white p-5 shadow-xl">
              <p className="text-3xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground">
                Years serving homeowners
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <div className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                Lower
              </p>
              <p className="mt-2 text-muted-foreground">
                energy waste through smarter home improvements.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                Warmer
              </p>
              <p className="mt-2 text-muted-foreground">
                rooms, fewer drafts, and better year-round comfort.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                Clearer
              </p>
              <p className="mt-2 text-muted-foreground">
                next steps after a professional inspection.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              What We Do
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Practical upgrades for a better home.
            </h2>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              From the first inspection to the final installation, the goal is
              simple: make the home more efficient, comfortable, and protected.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-3xl border bg-stone-50 p-6 transition hover:-translate-y-1 hover:shadow-lg sm:p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 leading-7 text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center sm:mt-12">
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted"
            >
              View All Services
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Why Homeowners Choose Us
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Friendly guidance before any big decision.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Energy upgrades can feel confusing. Eco Energy Guard keeps the
                process simple with clear inspections, honest recommendations,
                and practical solutions based on the home’s actual needs.
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  "Inspection-first approach",
                  "Clear recommendations before installation",
                  "Comfort, efficiency, and safety focused",
                  "Warm, local, homeowner-friendly service",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    <p className="font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border bg-white p-6 shadow-xl sm:p-8">
              <h3 className="text-2xl font-bold">The process</h3>

              <div className="mt-8 space-y-6">
                {[
                  ["01", "Request an inspection"],
                  ["02", "Review the home"],
                  ["03", "Receive recommendations"],
                  ["04", "Schedule installation if needed"],
                ].map(([number, title]) => (
                  <div key={number} className="flex gap-4 sm:gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground sm:h-12 sm:w-12">
                      {number}
                    </div>
                    <div>
                      <h4 className="font-semibold">{title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        A simple step-by-step experience for homeowners.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-primary py-16 text-primary-foreground sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to make your home feel better?
            </h2>
            <p className="mt-5 text-base opacity-90 sm:text-lg">
              Start with an inspection request. The team will review your info
              and follow up with availability and next steps.
            </p>

            <Link
              href="/book"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-100 hover:shadow-md sm:mt-10"
            >
              Request an Inspection
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
