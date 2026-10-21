
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  LockKeyhole,
  UserRound,
  HeartHandshake,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

function UnityVolBrand({ light = false }: { light?: boolean }) {
  const greenId = light
    ? "uvGreenRegisterLight"
    : "uvGreenRegisterDark";

  return (
    <Link
      href="/"
      aria-label="UnityVol Home"
      className="inline-flex items-center gap-2.5"
    >
      <svg
        viewBox="0 0 100 100"
        className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="UnityVol logo"
      >
        <defs>
          <linearGradient
            id={greenId}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#28C76F" />
            <stop offset="100%" stopColor="#07865A" />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="17"
          r="10"
          fill={`url(#${greenId})`}
        />

        <path
          d="M44 43 C28 41 18 30 22 20 C34 22 44 30 47 40Z"
          fill={`url(#${greenId})`}
        />

        <path
          d="M56 43 C72 41 82 30 78 20 C66 22 56 30 53 40Z"
          fill={`url(#${greenId})`}
        />

        <path
          d="M42 37 C42 31 46 29 50 29 C54 29 58 31 58 37 L58 57 L50 69 L42 57Z"
          fill={`url(#${greenId})`}
        />

        <path
          d="M45 72 C27 68 10 53 12 35 C29 39 43 52 48 66Z"
          fill={`url(#${greenId})`}
        />

        <path
          d="M55 72 C73 68 90 53 88 35 C71 39 57 52 52 66Z"
          fill={`url(#${greenId})`}
        />

        <path
          d="M50 76 L50 47 M50 65 C40 55 32 50 25 47 M50 65 C60 55 68 50 75 47"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
            light ? "text-white" : "text-black"
          }`}
        >
          Unity<span className="text-emerald-600">Vol</span>
        </span>

        <span
          className={`mt-1.5 whitespace-nowrap text-[8px] font-bold tracking-[0.12em] sm:text-[9px] ${
            light ? "text-white/80" : "text-black/60"
          }`}
        >
          PEOPLE · EVENTS · IMPACT
        </span>
      </span>
    </Link>
  );
}

type UserRole = "Volunteer" | "Organizer";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Volunteer" as UserRole,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Connect your registration API here.
    alert(
      `Registration UI ready!\nName: ${formData.name}\nRole: ${formData.role}\nBackend is not connected yet.`
    );
  };

  return (
    <main className="min-h-screen bg-white text-black lg:grid lg:grid-cols-2">
      {/* Left Branding Panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-emerald-700 p-12 text-white lg:flex">
        <div className="relative z-10">
          <UnityVolBrand light />
        </div>

        <div className="relative z-10 max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
            PEOPLE · EVENTS · IMPACT
          </p>

          <h1 className="mb-6 text-5xl font-bold leading-tight">
            Together, we make a difference.
          </h1>

          <p className="text-lg leading-8 text-white/90">
            Discover meaningful events, share your skills, and
            connect with people who want to create positive change.
          </p>

          <p className="mt-6 text-sm italic text-white/80">
            Together We Make a Difference
          </p>
        </div>

        <p className="relative z-10 text-sm text-white/70">
  © 2026 UnityVol. All rights reserved.
</p>

        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[40px] border-white/10" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-black/10" />

        <div className="pointer-events-none absolute bottom-1/3 right-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      </section>

      {/* Registration Form */}
      <section className="relative flex min-h-screen items-center justify-center bg-white px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-5 shadow-xl shadow-black/5 sm:p-8 lg:rounded-none lg:border-0 lg:p-0 lg:shadow-none">
          {/* Same Logo on Mobile */}
          <div className="mb-5 flex justify-center lg:hidden">
            <UnityVolBrand />
          </div>

          {/* Heading */}
          <div className="mb-5 text-center lg:text-left">
            <span className="mb-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              JOIN OUR COMMUNITY
            </span>

            <h2 className="mb-2 mt-2 text-3xl font-extrabold tracking-tight text-black">
              Create your account
            </h2>

            <p className="text-sm leading-6 text-black/60">
              Join UnityVol and start making a difference.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-black"
              >
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-black/15 bg-white py-3 pl-10 pr-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-black"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-black/15 bg-white py-3 pl-10 pr-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />
              </div>
            </div>

            {/* Compact Role Selection */}
            <fieldset>
              <legend className="mb-1.5 text-sm font-semibold text-black">
                I want to join as
              </legend>

              <div className="grid grid-cols-2 gap-2">
                {/* Volunteer */}
                <button
                  type="button"
                  aria-pressed={formData.role === "Volunteer"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "Volunteer",
                    }))
                  }
                  className={`relative rounded-lg border-2 px-2.5 py-2 text-left transition ${
                    formData.role === "Volunteer"
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-black/10 bg-white hover:border-emerald-300"
                  }`}
                >
                  {formData.role === "Volunteer" && (
                    <CheckCircle2
                      size={15}
                      className="absolute right-2 top-2 text-emerald-700"
                    />
                  )}

                  <span
                    className={`mb-1 flex h-7 w-7 items-center justify-center rounded-md ${
                      formData.role === "Volunteer"
                        ? "bg-emerald-700 text-white"
                        : "bg-black/5 text-black"
                    }`}
                  >
                    <HeartHandshake size={15} />
                  </span>

                  <span className="block text-xs font-bold text-black sm:text-sm">
                    Volunteer
                  </span>

                  <span className="mt-0.5 block text-[10px] leading-4 text-black/60">
                    Help people & join activities
                  </span>
                </button>

                {/* Organizer */}
                <button
                  type="button"
                  aria-pressed={formData.role === "Organizer"}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "Organizer",
                    }))
                  }
                  className={`relative rounded-lg border-2 px-2.5 py-2 text-left transition ${
                    formData.role === "Organizer"
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-black/10 bg-white hover:border-emerald-300"
                  }`}
                >
                  {formData.role === "Organizer" && (
                    <CheckCircle2
                      size={15}
                      className="absolute right-2 top-2 text-emerald-700"
                    />
                  )}

                  <span
                    className={`mb-1 flex h-7 w-7 items-center justify-center rounded-md ${
                      formData.role === "Organizer"
                        ? "bg-emerald-700 text-white"
                        : "bg-black/5 text-black"
                    }`}
                  >
                    <CalendarDays size={15} />
                  </span>

                  <span className="block text-xs font-bold text-black sm:text-sm">
                    Organizer
                  </span>

                  <span className="mt-0.5 block text-[10px] leading-4 text-black/60">
                    Create & manage events
                  </span>
                </button>
              </div>
            </fieldset>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-black"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-black/15 bg-white py-3 pl-10 pr-11 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/45 hover:text-emerald-700"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-semibold text-black"
              >
                Confirm Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-black/15 bg-white py-3 pl-10 pr-11 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/45 hover:text-emerald-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-700/15 transition hover:bg-emerald-700 active:scale-[0.99]"
            >
              Create Account
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-xs leading-5 text-black/50">
              By creating an account, you agree to use UnityVol responsibly.
            </p>
          </form>

          {/* Login Link */}
          <div className="mt-5 rounded-xl border border-black/5 bg-black/[0.025] p-3 text-center">
            <p className="text-sm text-black/65">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 transition hover:text-emerald-900 hover:underline"
            >
              Sign in
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Back Home */}
          <p className="mt-4 text-center text-sm">
            <Link
              href="/"
              className="font-medium text-black/55 transition hover:text-emerald-700"
            >
              ← Back to Home
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
