
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

const events = [
  {
    id: 1,
    title: "Tree Plantation Drive",
    category: "Environment",
    date: "Nov 15, 2026",
    time: "9:00 AM",
    location: "Dhaka University",
    description:
      "Help make our communities greener by planting trees and promoting environmental awareness.",
    color: "#dcfce7",
    textColor: "#15803d",
  },
  {
    id: 2,
    title: "Digital Literacy Workshop",
    category: "Education",
    date: "Nov 22, 2026",
    time: "10:00 AM",
    location: "Dhanmondi, Dhaka",
    description:
      "Help people develop essential digital skills and become more confident with technology.",
    color: "#dbeafe",
    textColor: "#1d4ed8",
  },
  {
    id: 3,
    title: "Community Health Camp",
    category: "Healthcare",
    date: "Nov 30, 2026",
    time: "8:30 AM",
    location: "Mirpur, Dhaka",
    description:
      "Support a community health initiative by helping organize activities and assist visitors.",
    color: "#f3e8ff",
    textColor: "#7e22ce",
  },
  {
    id: 4,
    title: "Community Food Distribution",
    category: "Community",
    date: "Dec 5, 2026",
    time: "8:00 AM",
    location: "Uttara, Dhaka",
    description:
      "Join volunteers in organizing and distributing food packages to local families.",
    color: "#ffedd5",
    textColor: "#c2410c",
  },
  {
    id: 5,
    title: "Winter Clothes Collection",
    category: "Community",
    date: "Dec 10, 2026",
    time: "10:00 AM",
    location: "Mohammadpur, Dhaka",
    description:
      "Collect, sort and prepare warm clothing for people who need support during winter.",
    color: "#fce7f3",
    textColor: "#be185d",
  },
  {
    id: 6,
    title: "Children's Learning Day",
    category: "Education",
    date: "Dec 15, 2026",
    time: "9:30 AM",
    location: "Uttara, Dhaka",
    description:
      "Spend a meaningful day helping children learn through educational games and activities.",
    color: "#fef3c7",
    textColor: "#a16207",
  },
];

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Demo only: connect this form to your backend/API
    // to save a real pending registration.
    setSubmitted(true);
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
                  This is a frontend demo. Your registration has not been
                  saved or sent to the organizer yet. Connect the backend
                  to complete the application process.
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
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    Submit Registration
                    <HandHeart size={17} />
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
