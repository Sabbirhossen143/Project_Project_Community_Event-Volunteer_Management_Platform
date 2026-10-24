"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import VolunteerSidebar from "@/components/VolunteerSidebar";
import VolunteerAIChat from "@/components/volunteer/VolunteerAIChat";
import {
  Menu,
  X,
  Search,
  Clock3,
  CalendarDays,
  MapPin,
  CheckCircle2,
  CalendarCheck,
  HandHeart,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  History,
  Award,
} from "lucide-react";

type Activity = {
  id: string;
  title: string;
  category: string;
  date: string;
  hours: number;
  location: string;
  status: "Completed" | "Upcoming" | "Pending" | "Rejected";
  description: string;
};

function getStatusClass(status: Activity["status"]) {
  return `ah-status ${status.toLowerCase()}`;
}

export default function ActivityHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [search, setSearch] = useState("");
const [filter, setFilter] = useState("All");
const [filterOpen, setFilterOpen] = useState(false);
const [selectedActivity, setSelectedActivity] =
  useState<Activity | null>(null);

const [activities, setActivities] = useState<Activity[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const { status: sessionStatus } = useSession();

useEffect(() => {
  if (sessionStatus === "loading") return;

  if (sessionStatus === "unauthenticated") {
    setActivities([]);
    setLoading(false);
    setError("Please log in to view your activity history.");
    return;
  }

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/my-registrations", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load activities.");
      }

      const registrations = Array.isArray(data)
        ? data
        : data.registrations ?? data.events ?? [];

      const formattedActivities: Activity[] = registrations.map(
        (item: any) => {
          const event = item.event ?? item.eventInfo ?? item;

          const rawStatus = String(
            item.status ?? item.registrationStatus ?? "Pending"
          ).toLowerCase();

          const eventDate = event.date ?? item.date ?? "";
          const parsedDate = new Date(eventDate);

          let activityStatus: Activity["status"] = "Pending";

if (["completed", "attended"].includes(rawStatus)) {
  activityStatus = "Completed";
} else if (["confirmed", "approved", "accepted"].includes(rawStatus)) {
  activityStatus = "Upcoming";
} else if (["rejected", "declined", "cancelled", "canceled"].includes(rawStatus)) {
  activityStatus = "Rejected";
}

          return {
            id: String(item._id ?? item.id ?? item.registrationId),
            title: event.title ?? item.eventName ?? "Untitled Event",
            category: event.category ?? "Community",
            date: eventDate
              ? new Date(eventDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "Date not specified",
            hours: Number(event.hours ?? item.hours ?? 0),
            location: event.location ?? item.location ?? "Not specified",
            status: activityStatus,
            description:
              event.description ?? item.description ??
              "No activity description available.",
          };
        }
      );

      setActivities(formattedActivities);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchActivities();
}, [sessionStatus]);

const completedActivities = activities.filter(
  (activity) => activity.status === "Completed"
);

const totalHours = completedActivities.reduce(
  (total, activity) => total + activity.hours,
  0
);

const filteredActivities = activities.filter((activity) => {
  const matchesSearch =
    `${activity.title} ${activity.category} ${activity.location}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesFilter =
    filter === "All" || activity.status === filter;

  return matchesSearch && matchesFilter;
});

  return (
    <div className="activity-app">
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
        select {
          font: inherit;
        }

        .ah-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        /* TOP NAVBAR */
        .ah-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 68px;
          padding: 12px 28px;
          background: #ffffffed;
          border-bottom: 1px solid #e7edf4;
          backdrop-filter: blur(10px);
        }

        .ah-top-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ah-breadcrumb {
          color: #7b8ba1;
          font-size: 12px;
        }

        .ah-mobile-menu {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e1e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
        }

        .ah-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ah-avatar {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #dceafe;
          color: #26578d;
          font-size: 12px;
          font-weight: 800;
        }

        .ah-profile-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .ah-profile-info strong {
          font-size: 12px;
        }

        .ah-profile-info small {
          color: #8795a8;
          font-size: 10px;
        }

        /* PAGE CONTENT */
        .ah-content {
          max-width: 1500px;
          margin: 0 auto;
          padding: 28px;
        }

        .ah-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 25px;
        }

        .ah-eyebrow {
          margin: 0 0 8px;
          color: #0d9669;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .ah-heading h1 {
          margin: 0;
          color: #17243b;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.8px;
        }

        .ah-description {
          margin: 9px 0 0;
          color: #8190a4;
          font-size: 12px;
          line-height: 1.7;
        }

        .ah-back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 13px;
          border: 1px solid #e0e7ef;
          border-radius: 9px;
          background: white;
          color: #40516a;
          font-size: 11px;
          font-weight: 750;
          text-decoration: none;
          white-space: nowrap;
        }

        .ah-back-link:hover {
          border-color: #0d9669;
          color: #0d9669;
        }

        /* SUMMARY CARDS */
        .ah-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 25px;
        }

        .ah-stat {
          padding: 20px;
          border: 1px solid #e7edf4;
          border-radius: 13px;
          background: white;
          box-shadow: 0 3px 10px #243b5305;
        }

        .ah-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .ah-stat-label {
          color: #7a8aa0;
          font-size: 11px;
          font-weight: 650;
        }

        .ah-stat-icon {
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          border-radius: 11px;
          background: #dcfce7;
          color: #15803d;
        }

        .ah-stat-number {
          margin-top: 13px;
          font-size: 29px;
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .ah-stat-note {
          margin-top: 6px;
          color: #8795a8;
          font-size: 10px;
        }

        /* HISTORY PANEL */
        .ah-panel {
          overflow: hidden;
          border: 1px solid #e7edf4;
          border-radius: 13px;
          background: white;
          box-shadow: 0 3px 10px #243b5305;
        }

        .ah-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 21px;
          border-bottom: 1px solid #edf1f6;
        }

        .ah-panel-header h2 {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
        }

        .ah-panel-header p {
          margin: 6px 0 0;
          color: #8795a8;
          font-size: 11px;
        }

        .ah-filters {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 17px 21px;
          border-bottom: 1px solid #edf1f6;
        }

        .ah-search {
          display: flex;
          align-items: center;
          gap: 9px;
          flex: 1;
          max-width: 330px;
          height: 39px;
          padding: 0 12px;
          border: 1px solid #e0e7f0;
          border-radius: 9px;
          background: #fbfcfe;
          color: #8795a8;
        }

        .ah-search input {
          width: 100%;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: #17243b;
          font-size: 11px;
        }
        
        .ah-search:focus-within {
  border-color: #0d9669;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(13, 150, 105, 0.12);
  transition: all 0.2s ease;
}

.ah-search input:focus {
  outline: none;
  box-shadow: none;
}

       
.ah-filter-wrap {
  position: relative;
  flex-shrink: 0;
}

.ah-filter-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  min-width: 190px;
  height: 48px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  color: #17243b;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.ah-filter-select:hover,
.ah-filter-select:focus-visible {
  border-color: #0d9669;
  outline: none;
  box-shadow: 0 0 0 3px rgba(13, 150, 105, 0.1);
}

.ah-filter-label {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 12px;
  font-weight: 650;
}

.ah-filter-caption {
  color: #94a3b8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.ah-filter-arrow {
  color: #64748b;
  transition: transform 0.2s ease;
}

.ah-filter-arrow.open {
  transform: rotate(180deg);
}

.ah-filter-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 50;
  width: 100%;
  min-width: 190px;
  padding: 6px;
  border: 1px solid #e8eef3;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  animation: ah-dropdown-in 0.16s ease-out;
}

.ah-filter-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 11px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #475569;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.ah-filter-option:hover {
  background: #f0fdf7;
  color: #087f5b;
}

.ah-filter-option.active {
  background: #eaf8f1;
  color: #087f5b;
  font-weight: 700;
}

.ah-filter-option.active svg {
  color: #0d9669;
}

@keyframes ah-dropdown-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


        /* ACTIVITY ROWS */
        .ah-activity {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding: 20px 21px;
          border-bottom: 1px solid #edf1f6;
          transition: background 0.2s;
        }

        .ah-activity:last-child {
          border-bottom: none;
        }

        .ah-activity:hover {
          background: #fbfdfc;
        }

        .ah-activity-main {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          min-width: 0;
        }

        .ah-activity-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 43px;
          height: 43px;
          border-radius: 11px;
          background: #e5f8ef;
          color: #0d9669;
        }

        .ah-activity-details {
          min-width: 0;
        }

        .ah-activity-details h3 {
          margin: 1px 0 6px;
          color: #293b52;
          font-size: 13px;
          font-weight: 800;
        }

        .ah-category {
          color: #0d9669;
          font-size: 10px;
          font-weight: 750;
        }

        .ah-activity-description {
          margin: 9px 0 10px;
          color: #7c8ba0;
          font-size: 11px;
          line-height: 1.7;
        }

        .ah-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 14px;
        }

        .ah-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #8795a8;
          font-size: 10px;
        }

        .ah-activity-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          flex-shrink: 0;
        }

        .ah-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
        }

        .ah-status.completed {
          background: #dcfce7;
          color: #15803d;
        }

        .ah-status.upcoming {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .ah-status.pending {
          background: #fef3c7;
          color: #a16207;
        }

        .ah-hours {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #617189;
          font-size: 11px;
          font-weight: 750;
        }

        .ah-details-button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 10px;
          border: 1px solid #dce6e1;
          border-radius: 7px;
          background: white;
          color: #0d9669;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
        }

        .ah-details-button:hover {
          background: #f0fdf4;
        }

        .ah-empty {
          padding: 45px 20px;
          color: #8795a8;
          text-align: center;
          font-size: 12px;
        }

        .ah-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 16px 21px;
          border-top: 1px solid #edf1f6;
          color: #8795a8;
          font-size: 10px;
        }

        /* ACTIVITY DETAILS MODAL */
        .ah-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #15223870;
        }

        .ah-modal {
          width: 100%;
          max-width: 430px;
          padding: 24px;
          border-radius: 15px;
          background: white;
          box-shadow: 0 20px 60px #15223830;
        }

        .ah-modal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .ah-modal-top h2 {
          margin: 0;
          font-size: 18px;
        }

        .ah-modal-close {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 1px solid #e7edf4;
          border-radius: 8px;
          background: white;
          cursor: pointer;
        }

        .ah-modal-description {
          color: #718096;
          font-size: 12px;
          line-height: 1.8;
        }

        .ah-modal-info {
          display: grid;
          gap: 13px;
          margin: 20px 0;
        }

        .ah-modal-info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #40516a;
          font-size: 12px;
        }

        .ah-modal-info-item svg {
          color: #0d9669;
        }

        .ah-modal-done {
          width: 100%;
          padding: 11px;
          border: none;
          border-radius: 8px;
          background: #0d9669;
          color: white;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .ah-main {
            margin-left: 0;
          }

          .ah-mobile-menu {
            display: flex;
          }

          .ah-content {
            padding: 22px;
          }
        }

        @media (max-width: 650px) {
          .ah-topbar {
            padding: 12px 16px;
          }

          .ah-profile-info {
            display: none;
          }

          .ah-content {
            padding: 18px 14px;
          }

          .ah-heading {
            flex-direction: column;
          }

          .ah-heading h1 {
            font-size: 23px;
          }

          .ah-stats {
            grid-template-columns: 1fr;
            gap: 11px;
          }

          .ah-stat {
            padding: 16px;
          }

          .ah-filters {
            align-items: stretch;
            flex-direction: column;
          }

          .ah-search {
            max-width: none;
          }

          .ah-filter-select {
            justify-content: space-between;
          }

          .ah-filter-select select {
            flex: 1;
          }

          .ah-activity {
            flex-direction: column;
          }

          .ah-activity-right {
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding-left: 56px;
          }

          .ah-panel-header {
            padding: 16px;
          }

          .ah-footer {
            align-items: flex-start;
            flex-direction: column;
            padding: 14px 16px;
          }
        }
      `}</style>

      <VolunteerSidebar
        activePage="Activity History"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName="Sarah Ahmed"
        userRole="Volunteer"
        avatarText="SA"
      />

      <main className="ah-main">
        {/* TOP NAVBAR */}
        <header className="ah-topbar">
          <div className="ah-top-left">
            <button
              type="button"
              className="ah-mobile-menu"
              aria-label="Toggle navigation"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <span className="ah-breadcrumb">
              Volunteer Workspace / Activity History
            </span>
          </div>

          <div className="ah-profile">
            <div className="ah-avatar">SA</div>

            <div className="ah-profile-info">
              <strong>Sarah Ahmed</strong>
              <small>Volunteer</small>
            </div>
          </div>
        </header>

        <section className="ah-content">
          {/* PAGE HEADING */}
          <div className="ah-heading">
            <div>
              <p className="ah-eyebrow">Your volunteering journey</p>
              <h1>Activity History</h1>
              <p className="ah-description">
                Track your volunteering activities, participation status,
                and the time you have contributed to your community.
              </p>
            </div>

            <Link
              href="/volunteer/dashboard"
              className="ah-back-link"
            >
              <ArrowRight
                size={14}
                style={{ transform: "rotate(180deg)" }}
              />
              Back to Dashboard
            </Link>
          </div>

          {/* SUMMARY CARDS */}
          <div className="ah-stats">
            <div className="ah-stat">
              <div className="ah-stat-top">
                <span className="ah-stat-label">
                  Completed Activities
                </span>

                <div className="ah-stat-icon">
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="ah-stat-number">
                {completedActivities.length}
              </div>

              <div className="ah-stat-note">
                Activities successfully completed
              </div>
            </div>

            <div className="ah-stat">
              <div className="ah-stat-top">
                <span className="ah-stat-label">
                  Total Volunteer Hours
                </span>

                <div
                  className="ah-stat-icon"
                  style={{
                    background: "#dbeafe",
                    color: "#2563eb",
                  }}
                >
                  <Clock3 size={20} />
                </div>
              </div>

              <div className="ah-stat-number">{totalHours}</div>

              <div className="ah-stat-note">
                Hours from completed activities
              </div>
            </div>

            <div className="ah-stat">
              <div className="ah-stat-top">
                <span className="ah-stat-label">
                  Upcoming Activities
                </span>

                <div
                  className="ah-stat-icon"
                  style={{
                    background: "#f3e8ff",
                    color: "#7e22ce",
                  }}
                >
                  <CalendarCheck size={20} />
                </div>
              </div>

              <div className="ah-stat-number">
  {activities.filter(
    (activity) => activity.status === "Upcoming"
  ).length}
</div>

              <div className="ah-stat-note">
                Activities scheduled for you
              </div>
            </div>
          </div>

          {/* ACTIVITY HISTORY */}
          <section className="ah-panel">
            <div className="ah-panel-header">
              <div>
                <h2>All Activities</h2>
                <p>
                  Review your completed, upcoming, and pending activities.
                </p>
              </div>

              <History size={21} color="#0d9669" />
            </div>

            {/* SEARCH + FILTER */}
            <div className="ah-filters">
              <label className="ah-search">
                <Search size={16} />

                <input
                  type="text"
                  placeholder="Search activities..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              
<div className="ah-filter-wrap">
  <button
    type="button"
    className="ah-filter-select"
    onClick={() => setFilterOpen((open) => !open)}
    aria-expanded={filterOpen}
  >
    <span className="ah-filter-label">
      <span>{filter === "All" ? "All Activities" : filter}</span>
    </span>
    <ChevronDown
      size={16}
      className={`ah-filter-arrow ${filterOpen ? "open" : ""}`}
    />
  </button>

  {filterOpen && (
    <div className="ah-filter-menu">
      {[
        { value: "All", label: "All Activities" },
        { value: "Completed", label: "Completed" },
        { value: "Upcoming", label: "Upcoming" },
        { value: "Pending", label: "Pending" },
      ].map((option) => (
        <button
          type="button"
          key={option.value}
          className={`ah-filter-option ${
            filter === option.value ? "active" : ""
          }`}
          onClick={() => {
            setFilter(option.value);
            setFilterOpen(false);
          }}
        >
          <span>{option.label}</span>
          {filter === option.value && (
            <CheckCircle2 size={16} />
          )}
        </button>
      ))}
    </div>
  )}
</div>

            </div>

            {/* ACTIVITY LIST */}
<div>
  {loading ? (
    <div className="ah-empty">Loading activity history...</div>
  ) : error ? (
    <div className="ah-empty" style={{ color: "#dc2626" }}>
      {error}
    </div>
  ) : filteredActivities.length > 0 ? (
    filteredActivities.map((activity) => (
        <article className="ah-activity" key={activity.id}>
  <div className="ah-activity-main">
    <div className="ah-activity-icon">
      {activity.status === "Completed" ? (
        <CheckCircle2 size={21} />
      ) : activity.status === "Upcoming" ? (
        <CalendarDays size={21} />
      ) : (
        <Clock3 size={21} />
      )}
    </div>

    <div className="ah-activity-details">
      <h3>{activity.title}</h3>

      <span className="ah-category">{activity.category}</span>

      <p className="ah-activity-description">
        {activity.description}
      </p>

      <div className="ah-meta">
        <span className="ah-meta-item">
          <CalendarDays size={13} />
          {activity.date}
        </span>

        <span className="ah-meta-item">
          <MapPin size={13} />
          {activity.location}
        </span>
      </div>
    </div>
  </div>

  <div className="ah-activity-right">
    <span className={getStatusClass(activity.status)}>
      {activity.status === "Completed" ? (
        <CheckCircle2 size={12} />
      ) : (
        <Clock3 size={12} />
      )}
      {activity.status}
    </span>

    <span className="ah-hours">
      <Clock3 size={13} />
      {activity.hours} hours
    </span>

    <button
      type="button"
      className="ah-details-button"
      onClick={() => setSelectedActivity(activity)}
    >
      Details <ArrowRight size={12} />
    </button>
  </div>
</article>
    ))
  ) : (
    <div className="ah-empty">
      No activities found. Try changing your search or filter.
    </div>
  )}
</div>

            <div className="ah-footer">
              <span>
                Showing {filteredActivities.length} of {activities.length}{" "}
                activities
              </span>

              <span>
                <Award
                  size={13}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: 5,
                  }}
                />
                Every hour makes a difference!
              </span>
            </div>
          </section>
        </section>
      </main>

      <VolunteerAIChat />

      {/* ACTIVITY DETAILS MODAL */}
      {selectedActivity && (
        <div
          className="ah-modal-overlay"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="ah-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ah-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ah-modal-top">
              <h2 id="ah-modal-title">Activity Details</h2>

              <button
                type="button"
                className="ah-modal-close"
                aria-label="Close activity details"
                onClick={() => setSelectedActivity(null)}
              >
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: 15, marginBottom: 8 }}>
              {selectedActivity.title}
            </h3>

            <p className="ah-modal-description">
              {selectedActivity.description}
            </p>

            <div className="ah-modal-info">
              <div className="ah-modal-info-item">
                <CalendarDays size={17} />
                {selectedActivity.date}
              </div>

              <div className="ah-modal-info-item">
                <MapPin size={17} />
                {selectedActivity.location}
              </div>

              <div className="ah-modal-info-item">
                <Clock3 size={17} />
                {selectedActivity.hours} volunteer hours
              </div>

              <div className="ah-modal-info-item">
                <CheckCircle2 size={17} />
                Status: {selectedActivity.status}
              </div>
            </div>

            <button
              type="button"
              className="ah-modal-done"
              onClick={() => setSelectedActivity(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
    </div>
    
  );
  
}