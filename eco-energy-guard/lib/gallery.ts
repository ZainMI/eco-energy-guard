import fs from "fs";
import path from "path";

export interface GalleryProject {
  slug: string;
  title: string;
  city?: string;
  state?: string;
  description: string;
  services: string[];
  improvements: string[];
  featured?: boolean;
  imageFit?: "cover" | "contain";
  before: string;
  after: string;
}

function findImage(folderPath: string, slug: string, name: "before" | "after") {
  const extensions = ["png", "jpg", "jpeg", "webp"];

  const extension = extensions.find((ext) =>
    fs.existsSync(path.join(folderPath, `${name}.${ext}`)),
  );

  return extension ? `/images/${slug}/${name}.${extension}` : "";
}

export function getGalleryProjects(): GalleryProject[] {
  const galleryDir = path.join(process.cwd(), "public", "images");

  if (!fs.existsSync(galleryDir)) {
    return [];
  }

  return fs
    .readdirSync(galleryDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((folder) => {
      const slug = folder.name;
      const folderPath = path.join(galleryDir, slug);

      const projectJsonPath = path.join(folderPath, "project.json");
      const descriptionJsonPath = path.join(folderPath, "description.json");

      const metadataPath = fs.existsSync(projectJsonPath)
        ? projectJsonPath
        : descriptionJsonPath;

      const defaults: GalleryProject = {
        slug,
        title: slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        city: "",
        state: "",
        description: "Before and after home energy efficiency project.",
        services: [],
        improvements: [],
        featured: false,
        imageFit: "cover",
        before: findImage(folderPath, slug, "before"),
        after: findImage(folderPath, slug, "after"),
      };

      if (!fs.existsSync(metadataPath)) {
        return defaults;
      }

      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

        return {
          ...defaults,
          ...metadata,
          before: defaults.before,
          after: defaults.after,
        };
      } catch {
        return defaults;
      }
    })
    .filter((project) => project.before && project.after)
    .sort((a, b) => Number(b.featured) - Number(a.featured));
}
