"use client";

import OrganizerSidebar from "@/components/OrganizerSidebar";
import OrganizerAIChat from "@/components/Organizer/OrganizerAIChat";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  Users,
  ChartNoAxesColumn,
  Search,
  MapPin,
  CheckCircle2,
  Clock,
  Trash2,
  Menu,
  X,
  HandHeart,
  LogOut,
  Mail,
} from "lucide-react";

type VolunteerStatus = "Confirmed" | "Pending";

type Volunteer = {
  id: number;
  name: string;
  email: string;
  initials: string;
  event: string;
  date: string;
  status: VolunteerStatus;
  color: string;
};

const initialVolunteers: Volunteer[] = [
  {
    id: 1,
    name: "Ayesha Rahman",
    email: "ayesha@example.com",
    initials: "AR",
    event: "Tree Plantation Drive",
    date: "Nov 15, 2026",
    status: "Confirmed",
    color: "#dcfce7",
  },
  {
    id: 2,
    name: "Tanvir Hasan",
    email: "tanvir@example.com",
    initials: "TH",
    event: "Digital Literacy Workshop",
    date: "Nov 22, 2026",
    status: "Pending",
    color: "#dbeafe",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    initials: "NJ",
    event: "Free Health Camp",
    date: "Nov 30, 2026",
    status: "Confirmed",
    color: "#f3e8ff",
  },
  {
    id: 4,
    name: "Rafi Ahmed",
    email: "rafi@example.com",
    initials: "RA",
    event: "Cloth Donation Drive",
    date: "Dec 05, 2026",
    status: "Confirmed",
    color: "#ffedd5",
  },
  {
    id: 5,
    name: "Sadia Islam",
    email: "sadia@example.com",
    initials: "SI",
    event: "Tree Plantation Drive",
    date: "Nov 15, 2026",
    status: "Pending",
    color: "#fce7f3",
  },
];

const navItems = [
  { label: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
  { label: "Create Event", href: "/organizer/events/create", icon: CalendarPlus },
  { label: "Manage Events", href: "/organizer/events", icon: CalendarDays },
  { label: "Event Volunteers", href: "/organizer/volunteers", icon: Users },
  { label: "Analytics", href: "/organizer/analytics", icon: ChartNoAxesColumn },
];

export default function EventVolunteersPage() {
  const [volunteers, setVolunteers] =
    useState<Volunteer[]>(initialVolunteers);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const eventNames = Array.from(
    new Set(volunteers.map((volunteer) => volunteer.event))
  );

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) => {
      const matchesSearch =
        `${volunteer.name} ${volunteer.email} ${volunteer.event}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesEvent =
        eventFilter === "All" || volunteer.event === eventFilter;

      const matchesStatus =
        statusFilter === "All" || volunteer.status === statusFilter;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [volunteers, search, eventFilter, statusFilter]);

  const confirmedCount = volunteers.filter(
    (volunteer) => volunteer.status === "Confirmed"
  ).length;

  const pendingCount = volunteers.filter(
    (volunteer) => volunteer.status === "Pending"
  ).length;

  function updateStatus(id: number) {
    setVolunteers((current) =>
      current.map((volunteer) =>
        volunteer.id === id
          ? {
              ...volunteer,
              status:
                volunteer.status === "Pending"
                  ? "Confirmed"
                  : "Pending",
            }
          : volunteer
      )
    );

    setNotice("Volunteer status updated successfully.");
  }

  function removeVolunteer(id: number) {
    const volunteer = volunteers.find((item) => item.id === id);
    if (!volunteer) return;

    if (!window.confirm(`Remove ${volunteer.name} from this list?`)) {
      return;
    }

    setVolunteers((current) =>
      current.filter((item) => item.id !== id)
    );

    setNotice("Volunteer removed successfully.");
  }

  return (
    <div className="page-shell">
      <style jsx global>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #f4f7fb;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          color: #17243b;
        }

        button, input, select { font: inherit; }

        .page-shell { min-height: 100vh; }

        .sidebar {
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

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 10px 28px;
          color: white;
          text-decoration: none;
        }

        .logo {
          display: grid;
          place-items: center;
          width: 37px;
          height: 37px;
          border-radius: 12px;
          background: #119b6b;
        }

        .brand-name { font-size: 21px; font-weight: 850; }

        .brand-caption {
          margin-top: 3px;
          color: #a5b6c9;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .nav { display: grid; gap: 7px; }

        .nav a {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 44px;
          padding: 0 13px;
          border-radius: 9px;
          color: #c1cddd;
          text-decoration: none;
          font-size: 12px;
          font-weight: 650;
        }

        .nav a:hover { background: #ffffff0c; color: white; }
        .nav a.active { background: #0d9669; color: white; }

        .sidebar-bottom {
          margin-top: auto;
          padding: 14px 8px 0;
          border-top: 1px solid #ffffff18;
        }

        .user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0 18px;
        }

        .avatar {
          display: grid;
          place-items: center;
          flex: none;
          width: 37px;
          height: 37px;
          border-radius: 50%;
          background: #d5e9df;
          color: #176748;
          font-size: 12px;
          font-weight: 800;
        }

        .user-name { color: white; font-size: 12px; font-weight: 750; }
        .user-role { margin-top: 3px; color: #9caec5; font-size: 10px; }

        .logout {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 0;
          background: none;
          color: #c7d3e2;
          cursor: pointer;
          font-size: 12px;
        }

        .main { min-height: 100vh; margin-left: 246px; }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          height: 67px;
          padding: 0 28px;
          border-bottom: 1px solid #e7edf4;
          background: #ffffffed;
        }

        .top-title { color: #607089; font-size: 13px; }

        .search {
          display: flex;
          align-items: center;
          gap: 9px;
          width: min(100%, 330px);
          height: 38px;
          padding: 0 12px;
          border: 1px solid #e0e7f0;
          border-radius: 9px;
          background: #fbfcfe;
          color: #8a98ac;
        }

        .search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 12px;
        }

        .content { max-width: 1500px; margin: 0 auto; padding: 28px; }

        .page-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
        }

        h1 { margin: 0; font-size: 26px; letter-spacing: -.7px; }

        .subtitle { margin: 7px 0 0; color: #7c8ba0; font-size: 12px; }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 20px;
        }

        .stat, .panel {
          border: 1px solid #e7edf4;
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 7px #243b5305;
        }

        .stat { padding: 18px; }
        .stat-label { color: #7a8aa0; font-size: 11px; font-weight: 650; }
        .stat-value { margin-top: 8px; font-size: 28px; font-weight: 850; }
        .stat-note { margin-top: 5px; color: #15966c; font-size: 10px; }

        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px;
        }

        .panel-title { margin: 0; font-size: 14px; font-weight: 800; }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          padding: 0 18px 17px;
        }

        .filters select {
          max-width: 100%;
          min-height: 36px;
          padding: 0 11px;
          border: 1px solid #e1e8f0;
          border-radius: 8px;
          background: white;
          color: #607089;
          font-size: 11px;
        }

        .table-wrap { width: 100%; overflow-x: auto; }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          white-space: nowrap;
        }

        th {
          padding: 12px 16px;
          background: #f8fafc;
          color: #8492a6;
          font-size: 10px;
        }

        td {
          padding: 14px 16px;
          border-top: 1px solid #eff2f6;
          color: #617189;
          font-size: 11px;
        }

        tbody tr:hover { background: #fbfdfc; }

        .person {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .person-avatar {
          display: grid;
          place-items: center;
          width: 37px;
          height: 37px;
          flex: none;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 800;
        }

        .person-name { color: #2d3d54; font-weight: 750; }

        .person-email {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
          color: #8795a8;
          font-size: 10px;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 20px;
          background: #e5f8ef;
          color: #16855f;
          font-size: 9px;
          font-weight: 750;
        }

        .status.pending { background: #fff3dd; color: #ad7413; }

        .actions {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: nowrap;
}

.action {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  height: 38px;
  min-height: 38px;
  min-width: 112px;
  padding: 0 14px;

  border: 1px solid #e1e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #52667f;

  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;

  cursor: pointer;
  flex: 0 0 auto;
  appearance: none;
  -webkit-appearance: none;
}

.action svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.action:hover {
  border-color: #0d9669;
  color: #087b56;
}

.action.remove {
  min-width: 38px;
  width: 38px;
  padding: 0;
}

.action.remove:hover {
  border-color: #fca5a5;
  color: #dc2626;
}

        .empty { padding: 35px; text-align: center; color: #8795a8; }

        .notice {
          margin-bottom: 16px;
          padding: 12px 14px;
          border: 1px solid #b9ead5;
          border-radius: 9px;
          background: #effcf6;
          color: #087b56;
          font-size: 12px;
        }

        .mobile-menu { display: none; }

        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); transition: transform .2s; }
          .sidebar.open { transform: translateX(0); box-shadow: 20px 0 60px #0d1b2d35; }
          .main { margin-left: 0; }
          .mobile-menu {
            display: grid;
            place-items: center;
            width: 36px;
            height: 36px;
            border: 1px solid #e1e8f0;
            border-radius: 9px;
            background: white;
            cursor: pointer;
          }
          .content { padding: 22px 18px; }
        }

        @media (max-width: 600px) {
          .topbar { height: 60px; padding: 0 13px; }
          .top-title { display: none; }
          .content { padding: 18px 12px; }
          .page-head { align-items: flex-start; flex-direction: column; }
          h1 { font-size: 23px; }
          .stats { grid-template-columns: 1fr; gap: 10px; }
          .stat { padding: 15px; }
        }
      `}</style>

      <OrganizerSidebar
  activePage="Event Volunteers"
  sidebarOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>
      <main className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="top-title">
              Organizer Workspace / Event Volunteers
            </span>
          </div>

          <label className="search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search volunteers..."
            />
          </label>
        </header>

        <section className="content">
          <div className="page-head">
            <div>
              <h1>Event Volunteers</h1>
              <p className="subtitle">
                Manage registrations and coordinate your event volunteers.
              </p>
            </div>
          </div>

          {notice && (
            <div className="notice" role="status">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{notice}</span>
                <button
                  onClick={() => setNotice("")}
                  aria-label="Dismiss message"
                  style={{ border: 0, background: "transparent", cursor: "pointer", color: "inherit" }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="stats">
            <div className="stat">
              <div className="stat-label">Total Registrations</div>
              <div className="stat-value">{volunteers.length}</div>
              <div className="stat-note">Across all listed events</div>
            </div>

            <div className="stat">
              <div className="stat-label">Confirmed Volunteers</div>
              <div className="stat-value">{confirmedCount}</div>
              <div className="stat-note">Ready to participate</div>
            </div>

            <div className="stat">
              <div className="stat-label">Pending Requests</div>
              <div className="stat-value">{pendingCount}</div>
              <div className="stat-note">Awaiting confirmation</div>
            </div>
          </div>

          <section className="panel">
            <div className="panel-head">
              <h2 className="panel-title">Volunteer Registrations</h2>
              <span style={{ color: "#8795a8", fontSize: 11 }}>
                {filteredVolunteers.length} result(s)
              </span>
            </div>

            <div className="filters">
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                aria-label="Filter by event"
              >
                <option value="All">All Events</option>
                {eventNames.map((eventName) => (
                  <option key={eventName} value={eventName}>
                    {eventName}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>VOLUNTEER</th>
                    <th>EVENT</th>
                    <th>EVENT DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer.id}>
                      <td>
                        <div className="person">
                          <div
                            className="person-avatar"
                            style={{
                              background: volunteer.color,
                              color: "#375466",
                            }}
                          >
                            {volunteer.initials}
                          </div>

                          <div>
                            <div className="person-name">
                              {volunteer.name}
                            </div>
                            <div className="person-email">
                              <Mail size={12} />
                              {volunteer.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>{volunteer.event}</td>

                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <CalendarDays size={13} />
                          {volunteer.date}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status ${
                            volunteer.status === "Pending" ? "pending" : ""
                          }`}
                        >
                          {volunteer.status === "Pending" ? (
                            <Clock size={12} />
                          ) : (
                            <CheckCircle2 size={12} />
                          )}
                          {volunteer.status}
                        </span>
                      </td>

                      <td>
                        <div className="actions">
                          <button
                            className="action"
                            onClick={() => updateStatus(volunteer.id)}
                            title="Change volunteer status"
                          >
                            <CheckCircle2 size={13} />
                            {volunteer.status === "Pending"
                              ? "Confirm"
                              : "Set Pending"}
                          </button>

                          <button
                            className="action remove"
                            onClick={() => removeVolunteer(volunteer.id)}
                            title="Remove volunteer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredVolunteers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty">
                        No volunteers found. Try another search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>
      <OrganizerAIChat />
    </div>
  );
}