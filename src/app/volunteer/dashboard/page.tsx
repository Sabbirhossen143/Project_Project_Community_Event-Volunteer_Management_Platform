"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import VolunteerSidebar from "@/components/VolunteerSidebar";
import VolunteerAIChat from "@/components/volunteer/VolunteerAIChat";
import {
  Compass,
  CalendarCheck,
  CalendarDays,
  MapPin,
  Clock3,
  ArrowRight,
  Menu,
  X,
  HandHeart,
  CheckCircle2,
  Search,
  UserRound,
  LogOut,
  ChevronDown,
   Bell,
} from "lucide-react";


type VolunteerEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  registered: boolean;
  status: string;
  color: string;
  textColor: string;
};

export default function VolunteerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [welcomeToast, setWelcomeToast] = useState(false);
  const { data: session } = useSession();
  const [profileName, setProfileName] = useState("");
const [profileImage, setProfileImage] = useState("");
  const [selectedEvent, setSelectedEvent] =
  useState<VolunteerEvent | null>(null);
  
const [events, setEvents] = useState<VolunteerEvent[]>([]);
const [registeredEvents, setRegisteredEvents] =
  useState<VolunteerEvent[]>([]);
const [eventsLoading, setEventsLoading] = useState(true);
const [eventsError, setEventsError] = useState("");


const userName = profileName || session?.user?.name || "Volunteer";
const avatarText = userName
  .split(" ")
  .filter(Boolean)
  .map((part) => part[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

  useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  useEffect(() => {
  if (!session) return;

  let cancelled = false;

  async function loadVolunteerProfile() {
    try {
      const response = await fetch("/api/volunteer/profile", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const result = await response.json();

      if (cancelled) return;

      setProfileName(result.profile?.name || "");
      setProfileImage(result.profile?.profileImage || "");
    } catch (error) {
      console.error("Dashboard profile load error:", error);
    }
  }

  loadVolunteerProfile();

  return () => {
    cancelled = true;
  };
}, [session]);
  
useEffect(() => {
  if (!session) return;

  let cancelled = false;

  async function loadDashboard() {
    try {
      setEventsLoading(true);
      setEventsError("");

      const [eventsResponse, registrationsResponse] =
        await Promise.all([
          fetch("/api/events", { cache: "no-store" }),
          fetch("/api/my-registrations", { cache: "no-store" }),
        ]);

      const [eventsData, registrationsData] = await Promise.all([
        eventsResponse.json(),
        registrationsResponse.json(),
      ]);

      if (!eventsResponse.ok) {
        throw new Error("Failed to load events.");
      }

      if (!registrationsResponse.ok) {
        throw new Error(
          registrationsData.message ||
            "Failed to load your registrations."
        );
      }

      const allEvents = Array.isArray(eventsData)
        ? eventsData
        : eventsData.events ?? [];

      const registrations = Array.isArray(registrationsData)
        ? registrationsData
        : registrationsData.registrations ?? [];

      const myRegistrations: VolunteerEvent[] = registrations.map(
        (registration: any) => {
          const event = registration.event ?? registration.eventInfo ?? registration;

          return {
            id: String(event._id ?? event.id ?? registration.eventId ?? registration._id),
            title: event.title ?? "Untitled Event",
            category: event.category ?? "Community",
            date: event.date
              ? new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "Date not specified",
            time: event.time ?? "Time not specified",
            location: event.location ?? "Location not specified",
            registered: true,
            status: registration.status ?? "Pending",
            color: "#dcfce7",
            textColor: "#15803d",
          };
        }
      );

      const registeredIds = new Set(
        myRegistrations.map((event) => event.id)
      );

      const formattedEvents: VolunteerEvent[] = allEvents.map(
        (event: any) => {
          const id = String(event._id ?? event.id);
          const registration = myRegistrations.find(
            (item) => item.id === id
          );

          return {
            id,
            title: event.title ?? "Untitled Event",
            category: event.category ?? "Community",
            date: event.date
              ? new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "Date not specified",
            time: event.time ?? "Time not specified",
            location: event.location ?? "Location not specified",
            registered: registeredIds.has(id),
            status: registration?.status ?? "",
            color: "#dcfce7",
            textColor: "#15803d",
          };
        }
      );

      if (!cancelled) {
        setRegisteredEvents(myRegistrations);
        setEvents(formattedEvents);
      }
    } catch (error) {
      if (!cancelled) {
        setEventsError(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      }
    } finally {
      if (!cancelled) setEventsLoading(false);
    }
  }

  loadDashboard();

  return () => {
    cancelled = true;
  };
}, [session]);


 useEffect(() => {
  if (!session?.user) return;

  if (sessionStorage.getItem("showWelcomeToast") === "true") {
    sessionStorage.removeItem("showWelcomeToast");
    setWelcomeToast(true);
  }
}, [session]);

useEffect(() => {
  if (!welcomeToast) return;

  const timer = setTimeout(() => {
    setWelcomeToast(false);
  }, 4000);

  return () => clearTimeout(timer);
}, [welcomeToast]);

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;

    if (
      profileRef.current &&
      !profileRef.current.contains(target)
    ) {
      setShowProfile(false);
    }

    if (
      notificationRef.current &&
      !notificationRef.current.contains(target)
    ) {
      setShowNotifications(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);


const reminderEvents = registeredEvents
  .map((event) => {
    const eventDate = new Date(event.date);
    const daysLeft =
      currentTime === null
        ? 0
        : Math.ceil(
            (eventDate.getTime() - currentTime) /
              (1000 * 60 * 60 * 24)
          );

    return { ...event, daysLeft };
  })
  .filter(
    (event) => currentTime !== null && event.daysLeft >= 0
  )
  .sort((a, b) => a.daysLeft - b.daysLeft);

const notificationCount = reminderEvents.filter(
  (event) => event.daysLeft <= 7
).length;


  const upcomingEvents = events.filter((event) => {
    if (currentTime === null) return true;

    return new Date(event.date).getTime() >= currentTime;
  });

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

        .v-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        /* NAVBAR */
        .v-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
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

        .v-top-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .v-top-title {
          color: #607089;
          font-size: 12px;
          white-space: nowrap;
        }

        /* SEARCH BOX */
        .v-search {
          display: flex;
          align-items: center;
          gap: 9px;
          width: min(100%, 260px);
          height: 38px;
          flex-shrink: 1;
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

        .v-search:focus-within {
          border-color: #0d9669;
          box-shadow: 0 0 0 3px #0d966910;
        }

        /* RIGHT SIDE */
        .v-top-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 20px;
          margin-left: auto;
        }

        /* PROFILE BUTTON */
        .v-profile-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .v-profile {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 5px 7px;
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          color: #293b52;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
        }

        .v-profile:hover {
          background: #f4f7fb;
          border-color: #e7edf4;
        }

        /* NOTIFICATION */
.v-notification-wrap {
  position: relative;
  flex-shrink: 0;
}

.v-notification-btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid #e0e7f0;
  border-radius: 10px;
  background: white;
  color: #40516a;
  cursor: pointer;
  transition: all 0.2s;
}

.v-notification-btn:hover {
  background: #f0fdf7;
  border-color: #b7e7d0;
  color: #0d9669;
}

.v-notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  border: 2px solid white;
  border-radius: 20px;
  background: #ef4444;
  color: white;
  font-size: 9px;
  font-weight: 800;
}

.v-notification-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: -45px;
  z-index: 60;
  width: 330px;
  max-width: calc(100vw - 30px);
  overflow: hidden;
  border: 1px solid #e6ebf2;
  border-radius: 13px;
  background: white;
  box-shadow: 0 14px 35px #182b441a;
  animation: v-dropdown-in 0.15s ease-out;
}

.v-notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #edf1f5;
}

.v-notification-header strong {
  color: #24334a;
  font-size: 13px;
}

.v-notification-header small {
  color: #8795a8;
  font-size: 10px;
}


.v-notification-item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  width: 100%;
  padding: 14px 16px;
  border: 0;
  border-bottom: 1px solid #f0f3f7;
  background: white;
  color: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}

.v-notification-item:last-child {
  border-bottom: 0;
}

.v-notification-item:hover {
  background: #f8fbf9;
}

.v-notification-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #e5f8ef;
  color: #0d9669;
}

.v-notification-info {
  min-width: 0;
  flex: 1;
}

.v-notification-info strong {
  display: block;
  color: #293b52;
  font-size: 11px;
  line-height: 1.5;
}

.v-notification-info p {
  margin: 5px 0 0;
  color: #7c8ba0;
  font-size: 10px;
  line-height: 1.6;
}

.v-notification-days {
  display: inline-block;
  margin-top: 7px;
  padding: 4px 7px;
  border-radius: 6px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 9px;
  font-weight: 750;
}

.v-notification-empty {
  padding: 26px 18px;
  color: #8795a8;
  font-size: 11px;
  text-align: center;
  line-height: 1.8;
}

@media (max-width: 650px) {
  .v-notification-dropdown {
    right: -45px;
    width: min(330px, calc(100vw - 30px));
  }
}

        .v-avatar {
          display: grid;
          place-items: center;
          width: 35px;
          height: 35px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #d7e6f6;
          color: #26578d;
          font-size: 11px;
          font-weight: 800;
        }

        .v-profile-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .v-profile-info strong {
          color: #24334a;
          font-size: 12px;
          font-weight: 750;
        }

        .v-profile-info small {
          color: #8795a8;
          font-size: 10px;
        }

        .v-profile > svg {
          color: #8795a8;
          transition: transform 0.2s;
        }

        .v-profile .v-chevron-open {
          transform: rotate(180deg);
        }

        /* PROFILE DROPDOWN */
        .v-profile-dropdown {
          position: absolute;
          top: calc(100% + 9px);
          right: 0;
          z-index: 50;
          width: 175px;
          padding: 7px;
          border: 1px solid #e6ebf2;
          border-radius: 10px;
          background: white;
          box-shadow: 0 12px 30px #182b4417;
          animation: v-dropdown-in 0.15s ease-out;
        }

        @keyframes v-dropdown-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .v-dropdown-item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 10px;
          border: 0;
          border-radius: 6px;
          background: white;
          color: #40516a;
          font-size: 12px;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
        }

        .v-dropdown-item:hover {
          background: #f4f8f6;
        }

        .v-logout {
          color: #dc2626;
        }

        .v-logout:hover {
          background: #fef2f2;
        }

        /* MOBILE MENU */
        .v-mobile-menu {
          display: none;
          place-items: center;
          width: 37px;
          height: 37px;
          flex-shrink: 0;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

        /* CONTENT */
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
          font-weight: 800;
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

        /* STATS */
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

        /* PANELS */
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

        /* Welcome Toast */
.uv-toast {
  position: fixed;
  z-index: 9999;
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

  font-size: 13px;
  font-weight: 600;

  box-shadow: 0 12px 35px #1d34421c;
  animation: toastSlideIn 0.25s ease-out;
}

/* Close Button */
.uv-toast button {
  display: grid;
  place-items: center;
  flex-shrink: 0;

  padding: 2px;
  border: 0;
  border-radius: 4px;

  background: transparent;
  color: inherit;

  cursor: pointer;
}

.uv-toast button:hover {
  background: #d9f5e8;
}

/* Toast Animation */
@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsive */
@media (max-width: 650px) {
  .uv-toast {
    top: 70px;
    right: 12px;
    max-width: calc(100vw - 24px);
    padding: 11px 13px;
    font-size: 12px;
  }
}

        /* EVENTS */
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
          margin: 0 0 5px;
          color: #293b52;
          font-size: 13px;
          font-weight: 800;
        }

        .v-category {
          font-size: 10px;
          font-weight: 750;
        }

        .v-event-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 9px;
        }

        .v-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #8795a8;
          font-size: 10px;
        }

        .v-event-action {
          flex: none;
        }

        .v-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 20px;
          background: #dcfce7;
          color: #15803d;
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
        }

        .v-status.pending {
          background: #fef3c7;
          color: #a16207;
        }

        .v-empty {
          padding: 30px 20px;
          color: #8795a8;
          font-size: 12px;
          text-align: center;
        }

        /* BOTTOM SECTION */
        .v-bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          gap: 20px;
          align-items: stretch;
        }

        .v-bottom-grid .v-panel {
          margin-bottom: 0;
        }

        .v-tip {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 26px;
          background: linear-gradient(135deg, #e8fff3, #ffffff);
        }

        .v-tip-icon {
          display: grid;
          place-items: center;
          width: 45px;
          height: 45px;
          margin-bottom: 15px;
          border-radius: 13px;
          background: #d1fae5;
          color: #0d9669;
        }

        .v-tip h3 {
          margin: 0 0 9px;
          font-size: 17px;
        }

        .v-tip p {
          margin: 0 0 18px;
          color: #718096;
          font-size: 12px;
          line-height: 1.8;
        }

        /* TABLET */
        @media (max-width: 1100px) {
          .v-content {
            padding: 22px;
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

          .v-topbar {
            padding-right: 18px;
            padding-left: 18px;
          }

          .v-top-right {
            gap: 12px;
          }
        }

        /* MOBILE */
        @media (max-width: 900px) {
          .v-main {
            margin-left: 0;
          }

          .v-mobile-menu {
            display: grid;
          }

          .v-topbar {
            padding: 12px 18px;
          }

          .v-content {
            padding: 22px 18px;
          }
        }

        @media (max-width: 650px) {
          .v-topbar {
            flex-wrap: wrap;
            gap: 10px;
          }

          .v-top-left {
            width: auto;
            flex: 1;
            min-width: 0;
          }

          .v-top-title {
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .v-top-right {
            width: 100%;
            gap: 10px;
          }

          .v-search {
            width: auto;
            max-width: none;
            flex: 1;
            min-width: 0;
          }

          .v-profile-info,
          .v-profile > svg {
            display: none;
          }

          .v-welcome {
            align-items: flex-start;
            flex-direction: column;
          }

          .v-welcome h1 {
            font-size: 23px;
          }

          .v-stats {
            grid-template-columns: 1fr;
          }

          .v-stat {
            padding: 17px;
          }

          .v-event {
            align-items: flex-start;
            flex-direction: column;
          }

          .v-event-action {
            padding-left: 57px;
          }

          .v-event-meta {
            gap: 8px;
          }

          .v-panel-head {
            padding: 16px;
          }
        }

        
.v-details-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
}

.v-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
}

.v-event-modal {
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 26px;
  border: 1px solid #e7edf4;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 24px 70px #00000030;
  animation: v-modal-in 0.2s ease-out;
}

.v-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.v-modal-header h2 {
  margin: 0 0 8px;
  color: #17243b;
  font-size: 21px;
  font-weight: 800;
  line-height: 1.4;
}

.v-modal-close {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  color: #64748b;
  cursor: pointer;
}

.v-modal-close:hover {
  background: #f1f5f9;
  color: #17243b;
}

.v-modal-category {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  background: #e5f8ef;
  color: #0d9669;
  font-size: 11px;
  font-weight: 750;
}

.v-modal-info {
  display: grid;
  gap: 13px;
  margin-bottom: 24px;
}

.v-modal-info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px;
  border: 1px solid #edf1f5;
  border-radius: 10px;
  color: #40516a;
  font-size: 12px;
}

.v-modal-info-item svg {
  flex-shrink: 0;
  color: #0d9669;
}

.v-modal-register-note {
  margin: 0 0 14px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.7;
}

.v-modal-register-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  border: 0;
  border-radius: 10px;
  background: #0d9669;
  color: white;
  font-size: 12px;
  font-weight: 750;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}

.v-modal-register-btn:hover {
  background: #087b56;
}

@keyframes v-modal-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 500px) {
  .v-event-modal {
    padding: 20px;
  }

  .v-modal-header h2 {
    font-size: 18px;
  }
}

      `}</style>

      <VolunteerSidebar
  activePage="Dashboard"
  sidebarOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  onLogout={() => signOut({ callbackUrl: "/login" })}
  userName={userName}
  userRole="Volunteer"
  avatarText={avatarText}
  avatarImage={profileImage}
/>

      <main className="v-main">

        {welcomeToast && (
  <div className="uv-toast" role="status">
    <CheckCircle2 size={17} />
    <span>Welcome back, {userName}! 👋</span>
    <button
      onClick={() => setWelcomeToast(false)}
      aria-label="Dismiss welcome message"
    >
      <X size={14} />
    </button>
  </div>
)}

        {/* NAVBAR */}
        <header className="v-topbar">
          <div className="v-top-left">
            <button
              type="button"
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

          
<div className="v-top-right">
  {/* SEARCH */}
  <label className="v-search">
    <Search size={16} />
    <input
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      placeholder="Search upcoming events..."
      aria-label="Search upcoming events"
    />
  </label>

  {/* EVENT REMINDERS */}
  <div className="v-notification-wrap" ref={notificationRef}>
    <button
      type="button"
      className="v-notification-btn"
      aria-label="Event reminders"
      aria-expanded={showNotifications}
      onClick={() => {
        setShowNotifications((open) => !open);
        setShowProfile(false);
      }}
    >
      <Bell size={19} />

      {notificationCount > 0 && (
        <span className="v-notification-badge">
          {notificationCount}
        </span>
      )}
    </button>

    {showNotifications && (
      <div className="v-notification-dropdown">
        <div className="v-notification-header">
          <strong>Event Reminders</strong>
          <small>{reminderEvents.length} upcoming</small>
        </div>

        
{reminderEvents.length > 0 ? (
  reminderEvents.map((event) => (
    <Link
      href="/volunteer/events"
      className="v-notification-item"
      key={event.id}
      onClick={() => setShowNotifications(false)}
    >
      <div className="v-notification-icon">
        <CalendarDays size={18} />
      </div>

      <div className="v-notification-info">
        <strong>{event.title}</strong>

        <p>
          <Clock3
            size={11}
            style={{
              display: "inline",
              verticalAlign: "middle",
              marginRight: 4,
            }}
          />
          {event.date} · {event.time}
        </p>

        <span className="v-notification-days">
          {event.daysLeft === 0
            ? "Event is today!"
            : event.daysLeft === 1
            ? "1 day remaining"
            : `${event.daysLeft} days remaining`}
        </span>
      </div>
    </Link>
  ))
) : (
  <div className="v-notification-empty">
    <CalendarCheck
      size={25}
      style={{ marginBottom: 8 }}
    />
    <div>No upcoming registered events.</div>
    <div>Register for an event to see reminders.</div>
  </div>
)}
      </div>
    )}
  </div>

  {/* PROFILE DROPDOWN */}
  <div className="v-profile-wrap" ref={profileRef}>
    <button
      type="button"
      className="v-profile"
      onClick={() => setShowProfile((open) => !open)}
      aria-expanded={showProfile}
      aria-label="Open profile menu"
    >
      <span className="v-avatar">
  {profileImage ? (
    <img
      src={profileImage}
      alt="Your profile"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%",
      }}
    />
  ) : (
    avatarText
  )}
</span>

<span className="v-profile-info">
  <strong>{userName}</strong>
  <small>Volunteer</small>
</span>

      <ChevronDown
        size={15}
        className={showProfile ? "v-chevron-open" : ""}
      />
    </button>

    {showProfile && (
      <div className="v-profile-dropdown">
        <Link
          href="/volunteer/profile"
          className="v-dropdown-item"
          onClick={() => setShowProfile(false)}
        >
          <UserRound size={16} />
          My Profile
        </Link>

        <Link
          href="/login"
          className="v-dropdown-item v-logout"
          onClick={() => setShowProfile(false)}
        >
          <LogOut size={16} />
          Log out
        </Link>
      </div>
    )}
  </div>
</div>
</header>


        {/* DASHBOARD CONTENT */}
        <section className="v-content">
          <div className="v-welcome">
            <div>
              <p className="v-eyebrow">Your community matters</p>
              <h1>Welcome back, {userName}! 👋</h1>
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

          {/* STATS */}
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

              <div className="v-stat-number">
                {upcomingEvents.length}
              </div>

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
                {
                  registeredEvents.filter(
                    (event) => event.status === "Confirmed"
                  ).length
                }
              </div>

              <div className="v-stat-note">
                Registrations confirmed by organizers
              </div>
            </div>
          </div>

          {/* UPCOMING EVENTS */}
          <section className="v-panel">
            <div className="v-panel-head">
              <div>
                <h2 className="v-panel-title">
                  Upcoming Opportunities
                </h2>
                <p className="v-panel-subtitle">
                  Find an event that matches your interests.
                </p>
              </div>

              <Link href="/volunteer/events" className="v-text-link">
                Browse all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="v-event-list">
              {eventsLoading ? (
  <div className="v-empty">Loading events...</div>
) : eventsError ? (
  <div className="v-empty">{eventsError}</div>
) : filteredEvents.length > 0 ? (
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
                        <h3 className="v-event-title">
                          {event.title}
                        </h3>

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
                        <button
  type="button"
  className="v-text-link"
  onClick={() => setSelectedEvent(event)}
>
  View details <ArrowRight size={14} />
</button>
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

          {/* MY PARTICIPATION */}
          <div className="v-bottom-grid">
            <section className="v-panel">
              <div className="v-panel-head">
                <div>
                  <h2 className="v-panel-title">My Participation</h2>
                  <p className="v-panel-subtitle">
                    Keep track of your registrations.
                  </p>
                </div>

                <Link
                  href="/volunteer/my-events"
                  className="v-text-link"
                >
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

            {/* TIP */}
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

      
{selectedEvent && (
  <div
    className="v-modal-overlay"
    onClick={() => setSelectedEvent(null)}
  >
    <section
      className="v-event-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="v-event-modal-title"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="v-modal-header">
        <div>
          <span className="v-modal-category">
            {selectedEvent.category}
          </span>

          <h2
            id="v-event-modal-title"
            style={{ marginTop: 12 }}
          >
            {selectedEvent.title}
          </h2>
        </div>

        <button
          type="button"
          className="v-modal-close"
          onClick={() => setSelectedEvent(null)}
          aria-label="Close event details"
        >
          <X size={18} />
        </button>
      </div>

      <div className="v-modal-info">
        <div className="v-modal-info-item">
          <CalendarDays size={18} />
          <span>{selectedEvent.date}</span>
        </div>

        <div className="v-modal-info-item">
          <Clock3 size={18} />
          <span>{selectedEvent.time}</span>
        </div>

        <div className="v-modal-info-item">
          <MapPin size={18} />
          <span>{selectedEvent.location}</span>
        </div>
      </div>

      <p className="v-modal-register-note">
        Interested in participating? Go to Manage Events
        to view the full event information and complete
        your registration.
      </p>

      <Link
        href="/volunteer/events"
        className="v-modal-register-btn"
        onClick={() => setSelectedEvent(null)}
      >
        For registration, go to Manage Events
        <ArrowRight size={16} />
      </Link>
    </section>
  </div>
)}


      <VolunteerAIChat />
    </div>
  );
}