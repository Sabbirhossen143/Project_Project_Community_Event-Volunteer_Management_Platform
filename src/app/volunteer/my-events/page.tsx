
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VolunteerSidebar from "@/components/VolunteerSidebar";
import EventDetailsModal, {
  type EventDetailsData,
} from "@/components/EventDetailsModal";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  HandHeart,
  Search,
  Menu,
  X,
  CalendarCheck,
  CheckCircle2,
  ClockAlert,
  ClipboardList,
} from "lucide-react";

type MyEvent = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  description: string;
  color: string;
  textColor: string;
};

const initialMyEvents: MyEvent[] = [
  {
    id: 1,
    title: "Tree Plantation Drive",
    category: "Environment",
    date: "Nov 15, 2026",
    time: "9:00 AM",
    location: "Dhaka University",
    status: "Confirmed",
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
    status: "Pending",
    description:
      "Help people develop essential digital skills and become more confident with technology.",
    color: "#dbeafe",
    textColor: "#1d4ed8",
  },
  {
    id: 3,
    title: "Community Food Distribution",
    category: "Community",
    date: "Oct 10, 2026",
    time: "8:00 AM",
    location: "Uttara, Dhaka",
    status: "Confirmed",
    description:
      "Help organize food packages and distribute them to families in the community.",
    color: "#ffedd5",
    textColor: "#c2410c",
  },
];

const tabs = ["All Events", "Upcoming", "Completed", "Pending"];


export default function MyEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Events");
  const [todayStart, setTodayStart] = useState<number | null>(null);
  
const [myEvents, setMyEvents] =
  useState<MyEvent[]>(initialMyEvents);

const handleCancelRegistration = (eventId: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this registration?"
  );

  if (!confirmed) return;

  setMyEvents((currentEvents) =>
    currentEvents.map((event) =>
      event.id === eventId && event.status === "Pending"
        ? { ...event, status: "Cancelled" }
        : event
    )
  );
};

  const [selectedEvent, setSelectedEvent] =
  useState<EventDetailsData | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setTodayStart(today.getTime());
  }, []);

  const filteredEvents = myEvents.filter((event) => {
    const eventTime = new Date(event.date).getTime();

    const isUpcoming =
      todayStart === null ? true : eventTime >= todayStart;

    const matchesTab =
      activeTab === "All Events" ||
      (activeTab === "Upcoming" && isUpcoming) ||
      (activeTab === "Completed" &&
        todayStart !== null &&
        !isUpcoming) ||
      (activeTab === "Pending" && event.status === "Pending");

    const matchesSearch =
      `${event.title} ${event.category} ${event.location}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const confirmedCount = myEvents.filter(
    (event) => event.status === "Confirmed"
  ).length;

  const pendingCount = myEvents.filter(
    (event) => event.status === "Pending"
  ).length;

  const upcomingCount =
    todayStart === null
      ? 0
      : myEvents.filter(
          (event) => new Date(event.date).getTime() >= todayStart
        ).length;

  return (
    <div className="my-events-app">
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

        .me-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        .me-topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 68px;
          padding: 12px 28px;
          border-bottom: 1px solid #e7edf4;
          background: #ffffffed;
          backdrop-filter: blur(10px);
        }

        .me-mobile-menu {
          display: none;
          place-items: center;
          width: 37px;
          height: 37px;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

        .me-breadcrumb {
          color: #607089;
          font-size: 12px;
        }

        .me-content {
          max-width: 1500px;
          margin: 0 auto;
          padding: 28px;
        }

        .me-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 24px;
        }

        .me-eyebrow {
          margin: 0 0 8px;
          color: #119b6b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .me-heading h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.8px;
          font-weight: 700;
        }

        .me-subtitle {
          margin: 8px 0 0;
          color: #7c8ba0;
          font-size: 12px;
          line-height: 1.7;
        }

        .me-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 15px;
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

        .me-primary:hover {
          background: #087b56;
        }

        .me-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
          margin-bottom: 24px;
        }

        .me-stat {
          min-width: 0;
          padding: 19px;
          border: 1px solid #e7edf4;
          border-radius: 13px;
          background: white;
        }

        .me-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .me-stat-label {
          color: #7a8aa0;
          font-size: 11px;
          font-weight: 650;
        }

        .me-stat-icon {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #e5f8ef;
          color: #119b6b;
        }

        .me-stat-number {
          margin-top: 14px;
          font-size: 29px;
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .me-stat-note {
          margin-top: 6px;
          color: #8795a8;
          font-size: 10px;
        }

        .me-panel {
          overflow: hidden;
          border: 1px solid #e7edf4;
          border-radius: 13px;
          background: white;
        }

        .me-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 20px;
          border-bottom: 1px solid #f0f3f7;
        }

        .me-panel-title {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
        }

        .me-panel-subtitle {
          margin: 5px 0 0;
          color: #8795a8;
          font-size: 11px;
        }

        .me-search {
          display: flex;
          align-items: center;
          gap: 9px;
          width: min(100%, 280px);
          height: 39px;
          padding: 0 12px;
          border: 1px solid #e0e7f0;
          border-radius: 9px;
          background: #fbfcfe;
          color: #8795a8;
        }

        .me-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #17243b;
          font-size: 11px;
        }

        .me-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 17px 20px;
          border-bottom: 1px solid #f0f3f7;
        }

        .me-tab {
          padding: 9px 13px;
          border: 1px solid #e1e8f0;
          border-radius: 8px;
          background: white;
          color: #607089;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .me-tab.active {
          border-color: #0d9669;
          background: #0d9669;
          color: white;
        }

        .me-event {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 21px 20px;
          border-bottom: 1px solid #f0f3f7;
        }

        
.me-event-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.me-cancel {
  padding: 8px 11px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fff1f2;
  color: #be123c;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
}

.me-cancel:hover {
  background: #ffe4e6;
}

@media (max-width: 650px) {
  .me-event-actions {
    align-items: flex-start;
  }
}


        .me-event:last-child {
          border-bottom: 0;
        }

        .me-event-left {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          min-width: 0;
        }

        .me-event-icon {
          display: grid;
          flex: none;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
        }

        .me-event-info {
          min-width: 0;
        }

        .me-event-title {
          margin: 0;
          color: #293b52;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.5;
        }

        .me-event-category {
          display: inline-block;
          margin-top: 5px;
          font-size: 10px;
          font-weight: 750;
        }

        .me-event-description {
          margin: 8px 0 10px;
          color: #8795a8;
          font-size: 11px;
          line-height: 1.7;
        }

        .me-event-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 15px;
        }

        .me-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #7c8ba0;
          font-size: 10px;
        }

        .me-event-right {
          display: flex;
          flex: none;
          flex-direction: column;
          align-items: flex-end;
          gap: 15px;
        }

        .me-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 10px;
          border-radius: 20px;
          background: #dcfce7;
          color: #15803d;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .me-status.pending {
          background: #fef3c7;
          color: #a16207;
        }

        .me-status.cancelled {
          background: #fee2e2;
          color: #b91c1c;
        }

        .me-details {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #0d9669;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
        }

        .me-details:hover {
          color: #087b56;
        }

        .me-empty {
          padding: 50px 20px;
          color: #8795a8;
          text-align: center;
        }

        .me-empty h3 {
          margin: 12px 0 7px;
          color: #293b52;
          font-size: 15px;
        }

        .me-empty p {
          margin: 0;
          font-size: 12px;
          line-height: 1.7;
        }

        @media (max-width: 1100px) {
          .me-content {
            padding: 22px;
          }

          .me-event {
            align-items: flex-start;
          }
        }

        @media (max-width: 900px) {
          .me-main {
            margin-left: 0;
          }

          .me-mobile-menu {
            display: grid;
          }

          .me-topbar {
            padding: 12px 18px;
          }

          .me-content {
            padding: 22px 18px;
          }
        }

        @media (max-width: 650px) {
          .me-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .me-heading h1 {
            font-size: 24px;
          }

          .me-stats {
            grid-template-columns: 1fr;
          }

          .me-panel-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .me-search {
            width: 100%;
          }

          .me-event {
            flex-direction: column;
            gap: 15px;
          }

          .me-event-right {
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding-left: 62px;
          }

          .me-event-meta {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>

      <VolunteerSidebar
        activePage="My Events"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName="Sarah Ahmed"
        userRole="Volunteer"
        avatarText="SA"
      />

      <main className="me-main">
        <header className="me-topbar">
          <button
            type="button"
            className="me-mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <span className="me-breadcrumb">
            Volunteer Workspace / My Events
          </span>
        </header>

        <section className="me-content">
          <div className="me-heading">
            <div>
              <p className="me-eyebrow">Your volunteering journey</p>
              <h1>My Events</h1>
              <p className="me-subtitle">
                Manage your registrations and keep track of your
                volunteering activities.
              </p>
            </div>

            <Link href="/volunteer/events" className="me-primary">
              <HandHeart size={16} />
              Browse Events
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="me-stats">
            <div className="me-stat">
              <div className="me-stat-top">
                <span className="me-stat-label">Total Registrations</span>
                <div className="me-stat-icon">
                  <ClipboardList size={19} />
                </div>
              </div>
              <div className="me-stat-number">{myEvents.length}</div>
              <div className="me-stat-note">
                Events you have registered for
              </div>
            </div>

            <div className="me-stat">
              <div className="me-stat-top">
                <span className="me-stat-label">Upcoming Events</span>
                <div
                  className="me-stat-icon"
                  style={{ background: "#dbeafe", color: "#2563eb" }}
                >
                  <CalendarDays size={19} />
                </div>
              </div>
              <div className="me-stat-number">{upcomingCount}</div>
              <div className="me-stat-note">
                Events scheduled for the future
              </div>
            </div>

            <div className="me-stat">
              <div className="me-stat-top">
                <span className="me-stat-label">Confirmed</span>
                <div
                  className="me-stat-icon"
                  style={{ background: "#f3e8ff", color: "#7e22ce" }}
                >
                  <CheckCircle2 size={19} />
                </div>
              </div>
              <div className="me-stat-number">{confirmedCount}</div>
              <div className="me-stat-note">
                {pendingCount} registration(s) awaiting approval
              </div>
            </div>
          </div>

          <section className="me-panel">
            <div className="me-panel-head">
              <div>
                <h2 className="me-panel-title">Your Registrations</h2>
                <p className="me-panel-subtitle">
                  View your events and registration status.
                </p>
              </div>

              <label className="me-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search my events..."
                  aria-label="Search my events"
                />
              </label>
            </div>

            <div className="me-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`me-tab ${
                    activeTab === tab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <article className="me-event" key={event.id}>
                    <div className="me-event-left">
                      <div
                        className="me-event-icon"
                        style={{
                          background: event.color,
                          color: event.textColor,
                        }}
                      >
                        <HandHeart size={22} />
                      </div>

                      <div className="me-event-info">
                        <h3 className="me-event-title">
                          {event.title}
                        </h3>

                        <span
                          className="me-event-category"
                          style={{ color: event.textColor }}
                        >
                          {event.category}
                        </span>

                        <p className="me-event-description">
                          {event.description}
                        </p>

                        <div className="me-event-meta">
                          <span className="me-meta-item">
                            <CalendarDays size={13} />
                            {event.date}
                          </span>

                          <span className="me-meta-item">
                            <Clock3 size={13} />
                            {event.time}
                          </span>

                          <span className="me-meta-item">
                            <MapPin size={13} />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="me-event-right">
                      <span
                        className={`me-status ${
                          event.status === "Pending"
                            ? "pending"
                            : event.status === "Cancelled"
                              ? "cancelled"
                              : ""
                        }`}
                      >
                        {event.status === "Confirmed" ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <ClockAlert size={12} />
                        )}
                        {event.status}
                      </span>

                      
<div className="me-event-actions">
  <button
    type="button"
    onClick={() => setSelectedEvent(event)}
    className="me-details"
  >
    View Details
  </button>

  {event.status === "Pending" && (
    <button
      type="button"
      onClick={() => handleCancelRegistration(event.id)}
      className="me-cancel"
    >
      Cancel Registration
    </button>
  )}
</div>

                    </div>
                  </article>
                ))
              ) : (
                <div className="me-empty">
                  <CalendarCheck size={30} />
                  <h3>No events found</h3>
                  <p>
                    There are no registrations matching this filter.
                    Try another tab or search term.
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>
      </main>
      <EventDetailsModal
  event={selectedEvent}
  onClose={() => setSelectedEvent(null)}
/>
    </div>
  );
}
