import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthSiteUrl } from "@/lib/site-url";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const loginUrl = new URL("/login", getAuthSiteUrl(requestUrl.origin));
      loginUrl.searchParams.set("error", "Authentication could not be completed.");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.redirect(`${getAuthSiteUrl(requestUrl.origin)}/admin`);
}
