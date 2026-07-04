"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserCog } from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";

type UserRole = "owner" | "admin" | "employee" | "estimator" | "technician";

type AppUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  created_at: string;
};

const roles: UserRole[] = [
  "owner",
  "admin",
  "employee",
  "estimator",
  "technician",
];

export default function AdminUsersPage() {
  const supabase = createClient();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadUsers() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setCurrentUserId(user.id);

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    setCurrentRole(profile?.role ?? null);

    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data as AppUser[]);
    }

    setLoading(false);
  }

  async function updateRole(userId: string, role: UserRole) {
    setMessage("");

    if (userId === currentUserId && role !== "owner") {
      setMessage("You cannot remove your own owner access.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", userId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Role updated.");
    await loadUsers();
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <Container>
          <p>Loading users...</p>
        </Container>
      </section>
    );
  }

  if (currentRole !== "owner") {
    return (
      <section className="py-16">
        <Container>
          <div className="rounded-[2rem] border bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold">Owner access required</h1>
            <p className="mt-3 text-muted-foreground">
              Only the owner can manage employee roles.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Admin Users
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Manage Team Access
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Employees appear here after signing in with Google. The owner can
              assign roles for admin, estimating, scheduling, and technician
              access.
            </p>
          </div>

          <div className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
            <ShieldCheck className="mr-2 inline h-4 w-4 text-primary" />
            Owner Only
          </div>
        </div>

        {message && (
          <div className="mt-8 rounded-2xl border bg-white p-4 text-sm shadow-sm">
            {message}
          </div>
        )}

        <div className="mt-10 grid gap-4">
          {users.map((user) => (
            <article
              key={user.id}
              className="rounded-3xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <UserCog className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      {user.full_name || "Unnamed User"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                      Current role:{" "}
                      <span className="font-bold text-foreground">
                        {user.role}
                      </span>
                    </p>
                  </div>
                </div>

                <select
                  value={user.role}
                  onChange={(event) =>
                    updateRole(user.id, event.target.value as UserRole)
                  }
                  className="h-11 rounded-xl border bg-background px-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
