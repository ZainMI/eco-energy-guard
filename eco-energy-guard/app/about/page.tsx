import Link from "next/link";
import {
  Award,
  CheckCircle2,
  HeartHandshake,
  Home,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import Container from "@/components/layout/Container";

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
      "We inspect first, explain what we find, and recommend only the improvements that make sense.",
  },
  {
    icon: Leaf,
    title: "Energy Efficiency",
    description:
      "Better insulation and air sealing help create a more comfortable home while reducing wasted energy.",
  },
  {
    icon: HeartHandshake,
    title: "Local Service",
    description:
      "We're proud to help homeowners throughout New York's Capital Region improve their homes.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              About Eco Energy Guard
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Helping homeowners build warmer, healthier, and more efficient
              homes.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              Eco Energy Guard works with homeowners to identify energy loss,
              improve comfort, and recommend practical insulation and air
              sealing solutions. Every project starts with understanding the
              home before recommending any installation.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
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

      <section className="bg-white py-16 sm:py-24">
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
                We believe homeowners deserve clear answers—not confusing
                technical jargon or pressure to purchase services they don't
                need. That's why every project begins with a professional
                inspection and straightforward recommendations.
              </p>
            </div>

            <div className="rounded-[2rem] border bg-stone-50 p-8">
              <div className="space-y-6">
                {[
                  "Inspect the home",
                  "Identify energy loss",
                  "Explain findings",
                  "Recommend improvements",
                  "Schedule installation if needed",
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
              efficient, we're here to help.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-primary transition hover:bg-stone-100"
              >
                Request Inspection
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
