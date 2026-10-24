
"use client";

import { useEffect, useState } from "react";
import VolunteerSidebar from "@/components/VolunteerSidebar";
import VolunteerAIChat from "@/components/volunteer/VolunteerAIChat";
import {
  Heart,
  CalendarDays,
  Clock3,
  MapPin,
  HandHeart,
  Trash2,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type EventItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  color: string;
  textColor: string;
};

export default function FavoritesPage() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
const [events, setEvents] = useState<EventItem[]>([]);

useEffect(() => {
  const saved = localStorage.getItem("volunteerFavorites");

  if (saved) {
    try {
      setFavoriteIds(JSON.parse(saved).map(String));
    } catch {
      setFavoriteIds([]);
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) throw new Error("Failed to load events");

      const data = await response.json();
      const eventList = Array.isArray(data) ? data : data.events ?? [];

      setEvents(
        eventList.map((event: any) => ({
          id: String(event._id ?? event.id),
          title: event.title,
          category: event.category ?? "Community",
          date: event.date ?? "",
          time: event.time ?? event.startTime ?? "",
          location: event.location ?? "",
          description: event.description ?? "",
          color: "#dcfce7",
          textColor: "#15803d",
        }))
      );
    } catch (error) {
      console.error("Failed to load favorite events:", error);
    }
  };

  fetchEvents();
}, []);

  const removeFavorite = (eventId: string) => {
  setFavoriteIds((previous) => {
    const updated = previous.filter((id) => id !== eventId);

    localStorage.setItem(
      "volunteerFavorites",
      JSON.stringify(updated)
    );

    return updated;
  });
};

  const favoriteEvents = events.filter((event) =>
    favoriteIds.includes(event.id)
  );

  return (
    <div className="favorites-app">
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

        button {
          font: inherit;
        }

        .favorites-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        .favorites-topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 16px;
          min-height: 68px;
          padding: 12px 28px;
          border-bottom: 1px solid #e7edf4;
          background: #ffffffed;
          backdrop-filter: blur(10px);
        }

        .favorites-top-title {
          color: #607089;
          font-size: 12px;
        }

        .favorites-mobile-menu {
          display: none;
          place-items: center;
          width: 37px;
          height: 37px;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

        .favorites-content {
          max-width: 1500px;
          margin: 0 auto;
          padding: 28px;
        }

        .favorites-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 25px;
        }

        .favorites-eyebrow {
          margin: 0 0 8px;
          color: #e11d48;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .favorites-heading h1 {
          margin: 0;
          color: #17243b;
          font-size: 28px;
          letter-spacing: -0.8px;
        }

        .favorites-subtitle {
          margin: 8px 0 0;
          color: #7c8ba0;
          font-size: 12px;
          line-height: 1.7;
        }

        .favorites-count {
          padding: 11px 15px;
          border: 1px solid #fecdd3;
          border-radius: 10px;
          background: #fff1f2;
          color: #be123c;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .favorite-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e7edf4;
          border-radius: 14px;
          background: white;
          box-shadow: 0 3px 10px #243b5305;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .favorite-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px #243b5310;
        }

        .favorite-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 112px;
          padding: 20px;
        }

        .favorite-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid #ffffff90;
          border-radius: 14px;
          background: #ffffffb8;
        }

        .favorite-category {
          padding: 7px 10px;
          border-radius: 20px;
          background: #ffffffd9;
          font-size: 10px;
          font-weight: 800;
        }

        .favorite-body {
          display: flex;
          flex-direction: column;
          padding: 19px;
        }

        .favorite-title {
          margin: 0;
          color: #293b52;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.5;
        }

        .favorite-description {
          margin: 10px 0 17px;
          color: #7c8ba0;
          font-size: 11px;
          line-height: 1.8;
        }

        .favorite-meta {
          display: grid;
          gap: 11px;
          margin-top: auto;
          padding: 15px 0;
          border-top: 1px solid #f0f3f7;
        }

        .favorite-meta-item {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #607089;
          font-size: 11px;
        }

        .favorite-meta-item svg {
          flex-shrink: 0;
          color: #0d9669;
        }

        .favorite-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid #f0f3f7;
        }

        .favorite-browse-link,
        .favorite-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 38px;
          padding: 9px 12px;
          border: 1px solid #0d9669;
          border-radius: 8px;
          background: white;
          color: #0d9669;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .favorite-browse-link:hover {
          background: #ecfdf5;
        }

        .favorite-remove {
          border-color: #fecdd3;
          color: #e11d48;
        }

        .favorite-remove:hover {
          background: #fff1f2;
        }

        .favorites-empty {
          grid-column: 1 / -1;
          padding: 55px 20px;
          border: 1px dashed #d8e2ed;
          border-radius: 13px;
          background: white;
          text-align: center;
        }

        .favorites-empty-icon {
          display: grid;
          place-items: center;
          width: 64px;
          height: 64px;
          margin: 0 auto;
          border-radius: 20px;
          background: #fff1f2;
          color: #e11d48;
        }

        .favorites-empty h2 {
          margin: 16px 0 8px;
          color: #293b52;
          font-size: 18px;
        }

        .favorites-empty p {
          margin: 0 auto 20px;
          max-width: 420px;
          color: #7c8ba0;
          font-size: 12px;
          line-height: 1.8;
        }

        @media (max-width: 1200px) {
          .favorites-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .favorites-main {
            margin-left: 0;
          }

          .favorites-mobile-menu {
            display: grid;
          }

          .favorites-topbar {
            padding: 12px 18px;
          }

          .favorites-content {
            padding: 22px 18px;
          }
        }

        @media (max-width: 600px) {
          .favorites-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .favorites-heading h1 {
            font-size: 24px;
          }

          .favorites-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <VolunteerSidebar
        activePage="Favorites"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName="Sarah Ahmed"
        userRole="Volunteer"
        avatarText="SA"
      />

      <main className="favorites-main">
        <header className="favorites-topbar">
          <button
            type="button"
            className="favorites-mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <span className="favorites-top-title">
            Volunteer Workspace / Favorites
          </span>
        </header>

        <section className="favorites-content">
          <div className="favorites-heading">
            <div>
              <p className="favorites-eyebrow">
                Your saved opportunities
              </p>

              <h1>Favorite Events</h1>

              <p className="favorites-subtitle">
                Keep track of the volunteering opportunities
                you love and want to join.
              </p>
            </div>

            <div className="favorites-count">
              {favoriteEvents.length} Saved Events
            </div>
          </div>

          <div className="favorites-grid">
            {favoriteEvents.length > 0 ? (
              favoriteEvents.map((event) => (
                <article className="favorite-card" key={event.id}>
                  <div
                    className="favorite-banner"
                    style={{ background: event.color }}
                  >
                    <div
                      className="favorite-icon"
                      style={{ color: event.textColor }}
                    >
                      <HandHeart size={25} />
                    </div>

                    <span
                      className="favorite-category"
                      style={{ color: event.textColor }}
                    >
                      {event.category}
                    </span>
                  </div>

                  <div className="favorite-body">
                    <h2 className="favorite-title">
                      {event.title}
                    </h2>

                    <p className="favorite-description">
                      {event.description}
                    </p>

                    <div className="favorite-meta">
                      <div className="favorite-meta-item">
                        <CalendarDays size={15} />
                        <span>{event.date}</span>
                      </div>

                      <div className="favorite-meta-item">
                        <Clock3 size={15} />
                        <span>{event.time}</span>
                      </div>

                      <div className="favorite-meta-item">
                        <MapPin size={15} />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="favorite-actions">
                      <Link
                        href="/volunteer/events"
                        className="favorite-browse-link"
                      >
                        Browse Events
                        <ArrowRight size={14} />
                      </Link>

                      <button
                        type="button"
                        className="favorite-remove"
                        onClick={() => removeFavorite(event.id)}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="favorites-empty">
                <div className="favorites-empty-icon">
                  <Heart size={30} />
                </div>

                <h2>No Favorite Events Yet</h2>

                <p>
                  You have not saved any events yet.
                  Browse events and tap the heart icon to
                  add opportunities to your favorites.
                </p>

                <Link
                  href="/volunteer/events"
                  className="favorite-browse-link"
                >
                  Explore Events
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <VolunteerAIChat />
    </div>
  );
}
