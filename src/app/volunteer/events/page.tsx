
"use client";

import { useState } from "react";
import Link from "next/link";
import VolunteerSidebar from "@/components/VolunteerSidebar";
import {
  Search,
  MapPin,
  CalendarDays,
  Clock3,
  ArrowRight,
  HandHeart,
  Menu,
  X,
  SlidersHorizontal,
} from "lucide-react";

type EventItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  color: string;
  textColor: string;
};

const events: EventItem[] = [
  {
    id: 1,
    title: "Tree Plantation Drive",
    category: "Environment",
    date: "Nov 15, 2026",
    time: "9:00 AM",
    location: "Dhaka University",
    description:
      "Help make our communities greener by planting trees and promoting environmental awareness.",
    color: "#dcfce7",
    textColor: "#15803d",
  },
  {
    id: 2,
    title: "Digital Literacy Workshop",
    category: "Education",
    date: "Nov 22, 2026",
    time: "10:00 AM",
    location: "Dhanmondi, Dhaka",
    description:
      "Help people develop essential digital skills and become more confident with technology.",
    color: "#dbeafe",
    textColor: "#1d4ed8",
  },
  {
    id: 3,
    title: "Community Health Camp",
    category: "Healthcare",
    date: "Nov 30, 2026",
    time: "8:30 AM",
    location: "Mirpur, Dhaka",
    description:
      "Support a community health initiative by helping organize activities and assist visitors.",
    color: "#f3e8ff",
    textColor: "#7e22ce",
  },
  {
    id: 4,
    title: "Community Food Distribution",
    category: "Community",
    date: "Dec 5, 2026",
    time: "8:00 AM",
    location: "Uttara, Dhaka",
    description:
      "Join volunteers in organizing and distributing food packages to local families.",
    color: "#ffedd5",
    textColor: "#c2410c",
  },
  {
    id: 5,
    title: "Winter Clothes Collection",
    category: "Community",
    date: "Dec 10, 2026",
    time: "10:00 AM",
    location: "Mohammadpur, Dhaka",
    description:
      "Collect, sort and prepare warm clothing for people who need support during winter.",
    color: "#fce7f3",
    textColor: "#be185d",
  },
  {
    id: 6,
    title: "Children's Learning Day",
    category: "Education",
    date: "Dec 15, 2026",
    time: "9:30 AM",
    location: "Uttara, Dhaka",
    description:
      "Spend a meaningful day helping children learn through educational games and activities.",
    color: "#fef3c7",
    textColor: "#a16207",
  },
];

const categories = [
  "All Events",
  "Environment",
  "Education",
  "Healthcare",
  "Community",
];

export default function BrowseEventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Events");

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      activeCategory === "All Events" ||
      event.category === activeCategory;

    const matchesSearch =
      `${event.title} ${event.category} ${event.location} ${event.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="browse-app">
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

        .browse-main {
          min-height: 100vh;
          margin-left: 246px;
        }

        .browse-topbar {
          position: sticky;
          top: 0;
          z-index: 10;
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

        .browse-top-title {
          color: #607089;
          font-size: 12px;
        }

        .browse-mobile-menu {
          display: none;
          place-items: center;
          width: 37px;
          height: 37px;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

        .browse-content {
          max-width: 1500px;
          margin: 0 auto;
          padding: 28px;
        }

        .browse-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 24px;
        }

        .browse-eyebrow {
          margin: 0 0 8px;
          color: #119b6b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .browse-heading h1 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.8px;
        }

        .browse-subtitle {
          margin: 8px 0 0;
          color: #7c8ba0;
          font-size: 12px;
          line-height: 1.7;
        }

        .browse-count {
          padding: 11px 15px;
          border: 1px solid #d5f2e4;
          border-radius: 10px;
          background: #e8fff3;
          color: #087b56;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .browse-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .browse-search {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
          height: 46px;
          padding: 0 14px;
          border: 1px solid #e0e7f0;
          border-radius: 10px;
          background: white;
          color: #8795a8;
        }

        .browse-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #17243b;
          font-size: 12px;
        }

        .browse-filter-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #607089;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .browse-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 23px;
        }

        .browse-category {
          padding: 10px 15px;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          color: #607089;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .browse-category:hover {
          border-color: #9bdcc1;
          color: #087b56;
        }

        .browse-category.active {
          border-color: #0d9669;
          background: #0d9669;
          color: white;
        }

        .browse-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .browse-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e7edf4;
          border-radius: 14px;
          background: white;
          box-shadow: 0 3px 10px #243b5305;
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .browse-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px #243b5310;
        }

        .browse-card-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 112px;
          padding: 20px;
        }

        .browse-card-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid #ffffff90;
          border-radius: 14px;
          background: #ffffffb8;
        }

        .browse-category-tag {
          padding: 7px 10px;
          border-radius: 20px;
          background: #ffffffd9;
          font-size: 10px;
          font-weight: 800;
        }

        .browse-card-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 19px;
        }

        .browse-card-title {
          margin: 0;
          color: #293b52;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.5;
        }

        .browse-description {
          margin: 10px 0 17px;
          color: #7c8ba0;
          font-size: 11px;
          line-height: 1.8;
        }

        .browse-meta {
          display: grid;
          gap: 11px;
          margin-top: auto;
          padding: 15px 0;
          border-top: 1px solid #f0f3f7;
        }

        .browse-meta-item {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #607089;
          font-size: 11px;
        }

        .browse-meta-item svg {
          flex: none;
          color: #0d9669;
        }

        .browse-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 3px;
          padding-top: 15px;
          border-top: 1px solid #f0f3f7;
          color: #0d9669;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
        }

        .browse-details:hover {
          color: #087b56;
        }

        .browse-empty {
          grid-column: 1 / -1;
          padding: 55px 20px;
          border: 1px dashed #d8e2ed;
          border-radius: 13px;
          background: white;
          color: #8795a8;
          text-align: center;
        }

        .browse-empty h3 {
          margin: 12px 0 7px;
          color: #293b52;
          font-size: 15px;
        }

        .browse-empty p {
          margin: 0;
          font-size: 12px;
        }

        @media (max-width: 1200px) {
          .browse-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .browse-main {
            margin-left: 0;
          }

          .browse-mobile-menu {
            display: grid;
          }

          .browse-topbar {
            justify-content: flex-start;
            padding: 12px 18px;
          }

          .browse-content {
            padding: 22px 18px;
          }
        }

        @media (max-width: 600px) {
          .browse-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .browse-heading h1 {
            font-size: 24px;
          }

          .browse-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .browse-filter-label {
            padding: 5px 0;
          }

          .browse-grid {
            grid-template-columns: 1fr;
          }

          .browse-card-banner {
            min-height: 95px;
          }
        }
      `}</style>

      <VolunteerSidebar
        activePage="Events"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName="Sarah Ahmed"
        userRole="Volunteer"
        avatarText="SA"
      />

      <main className="browse-main">
        <header className="browse-topbar">
          <button
            type="button"
            className="browse-mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <span className="browse-top-title">
            Volunteer Workspace / Browse Events
          </span>
        </header>

        <section className="browse-content">
          <div className="browse-heading">
            <div>
              <p className="browse-eyebrow">
                Make a difference today
              </p>
              <h1>Browse Events</h1>
              <p className="browse-subtitle">
                Discover opportunities, connect with your community,
                and turn your time into meaningful impact.
              </p>
            </div>

            <div className="browse-count">
              {filteredEvents.length} Events Found
            </div>
          </div>

          <div className="browse-toolbar">
            <label className="browse-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events, categories, locations..."
                aria-label="Search events"
              />
            </label>

            <div className="browse-filter-label">
              <SlidersHorizontal size={16} />
              Filter by category
            </div>
          </div>

          <div className="browse-categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`browse-category ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="browse-grid">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <article className="browse-card" key={event.id}>
                  <div
                    className="browse-card-banner"
                    style={{ background: event.color }}
                  >
                    <div
                      className="browse-card-icon"
                      style={{ color: event.textColor }}
                    >
                      <HandHeart size={25} />
                    </div>

                    <span
                      className="browse-category-tag"
                      style={{ color: event.textColor }}
                    >
                      {event.category}
                    </span>
                  </div>

                  <div className="browse-card-body">
                    <h2 className="browse-card-title">
                      {event.title}
                    </h2>

                    <p className="browse-description">
                      {event.description}
                    </p>

                    <div className="browse-meta">
                      <div className="browse-meta-item">
                        <CalendarDays size={15} />
                        <span>{event.date}</span>
                      </div>

                      <div className="browse-meta-item">
                        <Clock3 size={15} />
                        <span>{event.time}</span>
                      </div>

                      <div className="browse-meta-item">
                        <MapPin size={15} />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <Link
                      href={`/volunteer/events/${event.id}`}
                      className="browse-details"
                    >
                      View Details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="browse-empty">
                <Search size={28} />
                <h3>No events found</h3>
                <p>
                  Try another search term or select a different category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
