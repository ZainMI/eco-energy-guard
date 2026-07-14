import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Home,
  Leaf,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  ThermometerSun,
  Zap,
} from "lucide-react";
import Container from "@/components/layout/Container";
import ImagePlaceholder from "@/components/ui/image-placeholder";
import {
  FREE_INSPECTION_CTA,
  PHONE_DISPLAY,
  PHONE_HREF,
  services as allServices,
  towns,
} from "@/lib/site-content";

const featuredServiceConfigs = [
  { slug: "foam-air-sealing", icon: ShieldCheck },
  { slug: "blown-in-fiberglass-insulation", icon: Sparkles },
  { slug: "attic-insulation", icon: Home },
  { slug: "basement-insulation", icon: Home },
  { slug: "crawl-space-insulation", icon: ThermometerSun },
  { slug: "garage-ceiling-insulation", icon: Zap },
];

const services = featuredServiceConfigs
  .map((config) => {
    const service = allServices.find((item) => item.slug === config.slug);
    if (!service) return null;
    return {
      id: service.slug,
      icon: config.icon,
      title: service.title,
      description: service.shortDescription,
    };
  })
  .filter((service): service is NonNullable<typeof service> => service !== null);

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
      {/* ─── HERO ─── */}
      <section className="overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50">
        <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
          {/* Left: text */}
          <div>
            <div className="inline-flex rounded-full border bg-white px-4 py-2 text-xs font-semibold text-muted-foreground shadow-sm sm:text-sm">
              ⭐ 100+ Five-Star Google Reviews · Est. 2008
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Local Business.
              <br />
              Honest Pricing.
              <br />
              <span className="text-primary">Better Comfort.</span>
            </h1>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">
              Leader in Attic, Basement, and Conditioned Space
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              ABCs
            </p>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Upgrading your house with our insulation services is an investment
              in year-round comfort and lower utility costs. As an Energize CT
              partner, we help homeowners save up to{" "}
              <strong className="text-foreground">20% on energy bills per year</strong>{" "}
              with improvements designed for long-term value.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
              >
                Book a Free Inspection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <a
                href={PHONE_HREF}
                className="inline-flex h-12 items-center justify-center rounded-full border bg-white px-7 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted"
              >
                <Phone className="mr-2 h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
            </div>
            <p className="mt-4 text-sm font-semibold text-foreground">
              {FREE_INSPECTION_CTA}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "🏆 Energize CT Partner",
                "📅 18+ Years in Business",
                "⚡ Fast & Affordable",
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex rounded-full border bg-white px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right: hero image */}
          <div className="relative">
            <ImagePlaceholder
              label="Hero image — e.g. insulation installation or crew at work"
              className="aspect-[4/3] w-full rounded-[2rem] shadow-2xl"
            />
            {/* Floating review badge */}
            <div className="absolute -bottom-5 -left-4 rounded-2xl border bg-white px-5 py-3 shadow-lg sm:-left-6">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold">100+ Reviews</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Google · 5-star rated
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="border-y bg-white py-5">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
            {[
              { icon: Star, label: "100+ Five-Star Google Reviews" },
              { icon: Calendar, label: "Established 2008 · 18+ Years" },
              { icon: Leaf, label: "Energize CT Rebate Partner" },
              { icon: Zap, label: "Fast · Affordable · Professional" },
              { icon: BadgeCheck, label: "Owens Corning Certified" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Insulation solutions for every home.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Available throughout Central Connecticut. Free inspections on all
              services.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="group rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <ImagePlaceholder
                    label={`${service.title} — add photo here`}
                    className="mb-4 aspect-video w-full"
                  />
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2"
                  >
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
            >
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ─── ENERGY SAVINGS / ENERGIZE CT ─── */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white sm:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
                  Energize CT Rebate Program Partner
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                  Save up to 20% on energy bills per year.
                </h2>
                <p className="mt-5 leading-8 text-emerald-100">
                  As an approved Energize CT rebate contractor, we help you
                  qualify for rebates on insulation and air sealing upgrades —
                  reducing your out-of-pocket cost and your monthly energy bills
                  at the same time.
                </p>
                <Link
                  href="/book"
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-100"
                >
                  Get a Free Inspection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "20%", label: "Average energy savings per year" },
                  { value: "100+", label: "Five-star Google reviews" },
                  { value: "18+", label: "Years in business since 2008" },
                  { value: "FREE", label: "Inspection, no obligation" },
                ].map(({ value, label }) => (
                  <div key={label} className="rounded-2xl bg-white/10 p-5">
                    <p className="text-3xl font-bold">{value}</p>
                    <p className="mt-1 text-sm text-emerald-200">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Simple Process
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Getting started is easy.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Call or Book Online",
                text: "Schedule your free inspection by phone or online. No obligation — just honest advice.",
              },
              {
                step: "2",
                title: "Free Home Inspection",
                text: "We visit your home, assess insulation, identify drafts, and explain exactly what we find.",
              },
              {
                step: "3",
                title: "Get It Done Right",
                text: "Our team completes the work professionally and helps you claim any available Energize CT rebates.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border bg-stone-50 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── CERTIFICATIONS ─── */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Certifications & Partnerships
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted, certified, and approved.
            </h2>
          </div>

          {/* Certification image placeholders */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              "Owens Corning Certification",
              "Energize CT Partner Badge",
              "Google 5-Star Badge",
              "RIMA International Badge",
            ].map((cert) => (
              <div
                key={cert}
                className="flex flex-col items-center gap-3 rounded-2xl border bg-stone-50 p-5 text-center shadow-sm"
              >
                <ImagePlaceholder
                  label={cert}
                  className="aspect-square w-full max-w-[100px]"
                />
                <p className="text-xs font-medium text-muted-foreground">
                  {cert}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border bg-stone-50 p-6 sm:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Approved contractor for Eversource and United Illuminating",
                "Top of the House certified Owens Corning contractor",
                "Partners of the Energize CT Rebate Program",
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

      {/* ─── REVIEWS ─── */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Google Reviews
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                100+ five-star reviews.
              </h2>
            </div>

            <Link
              href="/book"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Book Your Free Inspection
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
                  &ldquo;{review.quote}&rdquo;
                </p>
                <p className="mt-5 font-bold">{review.name}</p>
                <p className="text-sm text-muted-foreground">Google Review</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── AREAS SERVED ─── */}
      <section id="areas" className="bg-white py-16 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Service Area
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                Insulation available in Central Connecticut.
              </h2>
              <p className="mt-5 leading-8 text-muted-foreground">
                Eco Energy Guard serves homeowners throughout Central CT,
                helping families reduce energy costs and improve home comfort
                year-round.
              </p>
              <Link
                href="/locations"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2"
              >
                See all locations <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] border bg-stone-50 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Towns We Serve</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {towns.slice(0, 20).map((town) => (
                  <span
                    key={town.slug}
                    className="rounded-full border bg-white px-3 py-1 text-xs font-medium"
                  >
                    {town.name}
                  </span>
                ))}
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  + more
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-primary py-16 text-primary-foreground sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Call, email or book online for a free inspection.
            </h2>
            <p className="mt-5 text-lg opacity-90">
              No pressure. No obligation. Just honest answers about your home&apos;s
              insulation and energy efficiency.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-100"
              >
                Book Online — Free Inspection
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-8 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Phone className="mr-2 h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
