"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  services,
  SITE_TITLE_PHRASE,
} from "@/lib/site-content";

const serviceLinks = services.map((service) => ({
  href: `/services/${service.slug}`,
  label: service.title,
}));

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/areas", label: "Areas Served" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
        {/* Logo */}
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
              {SITE_TITLE_PHRASE}
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium transition hover:text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}

          {/* Services dropdown */}
          <div className="group relative">
            <button className="relative flex items-center gap-1 text-sm font-medium transition hover:text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all group-hover:after:w-full">
              Services
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
            </button>

            <div className="invisible absolute left-1/2 top-full mt-3 max-h-[22rem] w-72 -translate-x-1/2 overflow-y-auto rounded-2xl border bg-white p-2 shadow-xl opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              {/* Arrow */}
              <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t bg-white" />
              {serviceLinks.map((svc) => (
                <Link
                  key={svc.href}
                  href={svc.href}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium transition hover:bg-primary/10 hover:text-primary"
                >
                  {svc.label}
                </Link>
              ))}
              <div className="mt-1 border-t pt-1">
                <Link
                  href="/services"
                  className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
                >
                  View All Services →
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/book"
          className="hidden h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md lg:inline-flex"
        >
          Free Inspection
        </Link>

        {/* Mobile menu */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition hover:bg-muted">
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[82vw] max-w-sm border-l bg-background px-6 pt-10"
            >
              <div className="mb-8 flex items-center gap-3">
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
                    {SITE_TITLE_PHRASE}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3.5 text-lg font-semibold transition hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile services accordion */}
                <div>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-semibold transition hover:bg-muted"
                  >
                    Services
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {servicesOpen && (
                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l pl-4">
                      {serviceLinks.map((svc) => (
                        <Link
                          key={svc.href}
                          href={svc.href}
                          onClick={() => setOpen(false)}
                          className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          {svc.label}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
                      >
                        View All Services →
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex h-14 items-center justify-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                >
                  Book Free Inspection
                </Link>

                <a
                  href={PHONE_HREF}
                  className="inline-flex h-12 items-center justify-center rounded-full border px-5 text-sm font-semibold transition hover:bg-muted"
                >
                  {PHONE_DISPLAY} — Call Now
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
