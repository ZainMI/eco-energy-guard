import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  HeartHandshake,
  Home,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import Container from "@/components/layout/Container";
import ImagePlaceholder from "@/components/ui/image-placeholder";

const values = [
  {
    icon: Home,
    title: "Homeowners First",
    description:
      "Every recommendation starts with understanding your home, not selling unnecessary work.",
  },
  {
    icon: ShieldCheck,
    title: "Honest Recommendations",
    description:
      "We inspect first, explain what we find, and recommend only the improvements that make sense for your situation.",
  },
  {
    icon: Leaf,
    title: "Energy Efficiency",
    description:
      "Better insulation and air sealing help create a more comfortable home while reducing wasted energy and lowering bills.",
  },
  {
    icon: HeartHandshake,
    title: "Local CT Business",
    description:
      "Proudly serving homeowners throughout Central Connecticut since 2008. We're your neighbors.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                About Eco Energy Guard
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Central Connecticut's trusted insulation experts since 2008.
              </h1>

              <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                With 18+ years of experience helping Connecticut homeowners
                improve comfort and reduce energy costs, Eco Energy Guard
                combines honest advice, certified expertise, and professional
                installation on every project.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Est. 2008 · 18+ Years",
                  "Energize CT Partner",
                  "Owens Corning Certified",
                  "100+ 5-Star Reviews",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex rounded-full border bg-white px-4 py-1.5 text-sm font-semibold shadow-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Team / owner photo placeholder */}
            <ImagePlaceholder
              label="Team or owner photo — add image here"
              className="aspect-[4/3] w-full rounded-[2rem] shadow-xl"
            />
          </div>
        </Container>
      </section>

      {/* ─── VALUES ─── */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Our Values
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              What makes us different.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-[2rem] border bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h2 className="mt-6 text-2xl font-bold">{value.title}</h2>

                  <p className="mt-4 leading-7 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── CERTIFICATIONS ─── */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Certifications & Approvals
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Industry-certified and rebate-approved.
            </h2>
          </div>

          {/* Certification image placeholders */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              "Owens Corning Certification",
              "Energize CT Partner Badge",
              "Eversource / UI Approved",
              "License / Insurance Certificate",
            ].map((cert) => (
              <div
                key={cert}
                className="flex flex-col items-center gap-3 rounded-2xl border bg-stone-50 p-5 text-center shadow-sm"
              >
                <ImagePlaceholder
                  label={cert}
                  className="aspect-square w-full max-w-[100px]"
                />
                <p className="text-xs font-semibold text-muted-foreground">
                  {cert}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border bg-stone-50 p-6 sm:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Approved contractor for Eversource and United Illuminating rebate programs",
                "Top of the House certified Owens Corning insulation contractor",
                "Partners of the Energize CT Rebate Program — helping customers save up to 20% on energy bills",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Our Process
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Every project starts with understanding your home.
              </h2>

              <p className="mt-6 leading-8 text-muted-foreground">
                We believe homeowners deserve clear answers — not confusing
                technical jargon or pressure to purchase services they don't
                need. Every project begins with a professional free inspection
                and straightforward recommendations.
              </p>
            </div>

            <div className="rounded-[2rem] border bg-stone-50 p-8">
              <div className="space-y-6">
                {[
                  "Inspect the home — free, no obligation",
                  "Identify energy loss and insulation gaps",
                  "Explain findings in plain language",
                  "Recommend only the improvements that make sense",
                  "Schedule installation and help claim CT rebates",
                ].map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-semibold">{item}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Clear communication every step of the way.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="rounded-[2rem] bg-primary px-8 py-14 text-center text-primary-foreground">
            <Award className="mx-auto h-12 w-12" />

            <h2 className="mt-6 text-3xl font-bold sm:text-5xl">
              Your comfort comes first.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">
              Whether you're experiencing drafts, inconsistent temperatures,
              rising energy costs, or simply want to make your home more
              efficient — we're here to help. Free estimates, honest advice,
              18+ years of experience.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-primary transition hover:bg-stone-100"
              >
                Book a Free Inspection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/gallery"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}