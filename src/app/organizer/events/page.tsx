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
  Plus,
  MapPin,
  CalendarDays as CalendarIcon,
  Eye,
  Pencil,
  Trash2,
  Menu,
  X,
  HandHeart,
  LogOut,
} from "lucide-react";

type EventStatus = "Upcoming" | "Completed" | "Draft";

type EventItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  registered: number;
  capacity: number;
  status: EventStatus;
};

const initialEvents: EventItem[] = [
  {
    id: 1,
    title: "Tree Plantation Drive",
    category: "Environment",
    date: "Nov 15, 2026",
    location: "Riverside Park, Dhaka",
    registered: 12,
    capacity: 20,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Digital Literacy Workshop",
    category: "Education",
    date: "Nov 22, 2026",
    location: "Community Center, Dhaka",
    registered: 8,
    capacity: 15,
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Free Health Camp",
    category: "Health",
    date: "Nov 30, 2026",
    location: "City Hospital, Dhaka",
    registered: 5,
    capacity: 20,
    status: "Upcoming",
  },
  {
    id: 4,
    title: "Cloth Donation Drive",
    category: "Community",
    date: "Dec 05, 2026",
    location: "Mirpur Community Hall",
    registered: 18,
    capacity: 25,
    status: "Upcoming",
  },
  {
    id: 5,
    title: "Community Clean-up",
    category: "Environment",
    date: "Oct 10, 2026",
    location: "Hatirjheel, Dhaka",
    registered: 24,
    capacity: 25,
    status: "Completed",
  },
];

const navItems = [
  { label: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
  { label: "Create Event", href: "/organizer/events/create", icon: CalendarPlus },
  { label: "Manage Events", href: "/organizer/events", icon: CalendarDays },
  { label: "Event Volunteers", href: "/organizer/volunteers", icon: Users },
  { label: "Analytics", href: "/organizer/analytics", icon: ChartNoAxesColumn },
];

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        `${event.title} ${event.category} ${event.location}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || event.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || event.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [events, search, statusFilter, categoryFilter]);

  const upcomingCount = events.filter(
    (event) => event.status === "Upcoming"
  ).length;

  const volunteerCount = events.reduce(
    (total, event) => total + event.registered,
    0
  );

  const completedCount = events.filter(
    (event) => event.status === "Completed"
  ).length;

  function deleteEvent(id: number) {
    const event = events.find((item) => item.id === id);
    if (!event) return;

    if (!window.confirm(`Delete "${event.title}"?`)) return;

    setEvents((current) => current.filter((item) => item.id !== id));
    setNotice("Event deleted successfully.");
  }

  function editEvent(event: EventItem) {
    const title = window.prompt("Enter event title:", event.title);
    if (title === null || !title.trim()) return;

    setEvents((current) =>
      current.map((item) =>
        item.id === event.id ? { ...item, title: title.trim() } : item
      )
    );
    setNotice("Event title updated successfully.");
  }

  function viewEvent(event: EventItem) {
    setNotice(
      `${event.title} — ${event.date} — ${event.location} — ${event.registered}/${event.capacity} volunteers`
    );
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
          position: fixed; inset: 0 auto 0 0; z-index: 30;
          display: flex; flex-direction: column; width: 246px;
          padding: 22px 13px; background: #12223a; color: #d9e4f3;
        }
        .brand {
          display: flex; align-items: center; gap: 10px;
          padding: 0 10px 28px; color: white; text-decoration: none;
        }
        .logo {
          display: grid; place-items: center; width: 37px; height: 37px;
          border-radius: 12px; background: #119b6b;
        }
        .brand-name { font-size: 21px; font-weight: 850; }
        .brand-caption { margin-top: 3px; font-size: 8px; letter-spacing: 1px; color: #a5b6c9; }
        .nav { display: grid; gap: 7px; }
        .nav a {
          display: flex; align-items: center; gap: 12px; min-height: 44px;
          padding: 0 13px; border-radius: 9px; color: #c1cddd;
          text-decoration: none; font-size: 12px; font-weight: 650;
        }
        .nav a:hover { background: #ffffff0c; color: white; }
        .nav a.active { background: #0d9669; color: white; }
        .sidebar-bottom { margin-top: auto; padding: 14px 8px 0; border-top: 1px solid #ffffff18; }
        .user { display: flex; align-items: center; gap: 10px; padding: 10px 0 18px; }
        .avatar {
          display: grid; place-items: center; flex: none; width: 37px; height: 37px;
          border-radius: 50%; background: #d5e9df; color: #176748;
          font-size: 12px; font-weight: 800;
        }
        .user-name { color: white; font-size: 12px; font-weight: 750; }
        .user-role { margin-top: 3px; color: #9caec5; font-size: 10px; }
        .logout { display: flex; align-items: center; gap: 10px; border: 0; background: none; color: #c7d3e2; cursor: pointer; font-size: 12px; }
        .main { min-height: 100vh; margin-left: 246px; }
        .topbar {
          position: sticky; top: 0; z-index: 10; display: flex; align-items: center;
          justify-content: space-between; gap: 12px; height: 67px; padding: 0 28px;
          border-bottom: 1px solid #e7edf4; background: #ffffffed;
        }
        .top-title { font-size: 13px; color: #607089; }
        .search {
          display: flex; align-items: center; gap: 9px; width: min(100%, 330px);
          height: 38px; padding: 0 12px; border: 1px solid #e0e7f0;
          border-radius: 9px; background: #fbfcfe; color: #8a98ac;
        }
        .search input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; font-size: 12px; }
        .content { max-width: 1500px; margin: 0 auto; padding: 28px; }
        .page-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
        h1 { margin: 0; font-size: 26px; letter-spacing: -.7px; }
        .subtitle { margin: 7px 0 0; color: #7c8ba0; font-size: 12px; }
        .primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          min-height: 40px; padding: 0 15px; border: 0; border-radius: 9px;
          background: #0d9669; color: white; text-decoration: none;
          font-size: 12px; font-weight: 750; cursor: pointer;
        }
        .primary:hover { background: #087b56; }
        .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 20px; }
        .stat, .panel { border: 1px solid #e7edf4; border-radius: 12px; background: white; box-shadow: 0 2px 7px #243b5305; }
        .stat { padding: 18px; }
        .stat-label { color: #7a8aa0; font-size: 11px; font-weight: 650; }
        .stat-value { margin-top: 8px; font-size: 28px; font-weight: 850; }
        .stat-note { margin-top: 5px; color: #15966c; font-size: 10px; }
        .panel-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px; }
        .panel-title { margin: 0; font-size: 14px; font-weight: 800; }
        .filters { display: flex; flex-wrap: wrap; gap: 9px; padding: 0 18px 17px; }
        .filters select {
          min-height: 36px; padding: 0 11px; border: 1px solid #e1e8f0;
          border-radius: 8px; background: white; color: #607089; font-size: 11px;
        }
        .table-wrap { width: 100%; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; white-space: nowrap; }
        th { padding: 12px 16px; background: #f8fafc; color: #8492a6; font-size: 10px; }
        td { padding: 14px 16px; border-top: 1px solid #eff2f6; color: #617189; font-size: 11px; }
        tbody tr:hover { background: #fbfdfc; }
        .event-title { color: #2d3d54; font-weight: 750; }
        .event-category { margin-top: 5px; color: #8b98aa; font-size: 10px; }
        .location { display: flex; align-items: center; gap: 5px; }
        .status { display: inline-flex; padding: 5px 9px; border-radius: 20px; background: #e5f8ef; color: #16855f; font-size: 9px; font-weight: 750; }
        .status.completed { background: #eaf1ff; color: #456cc4; }
        .status.draft { background: #fff3dd; color: #ad7413; }
        .progress { width: 90px; height: 5px; margin-top: 7px; overflow: hidden; border-radius: 9px; background: #edf1f6; }
        .progress span { display: block; height: 100%; border-radius: 9px; background: #25bd91; }
        .actions { display: flex; align-items: center; gap: 6px; }
        .action {
          display: grid; place-items: center; width: 30px; height: 30px;
          border: 1px solid #e1e8f0; border-radius: 7px; background: white;
          color: #64748b; cursor: pointer;
        }
        .action:hover { border-color: #0d9669; color: #087b56; }
        .action.delete:hover { border-color: #fca5a5; color: #dc2626; }
        .empty { padding: 35px; text-align: center; color: #8795a8; }
        .notice {
          margin-bottom: 16px; padding: 12px 14px; border: 1px solid #b9ead5;
          border-radius: 9px; background: #effcf6; color: #087b56; font-size: 12px;
        }
        .mobile-menu { display: none; }
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); transition: transform .2s; }
          .sidebar.open { transform: translateX(0); box-shadow: 20px 0 60px #0d1b2d35; }
          .main { margin-left: 0; }
          .mobile-menu { display: grid; place-items: center; width: 36px; height: 36px; border: 1px solid #e1e8f0; border-radius: 9px; background: white; cursor: pointer; }
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
  activePage="Manage Events"
  sidebarOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  onLogout={() =>
    setNotice("Connect this button to your sign-out flow.")
  }
/>

      <main className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="top-title">Organizer Workspace / Manage Events</span>
          </div>
          <label className="search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
            />
          </label>
        </header>

        <section className="content">
          <div className="page-head">
            <div>
              <h1>Manage Events</h1>
              <p className="subtitle">Create, organize and track your community events.</p>
            </div>
            <Link href="/organizer/events/create" className="primary">
              <Plus size={16} /> Create Event
            </Link>
          </div>

          {notice && (
            <div className="notice" role="status">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{notice}</span>
                <button onClick={() => setNotice("")} style={{ border: 0, background: "transparent", cursor: "pointer", color: "inherit" }}>
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="stats">
            <div className="stat">
              <div className="stat-label">Total Events</div>
              <div className="stat-value">{events.length}</div>
              <div className="stat-note">All your events</div>
            </div>
            <div className="stat">
              <div className="stat-label">Upcoming Events</div>
              <div className="stat-value">{upcomingCount}</div>
              <div className="stat-note">Ready for volunteers</div>
            </div>
            <div className="stat">
              <div className="stat-label">Volunteer Registrations</div>
              <div className="stat-value">{volunteerCount}</div>
              <div className="stat-note">{completedCount} completed events</div>
            </div>
          </div>

          <section className="panel">
            <div className="panel-head">
              <h2 className="panel-title">All Events</h2>
              <span style={{ color: "#8795a8", fontSize: 11 }}>
                {filteredEvents.length} result(s)
              </span>
            </div>

            <div className="filters">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
                <option value="All">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>

              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Filter by category">
                <option value="All">All Categories</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>EVENT</th>
                    <th>DATE</th>
                    <th>LOCATION</th>
                    <th>VOLUNTEERS</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <div className="event-title">{event.title}</div>
                        <div className="event-category">{event.category}</div>
                      </td>
                      <td>{event.date}</td>
                      <td>
                        <div className="location">
                          <MapPin size={13} /> {event.location}
                        </div>
                      </td>
                      <td>
                        <div>{event.registered} / {event.capacity}</div>
                        <div className="progress">
                          <span style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }} />
                        </div>
                      </td>
                      <td>
                        <span className={`status ${event.status.toLowerCase()}`}>
                          {event.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="action" title="View event" onClick={() => viewEvent(event)}>
                            <Eye size={15} />
                          </button>
                          <button className="action" title="Edit event title" onClick={() => editEvent(event)}>
                            <Pencil size={15} />
                          </button>
                          <button className="action delete" title="Delete event" onClick={() => deleteEvent(event.id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty">
                        No events found. Try another search or filter.
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