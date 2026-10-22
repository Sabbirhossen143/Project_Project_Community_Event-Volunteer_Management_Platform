"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import VolunteerSidebar from "@/components/VolunteerSidebar";
import {
  Compass,
  CalendarCheck,
  CalendarDays,
  MapPin,
  Clock3,
  ArrowRight,
  Menu,
  X,
  HandHeart,
  CheckCircle2,
  Search,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";

type VolunteerEvent = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  registered: boolean;
  status: string;
  color: string;
  textColor: string;
};

const events: VolunteerEvent[] = [
  {
    id: 1,
    title: "Tree Plantation Drive",
    category: "Environment",
    date: "Nov 15, 2026",
    time: "9:00 AM",
    location: "Dhaka University",
    registered: true,
    status: "Confirmed",
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
    registered: true,
    status: "Pending",
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
    registered: false,
    status: "",
    color: "#f3e8ff",
    textColor: "#7e22ce",
  },
];

export default function VolunteerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  // Click outside করলে profile dropdown বন্ধ হবে
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const registeredEvents = events.filter(
    (event) => event.registered
  );

  const upcomingEvents = events.filter((event) => {
    if (currentTime === null) return true;

    return new Date(event.date).getTime() >= currentTime;
  });

  const filteredEvents = upcomingEvents.filter((event) =>
    `${event.title} ${event.category} ${event.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="volunteer-app">
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
        input {
          font: inherit;
        }

        .v-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        /* NAVBAR */
        .v-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
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

        .v-top-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .v-top-title {
          color: #607089;
          font-size: 12px;
          white-space: nowrap;
        }

        /* SEARCH BOX */
        .v-search {
          display: flex;
          align-items: center;
          gap: 9px;
          width: min(100%, 260px);
          height: 38px;
          flex-shrink: 1;
          padding: 0 12px;
          border: 1px solid #e0e7f0;
          border-radius: 9px;
          background: #fbfcfe;
          color: #8a98ac;
        }

        .v-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #17243b;
          font-size: 12px;
        }

        .v-search:focus-within {
          border-color: #0d9669;
          box-shadow: 0 0 0 3px #0d966910;
        }

        /* RIGHT SIDE */
        .v-top-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 20px;
          margin-left: auto;
        }

        /* PROFILE BUTTON */
        .v-profile-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .v-profile {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 7px;
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          color: #293b52;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
        }

        .v-profile:hover {
          background: #f4f7fb;
          border-color: #e7edf4;
        }

        .v-avatar {
          display: grid;
          place-items: center;
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #d7e6f6;
          color: #26578d;
          font-size: 11px;
          font-weight: 800;
        }

        .v-profile-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .v-profile-info strong {
          color: #24334a;
          font-size: 12px;
          font-weight: 750;
        }

        .v-profile-info small {
          color: #8795a8;
          font-size: 10px;
        }

        .v-profile > svg {
          color: #8795a8;
          transition: transform 0.2s;
        }

        .v-profile .v-chevron-open {
          transform: rotate(180deg);
        }

        /* PROFILE DROPDOWN */
        .v-profile-dropdown {
          position: absolute;
          top: calc(100% + 9px);
          right: 0;
          z-index: 50;
          width: 175px;
          padding: 7px;
          border: 1px solid #e6ebf2;
          border-radius: 10px;
          background: white;
          box-shadow: 0 12px 30px #182b4417;
          animation: v-dropdown-in 0.15s ease-out;
        }

        @keyframes v-dropdown-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .v-dropdown-item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 10px;
          border: 0;
          border-radius: 6px;
          background: white;
          color: #40516a;
          font-size: 12px;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
        }

        .v-dropdown-item:hover {
          background: #f4f8f6;
        }

        .v-logout {
          color: #dc2626;
        }

        .v-logout:hover {
          background: #fef2f2;
        }

        /* MOBILE MENU */
        .v-mobile-menu {
          display: none;
          place-items: center;
          width: 37px;
          height: 37px;
          flex-shrink: 0;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

        /* CONTENT */
        .v-content {
          max-width: 1500px;
          margin: 0 auto;
          padding: 28px;
        }

        .v-welcome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .v-eyebrow {
          margin: 0 0 8px;
          color: #119b6b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .v-welcome h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.8px;
          font-weight: 800;
        }

        .v-subtitle {
          margin: 8px 0 0;
          color: #7c8ba0;
          font-size: 12px;
          line-height: 1.7;
        }

        .v-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 16px;
          border: 1px solid #0d9669;
          border-radius: 9px;
          background: #0d9669;
          color: white;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s;
        }

        .v-primary:hover {
          background: #087b56;
        }

        /* STATS */
        .v-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 24px;
        }

        .v-stat,
        .v-panel {
          min-width: 0;
          border: 1px solid #e7edf4;
          border-radius: 13px;
          background: white;
          box-shadow: 0 3px 10px #243b5305;
        }

        .v-stat {
          padding: 19px;
        }

        .v-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .v-stat-label {
          color: #7a8aa0;
          font-size: 11px;
          font-weight: 650;
        }

        .v-stat-icon {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #e5f8ef;
          color: #119b6b;
        }

        .v-stat-number {
          margin-top: 14px;
          font-size: 29px;
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .v-stat-note {
          margin-top: 6px;
          color: #8795a8;
          font-size: 10px;
        }

        /* PANELS */
        .v-panel {
          margin-bottom: 22px;
          overflow: hidden;
        }

        .v-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 20px;
          border-bottom: 1px solid #f0f3f7;
        }

        .v-panel-title {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
        }

        .v-panel-subtitle {
          margin: 5px 0 0;
          color: #8795a8;
          font-size: 11px;
        }

        .v-text-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #0d9669;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
          white-space: nowrap;
        }

        .v-text-link:hover {
          color: #087b56;
        }

        /* EVENTS */
        .v-event-list {
          display: grid;
        }

        .v-event {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          border-bottom: 1px solid #f0f3f7;
        }

        .v-event:last-child {
          border-bottom: 0;
        }

        .v-event-info {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .v-event-icon {
          display: grid;
          place-items: center;
          flex: none;
          width: 44px;
          height: 44px;
          border-radius: 12px;
        }

        .v-event-title {
          margin: 0 0 5px;
          color: #293b52;
          font-size: 13px;
          font-weight: 800;
        }

        .v-category {
          font-size: 10px;
          font-weight: 750;
        }

        .v-event-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 9px;
        }

        .v-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #8795a8;
          font-size: 10px;
        }

        .v-event-action {
          flex: none;
        }

        .v-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 20px;
          background: #dcfce7;
          color: #15803d;
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
        }

        .v-status.pending {
          background: #fef3c7;
          color: #a16207;
        }

        .v-empty {
          padding: 30px 20px;
          color: #8795a8;
          font-size: 12px;
          text-align: center;
        }

        /* BOTTOM SECTION */
        .v-bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          gap: 20px;
          align-items: stretch;
        }

        .v-bottom-grid .v-panel {
          margin-bottom: 0;
        }

        .v-tip {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 26px;
          background: linear-gradient(135deg, #e8fff3, #ffffff);
        }

        .v-tip-icon {
          display: grid;
          place-items: center;
          width: 45px;
          height: 45px;
          margin-bottom: 15px;
          border-radius: 13px;
          background: #d1fae5;
          color: #0d9669;
        }

        .v-tip h3 {
          margin: 0 0 9px;
          font-size: 17px;
        }

        .v-tip p {
          margin: 0 0 18px;
          color: #718096;
          font-size: 12px;
          line-height: 1.8;
        }

        /* TABLET */
        @media (max-width: 1100px) {
          .v-content {
            padding: 22px;
          }

          .v-stats {
            gap: 10px;
          }

          .v-stat {
            padding: 15px;
          }

          .v-bottom-grid {
            grid-template-columns: 1fr;
          }

          .v-topbar {
            padding-right: 18px;
            padding-left: 18px;
          }

          .v-top-right {
            gap: 12px;
          }
        }

        /* MOBILE */
        @media (max-width: 900px) {
          .v-main {
            margin-left: 0;
          }

          .v-mobile-menu {
            display: grid;
          }

          .v-topbar {
            padding: 12px 18px;
          }

          .v-content {
            padding: 22px 18px;
          }
        }

        @media (max-width: 650px) {
          .v-topbar {
            flex-wrap: wrap;
            gap: 10px;
          }

          .v-top-left {
            width: auto;
            flex: 1;
            min-width: 0;
          }

          .v-top-title {
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .v-top-right {
            width: 100%;
            gap: 10px;
          }

          .v-search {
            width: auto;
            max-width: none;
            flex: 1;
            min-width: 0;
          }

          .v-profile-info,
          .v-profile > svg {
            display: none;
          }

          .v-welcome {
            align-items: flex-start;
            flex-direction: column;
          }

          .v-welcome h1 {
            font-size: 23px;
          }

          .v-stats {
            grid-template-columns: 1fr;
          }

          .v-stat {
            padding: 17px;
          }

          .v-event {
            align-items: flex-start;
            flex-direction: column;
          }

          .v-event-action {
            padding-left: 57px;
          }

          .v-event-meta {
            gap: 8px;
          }

          .v-panel-head {
            padding: 16px;
          }
        }
      `}</style>

      <VolunteerSidebar
        activePage="Dashboard"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName="Sarah Ahmed"
        userRole="Volunteer"
        avatarText="SA"
      />

      <main className="v-main">
        {/* NAVBAR */}
        <header className="v-topbar">
          <div className="v-top-left">
            <button
              type="button"
              className="v-mobile-menu"
              aria-label="Toggle navigation"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <span className="v-top-title">
              Volunteer Workspace / Dashboard
            </span>
          </div>

          <div className="v-top-right">
            {/* SEARCH */}
            <label className="v-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search upcoming events..."
                aria-label="Search upcoming events"
              />
            </label>

            {/* PROFILE DROPDOWN */}
            <div className="v-profile-wrap" ref={profileRef}>
              <button
                type="button"
                className="v-profile"
                onClick={() => setShowProfile((open) => !open)}
                aria-expanded={showProfile}
                aria-label="Open profile menu"
              >
                <span className="v-avatar">SA</span>

                <span className="v-profile-info">
                  <strong>Sarah Ahmed</strong>
                  <small>Volunteer</small>
                </span>

                <ChevronDown
                  size={15}
                  className={showProfile ? "v-chevron-open" : ""}
                />
              </button>

              {showProfile && (
                <div className="v-profile-dropdown">
                  <Link
                    href="/volunteer/profile"
                    className="v-dropdown-item"
                    onClick={() => setShowProfile(false)}
                  >
                    <UserRound size={16} />
                    My Profile
                  </Link>

                  <Link
                    href="/login"
                    className="v-dropdown-item v-logout"
                    onClick={() => setShowProfile(false)}
                  >
                    <LogOut size={16} />
                    Log out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <section className="v-content">
          <div className="v-welcome">
            <div>
              <p className="v-eyebrow">Your community matters</p>
              <h1>Welcome back, Sarah! 👋</h1>
              <p className="v-subtitle">
                Discover meaningful opportunities and make a difference
                in your community.
              </p>
            </div>

            <Link href="/volunteer/events" className="v-primary">
              <Compass size={16} />
              Explore Events
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* STATS */}
          <div className="v-stats">
            <div className="v-stat">
              <div className="v-stat-top">
                <span className="v-stat-label">My Registrations</span>
                <div className="v-stat-icon">
                  <CalendarCheck size={19} />
                </div>
              </div>

              <div className="v-stat-number">
                {registeredEvents.length}
              </div>

              <div className="v-stat-note">
                Events you have registered for
              </div>
            </div>

            <div className="v-stat">
              <div className="v-stat-top">
                <span className="v-stat-label">Upcoming Events</span>
                <div
                  className="v-stat-icon"
                  style={{ background: "#dbeafe", color: "#2563eb" }}
                >
                  <CalendarDays size={19} />
                </div>
              </div>

              <div className="v-stat-number">
                {upcomingEvents.length}
              </div>

              <div className="v-stat-note">
                Opportunities coming up
              </div>
            </div>

            <div className="v-stat">
              <div className="v-stat-top">
                <span className="v-stat-label">Confirmed</span>
                <div
                  className="v-stat-icon"
                  style={{ background: "#f3e8ff", color: "#7e22ce" }}
                >
                  <CheckCircle2 size={19} />
                </div>
              </div>

              <div className="v-stat-number">
                {
                  registeredEvents.filter(
                    (event) => event.status === "Confirmed"
                  ).length
                }
              </div>

              <div className="v-stat-note">
                Registrations confirmed by organizers
              </div>
            </div>
          </div>

          {/* UPCOMING EVENTS */}
          <section className="v-panel">
            <div className="v-panel-head">
              <div>
                <h2 className="v-panel-title">
                  Upcoming Opportunities
                </h2>
                <p className="v-panel-subtitle">
                  Find an event that matches your interests.
                </p>
              </div>

              <Link href="/volunteer/events" className="v-text-link">
                Browse all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="v-event-list">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <article className="v-event" key={event.id}>
                    <div className="v-event-info">
                      <div
                        className="v-event-icon"
                        style={{
                          background: event.color,
                          color: event.textColor,
                        }}
                      >
                        <HandHeart size={21} />
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <h3 className="v-event-title">
                          {event.title}
                        </h3>

                        <span
                          className="v-category"
                          style={{ color: event.textColor }}
                        >
                          {event.category}
                        </span>

                        <div className="v-event-meta">
                          <span className="v-meta-item">
                            <CalendarDays size={13} />
                            {event.date}
                          </span>

                          <span className="v-meta-item">
                            <Clock3 size={13} />
                            {event.time}
                          </span>

                          <span className="v-meta-item">
                            <MapPin size={13} />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="v-event-action">
                      {event.registered ? (
                        <span
                          className={`v-status ${
                            event.status === "Pending" ? "pending" : ""
                          }`}
                        >
                          {event.status === "Confirmed" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Clock3 size={12} />
                          )}

                          {event.status}
                        </span>
                      ) : (
                        <Link
                          href="/volunteer/events"
                          className="v-text-link"
                        >
                          View details <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="v-empty">
                  No upcoming events found. Try another search.
                </div>
              )}
            </div>
          </section>

          {/* MY PARTICIPATION */}
          <div className="v-bottom-grid">
            <section className="v-panel">
              <div className="v-panel-head">
                <div>
                  <h2 className="v-panel-title">My Participation</h2>
                  <p className="v-panel-subtitle">
                    Keep track of your registrations.
                  </p>
                </div>

                <Link
                  href="/volunteer/my-events"
                  className="v-text-link"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{ padding: 20 }}>
                {registeredEvents.length > 0 ? (
                  registeredEvents.map((event) => (
                    <div
                      key={event.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "12px 0",
                        borderBottom: "1px solid #f0f3f7",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 750,
                            color: "#293b52",
                          }}
                        >
                          {event.title}
                        </div>

                        <div
                          style={{
                            marginTop: 5,
                            fontSize: 10,
                            color: "#8795a8",
                          }}
                        >
                          {event.date}
                        </div>
                      </div>

                      <span
                        className={`v-status ${
                          event.status === "Pending" ? "pending" : ""
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="v-empty">
                    You have not registered for any events yet.
                  </div>
                )}
              </div>
            </section>

            {/* TIP */}
            <section className="v-panel v-tip">
              <div className="v-tip-icon">
                <HandHeart size={22} />
              </div>

              <h3>Small actions, big impact</h3>

              <p>
                Your time and skills can help create meaningful change.
                Explore community opportunities and find a cause you care
                about.
              </p>

              <Link href="/volunteer/events" className="v-primary">
                Find opportunities <ArrowRight size={15} />
              </Link>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}