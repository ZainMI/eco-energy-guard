import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Home,
  ShieldCheck,
  Sparkles,
  Star,
  ThermometerSun,
} from "lucide-react";
import Container from "@/components/layout/Container";

const services = [
  "Home Energy Inspections",
  "Insulation Upgrades",
  "Foam Air Sealing",
  "Reflective Insulation",
];

const reviews = [
  {
    name: "John W.",
    quote:
      "Bill was extremely helpful and knowledgeable. He explained everything step by step and helped with the rebate process.",
  },
  {
    name: "David D.",
    quote:
      "The Eco Energy team is nothing short of best-in-class. Their professionalism and customer attentiveness was outstanding.",
  },
  {
    name: "Shannon W.",
    quote:
      "Bill and his crew were amazing. Extremely knowledgeable, efficient, and easy to work with.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50">
        <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <div className="inline-flex rounded-full border bg-white px-4 py-2 text-xs font-semibold text-muted-foreground shadow-sm sm:text-sm">
              Certified home energy experts
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Make your home warmer, healthier, and more energy efficient.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Eco Energy Guard helps homeowners identify energy loss, improve
              insulation, seal drafts, and plan practical upgrades that make the
              home feel better year-round.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Request an Inspection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/gallery"
                className="inline-flex h-12 items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted"
              >
                View Projects
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border bg-white p-6 shadow-2xl">
              <Image
                src="/Logo.png"
                alt="Eco Energy Guard logo"
                width={180}
                height={180}
                priority
                className="mx-auto rounded-full"
              />

              <div className="mt-8 grid gap-3">
                {services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center gap-3 rounded-2xl bg-secondary p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    <p className="font-semibold">{service}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              "30+ years building experience",
              "Approved rebate contractor",
              "Owens Corning certified",
              "5-star homeowner reviews",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border bg-white p-5 shadow-sm"
              >
                <Award className="h-6 w-6 text-primary" />
                <p className="mt-4 font-bold">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              What We Do
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Practical energy upgrades for real homes.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Home,
                title: "Inspect",
                text: "We start by understanding your home, comfort issues, drafts, and energy loss.",
              },
              {
                icon: ThermometerSun,
                title: "Improve",
                text: "We recommend insulation, air sealing, and efficiency upgrades that make sense.",
              },
              {
                icon: ShieldCheck,
                title: "Install",
                text: "If the project is a fit, our team completes the work with clean, professional installation.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border bg-stone-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-10">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Certified & Qualified
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                  Trained professionals. Clear recommendations.
                </h2>
                <p className="mt-5 leading-8 text-muted-foreground">
                  Eco Energy Guard combines building experience, home energy
                  knowledge, approved rebate program participation, and
                  certified insulation practices to help homeowners choose the
                  right improvements.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  "Approved contractor for Eversource and United Illuminating",
                  "Top of the House certified Owens Corning contractor",
                  "Home insulation, foam air sealing, inspections, attic ventilation, and more",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl bg-secondary p-4"
                  >
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Homeowner Reviews
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Trusted by local homeowners.
              </h2>
            </div>

            <Link
              href="/book"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Start Your Project
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="rounded-3xl border bg-stone-50 p-6"
              >
                <div className="flex gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mt-5 leading-7 text-muted-foreground">
                  “{review.quote}”
                </p>
                <p className="mt-5 font-bold">{review.name}</p>
                <p className="text-sm text-muted-foreground">Google Review</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary py-16 text-primary-foreground sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to make your home feel better?
            </h2>
            <p className="mt-5 text-lg opacity-90">
              Start with an inspection request. The team will review your home,
              explain the options, and recommend the right next step.
            </p>

            <Link
              href="/book"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-100"
            >
              Request an Inspection
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
