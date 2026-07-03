import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Eco Energy Guard",
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
      </body>
    </html>
  );
}
