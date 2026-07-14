import Link from "next/link";
import Container from "@/components/layout/Container";
import BeforeAfterCard from "@/components/gallery/BeforeAfterCard";
import { getGalleryProjects } from "@/lib/gallery";

export default function GalleryPage() {
  const projects = getGalleryProjects();

  return (
    <>
      <section className="bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Project Gallery
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Real before-and-after home energy upgrades.
            </h1>

            <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Browse examples of insulation, air sealing, and energy-efficiency
              work completed for homeowners throughout Central Connecticut.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          {projects.length === 0 ? (
            <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold">No gallery projects yet</h2>

              <p className="mt-3 text-muted-foreground">
                Add project folders inside <code>public/images</code> containing
                before/after images and a project.json file.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {projects.map((project) => (
                <BeforeAfterCard key={project.slug} project={project} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-primary py-16 text-primary-foreground sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-5xl">
              Ready to improve your home?
            </h2>

            <p className="mt-5 text-lg opacity-90">
              Start with a home energy inspection and we&apos;ll help determine the
              best upgrades for your home.
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
