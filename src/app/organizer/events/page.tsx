"use client";

import OrganizerSidebar from "@/components/OrganizerSidebar";
import OrganizerAIChat from "@/components/Organizer/OrganizerAIChat";
import OrganizerEventDetailsModal, {
  type OrganizerEvent,
} from "@/components/Organizer/OrganizerEventDetailsModal";
import { useEffect, useMemo, useState } from "react";
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
  id: string | number;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  registered: number;
  capacity: number;
  status: EventStatus;
};

const navItems = [
  { label: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
  { label: "Create Event", href: "/organizer/events/create", icon: CalendarPlus },
  { label: "Manage Events", href: "/organizer/events", icon: CalendarDays },
  { label: "Event Volunteers", href: "/organizer/volunteers", icon: Users },
  { label: "Analytics", href: "/organizer/analytics", icon: ChartNoAxesColumn },
];

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [selectedEvent, setSelectedEvent] =
  useState<OrganizerEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editForm, setEditForm] = useState<EventItem | null>(null);

  
useEffect(() => {
  if (!notice) return;

  const timer = window.setTimeout(() => {
    setNotice("");
  }, 4000);

  return () => window.clearTimeout(timer);
}, [notice]);


  useEffect(() => {
  async function loadEvents() {
    try {
      const response = await fetch("/api/events", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load events");
      }

      const loadedEvents: EventItem[] = data.events.map(
        (event: {
          _id: string;
          title: string;
          category: string;
          date: string;
          startTime?: string;
          endTime?: string;
          location: string;
          capacity: number;
          status: string;
          registered?: number;
        }) => ({
          id: event._id,
          title: event.title,
          category: event.category,
          date: event.date,
          startTime: event.startTime ?? "",
          endTime: event.endTime ?? "",
          location: event.location,
          capacity: event.capacity,
          registered: event.registered ?? 0,
          status:
            event.status === "Draft"
              ? "Draft"
              : event.status === "Completed"
                ? "Completed"
                : "Upcoming",
        })
      );

      setEvents(loadedEvents);
    } catch (error) {
      console.error("Load events error:", error);
      setNotice("Failed to load events. Please refresh the page.");
    }
  }

  loadEvents();
}, []);

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

  
function deleteEvent(id: string | number) {
  const event = events.find((item) => item.id === id);
  if (!event) return;

  setDeleteTarget(event);
}


async function confirmDeleteEvent(id: string | number) {
  try {
    const response = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete event.");
    }

    setEvents((current) =>
      current.filter((item) => item.id !== id)
    );

    setNotice("Event deleted successfully.");
  } catch (error) {
    console.error("Delete event error:", error);

    setNotice(
      error instanceof Error
        ? error.message
        : "Failed to delete event."
    );
  }
}



  function editEvent(event: EventItem) {
  setEditingEvent(event);
  setEditForm({ ...event });
}

function handleEditChange(
  field: keyof EventItem,
  value: string | number
) {
  setEditForm((current) =>
    current ? { ...current, [field]: value } : current
  );
}


async function saveEditedEvent(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  if (!editForm) return;

  if (
    !editForm.title.trim() ||
    !editForm.category.trim() ||
    !editForm.date.trim() ||
    !editForm.location.trim()
  ) {
    setNotice("Please fill in all required fields.");
    return;
  }

  if (
    editForm.capacity < 1 ||
    editForm.registered < 0 ||
    editForm.registered > editForm.capacity
  ) {
    setNotice("Please check the volunteer numbers and capacity.");
    return;
  }

  try {
    const response = await fetch(
      `/api/events/${editForm.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editForm.title.trim(),
          category: editForm.category,
          date: editForm.date.trim(),
          startTime: editForm.startTime ?? "",
          endTime: editForm.endTime ?? "",
          location: editForm.location.trim(),
          capacity: Number(editForm.capacity),
          status:
            editForm.status === "Draft"
              ? "Draft"
              : editForm.status === "Completed"
                ? "Completed"
                : "Published",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update event.");
    }

    setEvents((current) =>
      current.map((event) =>
        event.id === editForm.id
          ? { ...editForm }
          : event
      )
    );

    setEditingEvent(null);
    setEditForm(null);
    setNotice("Event updated successfully.");
  } catch (error) {
    console.error("Update event error:", error);
    setNotice(
      error instanceof Error
        ? error.message
        : "Failed to update event."
    );
  }
}

  function viewEvent(event: EventItem) {
  setSelectedEvent(event);
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
          .edit-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(15, 29, 48, 0.58);
  backdrop-filter: blur(5px);
}

.edit-modal {
  width: 100%;
  max-width: 600px;
  max-height: 88dvh;
  overflow-y: auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 24px 80px rgba(15, 29, 48, 0.25);
  animation: editPopupIn 0.2s ease-out;
}

@keyframes editPopupIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.edit-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 24px;
  border-bottom: 1px solid #edf1f5;
}

.edit-modal-title {
  margin: 0;
  color: #17243b;
  font-size: 19px;
  font-weight: 800;
}

.edit-modal-subtitle {
  margin: 6px 0 0;
  color: #8290a3;
  font-size: 11px;
}

.edit-close {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 1px solid #e5eaf0;
  border-radius: 9px;
  background: white;
  color: #64748b;
  cursor: pointer;
}

.edit-close:hover {
  color: #dc2626;
  background: #fff5f5;
}

.edit-form {
  padding: 22px 24px;
}

.edit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.edit-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.edit-field.full {
  grid-column: 1 / -1;
}

.edit-field label {
  color: #43536a;
  font-size: 11px;
  font-weight: 750;
}

.edit-field input,
.edit-field select {
  width: 100%;
  min-width: 0;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #dfe6ef;
  border-radius: 9px;
  outline: none;
  background: #fff;
  color: #26364c;
  font-size: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.edit-field input:focus,
.edit-field select:focus {
  border-color: #0d9669;
  box-shadow: 0 0 0 3px rgba(13, 150, 105, 0.1);
}

.edit-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #edf1f5;
}

.edit-cancel,
.edit-save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}

.edit-cancel {
  border: 1px solid #dfe6ef;
  background: white;
  color: #526176;
}

.edit-save {
  border: 0;
  background: #0d9669;
  color: white;
}

.edit-save:hover {
  background: #087b56;
}

@media (max-width: 600px) {
  .edit-overlay {
    padding: 10px;
    align-items: center;
  }

  .edit-modal {
    max-width: 430px;
    max-height: 84dvh;
    border-radius: 14px;
  }

  .edit-modal-header {
    padding: 16px;
  }

  .edit-modal-title {
    font-size: 17px;
  }

  .edit-form {
    padding: 16px;
  }

  .edit-grid {
    gap: 13px 10px;
  }

  .edit-field input,
  .edit-field select {
    height: 40px;
    padding: 0 9px;
    font-size: 11px;
  }

  .edit-modal-footer {
    position: sticky;
    bottom: -16px;
    margin: 20px -16px -16px;
    padding: 13px 16px;
    background: white;
  }

  .edit-cancel,
  .edit-save {
    flex: 1;
    padding: 0 10px;
  }
}

@media (max-width: 360px) {
  .edit-grid {
    grid-template-columns: 1fr;
  }

  .edit-field.full {
    grid-column: auto;
  }
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
  position: fixed;
  top: 82px;
  right: 24px;
  z-index: 200;
  width: min(360px, calc(100vw - 32px));
  margin: 0;
  padding: 14px 16px;
  border: 1px solid #b9ead5;
  border-radius: 12px;
  background: #ffffff;
  color: #087b56;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 10px 35px rgba(15, 29, 48, 0.14);
  animation: toastIn 0.25s ease-out;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

        .uv-footer-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 2px 2px 0;
  color: #9aa6b6;
  font-size: 10px;
}

@media (max-width: 650px) {
  .uv-footer-note {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
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
                          <button
  className="action"
  title="Edit event"
  onClick={() => editEvent(event)}
>
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
          <footer className="uv-footer-note">
  <span>© 2026 UnityVol · Events · Planning · Impact</span>
  <span>Event management</span>
</footer>
        </section>
      </main>

      {editingEvent && editForm && (
  <div
    className="edit-overlay"
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        setEditingEvent(null);
        setEditForm(null);
      }
    }}
  >
    <section
      className="edit-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-event-heading"
    >
      <div className="edit-modal-header">
        <div>
          <h2 className="edit-modal-title" id="edit-event-heading">
            Edit Event
          </h2>
          <p className="edit-modal-subtitle">
            Update your event information below.
          </p>
        </div>

        <button
          type="button"
          className="edit-close"
          aria-label="Close edit popup"
          onClick={() => {
            setEditingEvent(null);
            setEditForm(null);
          }}
        >
          <X size={18} />
        </button>
      </div>

      <form className="edit-form" onSubmit={saveEditedEvent}>
        <div className="edit-grid">
          <div className="edit-field full">
            <label htmlFor="edit-title">Event Title *</label>
            <input
              id="edit-title"
              type="text"
              value={editForm.title}
              onChange={(e) =>
                handleEditChange("title", e.target.value)
              }
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="edit-field">
            <label htmlFor="edit-category">Category *</label>
            <select
              id="edit-category"
              value={editForm.category}
              onChange={(e) =>
                handleEditChange("category", e.target.value)
              }
              required
            >
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Community">Community</option>
            </select>
          </div>

          <div className="edit-field">
            <label htmlFor="edit-status">Event Status</label>
            <select
              id="edit-status"
              value={editForm.status}
              onChange={(e) =>
                handleEditChange(
                  "status",
                  e.target.value as EventStatus
                )
              }
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="edit-field full">
            <label htmlFor="edit-date">Event Date *</label>
            <input
              id="edit-date"
              type="text"
              value={editForm.date}
              onChange={(e) =>
                handleEditChange("date", e.target.value)
              }
              placeholder="e.g. Nov 15, 2026"
              required
            />
          </div>

          <div className="edit-field">
  <label htmlFor="edit-start-time">Start Time *</label>
  <input
    id="edit-start-time"
    type="time"
    value={editForm.startTime ?? ""}
    onChange={(e) =>
      handleEditChange("startTime", e.target.value)
    }
    required
  />
</div>

<div className="edit-field">
  <label htmlFor="edit-end-time">End Time *</label>
  <input
    id="edit-end-time"
    type="time"
    value={editForm.endTime ?? ""}
    onChange={(e) =>
      handleEditChange("endTime", e.target.value)
    }
    required
  />
</div>

          <div className="edit-field full">
            <label htmlFor="edit-location">Location *</label>
            <input
              id="edit-location"
              type="text"
              value={editForm.location}
              onChange={(e) =>
                handleEditChange("location", e.target.value)
              }
              placeholder="Enter event location"
              required
            />
          </div>

          <div className="edit-field">
            <label htmlFor="edit-registered">
              Registered Volunteers
            </label>
            <input
              id="edit-registered"
              type="number"
              min={0}
              max={editForm.capacity}
              value={editForm.registered}
              onChange={(e) =>
                handleEditChange(
                  "registered",
                  Number(e.target.value)
                )
              }
              required
            />
          </div>

          <div className="edit-field">
            <label htmlFor="edit-capacity">
              Volunteer Capacity
            </label>
            <input
              id="edit-capacity"
              type="number"
              min={1}
              value={editForm.capacity}
              onChange={(e) =>
                handleEditChange(
                  "capacity",
                  Number(e.target.value)
                )
              }
              required
            />
          </div>
        </div>

        <div className="edit-modal-footer">
          <button
            type="button"
            className="edit-cancel"
            onClick={() => {
              setEditingEvent(null);
              setEditForm(null);
            }}
          >
            Cancel
          </button>

          <button type="submit" className="edit-save">
            <Pencil size={14} />
            Save Changes
          </button>
        </div>
      </form>
    </section>
  </div>
)}


{deleteTarget && (
  <div className="edit-overlay">
    <section className="edit-modal" style={{ maxWidth: 420, padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 56,
          height: 56,
          margin: "0 auto 16px",
          borderRadius: "50%",
          background: "#fff1f2",
          color: "#dc2626",
          display: "grid",
          placeItems: "center"
        }}>
          <Trash2 size={26} />
        </div>

        <h2 style={{ margin: "0 0 10px", color: "#17243b" }}>
          Delete Event?
        </h2>

        <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
          Are you sure you want to delete
          <strong> "{deleteTarget.title}"</strong>?
          This action cannot be undone.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 24
        }}>
          <button
            className="edit-cancel"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>

          <button
            className="edit-save"
            style={{ background: "#dc2626" }}
            onClick={async () => {
              const id = deleteTarget.id;
              setDeleteTarget(null);
              await confirmDeleteEvent(id);
            }}
          >
            <Trash2 size={14} />
            Yes, Delete
          </button>
        </div>
      </div>
    </section>
  </div>
)}


      <OrganizerEventDetailsModal
  event={selectedEvent}
  onClose={() => setSelectedEvent(null)}
/>

      <OrganizerAIChat />

    </div>
  );
}