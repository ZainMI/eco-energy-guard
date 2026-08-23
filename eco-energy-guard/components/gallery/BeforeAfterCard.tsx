"use client";

import Image from "next/image";
import { CheckCircle2, MapPin, Maximize2, Tag } from "lucide-react";
import type { GalleryProject } from "@/lib/gallery";
import BeforeAfterSlider from "@/components/gallery/BeforeAfterSlider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BeforeAfterCard({
  project,
}: {
  project: GalleryProject;
}) {
  const location = [project.city, project.state].filter(Boolean).join(", ");

  return (
    <article className="overflow-hidden rounded-[2rem] border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Dialog>
        <DialogTrigger className="group/gallery relative grid w-full grid-cols-2 gap-1 overflow-hidden bg-stone-200 text-left">
          {[
            { src: project.before, label: "Before" },
            { src: project.after, label: "After" },
          ].map((image) => (
            <div
              key={image.label}
              className="relative aspect-[3/4] overflow-hidden bg-stone-100 sm:aspect-[4/3]"
            >
              <Image
                src={image.src}
                alt={`${project.title} ${image.label.toLowerCase()}`}
                fill
                className="object-cover transition duration-500 group-hover/gallery:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <span className="absolute left-3 top-3 rounded-full bg-zinc-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                {image.label}
              </span>
            </div>
          ))}
          <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow-lg transition group-hover/gallery:scale-105 sm:text-sm">
            <Maximize2 className="h-4 w-4" />
            Open comparison slider
          </span>
        </DialogTrigger>

        <DialogContent className="w-[calc(100vw-1rem)] max-w-6xl gap-3 bg-white p-3 sm:w-[calc(100vw-2rem)] sm:p-5">
          <DialogTitle className="pr-10 text-lg font-bold sm:text-2xl">
            {project.title}
          </DialogTitle>
          <DialogDescription>
            Drag the handle or use the left and right arrow keys to compare.
          </DialogDescription>
          <BeforeAfterSlider
            before={project.before}
            after={project.after}
            title={project.title}
            imageFit={project.imageFit ?? "contain"}
            expanded
          />
        </DialogContent>
      </Dialog>

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
