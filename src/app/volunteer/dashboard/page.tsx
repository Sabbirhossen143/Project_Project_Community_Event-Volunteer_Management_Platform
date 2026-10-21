
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  UserRound,
  CalendarDays,
  MapPin,
  Clock3,
  ArrowRight,
  Menu,
  X,
  HandHeart,
  CheckCircle2,
  Search,
} from "lucide-react";

const events = [
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

const navigation = [
  {
    label: "Dashboard",
    href: "/volunteer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Browse Events",
    href: "/volunteer/events",
    icon: Compass,
  },
  {
    label: "My Events",
    href: "/volunteer/my-events",
    icon: CalendarCheck,
  },
  {
    label: "My Profile",
    href: "/volunteer/profile",
    icon: UserRound,
  },
];

export default function VolunteerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const registeredEvents = events.filter((event) => event.registered);
  const upcomingEvents = events.filter(
    (event) => new Date(event.date).getTime() >= Date.now()
  );

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

        .v-sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 30;
          display: flex;
          flex-direction: column;
          width: 246px;
          padding: 22px 13px;
          background: #12223a;
          color: #d9e4f3;
        }

        .v-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 10px 32px;
          color: white;
          text-decoration: none;
        }

        .v-logo {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: #119b6b;
        }

        .v-brand-name {
          font-size: 20px;
          font-weight: 850;
        }

        .v-brand-caption {
          margin-top: 3px;
          color: #a5b6c9;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .v-nav-title {
          padding: 0 13px;
          margin: 0 0 10px;
          color: #8195ae;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: 1px;
        }

        .v-nav {
          display: grid;
          gap: 7px;
        }

        .v-nav a {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 44px;
          padding: 0 13px;
          border-radius: 9px;
          color: #c1cddd;
          font-size: 12px;
          font-weight: 650;
          text-decoration: none;
          transition: background 0.2s;
        }

        .v-nav a:hover {
          background: #ffffff0c;
          color: white;
        }

        .v-nav a.active {
          background: #0d9669;
          color: white;
        }

        .v-sidebar-bottom {
          margin-top: auto;
          padding: 15px 8px 0;
          border-top: 1px solid #ffffff18;
        }

        .v-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
        }

        .v-avatar {
          display: grid;
          place-items: center;
          flex: none;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #d5e9df;
          color: #176748;
          font-size: 12px;
          font-weight: 800;
        }

        .v-user-name {
          color: white;
          font-size: 12px;
          font-weight: 750;
        }

        .v-user-role {
          margin-top: 3px;
          color: #9caec5;
          font-size: 10px;
        }

        .v-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        .v-topbar {
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

        .v-top-title {
          color: #607089;
          font-size: 12px;
        }

        .v-search {
          display: flex;
          align-items: center;
          gap: 9px;
          width: min(100%, 280px);
          height: 38px;
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

        .v-mobile-menu {
          display: none;
          place-items: center;
          width: 37px;
          height: 37px;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

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
          margin: 0;
          color: #293b52;
          font-size: 12px;
          font-weight: 800;
        }

        .v-category {
          display: inline-block;
          margin-top: 6px;
          font-size: 10px;
          font-weight: 700;
        }

        .v-event-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px 14px;
          margin-top: 8px;
          color: #8795a8;
          font-size: 10px;
        }

        .v-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .v-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 20px;
          background: #e5f8ef;
          color: #16855f;
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
        }

        .v-status.pending {
          background: #fff3dd;
          color: #ad7413;
        }

        .v-empty {
          padding: 32px 20px;
          text-align: center;
          color: #8795a8;
          font-size: 12px;
        }

        .v-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .v-tip {
          padding: 20px;
          background: linear-gradient(135deg, #e9fbf2, #f7fffb);
        }

        .v-tip-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border-radius: 12px;
          background: #d0f5e2;
          color: #0d9669;
        }

        .v-tip h3 {
          margin: 14px 0 7px;
          font-size: 14px;
        }

        .v-tip p {
          margin: 0;
          color: #687d77;
          font-size: 11px;
          line-height: 1.8;
        }

        .v-tip .v-primary {
          margin-top: 16px;
        }

        @media (max-width: 1000px) {
          .v-content {
            padding: 22px 18px;
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
        }

        @media (max-width: 760px) {
          .v-sidebar {
            transform: translateX(-100%);
            transition: transform 0.2s ease;
          }

          .v-sidebar.open {
            transform: translateX(0);
            box-shadow: 20px 0 60px #0d1b2d35;
          }

          .v-main {
            margin-left: 0;
          }

          .v-mobile-menu {
            display: grid;
            flex: none;
          }

          .v-topbar {
            padding: 12px 15px;
          }

          .v-top-title {
            display: none;
          }

          .v-content {
            padding: 22px 15px;
          }

          .v-welcome {
            align-items: flex-start;
            flex-direction: column;
          }

          .v-welcome h1 {
            font-size: 25px;
          }

          .v-stats {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .v-search {
            width: 100%;
            max-width: 210px;
          }

          .v-event {
            align-items: flex-start;
            flex-direction: column;
          }

          .v-event-action {
            padding-left: 57px;
          }

          .v-panel-head {
            padding: 16px;
          }
        }
      `}</style>

      <aside className={`v-sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link href="/volunteer/dashboard" className="v-brand">
          <div className="v-logo">
            <HandHeart size={23} color="white" />
          </div>
          <div>
            <div className="v-brand-name">UnityVol</div>
            <div className="v-brand-caption">COMMUNITY PLATFORM</div>
          </div>
        </Link>

        <p className="v-nav-title">VOLUNTEER MENU</p>

        <nav className="v-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.href === "/volunteer/dashboard" ? "active" : ""
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="v-sidebar-bottom">
          <Link
            href="/volunteer/profile"
            className="v-user"
            style={{ textDecoration: "none" }}
            onClick={() => setSidebarOpen(false)}
          >
            <div className="v-avatar">SA</div>
            <div>
              <div className="v-user-name">Sarah Ahmed</div>
              <div className="v-user-role">Volunteer</div>
            </div>
          </Link>
        </div>
      </aside>

      <main className="v-main">
        <header className="v-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
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

          <label className="v-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search upcoming events..."
              aria-label="Search upcoming events"
            />
          </label>
        </header>

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
              <div className="v-stat-number">{upcomingEvents.length}</div>
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
                {registeredEvents.filter(
                  (event) => event.status === "Confirmed"
                ).length}
              </div>
              <div className="v-stat-note">
                Registrations confirmed by organizers
              </div>
            </div>
          </div>

          <section className="v-panel">
            <div className="v-panel-head">
              <div>
                <h2 className="v-panel-title">Upcoming Opportunities</h2>
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
                        <h3 className="v-event-title">{event.title}</h3>
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
                          href={`/volunteer/events/${event.id}`}
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

          <div className="v-bottom-grid">
            <section className="v-panel">
              <div className="v-panel-head">
                <div>
                  <h2 className="v-panel-title">My Participation</h2>
                  <p className="v-panel-subtitle">
                    Keep track of your registrations.
                  </p>
                </div>
                <Link href="/volunteer/my-events" className="v-text-link">
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
