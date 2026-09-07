"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type ContactActionProps = {
  type: "email" | "phone";
  value: string;
  displayValue?: string;
  className?: string;
};

export default function ContactAction({
  type,
  value,
  displayValue = value,
  className = "",
}: ContactActionProps) {
  const [copied, setCopied] = useState(false);
  const href =
    type === "email"
      ? `mailto:${value}`
      : `tel:${value.replace(/[^\d+]/g, "")}`;
  const label = type === "email" ? "email address" : "phone number";

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
      <a
        href={href}
        className="min-w-0 break-all font-semibold text-foreground underline decoration-primary/30 underline-offset-4 transition hover:text-primary hover:decoration-primary"
      >
        {displayValue}
      </a>
      <button
        type="button"
        onClick={copyValue}
        className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-full border bg-white px-2.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
        aria-label={`Copy ${label}`}
        title={`Copy ${label}`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>Copied</span>
          </>
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </span>
  );
}
