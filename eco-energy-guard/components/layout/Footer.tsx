import Link from "next/link";
import { Phone } from "lucide-react";
import {
  FREE_INSPECTION_CTA,
  PHONE_DISPLAY,
  PHONE_HREF,
  services,
} from "@/lib/site-content";

export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold">Eco Energy Guard</h3>
            <p className="mt-4 max-w-sm leading-7 text-muted-foreground">
              Professional insulation and air sealing services throughout
              Central Connecticut. Free inspections — honest pricing — 18+ years
              in business since 2008.
            </p>
            <p className="mt-3 max-w-sm text-sm font-semibold text-foreground">
              {FREE_INSPECTION_CTA}
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
              <p>info@ecoenergyguard.com</p>
              <p>Serving Central Connecticut</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition">Home</Link>
              <Link href="/about" className="hover:text-foreground transition">About</Link>
              <Link href="/services" className="hover:text-foreground transition">Services</Link>
              <Link href="/gallery" className="hover:text-foreground transition">Gallery</Link>
              <Link href="/locations" className="hover:text-foreground transition">Locations</Link>
              <Link href="/contact" className="hover:text-foreground transition">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Services</h4>
            <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
              {services.slice(0, 6).map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="hover:text-foreground transition"
                >
                  {service.title}
                </Link>
              ))}
              <Link href="/services" className="hover:text-foreground transition">All Services</Link>
              <Link href="/book" className="font-semibold text-primary hover:text-primary/80 transition">Book Free Inspection →</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Eco Energy Guard. All rights reserved. ·
          Est. 2008 · Central Connecticut
        </div>
      </div>
    </footer>
  );
}
