"use client";

import OrganizerSidebar from "@/components/OrganizerSidebar";
import OrganizerAIChat from "@/components/Organizer/OrganizerAIChat";
import { useEffect, useMemo, useState } from "react";
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
  Eye,
} from "lucide-react";

type VolunteerStatus = "Pending" | "Confirmed" | "Rejected";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  initials: string;
  event: string;
  date: string;
  status: VolunteerStatus;
  color: string;
  profile: {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  profileImage?: string;
} | null;
};

const navItems = [
  { label: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
  { label: "Create Event", href: "/organizer/events/create", icon: CalendarPlus },
  { label: "Manage Events", href: "/organizer/events", icon: CalendarDays },
  { label: "Event Volunteers", href: "/organizer/volunteers", icon: Users },
  { label: "Analytics", href: "/organizer/analytics", icon: ChartNoAxesColumn },
];

export default function EventVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Volunteer | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Volunteer | null>(null);
  

const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadRegistrations() {
    try {
      const response = await fetch("/api/registrations", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load registrations.");
      }

      const colors = [
        "#dcfce7",
        "#dbeafe",
        "#f3e8ff",
        "#ffedd5",
        "#fce7f3",
      ];

      const mapped: Volunteer[] = (data.registrations ?? []).map(
        (r: {
          _id: string;
          volunteerProfile?: Volunteer["profile"] | null;
          volunteerName: string;
          volunteerEmail: string;
          eventTitle: string;
          eventDate: string;
          status: VolunteerStatus;
        }, index: number) => {
          const name = r.volunteerName || "Unknown Volunteer";

          return {
            id: String(r._id),
            profile: r.volunteerProfile ?? null,
            name,
            email: r.volunteerEmail || "",
            initials: name
              .split(/\s+/)
              .map((part: string) => part[0] || "")
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            event: r.eventTitle || "Untitled Event",
            date: r.eventDate
              ? new Date(r.eventDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "—",
            status: r.status || "Pending",
            color: colors[index % colors.length],
          };
        }
      );

      setVolunteers(mapped);
    } catch (error) {
      console.error("Load registrations error:", error);
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not load registrations."
      );
    } finally {
      setLoading(false);
    }
  }

  loadRegistrations();
}, []);


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

  const rejectedCount = volunteers.filter(
  (volunteer) => volunteer.status === "Rejected"
).length;

 
async function updateStatus(
  id: string,
  decision: "Confirmed" | "Rejected"
) {
  const volunteer = volunteers.find((item) => item.id === id);

  if (!volunteer || volunteer.status !== "Pending") return;

  try {
    const response = await fetch("/api/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId: id,
        status: decision,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update status.");
    }

    setVolunteers((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: decision } : item
      )
    );

    setNotice(
      decision === "Confirmed"
        ? "Volunteer registration confirmed successfully."
        : "Volunteer registration rejected."
    );
  } catch (error) {
    setNotice(
      error instanceof Error ? error.message : "Status update failed."
    );
  }
}

function removeVolunteer(id: string) {
  const volunteer = volunteers.find((item) => item.id === id);
  if (!volunteer) return;

  setPendingDelete(volunteer);
}

async function confirmDelete() {
  if (!pendingDelete) return;

  try {
    const response = await fetch("/api/registrations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId: pendingDelete.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete registration.");
    }

    setVolunteers((current) =>
      current.filter((item) => item.id !== pendingDelete.id)
    );

    setNotice(`${pendingDelete.name} has been removed successfully.`);
    setPendingDelete(null);
  } catch (error) {
    setNotice(
      error instanceof Error ? error.message : "Delete failed."
    );
  }
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

        
.profile-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background: rgba(12, 25, 43, 0.58);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  animation: profileFadeIn 0.18s ease-out;
}

.profile-modal {
  width: 100%;
  max-width: 540px;
  max-height: min(82dvh, 650px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.24);
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  animation: profileSlideIn 0.22s ease-out;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #edf1f5;
}

.profile-header h2 {
  margin: 0;
  color: #14243a;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.45px;
}

.profile-header .action {
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 11px;
}

.profile-identity {
  display: flex;
  align-items: center;
  gap: 13px;
  margin: 16px 0;
  padding: 15px;
  border: 1px solid #e0f2e9;
  border-radius: 13px;
  background: linear-gradient(120deg, #f0fdf6, #f8fbff);
}

.profile-identity img,
.profile-avatar {
  width: 62px;
  height: 62px;
  flex-shrink: 0;
  border: 3px solid #ffffff;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.10);
}

.profile-avatar {
  display: grid;
  place-items: center;
  background: #d5f3e5;
  color: #087b56;
  font-size: 17px;
  font-weight: 800;
}

.profile-identity-info {
  min-width: 0;
}

.profile-identity-info h3 {
  margin: 0;
  color: #17243b;
  font-size: 15px;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.profile-identity-info p {
  margin: 5px 0 0;
  color: #718096;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.profile-section-title {
  margin: 18px 0 10px;
  color: #64748b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.profile-field {
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid #e9eef4;
  border-radius: 10px;
  background: #fbfcfe;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.profile-field:hover {
  border-color: #ccebdc;
  background: #f8fdf9;
}

.profile-label {
  margin-bottom: 6px;
  color: #8492a6;
  font-size: 10px;
  font-weight: 650;
}

.profile-value {
  color: #26374d;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.55;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.profile-status {
  display: inline-flex;
  align-items: center;
  padding: 5px 9px;
  border-radius: 20px;
  background: #fff4dc;
  color: #a66b08;
  font-size: 10px;
  font-weight: 750;
}

@keyframes profileFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes profileSlideIn {
  from { opacity: 0; transform: translateY(8px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 520px) {
  .profile-overlay {
    align-items: center;
    padding: 10px;
  }

  .profile-modal {
    width: 100%;
    max-height: 84dvh;
    padding: 15px;
    border-radius: 15px;
  }

  .profile-header h2 {
    font-size: 15px;
  }

  .profile-identity {
    gap: 11px;
    margin: 13px 0;
    padding: 12px;
  }

  .profile-identity img,
  .profile-avatar {
    width: 54px;
    height: 54px;
  }

  .profile-identity-info h3 {
    font-size: 13px;
  }

  .profile-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .profile-field {
    padding: 10px 11px;
  }

  .profile-section-title {
    margin-top: 15px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .profile-overlay,
  .profile-modal {
    animation: none;
  }
}


        .panel-title { margin: 0; font-size: 14px; font-weight: 800; }

        .filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 18px 20px;
}

.filters select {
  appearance: none;
  -webkit-appearance: none;

  min-width: 180px;
  max-width: 100%;
  min-height: 44px;
  padding: 0 42px 0 15px;

  border: 1px solid #dfe9e4;
  border-radius: 12px;

  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230d9669' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;

  color: #33465f;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
  outline: none;

  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.025);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.filters select:hover {
  border-color: #9bdcc2;
  background-color: #fcfffd;
}

.filters select:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
}

.filters select option {
  padding: 12px;
  background: #ffffff;
  color: #33465f;
  font-size: 13px;
}

.filters select option:checked {
  background: #e7f8ef;
  color: #087b56;
}

@media (max-width: 600px) {
  .filters {
    gap: 10px;
  }

  .filters select {
    flex: 1 1 100%;
    width: 100%;
    min-width: 0;
    min-height: 44px;
  }
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

        .status.rejected {
        background: #fee2e2;
        color: #b91c1c;
      }

  .action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 29px;
  min-height: 29px;
  min-width: 0;
  padding: 0 8px;
  border: 1px solid #e1e8f0;
  border-radius: 6px;
  background: #fff;
  color: #52667f;
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  flex: 0 0 auto;
  appearance: none;
  -webkit-appearance: none;
}

.action svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.action:hover {
  border-color: #0d9669;
  color: #087b56;
}

.action.remove {
  width: 29px;
  min-width: 29px;
  height: 29px;
  padding: 0;
}

.action.remove:hover {
  border-color: #fca5a5;
  color: #dc2626;
}

.actions {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: nowrap;
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.55);
}

.confirm-modal {
  width: 100%;
  max-width: 360px;
  padding: 24px;
  border-radius: 14px;
  background: #fff;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.confirm-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
}

.confirm-modal h3 {
  margin: 0 0 10px;
  color: #17243b;
  font-size: 18px;
}

.confirm-modal p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 22px;
}

.cancel-btn,
.delete-btn {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}

.cancel-btn {
  background: #fff;
  color: #475569;
}

.delete-btn {
  border-color: #dc2626;
  background: #dc2626;
  color: #fff;
}

.cancel-btn:hover {
  background: #f8fafc;
}

.delete-btn:hover {
  background: #b91c1c;
}

@media (max-width: 400px) {
  .confirm-modal {
    padding: 20px 16px;
  }
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
  <option value="Pending">Pending</option>
  <option value="Confirmed">Confirmed</option>
  <option value="Rejected">Rejected</option>
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
    className={`status ${volunteer.status.toLowerCase()}`}
  >
    {volunteer.status === "Pending" ? (
      <Clock size={12} />
    ) : volunteer.status === "Confirmed" ? (
      <CheckCircle2 size={12} />
    ) : (
      <X size={12} />
    )}

    {volunteer.status}
  </span>
</td>

  <td>
  <div className="actions">
    <button
  className="action"
  onClick={() => setSelectedProfile(volunteer)}
  title="View volunteer profile"
>
  <Eye size={13} />
  View Profile
</button>

    {volunteer.status === "Pending" ? (
      <>
        <button
          className="action"
          style={{
            borderColor: "#a7e8ce",
            background: "#effcf6",
            color: "#087b56",
          }}
          onClick={() =>
            updateStatus(volunteer.id, "Confirmed")
          }
          title="Confirm registration"
        >
          <CheckCircle2 size={14} />
          
        </button>

        <button
          className="action"
          style={{
            borderColor: "#fecaca",
            background: "#fff5f5",
            color: "#dc2626",
          }}
          onClick={() =>
            updateStatus(volunteer.id, "Rejected")
          }
          title="Reject registration"
        >
          <X size={14} />
          
        </button>
      </>
    ) : (
      <span
        style={{
          fontSize: 10,
          color: "#8795a8",
          fontWeight: 650,
        }}
      >
        <CheckCircle2
          size={13}
          style={{
            display: "inline",
            verticalAlign: "middle",
            marginRight: 4,
          }}
        />
        Decision locked
      </span>
    )}

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

                  {loading && (
  <tr>
    <td colSpan={5} className="empty">
      Loading registrations...
    </td>
  </tr>
)}

                  {!loading && filteredVolunteers.length === 0 && (
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
          <footer className="uv-footer-note">
  <span>© 2026 UnityVol · Volunteers · Community · Impact</span>
  <span>Volunteer coordination</span>
</footer>
        </section>
      </main>

      {pendingDelete && (
  <div className="confirm-overlay">
    <div
      className="confirm-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div className="confirm-icon">
        <Trash2 size={22} />
      </div>

      <h3 id="delete-title">Delete Registration?</h3>

      <p>
        Are you sure you want to delete{" "}
        <strong>{pendingDelete.name}</strong>?
        This action cannot be undone.
      </p>

      <div className="confirm-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setPendingDelete(null)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={confirmDelete}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}

{selectedProfile && (
  <div
    className="profile-overlay"
    onClick={() => setSelectedProfile(null)}
  >
    <div
      className="profile-modal"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="profile-header">
        <h2>Volunteer Profile</h2>

        <button
          type="button"
          className="action"
          onClick={() => setSelectedProfile(null)}
        >
          <X size={14} /> Close
        </button>
      </div>

      
<div className="profile-identity">
  {selectedProfile.profile?.profileImage ? (
    <img
      src={selectedProfile.profile.profileImage}
      alt={selectedProfile.profile?.name || selectedProfile.name}
    />
  ) : (
    <div className="profile-avatar">
      {selectedProfile.initials}
    </div>
  )}

  <div className="profile-identity-info">
    <h3>
      {selectedProfile.profile?.name || selectedProfile.name}
    </h3>
    <p>
      {selectedProfile.profile?.email || selectedProfile.email}
    </p>
  </div>
</div>

<div className="profile-section-title">
  Personal Information
</div>


      <div className="profile-grid">
        {[
          ["Full Name", selectedProfile.profile?.name || selectedProfile.name],
          ["Email", selectedProfile.profile?.email || selectedProfile.email],
          ["Phone", selectedProfile.profile?.phone],
          ["Location", selectedProfile.profile?.location],
          ["About Me", selectedProfile.profile?.bio],
          ["Skills", selectedProfile.profile?.skills?.join(", ")],
          ["Interests", selectedProfile.profile?.interests?.join(", ")],
          ["Event", selectedProfile.event],
          ["Event Date", selectedProfile.date],
          ["Registration Status", selectedProfile.status],
        ].map(([label, value]) => (
          <div className="profile-field" key={label}>
            <div className="profile-label">{label}</div>
            <div className="profile-value">
              {value || "Not provided"}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      <OrganizerAIChat />
    </div>
  );
}