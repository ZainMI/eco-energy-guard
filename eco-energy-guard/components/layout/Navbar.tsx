"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <Image
            src="/Logo.png"
            alt="Eco Energy Guard logo"
            width={56}
            height={56}
            priority
            className="h-11 w-11 shrink-0 rounded-full transition duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight sm:text-lg">
              Eco Energy Guard
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              Reflective Insulation Technology
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium transition hover:text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/book"
          className="hidden h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md lg:inline-flex"
        >
          Book Inspection
        </Link>

        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition hover:bg-muted">
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[82vw] max-w-sm border-l bg-background px-6 pt-10"
            >
              <div className="mb-10 flex items-center gap-3">
                <Image
                  src="/Logo.png"
                  alt="Eco Energy Guard logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                />

                <div>
                  <p className="font-bold">Eco Energy Guard</p>
                  <p className="text-xs text-muted-foreground">
                    Home Energy Solutions
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-4 text-xl font-semibold transition hover:bg-muted"
                    style={{
                      animationDelay: `${index * 60}ms`,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className="mt-6 inline-flex h-14 items-center justify-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  Book Inspection
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
