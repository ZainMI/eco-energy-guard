import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthSiteUrl } from "@/lib/site-url";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${getAuthSiteUrl(requestUrl.origin)}/admin`);
}
