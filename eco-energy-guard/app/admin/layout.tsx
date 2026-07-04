import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return (
      <section className="min-h-screen bg-stone-50 px-6 py-16">
        <div className="mx-auto max-w-xl rounded-[2rem] border bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold">Access Pending</h1>
          <p className="mt-4 text-muted-foreground">
            Your Google account is signed in, but it has not been approved for
            admin access yet.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Ask an existing admin to add your user record in Supabase.
          </p>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
