import { CheckCircle2, MapPin, Tag } from "lucide-react";
import type { GalleryProject } from "@/lib/gallery";
import BeforeAfterSlider from "@/components/gallery/BeforeAfterSlider";

export default function BeforeAfterCard({
  project,
}: {
  project: GalleryProject;
}) {
  const location = [project.city, project.state].filter(Boolean).join(", ");

  return (
    <article className="overflow-hidden rounded-[2rem] border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <BeforeAfterSlider
        before={project.before}
        after={project.after}
        title={project.title}
        imageFit={project.imageFit ?? "cover"}
      />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {project.title}
            </h2>

            {location && (
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {location}
              </p>
            )}
          </div>

          {project.services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.services.map((service, index) => (
                <span
                  key={`${project.slug}-service-${index}`}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                >
                  <Tag className="h-3 w-3" />
                  {service}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="mt-5 leading-7 text-muted-foreground">
          {project.description}
        </p>

        {project.improvements.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {project.improvements.map((item, index) => (
              <div
                key={`${project.slug}-improvement-${index}`}
                className="flex gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
