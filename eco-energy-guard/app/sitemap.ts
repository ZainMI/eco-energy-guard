import type { MetadataRoute } from "next";
import { services, towns } from "@/lib/site-content";
import { getServiceImage } from "@/lib/service-images";
import { PRODUCTION_SITE_URL } from "@/lib/site-url";

const lastModified = new Date("2026-09-07T00:00:00-04:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const mainPageDefinitions: Array<{
    path: string;
    priority: number;
    changeFrequency: NonNullable<
      MetadataRoute.Sitemap[number]["changeFrequency"]
    >;
  }> = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/locations", priority: 0.8, changeFrequency: "monthly" },
    { path: "/book", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "yearly" },
    { path: "/gallery", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  ];

  const mainPages: MetadataRoute.Sitemap = mainPageDefinitions.map(
    ({ path, ...entry }) => ({
      url: `${PRODUCTION_SITE_URL}${path}`,
      lastModified,
      ...entry,
    }),
  );

  const servicePages: MetadataRoute.Sitemap = services.map((service) => {
    const image = getServiceImage(service.slug);
    return {
      url: `${PRODUCTION_SITE_URL}/services/${service.slug}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
      ...(image
        ? { images: [new URL(image, PRODUCTION_SITE_URL).toString()] }
        : {}),
    };
  });

  const locationPages: MetadataRoute.Sitemap = towns.map((town) => ({
    url: `${PRODUCTION_SITE_URL}/locations/${town.slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...mainPages, ...servicePages, ...locationPages];
}
