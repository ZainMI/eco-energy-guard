"use client";

import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  async function signInWithGoogle() {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 px-6 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
        <div className="rounded-[2rem] border bg-white p-8 text-center shadow-xl">
          <Image
            src="/Logo.png"
            alt="Eco Energy Guard logo"
            width={96}
            height={96}
            className="mx-auto rounded-full"
            priority
          />

          <h1 className="mt-6 text-3xl font-bold">Admin Sign In</h1>

          <p className="mt-3 text-muted-foreground">
            Sign in with your approved Eco Energy Guard Google account.
          </p>

          <button
            onClick={signInWithGoogle}
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </section>
  );
}
