import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_TITLE_PHRASE } from "@/lib/site-content";

import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: `Eco Energy Guard | ${SITE_TITLE_PHRASE}`,
    template: `%s | ${SITE_TITLE_PHRASE}`,
  },
  description: "Professional home energy solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main>{children}</main>

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
