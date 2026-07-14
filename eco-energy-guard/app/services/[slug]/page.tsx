import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Home, Leaf, PiggyBank } from "lucide-react";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  services,
  type Service,
} from "@/lib/site-content";

type Params = {
  slug: string;
};

function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Services
          </Link>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {service.overview}
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <Home className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-xl font-bold">How it improves your home</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {service.homeBenefit}
              </p>
            </div>
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <PiggyBank className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-xl font-bold">How it saves energy</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {service.energySavings}
              </p>
            </div>
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <Leaf className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-xl font-bold">What is included</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {service.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-primary py-16 text-primary-foreground sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Call, email or book online for a free inspection.
            </h2>
            <p className="mt-5 text-lg opacity-90">
              Discuss {service.title.toLowerCase()} for your home and get clear,
              no-pressure recommendations.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-primary shadow-sm transition hover:bg-stone-100"
              >
                Book Free Inspection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-8 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
