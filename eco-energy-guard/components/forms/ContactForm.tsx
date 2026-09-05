"use client";

import { useActionState } from "react";
import {
  sendContactMessageAction,
  type ContactFormState,
} from "@/actions/contact";

const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContactMessageAction,
    initialContactFormState,
  );

  return (
    <form
      action={formAction}
      className="rounded-[2rem] border bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-2xl font-bold">Send a message</h2>
      <p className="mt-3 text-muted-foreground">
        Send us your question and one of our professionals will get back to you.
      </p>

      <div className="pointer-events-none absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-first-name" className="text-sm font-semibold">
            First name <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-first-name"
            name="firstName"
            required
            maxLength={80}
            autoComplete="given-name"
            className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="Jane"
          />
        </div>

        <div>
          <label htmlFor="contact-last-name" className="text-sm font-semibold">
            Last name <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-last-name"
            name="lastName"
            required
            maxLength={80}
            autoComplete="family-name"
            className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="Smith"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="text-sm font-semibold">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="text-sm font-semibold">
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            maxLength={40}
            autoComplete="tel"
            className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="1 (860)-690-5465"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="text-sm font-semibold">
            Message <span className="text-red-600">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            maxLength={5000}
            className="mt-2 min-h-40 w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="How can we help?"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>

      {state.message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-5 rounded-2xl p-4 text-sm font-medium ${
            state.status === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
