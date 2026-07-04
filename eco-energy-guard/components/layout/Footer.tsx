import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold">Eco Energy Guard</h3>

            <p className="mt-4 text-muted-foreground leading-7">
              Helping homeowners improve comfort, reduce energy waste, and save
              money through professional energy assessments, insulation, and air
              sealing.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>

            <div className="mt-4 flex flex-col gap-3 text-muted-foreground">
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/book">Book Inspection</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Contact</h4>

            <div className="mt-4 space-y-3 text-muted-foreground">
              <p>(518) XXX-XXXX</p>
              <p>info@ecoenergyguard.com</p>
              <p>Serving New York's Capital Region</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Eco Energy Guard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
