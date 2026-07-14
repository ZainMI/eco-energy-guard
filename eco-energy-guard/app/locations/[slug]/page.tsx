import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { PHONE_DISPLAY, PHONE_HREF, services, towns, type Town } from "@/lib/site-content";

type Params = {
  slug: string;
};

function getTown(slug: string): Town | undefined {
  return towns.find((town) => town.slug === slug);
}

export function generateStaticParams() {
  return towns.map((town) => ({ slug: town.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const town = getTown(slug);
  if (!town) {
    return { title: "Location Not Found" };
  }

  return {
    title: `${town.name} Insulation Services`,
    description: town.description,
  };
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const town = getTown(slug);

  if (!town) {
    notFound();
  }

  return (
    <>
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Locations
          </Link>
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
            <MapPin className="h-4 w-4" />
            {town.name}
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Insulation services in {town.name}.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {town.description}
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.slug}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold">{service.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {service.shortDescription}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-primary py-16 text-primary-foreground sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Ready to upgrade your {town.name} home?
            </h2>
            <p className="mt-5 text-lg opacity-90">
              Book online or call us for a free inspection and simple next
              steps.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-primary shadow-sm transition hover:bg-stone-100"
              >
                Book Free Inspection
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
