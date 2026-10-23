
"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Heart,
  TreePine,
  BookOpen,
  HeartHandshake,
  Search,
  Clock,
  Menu,
  X,
  Share2,
} from "lucide-react";

const events = [
  {
    id: 1,
    category: "Environment",
    title: "Green Earth, Green Future",
    description:
      "Join our community to plant trees and create a cleaner, greener future for the next generation.",
    date: "October 25, 2026",
    time: "9:00 AM - 12:00 PM",
    location: "Chattogram, Bangladesh",
    volunteers: 12,
    capacity: 30,
    icon: TreePine,
    color: "bg-emerald-100 text-emerald-700",
    accent: "from-emerald-100 to-lime-50",
  },
  {
    id: 2,
    category: "Education",
    title: "Share the Gift of Learning",
    description:
      "Help children discover their potential through reading sessions, mentoring, and creative activities.",
    date: "October 28, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Dhaka, Bangladesh",
    volunteers: 18,
    capacity: 25,
    icon: BookOpen,
    color: "bg-sky-100 text-sky-700",
    accent: "from-sky-100 to-indigo-50",
  },
  {
    id: 3,
    category: "Community",
    title: "Care Beyond Boundaries",
    description:
      "Support a local community initiative focused on essential supplies and meaningful human connections.",
    date: "November 2, 2026",
    time: "9:30 AM - 12:30 PM",
    location: "Cumilla, Bangladesh",
    volunteers: 9,
    capacity: 20,
    icon: HeartHandshake,
    color: "bg-rose-100 text-rose-700",
    accent: "from-rose-100 to-orange-50",
  },
  {
    id: 4,
    category: "Environment",
    title: "Clean City Campaign",
    description:
      "Work together to clean public spaces and inspire people to keep our neighborhoods beautiful.",
    date: "November 8, 2026",
    time: "8:00 AM - 11:00 AM",
    location: "Chattogram, Bangladesh",
    volunteers: 22,
    capacity: 40,
    icon: TreePine,
    color: "bg-emerald-100 text-emerald-700",
    accent: "from-green-100 to-teal-50",
  },
  {
    id: 5,
    category: "Education",
    title: "Digital Skills for Everyone",
    description:
      "Help students learn essential computer skills and become more confident in the digital world.",
    date: "November 12, 2026",
    time: "11:00 AM - 2:00 PM",
    location: "Dhaka, Bangladesh",
    volunteers: 14,
    capacity: 25,
    icon: BookOpen,
    color: "bg-sky-100 text-sky-700",
    accent: "from-sky-100 to-blue-50",
  },
  {
    id: 6,
    category: "Community",
    title: "Share a Meal, Share a Smile",
    description:
      "Prepare and distribute meals while bringing hope, kindness, and care to people in need.",
    date: "November 18, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Cumilla, Bangladesh",
    volunteers: 16,
    capacity: 30,
    icon: HeartHandshake,
    color: "bg-rose-100 text-rose-700",
    accent: "from-rose-100 to-pink-50",
  },
];

const categories = [
  "All Events",
  "Environment",
  "Education",
  "Community",
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Events");
  const [menuOpen, setMenuOpen] = useState(false);
  

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All Events" ||
        event.category === selectedCategory;

      const searchText = searchTerm.toLowerCase().trim();

      const matchesSearch =
        event.title.toLowerCase().includes(searchText) ||
        event.description.toLowerCase().includes(searchText) ||
        event.location.toLowerCase().includes(searchText) ||
        event.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleShareEvent = async (event: (typeof events)[number]) => {
  const shareUrl = `${window.location.origin}/events?eventId=${event.id}`;

  const shareData = {
    title: event.title,
    text: `${event.title}\n${event.description}\nDate: ${event.date}\nLocation: ${event.location}`,
    url: shareUrl,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(
        `${shareData.text}\n${shareUrl}`
      );
      window.alert("Event link copied successfully!");
    } else {
      window.prompt("Copy this event link:", shareUrl);
    }
  } catch (error) {
    if (error instanceof Error && error.name !== "AbortError") {
      window.alert("Could not share the event. Please try again.");
    }
  }
};

  return (
    <main className="min-h-screen bg-[#fcfdfb] text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/"
            aria-label="UnityVol Home"
            className="flex items-center gap-2.5"
          >
            <svg
              viewBox="0 0 100 100"
              className="h-11 w-11 shrink-0 sm:h-12 sm:w-12"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="UnityVol logo"
            >
              <defs>
                <linearGradient
                  id="unityVolGreenEvents"
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
                fill="url(#unityVolGreenEvents)"
              />
              <path
                d="M44 43 C28 41 18 30 22 20 C34 22 44 30 47 40Z"
                fill="url(#unityVolGreenEvents)"
              />
              <path
                d="M56 43 C72 41 82 30 78 20 C66 22 56 30 53 40Z"
                fill="url(#unityVolGreenEvents)"
              />
              <path
                d="M42 37 C42 31 46 29 50 29 C54 29 58 31 58 37 L58 57 L50 69 L42 57Z"
                fill="url(#unityVolGreenEvents)"
              />
              <path
                d="M45 72 C27 68 10 53 12 35 C29 39 43 52 48 66Z"
                fill="url(#unityVolGreenEvents)"
              />
              <path
                d="M55 72 C73 68 90 53 88 35 C71 39 57 52 52 66Z"
                fill="url(#unityVolGreenEvents)"
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
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
            >
              Home
            </Link>

            <Link
              href="/events"
              className="text-sm font-semibold text-emerald-700"
            >
              Explore Events
            </Link>

            <Link
              href="/#about"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
            >
              About Us
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50"
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
            <Link onClick={() => setMenuOpen(false)} href="/">
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
      <section className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <Heart size={16} />
              Make a Difference Today
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Discover Events.
              <span className="mt-2 block text-emerald-600">
                Create Impact.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Find meaningful volunteering opportunities, connect with
              inspiring people, and turn small acts of kindness into
              lasting community impact.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600">
              <span className="flex items-center gap-2">
                <CalendarDays
                  size={18}
                  className="text-emerald-600"
                />
                Upcoming Events
              </span>

              <span className="flex items-center gap-2">
                <Users
                  size={18}
                  className="text-emerald-600"
                />
                Community Volunteers
              </span>

              <span className="flex items-center gap-2">
                <HeartHandshake
                  size={18}
                  className="text-emerald-600"
                />
                Meaningful Causes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Find Your Opportunity
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Explore UnityVol Events
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              Discover causes you care about and find your next
              opportunity to make a difference.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3">
            <p className="text-sm text-slate-500">
              Available opportunities
            </p>
            <p className="mt-1 text-2xl font-black text-emerald-700">
              {filteredEvents.length} Events
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-9">
          <label htmlFor="event-search" className="sr-only">
            Search events
          </label>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50">
            <Search
              size={21}
              className="shrink-0 text-emerald-600"
            />

            <input
              id="event-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event, category, or location..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:text-base"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="shrink-0 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                selectedCategory === category
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        {filteredEvents.length > 0 ? (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const Icon = event.icon;
              const spotsLeft = event.capacity - event.volunteers;

              return (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                >
                  <div
                    className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${event.accent}`}
                  >
                    <div
                      className={`rounded-3xl p-6 shadow-sm transition duration-300 group-hover:scale-105 ${event.color}`}
                    >
                      <Icon size={52} strokeWidth={1.6} />
                    </div>

                    <span
                      className={`absolute left-5 top-5 rounded-full px-3 py-1.5 text-xs font-bold ${event.color}`}
                    >
                      {event.category}
                    </span>

                    <span className="absolute right-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700">
                      {spotsLeft} spots left
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-extrabold transition group-hover:text-emerald-700">
                      {event.title}
                    </h3>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-500">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
                      <p className="flex items-start gap-3">
                        <CalendarDays
                          size={17}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />
                        <span>{event.date}</span>
                      </p>

                      <p className="flex items-start gap-3">
                        <Clock
                          size={17}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />
                        <span>{event.time}</span>
                      </p>

                      <p className="flex items-start gap-3">
                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />
                        <span>{event.location}</span>
                      </p>

                      <p className="flex items-start gap-3">
                        <Users
                          size={17}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />
                        <span>
                          {event.volunteers} / {event.capacity} volunteers
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{
                          width: `${
                            (event.volunteers / event.capacity) * 100
                          }%`,
                        }}
                      />
                    </div>

                   <div className="mt-6 grid grid-cols-2 gap-3">
  <button
    type="button"
    onClick={() => handleShareEvent(event)}
    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-600 px-3 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
  >
    <Share2 size={16} />
    Share Event
  </button>

  <Link
    href={`/register?eventId=${event.id}&event=${encodeURIComponent(event.title)}`}
    className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
  >
    Join Event
    <ArrowRight size={16} />
  </Link>
</div>

                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Search
              size={38}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-xl font-bold">
              No events found
            </h3>

            <p className="mt-2 text-slate-500">
              Try another keyword or select a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Events");
              }}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>


      {/* Call To Action */}
      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-700 px-7 py-12 text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-200">
                Your Community. Your Impact.
              </span>

              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                Be part of something meaningful.
              </h2>

              <p className="mt-4 leading-7 text-emerald-100">
                Join our volunteer community and help create a better
                future, one good deed at a time.
              </p>
            </div>

            <Link
              href="/register"
              className="shrink-0 rounded-2xl bg-white px-7 py-4 font-extrabold text-emerald-800 transition hover:bg-emerald-50"
            >
              Become a Volunteer
              <ArrowRight size={18} className="ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
