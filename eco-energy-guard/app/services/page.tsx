import Link from "next/link";
import {
  ArrowRight,
  Home,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sun,
  ThermometerSun,
  Waves,
  Wind,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Container from "@/components/layout/Container";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import { PHONE_DISPLAY, PHONE_HREF, services } from "@/lib/site-content";

const iconMap: Record<string, LucideIcon> = {
  "foam-air-sealing": ShieldCheck,
  "blown-in-fiberglass-insulation": Sparkles,
  "batt-insulation": Home,
  "garage-ceiling-insulation": ThermometerSun,
  "insulation-removal": Wrench,
  "solar-attic-fans": Sun,
  "crawl-space-insulation": Home,
  "attic-insulation": Home,
  "basement-insulation": Home,
  "duct-insulation": Wind,
  "pipe-insulation": Waves,
  "passive-attic-ventilation": Wind,
  "radiant-barrier-foil": Sun,
  "double-bubble-foil": Sparkles,
  "basement-concrete-sealer": ShieldCheck,
  "rim-joist-foam-sealing": ShieldCheck,
  "thermal-imaging": ScanLine,
};

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
              Insulation services in Central Connecticut.
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Keep your home more comfortable and energy-efficient with full
              insulation and home-performance services.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Get a Free Inspection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex h-12 items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted"
              >
                {PHONE_DISPLAY} — Call Now
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.slug];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.slug}
                  className="overflow-hidden rounded-[2rem] border bg-white shadow-sm transition hover:shadow-md"
                >
                  <div
                    className={`grid gap-0 lg:grid-cols-2 ${isEven ? "" : "lg:grid-flow-dense"}`}
                  >
                    <div className={`${isEven ? "" : "lg:col-start-2"}`}>
                      <ImagePlaceholder
                        label={`${service.title} — add photo here`}
                        className="aspect-video h-full min-h-[220px] w-full rounded-none lg:rounded-none"
                      />
                    </div>

                    <div className="p-7 sm:p-10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                        {service.title}
                      </h2>
                      <p className="mt-4 leading-7 text-muted-foreground">
                        {service.shortDescription}
                      </p>
                      <ul className="mt-5 space-y-2">
                        {service.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex items-start gap-2 text-sm font-medium"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/services/${service.slug}`}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        View Service Details
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
    </>
  );
}
