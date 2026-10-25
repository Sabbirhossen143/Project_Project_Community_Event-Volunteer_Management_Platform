
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Heart,
  TreePine,
  BookOpen,
  HeartHandshake,
  Sparkles,
  Menu,
  X,
  Mail,
  Phone,
  Send,
} from "lucide-react";

type EventItem = {
  _id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  status?: string;
};

const eventStyles = [
  {
    icon: TreePine,
    color: "bg-emerald-100 text-emerald-700",
    accent: "from-emerald-100 to-lime-50",
  },
  {
    icon: BookOpen,
    color: "bg-sky-100 text-sky-700",
    accent: "from-sky-100 to-indigo-50",
  },
  {
    icon: HeartHandshake,
    color: "bg-rose-100 text-rose-700",
    accent: "from-rose-100 to-orange-50",
  },
];

const categories = [
  { name: "Environment", icon: TreePine, count: "Go green" },
  { name: "Education", icon: BookOpen, count: "Share knowledge" },
  { name: "Community", icon: HeartHandshake, count: "Make an impact" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
const [eventsLoading, setEventsLoading] = useState(true);
const [sending, setSending] = useState(false);
const [contactStatus, setContactStatus] = useState("");

useEffect(() => {
  let cancelled = false;

  async function fetchEvents() {
    try {
      const response = await fetch("/api/events", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();

      if (!cancelled && data.success && Array.isArray(data.events)) {
        const publishedEvents = data.events
          .filter(
            (event: EventItem) => event.status === "Published"
          )
          .sort(
            (a: EventItem, b: EventItem) =>
              new Date(a.date).getTime() -
              new Date(b.date).getTime()
          )
          .slice(0, 3);

        setEvents(publishedEvents);
      }
    } catch (error) {
      console.error("Error loading homepage events:", error);
    } finally {
      if (!cancelled) {
        setEventsLoading(false);
      }
    }
  }

  fetchEvents();

  return () => {
    cancelled = true;
  };
}, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfdfb] text-slate-800">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            aria-label="UnityVol Home"
            className="flex items-center gap-2.5"
          >
            {/* UnityVol Logo */}
            <svg
              viewBox="0 0 100 100"
              className="h-11 w-11 shrink-0 sm:h-12 sm:w-12"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="UnityVol logo"
            >
              <defs>
                <linearGradient
                  id="unityVolGreenHome"
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
                fill="url(#unityVolGreenHome)"
              />

              <path
                d="M44 43 C28 41 18 30 22 20 C34 22 44 30 47 40Z"
                fill="url(#unityVolGreenHome)"
              />

              <path
                d="M56 43 C72 41 82 30 78 20 C66 22 56 30 53 40Z"
                fill="url(#unityVolGreenHome)"
              />

              <path
                d="M42 37 C42 31 46 29 50 29 C54 29 58 31 58 37 L58 57 L50 69 L42 57Z"
                fill="url(#unityVolGreenHome)"
              />

              <path
                d="M45 72 C27 68 10 53 12 35 C29 39 43 52 48 66Z"
                fill="url(#unityVolGreenHome)"
              />

              <path
                d="M55 72 C73 68 90 53 88 35 C71 39 57 52 52 66Z"
                fill="url(#unityVolGreenHome)"
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
              <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Unity<span className="text-emerald-600">Vol</span>
              </span>

              <span className="mt-1.5 whitespace-nowrap text-[7px] font-bold tracking-[0.12em] text-slate-500 sm:text-[8px]">
                PEOPLE · EVENTS · IMPACT
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-emerald-700"
            >
              Home
            </Link>

            <Link
              href="/events"
              className="text-sm font-medium text-slate-600 hover:text-emerald-700"
            >
              Explore Events
            </Link>

            <Link
              href="/#about"
              className="text-sm font-medium text-slate-600 hover:text-emerald-700"
            >
              About Us
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
            >
              Join UnityVol
              <ArrowRight size={16} className="ml-1 inline" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            className="rounded-xl border border-slate-200 p-2 md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-5 py-5 md:hidden">
            <Link
              onClick={() => setMenuOpen(false)}
              href="/"
            >
              Home
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              href="/events"
            >
              Explore Events
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              href="/#about"
            >
              About Us
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              href="/login"
            >
              Log in
            </Link>

            <Link
              onClick={() => setMenuOpen(false)}
              href="/register"
              className="font-bold text-emerald-700"
            >
              Join UnityVol →
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-[72px] md:pt-[76px]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="hero-enter">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <Sparkles
                size={16}
                className="text-emerald-600"
                style={{
                  animation: "starPulse 1.5s ease-in-out infinite",
                }}
              />
              Small actions. Extraordinary impact.
            </div>

            <h1 className="hero-enter-delay max-w-2xl text-5xl leading-[1.12] font-black tracking-tight sm:text-6xl lg:text-7xl">
              Be the reason
              <span className="mt-2 block text-emerald-600">
                someone smiles.
              </span>
            </h1>

            <p className="hero-enter-delay mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Discover meaningful community events, meet inspiring people,
              and turn your time into something that truly matters. Your next
              good deed starts here.
            </p>

            <div className="hero-enter-delay-2 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/events"
                className="rounded-2xl bg-emerald-600 px-7 py-4 text-center font-bold text-white shadow-xl shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Find an Event
                <ArrowRight size={18} className="ml-2 inline" />
              </Link>

              <Link
                href="/register"
                className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center font-bold transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Become a Volunteer
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4 border-t border-slate-200 pt-7">
              <div className="flex -space-x-3">
                {[
                  "bg-emerald-200",
                  "bg-amber-200",
                  "bg-sky-200",
                  "bg-rose-200",
                ].map((color, i) => (
                  <span
                    key={color}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white ${color} text-xs font-black text-slate-700`}
                  >
                    {["A", "R", "S", "M"][i]}
                  </span>
                ))}
              </div>

              <div>
                <p className="font-bold">
                  Every helping hand matters
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  Be part of something bigger.
                </p>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="hero-float relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 blur-xl" />

            <div className="relative rounded-[2rem] border border-white bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-5 shadow-2xl shadow-emerald-900/10 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm">
                  YOUR COMMUNITY NEEDS YOU
                </span>

                <Heart className="text-rose-500" size={23} />
              </div>

              <div className="my-9 grid grid-cols-2 gap-4">
                <div className="flex min-h-48 flex-col justify-between rounded-3xl bg-emerald-600 p-5 text-white sm:min-h-56">
                  <TreePine size={36} />

                  <div>
                    <p className="text-3xl font-black">Grow</p>
                    <p className="mt-1 text-sm text-emerald-100">
                      A greener tomorrow
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex min-h-48 flex-col justify-between rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/5 sm:min-h-56">
                  <Users size={34} className="text-sky-600" />

                  <div>
                    <p className="text-2xl font-black">Connect</p>
                    <p className="mt-1 text-sm text-slate-500">
                      People who care
                    </p>
                  </div>
                </div>

                <div className="flex min-h-36 flex-col justify-between rounded-3xl bg-amber-100 p-5">
                  <HeartHandshake size={32} className="text-amber-800" />
                  <p className="font-bold text-amber-950">
                    Give with purpose.
                  </p>
                </div>

                <div className="mt-5 flex min-h-36 flex-col justify-between rounded-3xl bg-rose-100 p-5">
                  <Heart size={31} className="text-rose-600" />
                  <p className="font-bold text-rose-950">
                    Change a life.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white bg-white/90 p-4 shadow-sm">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <CalendarDays size={23} />
                </div>

                <div className="flex-1">
                  <p className="font-bold">
                    Your next chapter starts now
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Find a cause you believe in.
                  </p>
                </div>

                <ArrowRight size={20} className="text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      

<section className="scroll-reveal border-y border-emerald-200 bg-[#f4f7f3]">

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-7 px-5 py-9 md:grid-cols-4 lg:px-8">
          {[
            { value: "Every", label: "Action counts" },
            { value: "Local", label: "Communities first" },
            { value: "Open", label: "To everyone" },
            { value: "Together", label: "We make a difference" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xl font-black tracking-tight text-emerald-700 sm:text-2xl">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About UnityVol */}
      <section
        id="about"
        className="scroll-reveal mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase">
            Why UnityVol?
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Make your free time meaningful.
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Find the causes you care about and take a simple step toward
            a better community.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Heart,
              title: "Find your cause",
              text: "Discover opportunities that match your passions, interests, and skills.",
              color: "bg-rose-100 text-rose-600",
            },
            {
              icon: Users,
              title: "Meet your people",
              text: "Connect with volunteers and organizers who share your vision.",
              color: "bg-sky-100 text-sky-700",
            },
            {
              icon: Sparkles,
              title: "Make real impact",
              text: "Turn your intentions into practical actions that help people.",
              color: "bg-amber-100 text-amber-700",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="card-hover rounded-3xl border border-slate-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
            >
              <span
                className={`inline-flex rounded-2xl p-3 ${item.color}`}
              >
                <item.icon size={25} />
              </span>

              <h3 className="mt-5 text-xl font-extrabold">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="scroll-reveal bg-[#f4f8f3] py-20 lg:py-24">
        <div className="scroll-reveal mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase">
                Find your next opportunity
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Explore UnityVol events.
              </h2>

              <p className="mt-3 text-slate-500">
                Discover opportunities to share your time and talents.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-900"
            >
              View all events
              <ArrowRight size={18} />
            </Link>
          </div>

          {eventsLoading ? (
  <p className="mt-10 text-center text-slate-500">
    Loading events...
  </p>
) : events.length === 0 ? (
  <p className="mt-10 rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center text-slate-500">
    No upcoming events available right now.
  </p>
) : (
  <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => {
  const style = eventStyles[index % eventStyles.length];
  const Icon = style.icon;

              return (
                <article
                  key={event._id}
                  className="card-hover overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div
                    className={`flex h-44 items-center justify-center bg-gradient-to-br ${style.accent}`}
                  >
                    <div className={`rounded-3xl p-6 ${style.color}`}>
                      <Icon size={49} strokeWidth={1.6} />
                    </div>
                  </div>

                  <div className="p-6">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${style.color}`}
                    >
                      {event.category}
                    </span>

                    <h3 className="mt-4 text-xl font-extrabold">
                      {event.title}
                    </h3>

                    <p className="mt-3 min-h-20 text-sm leading-6 text-slate-500">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
                      <p className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-emerald-600"
                        />
                        {event.date
  ? new Date(event.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  : "Date not available"}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin
                          size={16}
                          className="text-emerald-600"
                        />
                        {event.location}
                      </p>

                      <p className="flex items-center gap-2">
                        <Users
                          size={16}
                          className="text-emerald-600"
                        />
                        {event.capacity} volunteer capacity
                      </p>
                    </div>

                    <Link
                      href="/events"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 py-3 font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                    >
                      Explore Event
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          )}
        </div>
      </section>

      {/* Call To Action */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-700 px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="text-sm font-bold tracking-widest text-emerald-200 uppercase">
                Your community. Your impact.
              </span>

              <h2 className="mt-4 text-3xl leading-tight font-black sm:text-4xl">
                The world gets better when we show up.
              </h2>

              <p className="mt-4 leading-7 text-emerald-100">
                Take the first step. Find an event, meet your community,
                and make a difference.
              </p>
            </div>

            <Link
              href="/register"
              className="shrink-0 rounded-2xl bg-white px-7 py-4 font-extrabold text-emerald-800 transition hover:bg-emerald-50"
            >
              Join UnityVol Today
              <ArrowRight size={18} className="ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>

      
{/* Contact Us */}

<section
  id="contact"
  className="scroll-reveal scroll-mt-24 bg-[#fcfdfb] py-20 lg:py-24"
>
  <div className="mx-auto max-w-7xl px-5 lg:px-8">
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">

      {/* Contact Information */}
      <div>
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
          Get in touch
        </span>

        <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
          Contact <span className="text-emerald-600">Us</span>
        </h2>

        <p className="mt-5 max-w-lg leading-7 text-slate-500">
          Have a question or want to make a difference in your
          community? We would love to hear from you. Reach out
          to the UnityVol team!
        </p>

        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Mail size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-800">Email Us</p>
              <p className="text-sm text-slate-500">
                sabbirhossen1430@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <MapPin size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-800">Our Location</p>
              <p className="text-sm text-slate-500">
                Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Phone size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-800">Call Us</p>
              <p className="text-sm text-slate-500">
                01308772842
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="rounded-3xl border border-emerald-100 bg-[#f4faf5] p-6 shadow-xl shadow-emerald-900/10 transition-shadow duration-300 hover:shadow-emerald-900/15 sm:p-8">
        <h3 className="text-xl font-extrabold text-slate-800">
          Send us a message
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Fill out the form and let us know how we can help.
        </p>

        <form
          onSubmit={async (e) => {
  e.preventDefault();

  if (sending) return;

  const form = e.currentTarget;
  const data = new FormData(form);

  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const subject = String(data.get("subject") || "").trim();
  const message = String(data.get("message") || "").trim();

  setSending(true);
  setContactStatus("");

  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        user_name: name,
        user_email: email,
        subject,
        message,
      },
      {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      }
    );
setContactStatus("success");
form.reset();
} catch (error: unknown) {
  console.error("EmailJS error details:", error);

  if (error && typeof error === "object") {
    const emailError = error as {
      status?: number;
      text?: string;
      message?: string;
    };

    console.error("EmailJS Status:", emailError.status);
    console.error("EmailJS Details:", emailError.text);
    console.error("EmailJS Message:", emailError.message);
  }

  setContactStatus("error");
} finally {
  setSending(false);
}
}}
          className="mt-6 space-y-5"
        >
          <div>
            <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold">
              Your Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold">
              Email Address
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold">
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              placeholder="What is this about?"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={4}
              placeholder="Write your message here..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {contactStatus === "success" && (
  <p role="status" className="rounded-xl bg-emerald-100 p-3 text-sm font-medium text-emerald-800">
    Message sent successfully! Thank you for contacting UnityVol.
  </p>
)}

{contactStatus === "error" && (
  <p role="alert" className="rounded-xl bg-red-100 p-3 text-sm font-medium text-red-800">
    Failed to send message. Please try again.
  </p>
)}

<button
  type="submit"
  disabled={sending}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  {sending ? "Sending..." : "Send Message"}
  {!sending && <Send size={17} />}
</button>
        </form>
      </div>

    </div>
  </div>
</section>


      {/* Footer */}
      <Footer />
    </main>
  );
}
