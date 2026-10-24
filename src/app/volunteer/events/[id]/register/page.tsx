
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  HandHeart,
  CheckCircle2,
} from "lucide-react";


export default function EventRegistrationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const eventId = Number(params.id);
  const event = events.find((item) => item.id === eventId);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [motivation, setMotivation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="text-center rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">
            Event not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This event may not exist or may have been removed.
          </p>
          <Link
            href="/volunteer/events"
            className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white"
          >
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: params.id,
        fullName,
        email,
        phone,
        motivation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed.");
    }

    setSubmitted(true);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/volunteer/events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to Browse Events
        </Link>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div
              className="p-7 sm:p-9"
              style={{
                background: `linear-gradient(135deg, ${event.color}, white)`,
              }}
            >
              <div
                className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/80"
                style={{ color: event.textColor }}
              >
                <HandHeart size={28} />
              </div>

              <span
                className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold"
                style={{ color: event.textColor }}
              >
                {event.category}
              </span>

              <h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
                {event.title}
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {event.description}
              </p>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 text-emerald-700" size={19} />
                <div>
                  <p className="text-xs text-slate-400">Event Date</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {event.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 text-emerald-700" size={19} />
                <div>
                  <p className="text-xs text-slate-400">Event Time</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {event.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 text-emerald-700" size={19} />
                <div>
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-800">
                  Registration requires approval
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Your application should remain Pending until the event
                  organizer reviews it.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
            {submitted ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                  <CheckCircle2 size={34} />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
                  Form Submitted
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">
                  Your registration has been submitted successfully.
                  Your application is Pending until the organizer reviews it.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/volunteer/events")}
                  className="mt-6 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800"
                >
                  Back to Events
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                  Join the event
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  Registration Form
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Provide your details to apply as a volunteer for this event.
                </p>

                {error && (
                  <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {error}
                   </p>
                 )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="motivation"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Why do you want to volunteer?
                    </label>
                    <textarea
                      id="motivation"
                      required
                      rows={4}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Tell the organizer a little about your interest..."
                      className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <button
  type="submit"
  disabled={loading}
  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Submitting..." : "Submit Registration"}
  {!loading && <HandHeart size={17} />}
</button>

                  <p className="text-center text-xs leading-5 text-slate-400">
                    Your request will need organizer approval before your
                    participation is confirmed.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
