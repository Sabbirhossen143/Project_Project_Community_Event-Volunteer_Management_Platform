
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import OrganizerSidebar from "@/components/OrganizerSidebar";
import OrganizerAIChat from "@/components/Organizer/OrganizerAIChat";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarDays,
  Users,
  ChartNoAxesColumn,
  LogOut,
  Menu,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  CalendarCheck,
  MapPin,
  CheckCircle2,
  HandHeart,
  MoreHorizontal,
  Eye,
  Plus,
  X,
  Send,
  Sparkles,
  Clock,
  Leaf,
  Filter,
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
  image: string;
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
    image: "🌱",
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
    image: "💻",
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
    image: "🩺",
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
    image: "🤝",
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
    image: "♻️",
  },
];

const categoryColors: Record<string, string> = {
  Environment: "#34c99a",
  Education: "#8b5cf6",
  Health: "#ec4899",
  Community: "#f59e0b",
};

const recentRegistrations = [
  {
    id: 1,
    name: "Ayesha Rahman",
    initials: "AR",
    event: "Tree Plantation Drive",
    date: "Nov 15, 2026",
    status: "Confirmed",
    color: "#dcfce7",
  },
  {
    id: 2,
    name: "Tanvir Hasan",
    initials: "TH",
    event: "Digital Literacy Workshop",
    date: "Nov 22, 2026",
    status: "Pending",
    color: "#dbeafe",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    initials: "NJ",
    event: "Free Health Camp",
    date: "Nov 30, 2026",
    status: "Confirmed",
    color: "#f3e8ff",
  },
  {
    id: 4,
    name: "Rafi Ahmed",
    initials: "RA",
    event: "Cloth Donation Drive",
    date: "Dec 05, 2026",
    status: "Confirmed",
    color: "#ffedd5",
  },
];

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("Last 7 days");
  const [showProfile, setShowProfile] = useState(false);
  const [showAllRegistrations, setShowAllRegistrations] = useState(false);
  const [notice, setNotice] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [today, setToday] = useState<Date | null>(null);


useEffect(() => {
  function handleOutsideClick(event: MouseEvent) {
    if (
  profileRef.current &&
  !profileRef.current.contains(event.target as Node)
) {
  setShowProfile(false);
  setShowNotifications(false);
}
  }

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);

useEffect(() => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  setToday(currentDate);
}, []);


  const [aiMessage, setAiMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "assistant" | "user"; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hi Sarah! 👋 I'm your UnityVol AI assistant. Tell me your event requirements, and I can help you plan activities, recruit volunteers, and organize community projects.",
    },
  ]);

  const totalEvents = events.length;

  const upcomingEvents = events.filter(
    (event) => event.status === "Upcoming"
  ).length;

  const completedEvents = events.filter(
    (event) => event.status === "Completed"
  ).length;

  const totalVolunteers = events.reduce(
    (sum, event) => sum + event.registered,
    0
  );

  const availableSlots = events
    .filter((event) => event.status === "Upcoming")
    .reduce(
      (sum, event) => sum + Math.max(event.capacity - event.registered, 0),
      0
    );

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};

    events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || "#64748b",
    }));
  }, [events]);

  const filteredEvents = events.filter((event) =>
    `${event.title} ${event.category} ${event.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredRegistrations = recentRegistrations.filter((person) =>
    `${person.name} ${person.event} ${person.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const upcomingList = events
    .filter((event) => event.status === "Upcoming")
    .slice(0, 4);

  const eventReminders = useMemo(() => {
  if (!today) return [];

  return events
    .filter((event) => event.status === "Upcoming")
    .map((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      const daysUntil = Math.round(
        (eventDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return {
        ...event,
        daysUntil,
      };
    })
    .filter(
      (event) =>
        !Number.isNaN(event.daysUntil) &&
        event.daysUntil >= 0
    )
    .sort((a, b) => a.daysUntil - b.daysUntil);
}, [events, today]);

const notificationCount =
  eventReminders.length + recentRegistrations.length;

  function sendAiMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = aiMessage.trim();
    if (!message) return;

    setChatMessages((current) => [
      ...current,
      { role: "user", text: message },
      {
        role: "assistant",
        text: "Thanks for sharing your requirement! This chat interface is ready. To generate real AI answers tailored to your request, connect it to your AI API/backend.",
      },
    ]);

    setAiMessage("");
  }


  return (
    <div className="uv-shell">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f7fb;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .uv-shell {
          min-height: 100vh;
          color: #17243b;
        }

        .uv-sidebar {
          position: fixed;
          z-index: 40;
          inset: 0 auto 0 0;
          display: flex;
          width: 246px;
          flex-direction: column;
          overflow-y: auto;
          background: #12223a;
          color: #d9e4f3;
          transition: transform 0.25s ease;
        }

        
.uv-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 23px 24px 28px;
  color: white;
  text-decoration: none;
}

.uv-logo {
  display: block;
  width: 42px;
  height: 42px;
  flex: none;
  overflow: visible;
}

.uv-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.uv-brand-name {
  font-size: 21px;
  font-weight: 850;
  letter-spacing: -0.7px;
  color: white;
}

.uv-brand-highlight {
  color: #28c76f;
}

.uv-brand-caption {
  margin-top: 7px;
  color: #a5b6c9;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.2px;
  white-space: nowrap;
}

        .uv-nav {
          display: grid;
          gap: 7px;
          padding: 0 13px;
        }

        .uv-nav a {
          display: flex;
          align-items: center;
          gap: 13px;
          min-height: 44px;
          padding: 0 13px;
          border-radius: 9px;
          color: #c1cddd;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.18s;
        }

        .uv-nav a:hover {
          background: #ffffff0c;
          color: white;
        }

        .uv-nav a.active {
          color: white;
          background: linear-gradient(100deg, #119b6b, #087a57);
          box-shadow: 0 5px 15px #07966a30;
        }

        .uv-sidebar-spacer {
          flex: 1;
          min-height: 35px;
        }

        .uv-sidebar-card {
          margin: 12px;
          padding: 15px;
          border: 1px solid #ffffff14;
          border-radius: 12px;
          background: #ffffff08;
        }

        .uv-sidebar-card-icon {
          display: grid;
          width: 36px;
          height: 36px;
          place-items: center;
          margin-bottom: 10px;
          border-radius: 10px;
          background: #ffffff12;
          color: #52dda8;
        }

        .uv-sidebar-card h3 {
          margin: 0 0 6px;
          color: white;
          font-size: 12px;
        }

        .uv-sidebar-card p {
          margin: 0;
          color: #a7b8cb;
          font-size: 10px;
          line-height: 1.6;
        }

        .uv-side-bottom {
          padding: 16px 14px 21px;
          border-top: 1px solid #ffffff12;
        }

        .uv-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 7px 16px;
        }

        .uv-avatar {
          display: grid;
          flex: none;
          width: 37px;
          height: 37px;
          place-items: center;
          border-radius: 50%;
          background: #d5e9df;
          color: #176748;
          font-size: 12px;
          font-weight: 800;
        }

        .uv-user-name {
          color: white;
          font-size: 12px;
          font-weight: 700;
        }

        .uv-user-role {
          margin-top: 3px;
          color: #9caec5;
          font-size: 11px;
        }

        .uv-logout {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 11px;
          padding: 11px 9px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #c7d3e2;
          text-align: left;
          font-size: 12px;
          cursor: pointer;
        }

        .uv-logout:hover {
          background: #ffffff0b;
          color: white;
        }

        .uv-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        .uv-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          height: 67px;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 0 28px;
          border-bottom: 1px solid #e7edf4;
          background: #ffffffed;
          backdrop-filter: blur(12px);
        }

        .uv-top-left {
          display: flex;
          flex: 1;
          align-items: center;
          gap: 15px;
          min-width: 0;
        }

        .uv-icon-button {
          display: grid;
          width: 37px;
          height: 37px;
          flex: none;
          place-items: center;
          border: 1px solid #e6ebf2;
          border-radius: 10px;
          background: white;
          color: #607089;
          cursor: pointer;
        }

        .uv-search {
          display: flex;
          width: min(100%, 360px);
          height: 38px;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          border: 1px solid #e0e7f0;
          border-radius: 9px;
          background: #fbfcfe;
          color: #8a98ac;
        }

        .uv-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #1b2a41;
          font-size: 12px;
        }

        .uv-search input::placeholder {
          color: #98a5b6;
        }

        .uv-top-right {
          position: relative;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .uv-bell {
  position: relative;
  display: grid;
  width: 38px;
  height: 38px;
  flex: none;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.uv-bell:hover {
  border-color: #10b981;
  background: #ecfdf5;
  color: #059669;
}

.uv-bell-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  border: 2px solid white;
  border-radius: 50%;
  background: #ef4444;
}

        .uv-profile {
          display: flex;
          align-items: center;
          gap: 9px;
          border: 0;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .uv-profile .uv-avatar {
          width: 35px;
          height: 35px;
          background: #d7e6f6;
          color: #26578d;
        }

        .uv-profile-name {
          color: #24334a;
          font-size: 12px;
          font-weight: 750;
        }

        .uv-profile-role {
          margin-top: 2px;
          color: #8795a8;
          font-size: 10px;
        }

        .uv-profile-menu {
          position: absolute;
          top: 48px;
          right: 0;
          z-index: 50;
          width: 175px;
          padding: 7px;
          border: 1px solid #e6ebf2;
          border-radius: 10px;
          background: white;
          box-shadow: 0 12px 30px #182b4417;
        }

        .uv-notification-menu {
  position: absolute;
  top: 48px;
  right: 45px;
  z-index: 60;
  width: min(360px, calc(100vw - 30px));
  max-height: 420px;
  overflow-y: auto;
  border: 1px solid #e6ebf2;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 15px 40px #182b441c;
}

.uv-notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #edf1f5;
}

.uv-notification-header h3 {
  margin: 0;
  color: #24334a;
  font-size: 14px;
}

.uv-notification-header p {
  margin: 5px 0 0;
  color: #8795a8;
  font-size: 11px;
}

.uv-notification-count {
  display: grid;
  min-width: 25px;
  height: 25px;
  place-items: center;
  padding: 0 6px;
  border-radius: 50%;
  background: #e5f8ef;
  color: #087b56;
  font-size: 11px;
  font-weight: 800;
}

.uv-notification-list {
  display: grid;
}

.uv-notification-item {
  display: flex;
  gap: 11px;
  padding: 14px;
  border-bottom: 1px solid #edf1f5;
}

.uv-notification-item:last-child {
  border-bottom: 0;
}

.uv-notification-icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: none;
  place-items: center;
  border-radius: 10px;
  background: #eaf9f3;
  color: #0d9669;
}

.uv-notification-info {
  min-width: 0;
  flex: 1;
}

.uv-notification-info strong {
  display: block;
  margin-bottom: 7px;
  color: #24334a;
  font-size: 12px;
}

.uv-notification-info span {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  color: #7c8ba0;
  font-size: 10px;
  overflow-wrap: anywhere;
}

.uv-notification-info p {
  margin: 8px 0 0;
  color: #0d9669;
  font-size: 10px;
  font-weight: 700;
}

.uv-notification-empty {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 28px 15px;
  color: #8795a8;
  text-align: center;
  font-size: 12px;
}

.uv-notification-empty p {
  margin: 0;
}

        .uv-profile-menu button {
          display: block;
          width: 100%;
          padding: 10px;
          border: 0;
          border-radius: 6px;
          background: white;
          color: #40516a;
          text-align: left;
          font-size: 12px;
          cursor: pointer;
        }

        .uv-profile-menu button:hover {
          background: #f4f8f6;
        }

        .uv-content {
          max-width: 1600px;
          margin: 0 auto;
          padding: 27px 28px 35px;
        }

        .uv-page-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 22px;
        }

        .uv-page-head h1 {
          margin: 0;
          color: #17243b;
          font-size: 25px;
          letter-spacing: -0.7px;
          font-weight: 800;
        }

        .uv-page-head p {
          margin: 6px 0 0;
          color: #7c8ba0;
          font-size: 12px;
        }

        .uv-primary {
          display: inline-flex;
          min-height: 39px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 14px;
          border: 0;
          border-radius: 9px;
          background: #0d9669;
          color: white;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 5px 12px #0d966921;
          transition: background 0.2s;
        }

        .uv-primary:hover {
          background: #087b56;
        }

        .uv-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .uv-stat {
          min-width: 0;
          padding: 18px 17px 15px;
          border: 1px solid #e9eef5;
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 7px #243b5305;
        }

        .uv-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .uv-stat-icon {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 11px;
        }

        .uv-stat-label {
          margin-top: 14px;
          color: #7a8aa0;
          font-size: 11px;
          font-weight: 600;
        }

        .uv-stat-value {
          margin-top: 3px;
          color: #18263d;
          font-size: 27px;
          line-height: 1.25;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .uv-stat-note {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 9px;
          color: #15966c;
          font-size: 10px;
        }

        .uv-panels {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
          align-items: stretch;
          gap: 15px;
          margin-bottom: 18px;
        }

        .uv-panel {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e7edf4;
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 7px #243b5305;
        }

        .uv-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 17px 17px 0;
        }

        .uv-panel-title {
          margin: 0;
          color: #24334a;
          font-size: 13px;
          font-weight: 800;
        }

        .uv-subtitle {
          color: #8c9aae;
          font-size: 10px;
        }

        .uv-select {
          max-width: 125px;
          padding: 6px 7px;
          border: 1px solid #e5ebf2;
          border-radius: 7px;
          outline: none;
          background: white;
          color: #607089;
          font-size: 10px;
        }

        .uv-category-body {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          padding: 25px 18px 28px;
        }

        .uv-donut {
          position: relative;
          display: grid;
          width: 130px;
          height: 130px;
          flex: none;
          place-items: center;
          border-radius: 50%;
        }

        .uv-donut::after {
          position: absolute;
          width: 78px;
          height: 78px;
          border-radius: 50%;
          background: white;
          content: "";
        }

        .uv-donut-center {
          z-index: 1;
          text-align: center;
        }

        .uv-donut-center strong {
          display: block;
          color: #1b2a41;
          font-size: 21px;
        }

        .uv-donut-center span {
          display: block;
          margin-top: 3px;
          color: #8b98aa;
          font-size: 9px;
        }

        .uv-legend {
          display: grid;
          flex: 1;
          gap: 13px;
          min-width: 0;
        }

        .uv-legend-row {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #718097;
          font-size: 10px;
        }

        .uv-legend-dot {
          width: 8px;
          height: 8px;
          flex: none;
          border-radius: 3px;
        }

        .uv-legend-row strong {
          margin-left: auto;
          color: #34435a;
          font-size: 10px;
        }

        .uv-chart {
          display: flex;
          height: 190px;
          align-items: stretch;
          gap: 12px;
          padding: 22px 17px 13px;
        }

        .uv-yaxis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-bottom: 29px;
          color: #a1adbd;
          font-size: 9px;
        }

        .uv-bars {
          display: flex;
          flex: 1;
          align-items: stretch;
          justify-content: space-around;
          gap: 10px;
          border-bottom: 1px solid #e9eef4;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 35px,
            #edf1f6 36px,
            transparent 37px
          );
        }

        .uv-bar-group {
          display: flex;
          width: 22%;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
        }

        .uv-bar {
          width: min(100%, 42px);
          min-height: 5px;
          border-radius: 5px 5px 0 0;
        }

        .uv-bar-label {
          min-height: 26px;
          color: #7d8ba0;
          text-align: center;
          font-size: 9px;
          line-height: 1.35;
        }

        .uv-ai-panel {
          display: flex;
          min-height: 300px;
          flex-direction: column;
          margin-bottom: 18px;
        }

        .uv-ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          flex: none;
          padding: 6px 9px;
          border-radius: 20px;
          background: #e5f8ef;
          color: #11815c;
          font-size: 10px;
          font-weight: 800;
        }

        .uv-ai-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding: 13px 17px 10px;
        }

        .uv-ai-suggestions button {
          padding: 8px 10px;
          border: 1px solid #dcece5;
          border-radius: 7px;
          background: #f4fbf7;
          color: #147d5c;
          font-size: 10px;
          cursor: pointer;
        }

        .uv-ai-suggestions button:hover {
          background: #e5f7ed;
        }

        .uv-ai-messages {
          display: flex;
          min-height: 100px;
          max-height: 210px;
          flex-direction: column;
          gap: 9px;
          overflow-y: auto;
          padding: 12px 17px;
          border-top: 1px solid #edf1f5;
        }

        .uv-ai-message {
          max-width: 88%;
          padding: 10px 12px;
          border-radius: 9px;
          font-size: 11px;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }

        .uv-ai-message.assistant {
          align-self: flex-start;
          border: 1px solid #e5eee9;
          background: #f5faf7;
          color: #405b4e;
        }

        .uv-ai-message.user {
          align-self: flex-end;
          background: #0d9669;
          color: white;
        }

        .uv-ai-form {
          display: flex;
          gap: 8px;
          padding: 12px 17px;
          border-top: 1px solid #edf1f5;
        }

        .uv-ai-form input {
          width: 100%;
          min-width: 0;
          padding: 11px 12px;
          border: 1px solid #e0e7f0;
          border-radius: 8px;
          outline: none;
          font-size: 11px;
        }

        .uv-ai-form input:focus {
          border-color: #20ad7d;
        }

        .uv-ai-form .uv-primary {
          min-height: 38px;
          flex: none;
          padding: 0 13px;
          font-size: 11px;
        }

        .uv-ai-disclaimer {
          margin: 0;
          padding: 0 17px 13px;
          color: #94a1af;
          font-size: 9px;
        }

        .uv-upcoming-list {
          display: grid;
          gap: 14px;
          padding: 18px 15px;
        }

        .uv-upcoming-item {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .uv-event-emoji {
          display: grid;
          width: 43px;
          height: 43px;
          flex: none;
          place-items: center;
          border-radius: 10px;
          background: #edf7f2;
          font-size: 21px;
        }

        .uv-upcoming-info {
          min-width: 0;
          flex: 1;
        }

        .uv-upcoming-title {
          overflow: hidden;
          color: #2b3b52;
          font-size: 10px;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .uv-upcoming-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 5px;
          overflow: hidden;
          color: #8795a8;
          font-size: 9px;
          white-space: nowrap;
        }

        .uv-progress-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 7px;
        }

        .uv-progress {
          height: 5px;
          flex: 1;
          overflow: hidden;
          border-radius: 9px;
          background: #edf1f6;
        }

        .uv-progress-fill {
          height: 100%;
          border-radius: 9px;
          background: #25bd91;
        }

        .uv-progress-label {
          color: #718097;
          font-size: 9px;
          white-space: nowrap;
        }

        .uv-table-panel {
          margin-bottom: 18px;
        }

        .uv-table-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px;
        }

        .uv-table-tools {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .uv-outline-btn {
          display: inline-flex;
          min-height: 31px;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 10px;
          border: 1px solid #e1e8f0;
          border-radius: 7px;
          background: white;
          color: #64748b;
          font-size: 10px;
          cursor: pointer;
        }

        .uv-outline-btn:hover {
          border-color: #0d9669;
          color: #087b56;
        }

        .uv-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .uv-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          white-space: nowrap;
        }

        .uv-table th {
          padding: 11px 15px;
          background: #f8fafc;
          color: #8492a6;
          font-size: 10px;
          font-weight: 700;
        }

        .uv-table td {
          padding: 12px 15px;
          border-top: 1px solid #eff2f6;
          color: #617189;
          font-size: 10px;
        }

        .uv-table tbody tr:hover {
          background: #fbfdfc;
        }

        .uv-event-title-cell {
          color: #2d3d54 !important;
          font-weight: 750;
        }

        .uv-category-pill,
        .uv-status-pill {
          display: inline-flex;
          align-items: center;
          border-radius: 20px;
          padding: 5px 9px;
          font-size: 9px;
          font-weight: 700;
        }

        .uv-status-pill {
          background: #e5f8ef;
          color: #16855f;
        }

        .uv-status-pill.completed {
          background: #eaf1ff;
          color: #456cc4;
        }

        .uv-status-pill.draft {
          background: #fff3dd;
          color: #ad7413;
        }

        .uv-view-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 9px;
          border: 1px solid #dce5ee;
          border-radius: 6px;
          background: white;
          color: #4f6785;
          font-size: 10px;
          cursor: pointer;
        }

        .uv-view-btn:hover {
          border-color: #0d9669;
          color: #087b56;
        }

        .uv-empty {
          padding: 32px 15px !important;
          color: #8b98aa !important;
          text-align: center;
        }

        .uv-lower-panels {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          align-items: start;
          gap: 15px;
          margin-bottom: 18px;
        }

        .uv-registration-chart {
          display: flex;
          height: 150px;
          align-items: flex-end;
          justify-content: space-around;
          gap: 12px;
          padding: 14px 18px 8px;
          border-top: 1px solid #f0f3f6;
          border-bottom: 1px solid #f0f3f6;
        }

        .uv-reg-bar-group {
          display: flex;
          width: 22%;
          height: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          color: #7d8ba0;
          font-size: 9px;
          text-align: center;
        }

        .uv-reg-bar-group strong {
          color: #34435a;
          font-size: 10px;
        }

        .uv-reg-bar-track {
          display: flex;
          width: 30px;
          height: 82px;
          align-items: flex-end;
          overflow: hidden;
          border-radius: 5px 5px 0 0;
          background: #f1f4f7;
        }

        .uv-reg-bar-track span {
          display: block;
          width: 100%;
          min-height: 4px;
          border-radius: 5px 5px 0 0;
        }

        .uv-registration-list {
          padding: 2px 15px;
        }

        .uv-registration-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 9px;
          padding: 11px 0;
          border-bottom: 1px solid #eff2f6;
        }

        .uv-registration-row:last-child {
          border-bottom: 0;
        }

        .uv-registration-person {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 9px;
        }

        .uv-registration-avatar {
          display: grid;
          width: 30px;
          height: 30px;
          flex: none;
          place-items: center;
          border-radius: 50%;
          color: #375466;
          font-size: 9px;
          font-weight: 800;
        }

        .uv-registration-copy {
          display: grid;
          min-width: 0;
          gap: 3px;
        }

        .uv-registration-copy strong {
          overflow: hidden;
          color: #304256;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .uv-registration-copy span {
          overflow: hidden;
          color: #8795a8;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .uv-registration-status {
          flex: none;
          padding: 5px 7px;
          border-radius: 20px;
          background: #e5f8ef;
          color: #16855f;
          font-size: 8px;
          font-weight: 750;
        }

        .uv-registration-status.pending {
          background: #fff3dd;
          color: #ad7413;
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

        .uv-toast {
          position: fixed;
          z-index: 70;
          top: 82px;
          right: 25px;
          display: flex;
          align-items: center;
          gap: 9px;
          max-width: calc(100vw - 30px);
          padding: 13px 17px;
          border: 1px solid #b9ead5;
          border-radius: 10px;
          background: #effcf6;
          color: #087b56;
          font-size: 12px;
          box-shadow: 0 12px 35px #1d34421c;
        }

        .uv-toast button {
          display: grid;
          place-items: center;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .uv-mobile-scrim {
          display: none;
      }

        @media (max-width: 1250px) {
          .uv-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .uv-panels {
            grid-template-columns: 1fr 1fr;
          }

          .uv-lower-panels {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .uv-sidebar {
            transform: translateX(-100%);
          }

          .uv-sidebar.open {
            transform: translateX(0);
            box-shadow: 20px 0 60px #0d1b2d35;
          }

          .uv-main {
            margin-left: 0;
          }

          .uv-mobile-scrim {
            position: fixed;
            z-index: 30;
            inset: 0;
            display: block;
            border: 0;
            background: #0c1b2d66;
          }

          .uv-content {
            padding: 22px 20px 30px;
          }

          .uv-topbar {
            padding: 0 20px;
          }
        }

        @media (min-width: 901px) {
          .uv-mobile-toggle {
            display: none !important;
          }
        }

        @media (max-width: 650px) {
          .uv-topbar {
            height: 60px;
            gap: 9px;
            padding: 0 13px;
          }

          .uv-top-left {
            gap: 8px;
          }

          .uv-search {
            width: 100%;
          }

          .uv-top-right {
            gap: 7px;
          }

          .uv-profile-copy,
.uv-profile-chevron {
  display: none !important;
}

.uv-bell {
  display: grid !important;
  width: 38px;
  height: 38px;
  flex: none;
}

.uv-notification-menu {
  position: fixed;
  top: 65px;
  right: 10px;
  width: calc(100vw - 20px);
  max-width: 360px;
  max-height: min(420px, calc(100dvh - 85px));
}

          .uv-content {
            padding: 20px 13px 25px;
          }

          .uv-page-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .uv-page-head h1 {
            font-size: 22px;
          }

          .uv-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .uv-stat {
            padding: 14px;
          }

          .uv-stat-value {
            font-size: 24px;
          }

          .uv-panels {
            grid-template-columns: 1fr;
          }

          .uv-category-body {
            justify-content: center;
          }

          .uv-donut {
            width: 118px;
            height: 118px;
          }

          .uv-chart {
            height: 180px;
          }

          .uv-table-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .uv-footer-note {
            align-items: flex-start;
            flex-direction: column;
          }

          .uv-form-grid {
            grid-template-columns: 1fr;
          }

          .uv-ai-form {
            align-items: stretch;
          }
        }
      `}</style>

      <OrganizerSidebar
        activePage="Dashboard"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => setNotice("Connect this button to your sign-out flow.")}
      />

      {/* Main Content */}
      <main className="uv-main">
        <header className="uv-topbar">
          <div className="uv-top-left">
            <button
              className="uv-icon-button uv-mobile-toggle"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>

            <label className="uv-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events or volunteers..."
                aria-label="Search dashboard"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  style={{
                    border: 0,
                    background: "transparent",
                    color: "#8190a5",
                    cursor: "pointer",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </label>
          </div>

          <div className="uv-top-right" ref={profileRef}>
            <button
  type="button"
  className="uv-bell"
  aria-label="Notifications"
  aria-expanded={showNotifications}
  onClick={() => {
    setShowNotifications((current) => !current);
    setShowProfile(false);
  }}
>
  <Bell size={18} />

  {notificationCount > 0 && (
  <span className="uv-bell-dot" />
)}
</button>


{showNotifications && (
  <div className="uv-notification-menu">
    <div className="uv-notification-header">
      <div>
        <h3>Notifications</h3>
        <p>Event reminders and volunteer registrations</p>
      </div>

      <span className="uv-notification-count">
        {notificationCount}
      </span>
    </div>

    <div className="uv-notification-list">
      {/* Event reminders */}
      {eventReminders.map((event) => (
        <div
          className="uv-notification-item"
          key={`event-${event.id}`}
        >
          <div className="uv-notification-icon">
            <CalendarDays size={18} />
          </div>

          <div className="uv-notification-info">
            <strong>Event Reminder: {event.title}</strong>

            <span>
              <CalendarDays size={12} />
              {event.date}
            </span>

            <span>
              <MapPin size={12} />
              {event.location}
            </span>

            <p>
              {event.daysUntil === 0
                ? "Your event is today!"
                : event.daysUntil === 1
                ? "Your event is tomorrow!"
                : `${event.daysUntil} days left until your event.`}
            </p>
          </div>
        </div>
      ))}

      {/* Volunteer registration notifications */}
      {recentRegistrations.map((person) => (
        <div
          className="uv-notification-item"
          key={`volunteer-${person.id}`}
        >
          <div
            className="uv-notification-icon"
            style={{
              background: "#eff6ff",
              color: "#2563eb",
            }}
          >
            <HandHeart size={18} />
          </div>

          <div className="uv-notification-info">
            <strong>Volunteer Registration</strong>

            <span>
              <Users size={12} />
              {person.name} registered
            </span>

            <span>
              <CalendarDays size={12} />
              {person.event}
            </span>

            <span>
              <Clock size={12} />
              Event date: {person.date}
            </span>

            <p
              style={{
                color:
                  person.status === "Confirmed"
                    ? "#059669"
                    : "#d97706",
              }}
            >
              Status: {person.status}
            </p>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {notificationCount === 0 && (
        <div className="uv-notification-empty">
          <Bell size={26} />
          <p>No notifications right now.</p>
        </div>
      )}
    </div>
  </div>
)}

            <button
              className="uv-profile"
              onClick={() => setShowProfile((current) => !current)}
            >
              <div className="uv-avatar">SA</div>
              <div className="uv-profile-copy">
                <div className="uv-profile-name">Sarah Ahmed</div>
                <div className="uv-profile-role">Organizer</div>
              </div>
              <ChevronDown
                className="uv-profile-chevron"
                size={14}
                color="#7b899b"
              />
            </button>

            {showProfile && (
              <div className="uv-profile-menu">
                <Link
  href="/organizer/profile"
  onClick={() => setShowProfile(false)}
  style={{
    display: "block",
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    color: "#40516a",
    fontSize: "12px",
    textDecoration: "none",
  }}
>
  My Profile
</Link>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    setNotice("Connect this action to your sign-out flow.");
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="uv-content">
          {/* Welcome */}
          <section className="uv-page-head">
            <div>
              <h1>Welcome back, Sarah Ahmed! 👋</h1>
              <p>Here's what's happening with your events and volunteers.</p>
            </div>

            <Link className="uv-primary" href="/organizer/events/create">
              <Plus size={16} />
              Create Event
            </Link>
          </section>

          {/* Statistics */}
          <section className="uv-stats" aria-label="Event statistics">
            {[
              {
                label: "Total Events",
                value: totalEvents,
                note: "Across your organization",
                icon: CalendarDays,
                color: "#3478e5",
                bg: "#edf4ff",
              },
              {
                label: "Upcoming Events",
                value: upcomingEvents,
                note: "Ready to go",
                icon: CalendarCheck,
                color: "#7954d9",
                bg: "#f3efff",
              },
              {
                label: "Total Volunteers",
                value: totalVolunteers,
                note: "Across all events",
                icon: Users,
                color: "#286fe0",
                bg: "#edf4ff",
              },
              {
                label: "Available Slots",
                value: availableSlots,
                note: "Across upcoming events",
                icon: HandHeart,
                color: "#159a79",
                bg: "#eaf9f3",
              },
              {
                label: "Completed Events",
                value: completedEvents,
                note: "Successfully completed",
                icon: CheckCircle2,
                color: "#2b70db",
                bg: "#edf4ff",
              },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <article className="uv-stat" key={stat.label}>
                  <div className="uv-stat-top">
                    <div
                      className="uv-stat-icon"
                      style={{
                        background: stat.bg,
                        color: stat.color,
                      }}
                    >
                      <Icon size={20} strokeWidth={2.4} />
                    </div>
                    <ArrowUpRight size={14} color="#15966c" />
                  </div>
                  <div className="uv-stat-label">{stat.label}</div>
                  <div className="uv-stat-value">{stat.value}</div>
                  <div className="uv-stat-note">
                    <CheckCircle2 size={12} />
                    {stat.note}
                  </div>
                </article>
              );
            })}
          </section>

          {/* Category chart and registration chart */}
          <section className="uv-panels">
            <article className="uv-panel">
              <div className="uv-panel-head">
                <h2 className="uv-panel-title">Events by Category</h2>
                <button
                  className="uv-icon-button"
                  aria-label="Category chart information"
                  onClick={() =>
                    setNotice("This chart updates when you create a new event.")
                  }
                >
                  <MoreHorizontal size={17} />
                </button>
              </div>

              <div className="uv-category-body">
                <div
                  className="uv-donut"
                  style={{
                    background: `conic-gradient(${categoryData
                      .map((item, index) => {
                        const total =
                          categoryData.reduce(
                            (sum, row) => sum + row.value,
                            0
                          ) || 1;

                        const start =
                          (categoryData
                            .slice(0, index)
                            .reduce((sum, row) => sum + row.value, 0) /
                            total) *
                          100;

                        const end = start + (item.value / total) * 100;
                        return `${item.color} ${start}% ${end}%`;
                      })
                      .join(", ")})`,
                  }}
                >
                  <div className="uv-donut-center">
                    <strong>{totalEvents}</strong>
                    <span>Total Events</span>
                  </div>
                </div>

                <div className="uv-legend">
                  {categoryData.map((item) => (
                    <div className="uv-legend-row" key={item.name}>
                      <span
                        className="uv-legend-dot"
                        style={{ background: item.color }}
                      />
                      <span>{item.name}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="uv-panel">
              <div className="uv-panel-head">
                <h2 className="uv-panel-title">Volunteer Registrations</h2>
                <select
                  className="uv-select"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  aria-label="Registration chart period"
                >
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This year</option>
                </select>
              </div>

              <div className="uv-chart">
                <div className="uv-yaxis">
                  <span>20</span>
                  <span>15</span>
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>

                <div className="uv-bars">
                  {[
                    { label: "Tree Drive", value: 12, color: "#35c99b" },
                    { label: "Digital Skills", value: 8, color: "#3478e5" },
                    { label: "Health Camp", value: 5, color: "#8b5cf6" },
                    { label: "Cloth Drive", value: 18, color: "#f59e0b" },
                  ].map((item) => (
                    <div className="uv-bar-group" key={item.label}>
                      <strong style={{ fontSize: 10, color: "#34435a" }}>
                        {item.value}
                      </strong>
                      <div
                        className="uv-bar"
                        style={{
                          height: `${(item.value / 20) * 105}px`,
                          background: item.color,
                        }}
                        title={`${item.value} registrations`}
                      />
                      <span className="uv-bar-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          {/* Upcoming Events */}
          <section className="uv-panel uv-table-panel">
            <div className="uv-table-head">
              <div>
                <h2 className="uv-panel-title">Upcoming Events</h2>
                <p className="uv-subtitle" style={{ margin: "5px 0 0" }}>
                  Keep track of your next community activities.
                </p>
              </div>

              <button
                className="uv-outline-btn"
                onClick={() => handleNavigation("Manage Events")}
              >
                View all <ChevronRight size={13} />
              </button>
            </div>

            <div className="uv-upcoming-list">
              {upcomingList.map((event) => (
                <div className="uv-upcoming-item" key={event.id}>
                  <div className="uv-event-emoji">{event.image}</div>
                  <div className="uv-upcoming-info">
                    <div className="uv-upcoming-title">{event.title}</div>
                    <div className="uv-upcoming-meta">
                      <CalendarDays size={11} />
                      {event.date}
                      <span>·</span>
                      <MapPin size={11} />
                      {event.location}
                    </div>
                    <div className="uv-progress-row">
                      <div className="uv-progress">
                        <div
                          className="uv-progress-fill"
                          style={{
                            width: `${Math.min(
                              (event.registered / event.capacity) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="uv-progress-label">
                        {event.registered}/{event.capacity}
                      </span>
                    </div>
                  </div>
                  <button
                    className="uv-view-btn"
                    onClick={() =>
                      setNotice(
                        `${event.title}: ${event.registered} of ${event.capacity} slots filled.`
                      )
                    }
                  >
                    <Eye size={12} />
                    View
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Events and Volunteer Registrations side by side */}
          <section className="uv-lower-panels">
            <article className="uv-panel uv-table-panel" id="recent-events">
              <div className="uv-table-head">
                <div>
                  <h2 className="uv-panel-title">Recent Events</h2>
                  <p className="uv-subtitle" style={{ margin: "5px 0 0" }}>
                    Review your latest event activity.
                  </p>
                </div>

                <div className="uv-table-tools">
                  <button
                    className="uv-outline-btn"
                    onClick={() => setSearch("")}
                  >
                    <Filter size={13} />
                    Clear search
                  </button>
                  <Link
                    className="uv-outline-btn"
                    href="/organizer/events/create"
                  >
                    <Plus size={13} />
                    Add event
                  </Link>
                </div>
              </div>

              <div className="uv-table-wrap">
                <table className="uv-table">
                  <thead>
                    <tr>
                      <th>Event Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Registered</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEvents.length ? (
                      filteredEvents.map((event) => (
                        <tr key={event.id}>
                          <td className="uv-event-title-cell">
                            {event.image} {event.title}
                          </td>
                          <td>
                            <span
                              className="uv-category-pill"
                              style={{
                                color: categoryColors[event.category] || "#64748b",
                                background: `${
                                  categoryColors[event.category] || "#64748b"
                                }18`,
                              }}
                            >
                              {event.category}
                            </span>
                          </td>
                          <td>{event.date}</td>
                          <td>
                            {event.registered}/{event.capacity}
                          </td>
                          <td>
                            <span
                              className={`uv-status-pill ${event.status.toLowerCase()}`}
                            >
                              {event.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="uv-view-btn"
                              onClick={() =>
                                setNotice(
                                  `${event.title}: ${event.registered} registered out of ${event.capacity} slots.`
                                )
                              }
                            >
                              <Eye size={12} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="uv-empty">
                          No events match "{search}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="uv-panel uv-table-panel" id="recent-registrations">
              <div className="uv-table-head">
                <div>
                  <h2 className="uv-panel-title">
                    Recent Volunteer Registrations
                  </h2>
                  <p className="uv-subtitle" style={{ margin: "5px 0 0" }}>
                    Latest volunteer sign-ups and status.
                  </p>
                </div>

                <button
                  className="uv-outline-btn"
                  onClick={() => setShowAllRegistrations((current) => !current)}
                >
                  {showAllRegistrations ? "Show less" : "View all"}
                  <ChevronRight size={13} />
                </button>
              </div>

              <div className="uv-registration-chart">
                {[
                  { label: "Tree Drive", value: 12, color: "#35c99b" },
                  { label: "Digital Skills", value: 8, color: "#3478e5" },
                  { label: "Health Camp", value: 5, color: "#8b5cf6" },
                  { label: "Cloth Drive", value: 18, color: "#f59e0b" },
                ].map((item) => (
                  <div className="uv-reg-bar-group" key={item.label}>
                    <strong>{item.value}</strong>
                    <div className="uv-reg-bar-track">
                      <span
                        style={{
                          height: `${(item.value / 20) * 100}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="uv-registration-list">
                {(showAllRegistrations
                  ? filteredRegistrations
                  : filteredRegistrations.slice(0, 3)
                ).map((person) => (
                  <div className="uv-registration-row" key={person.id}>
                    <div className="uv-registration-person">
                      <span
                        className="uv-registration-avatar"
                        style={{ background: person.color }}
                      >
                        {person.initials}
                      </span>
                      <div className="uv-registration-copy">
                        <strong>{person.name}</strong>
                        <span>{person.event}</span>
                        <span>{person.date}</span>
                      </div>
                    </div>
                    <span
                      className={`uv-registration-status ${person.status.toLowerCase()}`}
                    >
                      {person.status}
                    </span>
                  </div>
                ))}

                {filteredRegistrations.length === 0 && (
                  <p className="uv-empty">No registrations match your search.</p>
                )}
              </div>
            </article>
          </section>

          <footer className="uv-footer-note">
            <span>© 2026 UnityVol · People · Events · Impact</span>
            <span>Dashboard overview</span>
          </footer>
        </div>
      </main>

      <OrganizerAIChat />

      {/* Notification */}
      {notice && (
        <div className="uv-toast" role="status">
          <CheckCircle2 size={17} />
          <span>{notice}</span>
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            <X size={14} />
          </button>
        </div>
      )}


    </div>
  );
}
