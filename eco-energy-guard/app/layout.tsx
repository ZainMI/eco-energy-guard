import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_TITLE_PHRASE } from "@/lib/site-content";
import { PRODUCTION_SITE_URL } from "@/lib/site-url";

import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_SITE_URL),
  title: {
    default: `Eco Energy Guard | ${SITE_TITLE_PHRASE}`,
    template: `%s | ${SITE_TITLE_PHRASE}`,
  },
  description:
    "Eco Energy Guard provides professional insulation, air sealing, thermal imaging, and free home energy inspections across Central Connecticut.",
  applicationName: "Eco Energy Guard",
  keywords: [
    "Connecticut insulation",
    "home energy inspection",
    "attic insulation",
    "air sealing",
    "Central Connecticut",
  ],
  authors: [{ name: "Eco Energy Guard", url: PRODUCTION_SITE_URL }],
  creator: "Eco Energy Guard",
  publisher: "Eco Energy Guard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PRODUCTION_SITE_URL,
    siteName: "Eco Energy Guard",
    title: `Eco Energy Guard | ${SITE_TITLE_PHRASE}`,
    description:
      "Professional insulation and home energy inspections across Central Connecticut.",
    images: [
      { url: "/images/Hero Image.webp", alt: "Eco Energy Guard services" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Eco Energy Guard | ${SITE_TITLE_PHRASE}`,
    description:
      "Professional insulation and home energy inspections across Central Connecticut.",
    images: ["/images/Hero Image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${PRODUCTION_SITE_URL}/#business`,
    name: "Eco Energy Guard",
    url: PRODUCTION_SITE_URL,
    logo: `${PRODUCTION_SITE_URL}/Logo.png`,
    image: `${PRODUCTION_SITE_URL}/images/Hero%20Image.webp`,
    telephone: "+1-860-690-5465",
    email: "info@ecoenergyguard.com",
    foundingDate: "2008",
    areaServed: { "@type": "State", name: "Connecticut" },
    description:
      "Professional insulation, air sealing, thermal imaging, and home energy inspections across Central Connecticut.",
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        <Navbar />

        <main>{children}</main>

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
