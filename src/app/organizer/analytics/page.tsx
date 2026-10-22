"use client";

import OrganizerSidebar from "@/components/OrganizerSidebar";
import OrganizerAIChat from "@/components/Organizer/OrganizerAIChat";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Users,
  Menu,
  TrendingUp,
  UserCheck,
  Clock,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react";

const monthlyData = [
  { month: "May", volunteers: 35, events: 8 },
  { month: "Jun", volunteers: 48, events: 12 },
  { month: "Jul", volunteers: 42, events: 10 },
  { month: "Aug", volunteers: 65, events: 15 },
  { month: "Sep", volunteers: 58, events: 13 },
  { month: "Oct", volunteers: 82, events: 19 },
  { month: "Nov", volunteers: 72, events: 17 },
  { month: "Dec", volunteers: 96, events: 23 },
];

const categoryData = [
  { name: "Environment", count: 35, color: "#10b981" },
  { name: "Education", count: 25, color: "#3b82f6" },
  { name: "Community", count: 22, color: "#f59e0b" },
  { name: "Healthcare", count: 18, color: "#a78bfa" },
];

const eventPerformance = [
  {
    id: 1,
    name: "Community Clean-up",
    category: "Environment",
    date: "Oct 25, 2026",
    volunteers: 48,
    capacity: 60,
    status: "Upcoming",
  },
  {
    id: 2,
    name: "Tree Plantation Drive",
    category: "Environment",
    date: "Nov 15, 2026",
    volunteers: 72,
    capacity: 80,
    status: "Upcoming",
  },
  {
    id: 3,
    name: "Cloth Donation Drive",
    category: "Community",
    date: "Dec 05, 2026",
    volunteers: 35,
    capacity: 50,
    status: "Upcoming",
  },
  {
    id: 4,
    name: "Free Education Workshop",
    category: "Education",
    date: "Oct 10, 2026",
    volunteers: 56,
    capacity: 60,
    status: "Completed",
  },
  {
    id: 5,
    name: "Health Awareness Camp",
    category: "Healthcare",
    date: "Sep 20, 2026",
    volunteers: 42,
    capacity: 50,
    status: "Completed",
  },
];

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("8 months");

  const totalVolunteers = 428;
  const totalEvents = 24;
  const confirmedVolunteers = 356;
  const pendingVolunteers = 72;

  const filteredEvents = useMemo(() => {
    return eventPerformance.filter((event) =>
      event.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const maxVolunteers = Math.max(
    ...monthlyData.map((item) => item.volunteers)
  );

  const totalCategoryCount = categoryData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const handleExport = () => {
    const header = [
      "Event",
      "Category",
      "Date",
      "Volunteers",
      "Capacity",
      "Status",
    ];

    const rows = eventPerformance.map((event) => [
      event.name,
      event.category,
      event.date,
      event.volunteers,
      event.capacity,
      event.status,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "unityvol-analytics.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-page">
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

        button {
          cursor: pointer;
        }

        .analytics-page {
          min-height: 100vh;
        }

        .main-content {
          min-height: 100vh;
          margin-left: 246px;
          padding: 28px 32px 35px;
        }

        .topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
        }

        .breadcrumb {
          margin-bottom: 7px;
          color: #8190a5;
          font-size: 11px;
          line-height: 1.4;
        }

        .breadcrumb span {
          color: #119b6b;
          font-weight: 700;
        }

        /* Heading design matched with the other organizer pages */
        .page-title {
          margin: 0;
          color: #17243b;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.7px;
          line-height: 1.25;
        }

        .page-subtitle {
          margin: 7px 0 0;
          color: #7c8ba0;
          font-size: 12px;
          line-height: 1.6;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .export-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 15px;
          border: 1px solid #dce5ee;
          border-radius: 9px;
          background: white;
          color: #33465f;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .export-button:hover {
          border-color: #119b6b;
          color: #087b56;
        }

        .mobile-menu {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid #dce5ee;
          border-radius: 9px;
          background: white;
          color: #33465f;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .stat-card {
          min-width: 0;
          padding: 19px;
          border: 1px solid #e8edf3;
          border-radius: 14px;
          background: white;
          box-shadow: 0 3px 10px #192e4706;
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .stat-label {
          color: #77869a;
          font-size: 11px;
          font-weight: 650;
        }

        .stat-icon {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          border-radius: 10px;
        }

        .stat-icon.green {
          background: #e2f8ee;
          color: #0c9a69;
        }

        .stat-icon.blue {
          background: #e8f1ff;
          color: #3975dd;
        }

        .stat-icon.orange {
          background: #fff2df;
          color: #e79520;
        }

        .stat-icon.purple {
          background: #f1eaff;
          color: #8b5be3;
        }

        .stat-value {
          margin-top: 14px;
          color: #17243b;
          font-size: clamp(24px, 2.4vw, 31px);
          font-weight: 850;
          letter-spacing: -1px;
        }

        .stat-foot {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 9px;
          color: #8b99ab;
          font-size: 10px;
        }

        .trend-up {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #0a9a69;
          font-weight: 800;
        }

        .trend-down {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #d97706;
          font-weight: 800;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(280px, 1fr);
          gap: 20px;
          margin-bottom: 22px;
        }

        .panel {
          min-width: 0;
          padding: 22px;
          border: 1px solid #e8edf3;
          border-radius: 14px;
          background: white;
          box-shadow: 0 3px 10px #192e4706;
        }

        .panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .panel-title {
          margin: 0;
          color: #17243b;
          font-size: 15px;
          font-weight: 800;
        }

        .panel-description {
          margin: 6px 0 0;
          color: #8997a9;
          font-size: 11px;
          line-height: 1.5;
        }

        .period-select {
          min-height: 34px;
          max-width: 125px;
          padding: 0 9px;
          border: 1px solid #e1e8f0;
          border-radius: 8px;
          outline: none;
          background: white;
          color: #52667f;
          font-size: 10px;
        }

        .chart-area {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          height: 235px;
          margin-top: 26px;
          padding: 0 4px;
          border-bottom: 1px solid #e8edf3;
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 57px,
            #eef2f7 58px,
            transparent 59px
          );
        }

        .chart-column {
          display: flex;
          flex: 1;
          min-width: 0;
          height: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .bar-value {
          color: #718198;
          font-size: 10px;
          font-weight: 700;
        }

        .bar {
          width: min(100%, 32px);
          min-height: 5px;
          border-radius: 7px 7px 2px 2px;
          background: linear-gradient(180deg, #24c58b, #0d9669);
          transition: height 0.3s ease;
        }

        .bar:hover {
          background: linear-gradient(180deg, #62e8b6, #087b56);
        }

        .bar-label {
          margin-bottom: -25px;
          color: #8795a7;
          font-size: 10px;
        }

        .chart-legend {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 34px;
          color: #8795a7;
          font-size: 10px;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 3px;
          background: #10b981;
        }

        .category-list {
          display: grid;
          gap: 21px;
          margin-top: 27px;
        }

        .category-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 9px;
        }

        .category-name {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #52647b;
          font-size: 11px;
          font-weight: 650;
        }

        .category-dot {
          width: 9px;
          height: 9px;
          flex-shrink: 0;
          border-radius: 3px;
        }

        .category-count {
          color: #263950;
          font-size: 11px;
          font-weight: 800;
        }

        .progress-track {
          height: 7px;
          overflow: hidden;
          border-radius: 20px;
          background: #f0f3f7;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          transition: width 0.3s ease;
        }

        .category-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 28px;
          padding: 13px;
          border-radius: 10px;
          background: #f4faf7;
        }

        .category-summary span {
          color: #708579;
          font-size: 10px;
        }

        .category-summary strong {
          color: #087b56;
          font-size: 14px;
        }

        .table-panel {
          padding: 0;
          overflow: hidden;
        }

        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 22px;
        }

        .table-tools {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 36px;
          width: 210px;
          padding: 0 10px;
          border: 1px solid #e1e8f0;
          border-radius: 8px;
          background: white;
          color: #8a9aae;
        }

        .search-box input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #33465f;
          font-size: 11px;
        }

        .table-scroll {
          width: 100%;
          overflow-x: auto;
        }

        .performance-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .performance-table th {
          padding: 13px 18px;
          border-top: 1px solid #edf1f5;
          border-bottom: 1px solid #edf1f5;
          background: #f9fbfd;
          color: #8593a6;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.45px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .performance-table td {
          padding: 16px 18px;
          border-bottom: 1px solid #edf1f5;
          color: #53657c;
          font-size: 11px;
          white-space: nowrap;
        }

        .performance-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .event-name {
          color: #243750;
          font-size: 11px;
          font-weight: 750;
        }

        .category-pill {
          display: inline-flex;
          align-items: center;
          padding: 5px 8px;
          border-radius: 6px;
          background: #eff6ff;
          color: #3b72c7;
          font-size: 10px;
          font-weight: 700;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          padding: 5px 8px;
          border-radius: 6px;
          background: #dcfce7;
          color: #15803d;
          font-size: 10px;
          font-weight: 750;
        }

        .status-pill.upcoming {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .capacity-cell {
          min-width: 130px;
        }

        .capacity-label {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 7px;
          font-size: 10px;
        }

        .capacity-label strong {
          color: #32465e;
        }

        .capacity-track {
          height: 5px;
          overflow: hidden;
          border-radius: 20px;
          background: #edf1f5;
        }

        .capacity-fill {
          height: 100%;
          border-radius: inherit;
          background: #10b981;
        }

        .empty-row {
          padding: 35px !important;
          text-align: center;
          color: #8b99ab !important;
        }

        .footer-note {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 21px 2px 0;
          color: #95a1b1;
          font-size: 10px;
        }

        @media (max-width: 1200px) {
          .main-content {
            padding: 24px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .analytics-grid {
            grid-template-columns: minmax(0, 1.35fr) minmax(250px, 1fr);
          }
        }

        @media (max-width: 900px) {
          .main-content {
            margin-left: 0;
            padding: 22px;
          }

          .mobile-menu {
            display: inline-flex;
          }

          .topbar {
            align-items: flex-start;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .page-title {
            font-size: 23px;
            letter-spacing: -0.5px;
          }

          .main-content {
            padding: 16px;
          }

          .topbar {
            gap: 10px;
          }

          .top-actions {
            gap: 7px;
          }

          .export-button {
            min-height: 38px;
            padding: 0 10px;
            font-size: 11px;
          }

          .stats-grid {
            gap: 10px;
          }

          .stat-card {
            padding: 14px;
          }

          .stat-icon {
            width: 31px;
            height: 31px;
          }

          .stat-value {
            font-size: 25px;
          }

          .stat-foot {
            font-size: 9px;
          }

          .panel {
            padding: 16px;
          }

          .chart-area {
            gap: 7px;
            height: 200px;
          }

          .bar-label {
            font-size: 9px;
          }

          .table-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 16px;
          }

          .table-tools,
          .search-box {
            width: 100%;
          }

          .footer-note {
            flex-direction: column;
          }
        }
      `}</style>

      <OrganizerSidebar
        activePage="Analytics"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`mobile-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={19} />
            </button>

            <div>
              <div className="breadcrumb">
                Organizer / <span>Analytics</span>
              </div>
              <h1 className="page-title">Analytics Overview</h1>
              <p className="page-subtitle">
                Track your events, volunteer engagement, and community impact.
              </p>
            </div>
          </div>

          <div className="top-actions">
            <button className="export-button" onClick={handleExport}>
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Total Events</span>
              <div className="stat-icon green">
                <CalendarDays size={18} />
              </div>
            </div>
            <div className="stat-value">{totalEvents}</div>
            <div className="stat-foot">
              <span className="trend-up">
                <TrendingUp size={12} />
                12.5%
              </span>
              <span>compared to last period</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Total Volunteers</span>
              <div className="stat-icon blue">
                <Users size={18} />
              </div>
            </div>
            <div className="stat-value">{totalVolunteers}</div>
            <div className="stat-foot">
              <span className="trend-up">
                <TrendingUp size={12} />
                18.2%
              </span>
              <span>compared to last period</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Confirmed</span>
              <div className="stat-icon purple">
                <UserCheck size={18} />
              </div>
            </div>
            <div className="stat-value">{confirmedVolunteers}</div>
            <div className="stat-foot">
              <span className="trend-up">
                <ArrowUpRight size={12} />
                {Math.round((confirmedVolunteers / totalVolunteers) * 100)}%
              </span>
              <span>of total volunteers</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-label">Pending Requests</span>
              <div className="stat-icon orange">
                <Clock size={18} />
              </div>
            </div>
            <div className="stat-value">{pendingVolunteers}</div>
            <div className="stat-foot">
              <span className="trend-down">
                <ArrowDownRight size={12} />
                Needs review
              </span>
            </div>
          </article>
        </section>

        <section className="analytics-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Volunteer Growth</h2>
                <p className="panel-description">
                  Monthly volunteer registrations over time
                </p>
              </div>

              <select
                className="period-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                aria-label="Chart time period"
              >
                <option>8 months</option>
                <option>6 months</option>
                <option>4 months</option>
              </select>
            </div>

            <div className="chart-area">
              {monthlyData
                .slice(
                  period === "4 months"
                    ? 4
                    : period === "6 months"
                      ? 2
                      : 0
                )
                .map((item) => (
                  <div className="chart-column" key={item.month}>
                    <span className="bar-value">{item.volunteers}</span>
                    <div
                      className="bar"
                      style={{
                        height: `${(item.volunteers / maxVolunteers) * 75}%`,
                      }}
                      title={`${item.volunteers} volunteers`}
                    />
                    <span className="bar-label">{item.month}</span>
                  </div>
                ))}
            </div>

            <div className="chart-legend">
              <span className="legend-dot" />
              Volunteer registrations
            </div>
          </article>

          <article className="panel">
            <div>
              <h2 className="panel-title">Events by Category</h2>
              <p className="panel-description">
                Distribution across volunteer programs
              </p>
            </div>

            <div className="category-list">
              {categoryData.map((category) => {
                const percentage = Math.round(
                  (category.count / totalCategoryCount) * 100
                );

                return (
                  <div key={category.name}>
                    <div className="category-top">
                      <div className="category-name">
                        <span
                          className="category-dot"
                          style={{ background: category.color }}
                        />
                        {category.name}
                      </div>

                      <span className="category-count">
                        {category.count} ({percentage}%)
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${percentage}%`,
                          background: category.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="category-summary">
              <span>Total categorized events</span>
              <strong>{totalCategoryCount}</strong>
            </div>
          </article>
        </section>

        <section className="panel table-panel">
          <div className="table-header">
            <div>
              <h2 className="panel-title">Event Performance</h2>
              <p className="panel-description">
                Review volunteer participation across recent events
              </p>
            </div>

            <div className="table-tools">
              <label className="search-box">
                <Search size={15} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events..."
                  aria-label="Search events"
                />
              </label>
            </div>
          </div>

          <div className="table-scroll">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Volunteers</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => {
                    const percentage = Math.min(
                      100,
                      Math.round((event.volunteers / event.capacity) * 100)
                    );

                    return (
                      <tr key={event.id}>
                        <td>
                          <span className="event-name">{event.name}</span>
                        </td>

                        <td>
                          <span className="category-pill">
                            {event.category}
                          </span>
                        </td>

                        <td>{event.date}</td>

                        <td>
                          <strong style={{ color: "#243750" }}>
                            {event.volunteers}
                          </strong>
                        </td>

                        <td className="capacity-cell">
                          <div className="capacity-label">
                            <span>
                              {event.volunteers}/{event.capacity}
                            </span>
                            <strong>{percentage}%</strong>
                          </div>
                          <div className="capacity-track">
                            <div
                              className="capacity-fill"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </td>

                        <td>
                          <span
                            className={`status-pill ${
                              event.status === "Upcoming" ? "upcoming" : ""
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="empty-row">
                      No events found. Try another search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="footer-note">
          <span>© 2026 UnityVol · People · Events · Impact</span>
          <span>Analytics overview</span>
        </footer>
      </main>

      <OrganizerAIChat />

    </div>
  );
}