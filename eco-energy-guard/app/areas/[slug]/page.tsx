import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { services, towns, type Town } from "@/lib/site-content";

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
    return { title: "Town Not Found" };
  }

  return {
    title: `${town.name} Insulation Services`,
    description: `Insulation and energy-saving services available in ${town.name}, Connecticut.`,
  };
}

export default async function TownDetailPage({
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
            href="/areas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Areas Served
          </Link>
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
            <MapPin className="h-4 w-4" />
            {town.name}
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Insulation services available in {town.name}.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            Eco Energy Guard provides attic, basement, crawl space, ventilation,
            and home-performance insulation services for homeowners in {town.name}
            and surrounding Central Connecticut communities.
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
    </>
  );
}
