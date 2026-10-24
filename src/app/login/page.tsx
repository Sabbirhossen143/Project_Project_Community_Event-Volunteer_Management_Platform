
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  LockKeyhole,
} from "lucide-react";

function UnityVolBrand({ light = false }: { light?: boolean }) {
  const greenId = light ? "uvGreenLight" : "uvGreenDark";

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
          <linearGradient id={greenId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#28C76F" />
            <stop offset="100%" stopColor="#07865A" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="17" r="10" fill={`url(#${greenId})`} />

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

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
        transform="translate(1 1)"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.96 46.98 31.85 46.98 24.55Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
        transform="translate(1 1)"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.17 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
        transform="translate(1 0)"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<
  "google" | "github" | "credentials" | null
>(null);


const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    setLoadingProvider("credentials");

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    if (!result || result.error || !result.ok) {
      alert("Invalid email or password. Please try again.");
      return;
    }

    const session = await getSession();
    const role = (
      session?.user as { role?: string } | undefined
    )?.role;

    if (role === "Organizer") {
  sessionStorage.setItem("showWelcomeToast", "true");
  window.location.href = "/organizer/dashboard";
} else if (role === "Volunteer") {
  sessionStorage.setItem("showWelcomeToast", "true");
  window.location.href = "/volunteer/dashboard";
} else {
      alert("User role not found. Please contact support.");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoadingProvider(null);
  }
};

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setLoadingProvider(provider);
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error(`${provider} sign-in failed:`, error);
      setLoadingProvider(null);
    }
  };

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
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
            Discover meaningful events, share your skills, and connect with
            people who want to create positive change.
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

      {/* Login Form */}
      <section className="relative flex min-h-screen items-center justify-center bg-white px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-5 shadow-xl shadow-black/5 sm:p-9 lg:rounded-none lg:border-0 lg:p-0 lg:shadow-none">
          {/* Logo and Heading */}
          <div className="mb-7 text-center lg:mb-8 lg:text-left">
            <div className="mb-6 flex justify-center lg:hidden">
              <UnityVolBrand />
            </div>

            <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-black sm:text-4xl lg:text-3xl">
              Welcome back!
            </h2>

            <p className="text-sm leading-6 text-black/60 sm:text-base">
              Sign in to continue making a difference.
            </p>
          </div>

          

          {/* Email and Password Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-black"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-black/15 bg-white py-3.5 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-black"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-emerald-700 transition hover:text-emerald-900 hover:underline sm:text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-black/15 bg-white py-3.5 pl-11 pr-12 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md text-black/45 transition hover:text-emerald-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In */}
            
<button
  type="submit"
  disabled={loadingProvider !== null}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-700/15 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loadingProvider === "credentials" ? "Signing in..." : "Sign In"}
  <ArrowRight size={19} />
</button>

          </form>

          {/* Google and GitHub Sign In */}
<div className="mt-4 grid grid-cols-2 gap-3">
  <button
    type="button"
    onClick={() => handleSocialLogin("google")}
    disabled={loadingProvider !== null}
    className="flex min-w-0 items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-3 text-sm font-semibold text-black transition hover:bg-gray-50 disabled:opacity-60"
  >
    <GoogleIcon />
    <span className="truncate">
      {loadingProvider === "google" ? "Connecting..." : "Google"}
    </span>
  </button>

  <button
    type="button"
    onClick={() => handleSocialLogin("github")}
    disabled={loadingProvider !== null}
    className="flex min-w-0 items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-3 py-3 text-sm font-semibold text-black transition hover:bg-gray-50 disabled:opacity-60"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1.8 2.04 3.17 1.56.1-.72.4-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.16-3-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.05 1.15a10.6 10.6 0 0 1 5.56 0c2.1-1.45 3.05-1.15 3.05-1.15.61 1.55.23 2.69.11 2.98.72.78 1.16 1.78 1.16 3 0 4.3-2.61 5.25-5.1 5.53.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>

    <span className="truncate">
      {loadingProvider === "github" ? "Connecting..." : "GitHub"}
    </span>
  </button>
</div>

          {/* Register */}
          <div className="mt-7 rounded-2xl border border-black/5 bg-black/[0.025] p-4 text-center">
            <p className="text-sm text-black/65">
              Don&apos;t have an account?
            </p>

            <Link
              href="/register"
              className="mt-1 inline-flex items-center gap-1 font-bold text-emerald-700 transition hover:text-emerald-900 hover:underline"
            >
              Create your account
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Back Home */}
          
{/* Back Home */}
<div className="mt-6 flex justify-center">
  <Link
    href="/"
    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md hover:shadow-emerald-600/10 active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/20"
  >
    ← Back to Home
  </Link>
</div>

        </div>
      </section>
    </main>
  );
}
