
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  HandHeart,
  CalendarDays,
  LoaderCircle,
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

type UserRole = "Volunteer" | "Organizer";

function dashboardFor(role?: string | null) {
  if (role === "Volunteer") return "/volunteer/dashboard";
  if (role === "Organizer") return "/organizer/dashboard";
  return null;
}

export default function SelectRolePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const email = session?.user?.email ?? "";
  const currentRole = (session?.user as { role?: string | null } | undefined)?.role;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated" && currentRole) {
      const destination = dashboardFor(currentRole);
      if (destination) router.replace(destination);
    }
  }, [status, currentRole, router]);

  async function saveRoleAndPassword() {
    if (!selectedRole) {
      toast.error("Please select your role.");
      return;
    }

    if (!email) {
      toast.error("Your logged-in email could not be found.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (saving) return;
    setSaving(true);

    try {
      const response = await fetch("/api/auth/select-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || "Could not save your information.");
        return;
      }

      await update();
      sessionStorage.setItem("showWelcomeToast", "true");

      const destination = dashboardFor(result.role);
      if (!destination) {
        toast.error("Invalid account role.");
        return;
      }

      window.location.assign(destination);
    } catch (error) {
      console.error("Profile setup error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <LoaderCircle className="animate-spin text-emerald-600" size={32} />
      </main>
    );
  }

  if (dashboardFor(currentRole)) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <LoaderCircle className="animate-spin text-emerald-600" size={32} />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
          <ShieldCheck size={28} />
        </div>

        <p className="text-center text-sm font-bold uppercase tracking-widest text-emerald-700">
          Welcome to UnityVol
        </p>

        <h1 className="mt-3 text-center text-3xl font-extrabold text-slate-900">
          Complete Your Profile
        </h1>

        <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-slate-500">
          Choose your role and create a password for email login.
        </p>

        <div className="mt-7">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Logged-in Gmail
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3">
            <Mail size={20} className="shrink-0 text-slate-500" />
            <input
              type="email"
              value={email}
              readOnly
              aria-readonly="true"
              className="w-full cursor-not-allowed bg-transparent text-slate-600 outline-none"
            />
            <span className="text-xs font-semibold text-emerald-700">
              Verified
            </span>
          </div>
        </div>

        <div className="mt-7">
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Select Your Role
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedRole("Volunteer")}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                selectedRole === "Volunteer"
                  ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-600/10"
                  : "border-slate-200 hover:border-emerald-300"
              }`}
            >
              <HandHeart className="mb-4 text-emerald-600" size={30} />
              <span className="block text-lg font-bold text-slate-900">
                Volunteer
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-500">
                Discover events, register to help, and make a positive impact.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("Organizer")}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                selectedRole === "Organizer"
                  ? "border-emerald-600 bg-emerald-50 ring-4 ring-emerald-600/10"
                  : "border-slate-200 hover:border-emerald-300"
              }`}
            >
              <CalendarDays className="mb-4 text-emerald-600" size={30} />
              <span className="block text-lg font-bold text-slate-900">
                Organizer
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-500">
                Create community events and coordinate volunteer registrations.
              </span>
            </button>
          </div>
        </div>

        <div className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Create Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-emerald-500">
              <LockKeyhole size={19} className="shrink-0 text-slate-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-slate-500"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Confirm Password
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-emerald-500">
              <LockKeyhole size={19} className="shrink-0 text-slate-500" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="text-slate-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={saveRoleAndPassword}
          disabled={!selectedRole || !password || !confirmPassword || saving}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && <LoaderCircle className="animate-spin" size={18} />}
          {saving ? "Saving..." : "Save & Continue"}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-slate-500">
          Your password will be securely hashed before it is stored.
        </p>
      </section>
    </main>
  );
}
