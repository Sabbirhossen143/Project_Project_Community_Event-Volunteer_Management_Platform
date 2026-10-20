"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  Clock,
  HandHeart,
} from "lucide-react";

const events = [
  {
    category: "Environment",
    title: "Green Earth, Green Future",
    description:
      "Join our community to plant trees and create a cleaner, greener future for the next generation.",
    date: "October 25, 2026",
    location: "Chattogram, Bangladesh",
    volunteers: "12 / 30",
    icon: TreePine,
    color: "bg-emerald-100 text-emerald-700",
    accent: "from-emerald-100 to-lime-50",
  },
  {
    category: "Education",
    title: "Share the Gift of Learning",
    description:
      "Help children discover their potential through reading sessions, mentoring, and creative activities.",
    date: "October 28, 2026",
    location: "Dhaka, Bangladesh",
    volunteers: "18 / 25",
    icon: BookOpen,
    color: "bg-sky-100 text-sky-700",
    accent: "from-sky-100 to-indigo-50",
  },
  {
    category: "Community",
    title: "Care Beyond Boundaries",
    description:
      "Support a local community initiative focused on essential supplies and meaningful human connections.",
    date: "November 2, 2026",
    location: "Cumilla, Bangladesh",
    volunteers: "9 / 20",
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
      <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
              <HandHeart size={23} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Community<span className="text-emerald-600">Connect</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-semibold text-emerald-700">
              Home
            </Link>
            <Link href="/events" className="text-sm font-medium text-slate-600 hover:text-emerald-700">
              Explore Events
            </Link>
            <Link href="/#about" className="text-sm font-medium text-slate-600 hover:text-emerald-700">
              About Us
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">
              Log in
            </Link>
            <Link href="/register" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700">
              Join the Community <ArrowRight size={16} className="ml-1 inline" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            className="rounded-xl border border-slate-200 p-2 md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-5 py-5 md:hidden">
            <Link onClick={() => setMenuOpen(false)} href="/events">Explore Events</Link>
            <Link onClick={() => setMenuOpen(false)} href="/#about">About Us</Link>
            <Link onClick={() => setMenuOpen(false)} href="/login">Log in</Link>
            <Link onClick={() => setMenuOpen(false)} href="/register" className="font-bold text-emerald-700">Join the Community →</Link>
          </div>
        )}
      </header>

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
              <span className="mt-2 block text-emerald-600">someone smiles.</span>
            </h1>

            <p className="hero-enter-delay mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Discover meaningful community events, meet inspiring people,
              and turn your time into something that truly matters. Your next
              good deed starts here.
            </p>

            <div className="hero-enter-delay-2 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/events" className="rounded-2xl bg-emerald-600 px-7 py-4 text-center font-bold text-white shadow-xl shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                Find an Event <ArrowRight size={18} className="ml-2 inline" />
              </Link>
              <Link href="/register" className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center font-bold transition hover:border-emerald-300 hover:bg-emerald-50">
                Become a Volunteer
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4 border-t border-slate-200 pt-7">
              <div className="flex -space-x-3">
                {["bg-emerald-200", "bg-amber-200", "bg-sky-200", "bg-rose-200"].map((color, i) => (
                  <span key={color} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white ${color} text-xs font-black text-slate-700`}>
                    {["A", "R", "S", "M"][i]}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-bold">Every helping hand matters</p>
                <p className="mt-0.5 text-sm text-slate-500">Be part of something bigger.</p>
              </div>
            </div>
          </div>

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
                    <p className="mt-1 text-sm text-emerald-100">A greener tomorrow</p>
                  </div>
                </div>
                <div className="mt-8 flex min-h-48 flex-col justify-between rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/5 sm:min-h-56">
                  <Users size={34} className="text-sky-600" />
                  <div>
                    <p className="text-2xl font-black">Connect</p>
                    <p className="mt-1 text-sm text-slate-500">People who care</p>
                  </div>
                </div>
                <div className="flex min-h-36 flex-col justify-between rounded-3xl bg-amber-100 p-5">
                  <HeartHandshake size={32} className="text-amber-800" />
                  <p className="font-bold text-amber-950">Give with purpose.</p>
                </div>
                <div className="mt-5 flex min-h-36 flex-col justify-between rounded-3xl bg-rose-100 p-5">
                  <Heart size={31} className="text-rose-600" />
                  <p className="font-bold text-rose-950">Change a life.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white bg-white/90 p-4 shadow-sm">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <CalendarDays size={23} />
                </div>
                <div className="flex-1">
                  <p className="font-bold">Your next chapter starts now</p>
                  <p className="mt-1 text-sm text-slate-500">Find a cause you believe in.</p>
                </div>
                <ArrowRight size={20} className="text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-reveal border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-7 px-5 py-9 md:grid-cols-4 lg:px-8">
          {[
            { value: "Every", label: "Action counts" },
            { value: "Local", label: "Communities first" },
            { value: "Open", label: "To everyone" },
            { value: "Together", label: "We make a difference" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xl font-black tracking-tight text-emerald-700 sm:text-2xl">{item.value}</p>
              <p className="mt-1 text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="scroll-reveal mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase">Why Community Connect?</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Make your free time meaningful.</h2>
          <p className="mt-4 leading-7 text-slate-500">
            Find the causes you care about and take a simple step toward a better community.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Heart, title: "Find your cause", text: "Discover opportunities that match your passions, interests, and skills.", color: "bg-rose-100 text-rose-600" },
            { icon: Users, title: "Meet your people", text: "Connect with volunteers and organizers who share your vision.", color: "bg-sky-100 text-sky-700" },
            { icon: Sparkles, title: "Make real impact", text: "Turn your intentions into practical actions that help people.", color: "bg-amber-100 text-amber-700" },
          ].map((item) => (
            <article key={item.title} className="card-hover rounded-3xl border border-slate-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
              <span className={`inline-flex rounded-2xl p-3 ${item.color}`}><item.icon size={25} /></span>
              <h3 className="mt-5 text-xl font-extrabold">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-500">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scroll-reveal bg-[#f4f8f3] py-20 lg:py-24">
        <div className="scroll-reveal mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase">Find your next opportunity</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Explore community events.</h2>
              <p className="mt-3 text-slate-500">Discover opportunities to share your time and talents.</p>
            </div>
            <Link href="/events" className="inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-900">
              View all events <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const Icon = event.icon;
              return (
                <article key={event.title} className="card-hover overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
                  <div className={`flex h-44 items-center justify-center bg-gradient-to-br ${event.accent}`}>
                    <div className={`rounded-3xl p-6 ${event.color}`}>
                      <Icon size={49} strokeWidth={1.6} />
                    </div>
                  </div>
                  <div className="p-6">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${event.color}`}>{event.category}</span>
                    <h3 className="mt-4 text-xl font-extrabold">{event.title}</h3>
                    <p className="mt-3 min-h-20 text-sm leading-6 text-slate-500">{event.description}</p>
                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
                      <p className="flex items-center gap-2"><CalendarDays size={16} className="text-emerald-600" />{event.date}</p>
                      <p className="flex items-center gap-2"><MapPin size={16} className="text-emerald-600" />{event.location}</p>
                      <p className="flex items-center gap-2"><Users size={16} className="text-emerald-600" />{event.volunteers} volunteers</p>
                    </div>
                    <Link href="/events" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 py-3 font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white">
                      Explore Event <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-700 px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="text-sm font-bold tracking-widest text-emerald-200 uppercase">Your community. Your impact.</span>
              <h2 className="mt-4 text-3xl leading-tight font-black sm:text-4xl">The world gets better when we show up.</h2>
              <p className="mt-4 leading-7 text-emerald-100">Take the first step. Find an event, meet your community, and make a difference.</p>
            </div>
            <Link href="/register" className="shrink-0 rounded-2xl bg-white px-7 py-4 font-extrabold text-emerald-800 transition hover:bg-emerald-50">
              Join Us Today <ArrowRight size={18} className="ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <HandHeart className="text-emerald-600" size={22} />
            Community<span className="text-emerald-600">Connect</span>
          </Link>
          <p className="text-sm text-slate-500">Making communities stronger, one good deed at a time.</p>
          <p className="text-sm text-slate-400">© 2026 Community Connect</p>
        </div>
      </footer>
    </main>
  );
}
