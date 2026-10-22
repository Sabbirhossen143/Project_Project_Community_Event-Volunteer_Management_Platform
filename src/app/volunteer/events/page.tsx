"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import VolunteerSidebar from "@/components/VolunteerSidebar";
import VolunteerAIChat from "@/components/volunteer/VolunteerAIChat";
import EventDetailsModal, {
  type EventDetailsData,
} from "@/components/EventDetailsModal";

import {
  Search,
  MapPin,
  CalendarDays,
  Clock3,
  HandHeart,
  CheckCircle2,
  QrCode,
  X,
  Menu,
  SlidersHorizontal,
  Heart,
} from "lucide-react";


type EventItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  color: string;
  textColor: string;
};

const events: EventItem[] = [
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

const categories = [
  "All Events",
  "Environment",
  "Education",
  "Healthcare",
  "Community",
];

export default function BrowseEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All Events");

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
  const saved = localStorage.getItem("volunteerFavorites");

  if (saved) {
    try {
      setFavoriteIds(JSON.parse(saved));
    } catch {
      setFavoriteIds([]);
    }
  }
}, []);

const toggleFavorite = (eventId: number) => {
  setFavoriteIds((previous) => {
    const updated = previous.includes(eventId)
      ? previous.filter((id) => id !== eventId)
      : [...previous, eventId];

    localStorage.setItem(
      "volunteerFavorites",
      JSON.stringify(updated)
    );

    return updated;
  });
};

  const [selectedEvent, setSelectedEvent] =
    useState<EventDetailsData | null>(null);
  // Open a shared event automatically from the URL
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const eventId = Number(params.get("event"));

  if (!eventId) return;

  const matchedEvent = events.find(
    (event) => event.id === eventId
  );

  if (matchedEvent) {
    setSelectedEvent(matchedEvent);
  }
}, []);

  const [registerEvent, setRegisterEvent] =
    useState<EventItem | null>(null);

  const [motivation, setMotivation] = useState("");
  const [registrationSubmitted, setRegistrationSubmitted] =
    useState(false);

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      activeCategory === "All Events" ||
      event.category === activeCategory;

    const matchesSearch =
      `${event.title} ${event.category} ${event.location} ${event.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="browse-app">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f7fb;
          color: #17243b;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        .browse-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        .browse-topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 68px;
          padding: 12px 28px;
          border-bottom: 1px solid #e7edf4;
          background: #ffffffed;
          backdrop-filter: blur(10px);
        }

        .browse-top-title {
          color: #607089;
          font-size: 12px;
        }

        .browse-mobile-menu {
          display: none;
          place-items: center;
          width: 37px;
          height: 37px;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

        .browse-content {
          max-width: 1500px;
          margin: 0 auto;
          padding: 28px;
        }

        .browse-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 24px;
        }

        .browse-eyebrow {
          margin: 0 0 8px;
          color: #119b6b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .browse-heading h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.8px;
          font-weight: 700;
        }

        .browse-subtitle {
          margin: 8px 0 0;
          color: #7c8ba0;
          font-size: 12px;
          line-height: 1.7;
        }

        .browse-count {
          padding: 11px 15px;
          border: 1px solid #d5f2e4;
          border-radius: 10px;
          background: #e8fff3;
          color: #087b56;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .browse-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .browse-search {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
          height: 46px;
          padding: 0 14px;
          border: 1px solid #e0e7f0;
          border-radius: 10px;
          background: white;
          color: #8795a8;
        }

        .browse-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #17243b;
          font-size: 12px;
        }

        .browse-filter-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #607089;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .browse-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 23px;
        }

        .browse-category {
          padding: 10px 15px;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          color: #607089;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .browse-category:hover {
          border-color: #9bdcc1;
          color: #087b56;
        }

        .browse-category.active {
          border-color: #0d9669;
          background: #0d9669;
          color: white;
        }

        .browse-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .browse-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e7edf4;
          border-radius: 14px;
          background: white;
          box-shadow: 0 3px 10px #243b5305;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .browse-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px #243b5310;
        }

        .browse-card-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 112px;
          padding: 20px;
          position: relative;
        }

        .browse-favorite-btn {
  position: static;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  margin-left: 12px;
  border: 1px solid #ffffffb8;
  border-radius: 50%;
  background: #ffffffed;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.browse-favorite-btn:hover {
  transform: scale(1.08);
  color: #ef4444;
}

.browse-favorite-btn.is-favorite {
  color: #ef4444;
  background: #fff1f2;
  border-color: #fecdd3;
}

.browse-category-tag {
  margin-left: auto;
  flex-shrink: 0;
  padding: 7px 10px;
  border-radius: 20px;
  background: #ffffffd9;
  font-size: 10px;
  font-weight: 800;
}

        .browse-card-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid #ffffff90;
          border-radius: 14px;
          background: #ffffffb8;
        }

        

        .browse-card-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 19px;
        }

        .browse-card-title {
          margin: 0;
          color: #293b52;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.5;
        }

        .browse-description {
          margin: 10px 0 17px;
          color: #7c8ba0;
          font-size: 11px;
          line-height: 1.8;
        }

        .browse-meta {
          display: grid;
          gap: 11px;
          margin-top: auto;
          padding: 15px 0;
          border-top: 1px solid #f0f3f7;
        }

        .browse-meta-item {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #607089;
          font-size: 11px;
        }

        .browse-meta-item svg {
          flex: none;
          color: #0d9669;
        }

        .browse-card-actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 12px;
          margin-top: 3px;
          padding-top: 15px;
          border-top: 1px solid #f0f3f7;
        }

        .browse-details,
        .browse-register {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 9px 14px;
          border: 1px solid #0d9669;
          border-radius: 8px;
          background: transparent;
          color: #0d9669;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .browse-details:hover,
        .browse-register:hover {
          border-color: #087b56;
          background: #ecfdf5;
          color: #087b56;
        }

        .browse-empty {
          grid-column: 1 / -1;
          padding: 55px 20px;
          border: 1px dashed #d8e2ed;
          border-radius: 13px;
          background: white;
          color: #8795a8;
          text-align: center;
        }

        .browse-empty h3 {
          margin: 12px 0 7px;
          color: #293b52;
          font-size: 15px;
        }

        .browse-empty p {
          margin: 0;
          font-size: 12px;
        }

        @media (max-width: 1200px) {
          .browse-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .browse-main {
            margin-left: 0;
          }

          .browse-mobile-menu {
            display: grid;
          }

          .browse-topbar {
            justify-content: flex-start;
            padding: 12px 18px;
          }

          .browse-content {
            padding: 22px 18px;
          }
        }

        @media (max-width: 600px) {
          .browse-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .browse-heading h1 {
            font-size: 24px;
          }

          .browse-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .browse-filter-label {
            padding: 5px 0;
          }

          .browse-grid {
            grid-template-columns: 1fr;
          }

          .browse-card-banner {
            min-height: 95px;
          }
        }
      `}</style>

      <VolunteerSidebar
        activePage="Browse Events"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName="Sarah Ahmed"
        userRole="Volunteer"
        avatarText="SA"
      />

      <main className="browse-main">
        <header className="browse-topbar">
          <button
            type="button"
            className="browse-mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <span className="browse-top-title">
            Volunteer Workspace / Browse Events
          </span>
        </header>

        <section className="browse-content">
          <div className="browse-heading">
            <div>
              <p className="browse-eyebrow">
                Make a difference today
              </p>

              <h1>Browse Events</h1>

              <p className="browse-subtitle">
                Discover opportunities, connect with your community,
                and turn your time into meaningful impact.
              </p>
            </div>

            <div className="browse-count">
              {filteredEvents.length} Events Found
            </div>
          </div>

          <div className="browse-toolbar">
            <label className="browse-search">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events, categories, locations..."
                aria-label="Search events"
              />
            </label>

            <div className="browse-filter-label">
              <SlidersHorizontal size={16} />
              Filter by category
            </div>
          </div>

          <div className="browse-categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`browse-category ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="browse-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <article className="browse-card" key={event.id}>
                  <div
                    className="browse-card-banner"
                    style={{ background: event.color }}
                  >
                    <div
                      className="browse-card-icon"
                      style={{ color: event.textColor }}
                    >
                      <HandHeart size={25} />
                    </div>

                    <span
                      className="browse-category-tag"
                      style={{ color: event.textColor }}
                    >
                      {event.category}
                    </span>
                    <button
  type="button"
  className={`browse-favorite-btn ${
    favoriteIds.includes(event.id) ? "is-favorite" : ""
  }`}
  onClick={() => toggleFavorite(event.id)}
  aria-label={
    favoriteIds.includes(event.id)
      ? "Remove from favorites"
      : "Add to favorites"
  }
  title={
    favoriteIds.includes(event.id)
      ? "Remove from favorites"
      : "Add to favorites"
  }
>
  <Heart
    size={19}
    fill={favoriteIds.includes(event.id) ? "currentColor" : "none"}
  />
</button>
                  </div>

                  <div className="browse-card-body">
                    <h2 className="browse-card-title">
                      {event.title}
                    </h2>

                    <p className="browse-description">
                      {event.description}
                    </p>

                    <div className="browse-meta">
                      <div className="browse-meta-item">
                        <CalendarDays size={15} />
                        <span>{event.date}</span>
                      </div>

                      <div className="browse-meta-item">
                        <Clock3 size={15} />
                        <span>{event.time}</span>
                      </div>

                      <div className="browse-meta-item">
                        <MapPin size={15} />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="browse-card-actions">
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="browse-details"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRegisterEvent(event);
                          setMotivation("");
                          setRegistrationSubmitted(false);
                        }}
                        className="browse-register"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="browse-empty">
                <Search size={28} />
                <h3>No events found</h3>
                <p>
                  Try another search term or select a different category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <VolunteerAIChat />

      {/* Registration Popup */}
      {registerEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setRegisterEvent(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-title"
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={() => setRegisterEvent(null)}
              aria-label="Close registration form"
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            {registrationSubmitted ? (
  <div className="py-3 text-center">
    {/* Success Heading */}
    <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-emerald-700">
      <CheckCircle2 size={25} />
    </div>

    <h2 className="mt-3 text-xl font-extrabold text-slate-900">
      Registration Submitted!
    </h2>

    <p className="mt-1 text-xs text-slate-500">
      Your registration was submitted successfully.
    </p>

    {/* Name & Email */}
    <div className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-3 rounded-xl border border-slate-200 p-3 text-left">
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500">Name</p>
        <p className="mt-1 truncate text-xs font-bold text-slate-900">
          Sarah Ahmed
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-slate-500">Email</p>
        <p className="mt-1 truncate text-xs font-bold text-slate-900">
          sarah.ahmed@example.com
        </p>
      </div>
    </div>

    {/* Compact QR Code */}
    <div className="mx-auto mt-4 w-full max-w-sm rounded-xl border border-slate-200 p-3">
      <div className="flex items-center justify-center gap-2">
        <QrCode size={17} className="text-emerald-700" />
        <h3 className="text-sm font-bold text-slate-900">
          Registration QR Code
        </h3>
      </div>

      <div className="mt-3 flex justify-center">
        <QRCodeSVG
          value={JSON.stringify({
            registrationId: `UV-REG-${registerEvent.id}`,
            eventId: registerEvent.id,
            eventName: registerEvent.title,
          })}
          size={125}
          level="H"
          includeMargin
        />
      </div>

      {/* Event Information */}
      <div className="mt-3 rounded-lg bg-slate-50 p-3 text-left">
        <p className="text-[11px] text-slate-500">Event</p>
        <p className="mt-1 text-xs font-bold text-slate-900">
          {registerEvent.title}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500">
            Registration ID
          </span>
          <span className="font-mono text-xs font-bold text-emerald-700">
            UV-REG-{registerEvent.id}
          </span>
        </div>
      </div>
    </div>

    {/* Done Button */}
    <button
      type="button"
      onClick={() => setRegisterEvent(null)}
      className="mt-4 rounded-lg bg-emerald-700 px-7 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
    >
      Done
    </button>
  </div>
) : (
              <>
                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                  Join the event
                </p>

                <h2
                  id="registration-title"
                  className="mt-2 pr-8 text-2xl font-extrabold text-slate-900"
                >
                  Registration Form
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Event: {registerEvent.title}
                </p>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setRegistrationSubmitted(true);
                  }}
                >
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Full Name
                    </label>

                    <input
                      value="Sarah Ahmed"
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value="sarah.ahmed@example.com"
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      value="01700000000"
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="registration-motivation"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Why do you want to volunteer?
                    </label>

                    <textarea
                      id="registration-motivation"
                      required
                      rows={4}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Tell us why you want to join..."
                      className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white hover:bg-emerald-800"
                  >
                    Submit Registration
                    <HandHeart size={17} />
                  </button>

                  <p className="text-center text-xs leading-5 text-slate-400">
                    Your registration requires organizer approval.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      <EventDetailsModal
  event={selectedEvent}
  onClose={() => {
    setSelectedEvent(null);

    const url = new URL(window.location.href);
    url.searchParams.delete("event");

    window.history.replaceState({}, "", url.toString());
  }}
/>
    </div>
  );
}