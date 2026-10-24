
"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import VolunteerSidebar from "@/components/VolunteerSidebar";
import VolunteerAIChat from "@/components/volunteer/VolunteerAIChat";
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
  QrCode,
} from "lucide-react";

type MyEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  status: "Confirmed" | "Pending" | "Rejected" | "Cancelled";
  description: string;
  color: string;
  textColor: string;
};

const tabs = ["All Events", "Upcoming", "Completed", "Pending"];


export default function MyEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Events");
  const [todayStart, setTodayStart] = useState<number | null>(null);
  
const [myEvents, setMyEvents] = useState<MyEvent[]>([]);
const [loading, setLoading] = useState(true);
const [cancelEventId, setCancelEventId] = useState<string | null>(null);
const [cancelling, setCancelling] = useState(false);
const [error, setError] = useState("");


const handleCancelRegistration = async () => {
  if (!cancelEventId) return;

  try {
    setCancelling(true);

    const response = await fetch("/api/my-registrations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId: cancelEventId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not cancel registration.");
    }

    setMyEvents((events) =>
      events.map((event) =>
        event.id === cancelEventId
          ? { ...event, status: "Cancelled" }
          : event
      )
    );

    setCancelEventId(null);
  } catch (err) {
    window.alert(
      err instanceof Error ? err.message : "Cancellation failed."
    );
  } finally {
    setCancelling(false);
  }
};

  const [selectedEvent, setSelectedEvent] =
  useState<EventDetailsData | null>(null);

  const [selectedQrEvent, setSelectedQrEvent] =
  useState<MyEvent | null>(null);

  useEffect(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  setTodayStart(today.getTime());

  async function loadMyEvents() {
    try {
      setError("");

      const response = await fetch("/api/my-registrations", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load registrations.");
      }

      const colors = [
        ["#dcfce7", "#15803d"],
        ["#dbeafe", "#1d4ed8"],
        ["#ffedd5", "#c2410c"],
        ["#f3e8ff", "#7e22ce"],
      ];

      const mapped: MyEvent[] = (data.registrations ?? []).map(
        (r: {
          _id: string;
          title: string;
          category: string;
          date?: string;
          time: string;
          location: string;
          description: string;
          status: "Pending" | "Confirmed" | "Rejected" | "Cancelled";
        }, index: number) => {
          const colorPair = colors[index % colors.length];

          return {
            id: r._id,
            title: r.title,
            category: r.category,
            date: r.date
              ? new Date(r.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "Date not specified",
            time: r.time || "Time not specified",
            location: r.location || "Location not specified",
            description: r.description || "Event registration",
            status: r.status,
            color: colorPair[0],
            textColor: colorPair[1],
          };
        }
      );

      setMyEvents(mapped);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load events."
      );
    } finally {
      setLoading(false);
    }
  }

  loadMyEvents();

const intervalId = window.setInterval(() => {
  loadMyEvents();
}, 5000);

return () => window.clearInterval(intervalId);
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

        .me-status.rejected {
          background: #fee2e2;
          color: #b91c1c;
        }

        .me-status.cancelled {
  background: #f1f5f9;
  color: #475569;
}

        .me-status-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.me-qr-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 10px;
  border: 1px solid #bbf7d0;
  border-radius: 9px;
  background: #f0fdf4;
  color: #15803d;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.me-qr-button:hover {
  background: #dcfce7;
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
  {loading ? (
    <div className="me-empty">Loading your registrations...</div>
  ) : error ? (
    <div className="me-empty">{error}</div>
  ) : filteredEvents.length > 0 ? (
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
  {event.description.split(/(?<=[.!?])\s+/)[0]}
  {event.description.split(/(?<=[.!?])\s+/).length > 1 && "..."}
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
  <div className="me-status-actions">
    {event.status === "Confirmed" && (
      <button
        type="button"
        className="me-qr-button"
        onClick={() => setSelectedQrEvent(event)}
      >
        <QrCode size={15} />
        QR Code
      </button>
    )}

    <span
      className={`me-status ${
  event.status === "Pending"
    ? "pending"
    : event.status === "Rejected"
      ? "rejected"
      : event.status === "Cancelled"
        ? "cancelled"
        : ""
}`}
    >
      {event.status === "Confirmed" ? (
  <CheckCircle2 size={12} />
) : event.status === "Rejected" ||
  event.status === "Cancelled" ? (
  <X size={12} />
) : (
  <ClockAlert size={12} />
)}

{event.status}
    </span>
  </div>

                    
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
    onClick={() => setCancelEventId(event.id)}
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

      <VolunteerAIChat />

      <EventDetailsModal
  event={
    selectedEvent
      ? { ...selectedEvent, id: selectedEvent.id }
      : null
  }
  onClose={() => setSelectedEvent(null)}
/>

      {selectedQrEvent && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/60 p-2 backdrop-blur-sm sm:p-4"
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        setSelectedQrEvent(null);
      }
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      className="relative my-auto w-full max-w-[320px] rounded-2xl bg-white p-4 text-center shadow-2xl sm:max-w-md sm:p-8"
    >
      <button
        type="button"
        onClick={() => setSelectedQrEvent(null)}
        aria-label="Close QR code"
        className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
      >
        <X size={20} />
      </button>

      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        <QrCode size={30} />
      </div>

      <h2 className="text-lg font-extrabold text-slate-900 sm:text-2xl">
        Your Registration QR Code
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Keep this QR code for your event registration.
      </p>

      <div className="mx-auto mt-4 flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white p-2 sm:mt-6 sm:rounded-2xl sm:p-4">
        <QRCodeSVG
          value={JSON.stringify({
            registrationId: `UV-REG-${selectedQrEvent.id}`,
            eventName: selectedQrEvent.title,
            date: selectedQrEvent.date,
            location: selectedQrEvent.location,
          })}
          size={180}
          level="H"
          includeMargin
        />
      </div>

      <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 text-left">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            Event Name
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {selectedQrEvent.title}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500">
            Registration ID
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-emerald-700">
            UV-REG-{selectedQrEvent.id}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="mt-5 w-full rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
      >
        Print / Save QR Code
      </button>

      <button
        type="button"
        onClick={() => setSelectedQrEvent(null)}
        className="mt-3 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
      >
        Close
      </button>
    </div>
  </div>
)}
{cancelEventId && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
    <div
      role="dialog"
      aria-modal="true"
      className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600">
        <X size={24} />
      </div>

      <h2 className="text-center text-xl font-bold text-slate-900">
        Cancel Registration?
      </h2>

      <p className="mt-2 text-center text-sm leading-6 text-slate-500">
        Are you sure you want to cancel this registration? This action
        cannot be undone.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={cancelling}
          onClick={() => setCancelEventId(null)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 disabled:opacity-50"
        >
          Keep Registration
        </button>

        <button
          type="button"
          disabled={cancelling}
          onClick={handleCancelRegistration}
          className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {cancelling ? "Cancelling..." : "Yes, Cancel"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
