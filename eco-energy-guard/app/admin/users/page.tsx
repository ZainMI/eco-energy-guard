"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserCog, UserCheck, UserX, Shield } from "lucide-react";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";

type UserRole = "owner" | "employee";
type AccessStatus = "pending" | "approved" | "revoked";

type AppUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  access_status: AccessStatus;
  created_at: string;
};

const roles: UserRole[] = ["owner", "employee"];

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
      .select("id, full_name, email, role, access_status, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data as AppUser[]);
    }

    setLoading(false);
  }

  async function updateUser(
    userId: string,
    updates: { role?: UserRole; access_status?: AccessStatus },
  ) {
    setMessage("");

    if (userId === currentUserId && updates.access_status === "revoked") {
      setMessage("You cannot revoke your own access.");
      return;
    }

    if (userId === currentUserId && updates.role !== "owner") {
      setMessage("You cannot demote yourself from owner.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("User updated successfully.");
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

  const pendingUsers = users.filter((u) => u.access_status === "pending");
  const approvedUsers = users.filter((u) => u.access_status === "approved");

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-emerald-50 py-10 sm:py-16">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Admin Users
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Manage Employee Access
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

        <div className="mt-10 space-y-10">
          <div className="rounded-[2rem] border bg-white p-4 shadow-sm sm:p-6">
            <h2 className="border-b pb-4 text-2xl font-bold">
              Employee Requests
            </h2>
            {pendingUsers.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No pending employee requests.
              </p>
            ) : (
              <div className="mt-6 grid gap-4">
                {pendingUsers.map((user) => (
                  <article
                    key={user.id}
                    className="rounded-3xl border bg-stone-50 p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                          <UserCog className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {user.full_name || "Unnamed User"}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() =>
                            updateUser(user.id, {
                              access_status: "approved",
                              role: "employee",
                            })
                          }
                          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateUser(user.id, { access_status: "revoked" })
                          }
                          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-red-50 px-6 text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Deny
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border bg-white p-4 shadow-sm sm:p-6">
            <h2 className="border-b pb-4 text-2xl font-bold">
              Approved Employees
            </h2>
            {approvedUsers.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No approved employees.
              </p>
            ) : (
              <div className="mt-6 grid gap-4">
                {approvedUsers.map((user) => (
                  <article
                    key={user.id}
                    className="rounded-3xl border bg-stone-50 p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                          <UserCog className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            {user.full_name || "Unnamed User"}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-primary">
                            {user.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        {user.role !== "owner" && (
                          <button
                            type="button"
                            onClick={() =>
                              updateUser(user.id, { role: "owner" })
                            }
                            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border bg-white px-6 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-muted hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Make Owner
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            updateUser(user.id, { access_status: "revoked" })
                          }
                          disabled={user.id === currentUserId}
                          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-red-50 px-6 text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Revoke
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
