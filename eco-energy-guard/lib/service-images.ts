/**
 * Maps service slugs to the customer-provided photos in public/images/Services.
 * Services without a matching photo intentionally keep their existing placeholder.
 */
export const serviceImages: Record<string, string> = {
  "foam-air-sealing": "/images/Services/Rim Joist Foam Sealing.jpg",
  "blown-in-fiberglass-insulation": "/images/Services/Blown-in Insulation.webp",
  "batt-insulation": "/images/Services/Batt Insulation.webp",
  "garage-ceiling-insulation": "/images/Services/Cieling Insulation.JPEG",
  "solar-attic-fans": "/images/Services/Solar Attic Fans.webp",
  "crawl-space-insulation": "/images/Services/Crawl Space.webp",
  "attic-insulation": "/images/Services/Attic Insulation.webp",
  "basement-insulation": "/images/Services/Wall Insulation.JPEG",
  "duct-insulation": "/images/Services/Duct Insulation.webp",
  "pipe-insulation": "/images/Services/Pipe Insulation.png",
  "passive-attic-ventilation": "/images/Services/Passive Attic Ventilation.jpg",
  "radiant-barrier-foil": "/images/Services/Radiant Barrier Foil.JPEG",
  "double-bubble-foil": "/images/Services/Double Bubble Foil.JPEG",
  "basement-concrete-sealer": "/images/Services/Basement Concrete Sealer.jpeg",
  "rim-joist-foam-sealing": "/images/Services/Rim Joist Foam Sealing.jpg",
  "thermal-imaging": "/images/Services/Thermal Imaging.jpg",
};

export function getServiceImage(slug: string): string | undefined {
  return serviceImages[slug];
}
