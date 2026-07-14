import Link from "next/link";
import { Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold">Eco Energy Guard</h3>
            <p className="mt-4 max-w-sm leading-7 text-muted-foreground">
              Professional insulation and air sealing services throughout
              Central Connecticut. Free estimates — honest pricing — 18+ years
              in business since 2008.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href="tel:+18605550000"
                className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                (860) XXX-XXXX
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
              <Link href="/areas" className="hover:text-foreground transition">Areas Served</Link>
              <Link href="/contact" className="hover:text-foreground transition">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Services</h4>
            <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
              <Link href="/services#foam-air-sealing" className="hover:text-foreground transition">Foam Air Sealing</Link>
              <Link href="/services#blown-in-insulation" className="hover:text-foreground transition">Blown-in Insulation</Link>
              <Link href="/services#batt-insulation" className="hover:text-foreground transition">Batt Insulation</Link>
              <Link href="/services#dense-packed" className="hover:text-foreground transition">Dense Packed</Link>
              <Link href="/services#dense-packed-garage-ceilings" className="hover:text-foreground transition">Dense Packed Garage Ceilings</Link>
              <Link href="/book" className="font-semibold text-primary hover:text-primary/80 transition">Book Free Estimate →</Link>
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
