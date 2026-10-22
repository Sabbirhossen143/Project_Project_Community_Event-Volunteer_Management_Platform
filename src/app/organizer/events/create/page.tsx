"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OrganizerSidebar from "@/components/OrganizerSidebar";
import OrganizerAIChat from "@/components/Organizer/OrganizerAIChat";
import {
  CalendarPlus,
  CalendarDays,
  Menu,
  X,
  ArrowLeft,
  Calendar,
  MapPin,
  UsersRound,
  ChevronDown,
  Check,
  CheckCircle2,
} from "lucide-react";

export default function CreateEventPage() {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<
    "category" | "status" | null
  >(null);

  const [form, setForm] = useState({
    title: "",
    category: "Environment",
    date: "",
    startTime: "09:00",
    endTime: "12:00",
    location: "",
    capacity: "20",
    description: "",
    requirements: "",
    contactEmail: "",
    status: "Upcoming",
  });

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.endTime <= form.startTime) {
      alert("End time must be later than start time.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="page-shell">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f7fb;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          color: #17243b;
        }

        button,
        input,
        select,
        textarea {
          font: inherit;
        }

        .page-shell {
          min-height: 100vh;
        }

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

        .nav {
          display: grid;
          gap: 7px;
        }

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

        .nav a:hover {
          background: #ffffff0c;
          color: white;
        }

        .nav a.active {
          background: #0d9669;
          color: white;
        }

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

        .user-name {
          color: white;
          font-size: 12px;
          font-weight: 750;
        }

        .user-role {
          margin-top: 3px;
          color: #9caec5;
          font-size: 10px;
        }

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

        .main {
          min-height: 100vh;
          margin-left: 246px;
        }

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
          backdrop-filter: blur(12px);
        }

        .top-title {
          font-size: 13px;
          color: #607089;
        }

        .top-right {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #718096;
          font-size: 12px;
        }

        .online-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16a36f;
        }

        .mobile-menu {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e1e8f0;
          border-radius: 9px;
          background: white;
          color: #23334d;
          cursor: pointer;
        }

        .content {
          max-width: 1180px;
          margin: 0 auto;
          padding: 29px 30px 44px;
        }

        .crumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 17px;
          color: #8491a5;
          font-size: 11px;
        }

        .crumb a {
          color: #687991;
          text-decoration: none;
        }

        .page-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          margin-bottom: 24px;
        }

        .eyebrow {
          margin-bottom: 7px;
          color: #0c9568;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          color: #17243b;
          font-size: clamp(25px, 3vw, 32px);
          letter-spacing: -1px;
          font-Weight: 700;
        }

        .subtitle {
          margin: 9px 0 0;
          color: #748198;
          font-size: 13px;
          line-height: 1.6;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 13px;
          border: 1px solid #dce5ee;
          border-radius: 9px;
          background: white;
          color: #43536b;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .form-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 285px;
          align-items: start;
          gap: 20px;
        }

        .panel {
          overflow: hidden;
          border: 1px solid #e6ecf3;
          border-radius: 15px;
          background: white;
          box-shadow: 0 4px 18px #23334d05;
        }

        .panel-head {
          padding: 20px 22px 17px;
          border-bottom: 1px solid #edf1f6;
        }

        .panel-head h2 {
          margin: 0;
          font-size: 15px;
          letter-spacing: -0.25px;
        }

        .panel-head p {
          margin: 6px 0 0;
          color: #8793a6;
          font-size: 11px;
        }

        .panel-body {
          padding: 22px;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 16px;
          color: #273750;
          font-size: 12px;
          font-weight: 800;
        }

        .section-label span {
          display: grid;
          place-items: center;
          width: 27px;
          height: 27px;
          border-radius: 8px;
          background: #e8f7f0;
          color: #0b9868;
        }

        .fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 17px 15px;
        }

        .field {
          display: grid;
          gap: 7px;
          min-width: 0;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          color: #43516a;
          font-size: 11px;
          font-weight: 750;
        }

        .required {
          color: #e05b5b;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          min-width: 0;
          outline: none;
          border: 1px solid #dfe6ef;
          border-radius: 9px;
          background: #fcfdff;
          color: #24334a;
          padding: 11px 12px;
          font-size: 12px;
          transition: border 0.15s, box-shadow 0.15s;
        }

        .field input,
        .field select {
          height: 42px;
        }

        .field textarea {
          min-height: 104px;
          resize: vertical;
          line-height: 1.6;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #18a477;
          box-shadow: 0 0 0 3px #18a47716;
        }

        .custom-select {
          position: relative;
          width: 100%;
        }

        .select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 42px;
          padding: 0 12px;
          border: 1px solid #dfe6ef;
          border-radius: 10px;
          background: linear-gradient(180deg, #fff, #f9fbfd);
          color: #24334a;
          font-size: 12px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: border-color 0.18s, box-shadow 0.18s,
            background 0.18s;
        }

        .select-trigger:hover,
        .select-trigger[aria-expanded="true"] {
          border-color: #18a477;
          box-shadow: 0 0 0 3px #18a47712;
          background: #fff;
        }

        .select-trigger svg {
          color: #8190a4;
          transition: transform 0.18s ease;
        }

        .select-trigger .chevron-open {
          transform: rotate(180deg);
          color: #0e986b;
        }

        .select-menu {
          position: absolute;
          z-index: 25;
          top: calc(100% + 7px);
          left: 0;
          right: 0;
          max-height: 240px;
          overflow-y: auto;
          padding: 6px;
          border: 1px solid #e3eaf1;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 16px 36px #1b2b421c, 0 3px 8px #1b2b420a;
          animation: select-pop 0.14s ease-out;
        }

        .select-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 36px;
          padding: 8px 10px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          color: #53627a;
          font-size: 12px;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }

        .select-option:hover {
          background: #f0f8f4;
          color: #087f59;
        }

        .select-option.selected {
          background: #eaf8f1;
          color: #087f59;
          font-weight: 750;
        }

        .select-option.selected svg {
          color: #0e986b;
        }

        @keyframes select-pop {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: #a2adbc;
        }

        .hint {
          color: #95a0b0;
          font-size: 10px;
          line-height: 1.5;
        }

        .split {
          height: 1px;
          margin: 23px 0;
          background: #edf1f6;
        }

        .aside-stack {
          display: grid;
          gap: 17px;
        }

        .tips {
          display: grid;
          gap: 13px;
        }

        .tip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .tip-icon {
          display: grid;
          place-items: center;
          flex: none;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: #f0f7f4;
          color: #15996c;
        }

        .tip strong {
          display: block;
          color: #34435a;
          font-size: 11px;
        }

        .tip p {
          margin: 4px 0 0;
          color: #8793a5;
          font-size: 10px;
          line-height: 1.55;
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 22px;
          padding-top: 19px;
          border-top: 1px solid #edf1f6;
        }

        .footer-note {
          color: #8b97a8;
          font-size: 10px;
        }

        .actions {
          display: flex;
          gap: 9px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 15px;
          border: 1px solid #dce5ee;
          border-radius: 9px;
          background: white;
          color: #4b5b72;
          cursor: pointer;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
        }

        .btn-primary {
          border-color: #0e986b;
          background: #0e986b;
          color: white;
          box-shadow: 0 5px 12px #0e986b25;
        }

        .btn-primary:hover {
          background: #087f59;
        }

        .success {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 18px;
          padding: 13px 15px;
          border: 1px solid #bce9d3;
          border-radius: 10px;
          background: #effbf5;
          color: #176b4d;
          font-size: 12px;
          line-height: 1.6;
        }

        @media (max-width: 1080px) {
          .form-layout {
            grid-template-columns: minmax(0, 1fr) 245px;
          }

          .content {
            padding: 25px 20px 35px;
          }
        }

        @media (max-width: 850px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.2s;
          }

          .sidebar.open {
            transform: translateX(0);
            box-shadow: 20px 0 60px #0d1b2d35;
          }

          .main {
            margin-left: 0;
          }

          .mobile-menu {
            display: inline-flex;
          }

          .topbar {
            height: 60px;
            padding: 0 15px;
          }

          .form-layout {
            grid-template-columns: 1fr;
          }

          .aside-stack {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .content {
            padding: 20px 13px 30px;
          }

          .page-heading {
            flex-direction: column;
          }

          .fields {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .panel-body {
            padding: 17px;
          }

          .panel-head {
            padding: 17px;
          }

          .aside-stack {
            grid-template-columns: 1fr;
          }

          .form-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .actions {
            width: 100%;
          }

          .actions .btn {
            flex: 1;
          }

          .top-right {
            display: none;
          }
        }
      `}</style>

      <OrganizerSidebar
        activePage="Create Event"
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() =>
          alert("Logout can be connected to your authentication flow.")
        }
        userName="Organizer"
        userRole="Community Manager"
        avatarText="SH"
      />

      <main className="main">
        <header className="topbar">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
            }}
          >
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <span className="top-title">
              Organizer Portal{" "}
              <span style={{ color: "#c3ccd8" }}>/</span> Create Event
            </span>
          </div>

          <div className="top-right">
            <span className="online-dot" />
            Workspace active
            <span style={{ color: "#d4dce6" }}>|</span>
            UnityVol
          </div>
        </header>

        <div className="content">
          <div className="crumb">
            <Link href="/organizer/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href="/organizer/events">Manage Events</Link>
            <span>/</span>
            <span>Create Event</span>
          </div>

          <div className="page-heading">
            <div>
              <div className="eyebrow">Bring people together</div>
              <h1>Create a new event</h1>
              <p className="subtitle">
                Share the details and give volunteers a meaningful way to
                contribute.
              </p>
            </div>

            <Link className="back-link" href="/organizer/events">
              <ArrowLeft size={15} />
              Back to events
            </Link>
          </div>

          {submitted && (
            <div className="success">
              <CheckCircle2 size={19} />
              <div>
                <strong>Event details validated!</strong>
                <br />
                This form is ready to connect to your API/database. Right now,
                submission is a front-end demo and the event has not been saved
                permanently.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-layout">
              <section className="panel">
                <div className="panel-head">
                  <h2>Event information</h2>
                  <p>Fields marked with * are required.</p>
                </div>

                <div className="panel-body">
                  <div className="section-label">
                    <span>
                      <CalendarDays size={15} />
                    </span>
                    Basic details
                  </div>

                  <div className="fields">
                    <div className="field full">
                      <label htmlFor="title">
                        Event title <span className="required">*</span>
                      </label>
                      <input
                        id="title"
                        required
                        maxLength={100}
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                        placeholder="e.g. Community Tree Plantation Drive"
                      />
                      <div className="hint">
                        Choose a clear title that tells volunteers what the
                        event is about.
                      </div>
                    </div>

                    <div className="field">
                      <label id="category-label">
                        Category <span className="required">*</span>
                      </label>

                      <div className="custom-select">
                        <button
                          type="button"
                          className="select-trigger"
                          aria-labelledby="category-label"
                          aria-haspopup="listbox"
                          aria-expanded={openDropdown === "category"}
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === "category" ? null : "category"
                            )
                          }
                        >
                          <span>{form.category}</span>
                          <ChevronDown
                            size={16}
                            className={
                              openDropdown === "category" ? "chevron-open" : ""
                            }
                          />
                        </button>

                        {openDropdown === "category" && (
                          <div
                            className="select-menu"
                            role="listbox"
                            aria-labelledby="category-label"
                          >
                            {[
                              "Environment",
                              "Education",
                              "Health",
                              "Community",
                              "Animal Welfare",
                              "Disaster Relief",
                              "Other",
                            ].map((option) => (
                              <button
                                type="button"
                                role="option"
                                aria-selected={form.category === option}
                                key={option}
                                className={
                                  "select-option " +
                                  (form.category === option ? "selected" : "")
                                }
                                onClick={() => {
                                  update("category", option);
                                  setOpenDropdown(null);
                                }}
                              >
                                <span>{option}</span>
                                {form.category === option && (
                                  <Check size={15} />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="hidden"
                        name="category"
                        value={form.category}
                      />
                    </div>

                    <div className="field">
                      <label id="status-label">Event status</label>

                      <div className="custom-select">
                        <button
                          type="button"
                          className="select-trigger"
                          aria-labelledby="status-label"
                          aria-haspopup="listbox"
                          aria-expanded={openDropdown === "status"}
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === "status" ? null : "status"
                            )
                          }
                        >
                          <span>{form.status}</span>
                          <ChevronDown
                            size={16}
                            className={
                              openDropdown === "status" ? "chevron-open" : ""
                            }
                          />
                        </button>

                        {openDropdown === "status" && (
                          <div
                            className="select-menu"
                            role="listbox"
                            aria-labelledby="status-label"
                          >
                            {["Upcoming", "Draft"].map((option) => (
                              <button
                                type="button"
                                role="option"
                                aria-selected={form.status === option}
                                key={option}
                                className={
                                  "select-option " +
                                  (form.status === option ? "selected" : "")
                                }
                                onClick={() => {
                                  update("status", option);
                                  setOpenDropdown(null);
                                }}
                              >
                                <span>{option}</span>
                                {form.status === option && (
                                  <Check size={15} />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="hidden"
                        name="status"
                        value={form.status}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="date">
                        Event date <span className="required">*</span>
                      </label>
                      <input
                        id="date"
                        type="date"
                        required
                        min={today || undefined}
                        value={form.date}
                        onChange={(e) => update("date", e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="capacity">
                        Volunteer capacity <span className="required">*</span>
                      </label>
                      <input
                        id="capacity"
                        type="number"
                        min="1"
                        max="10000"
                        required
                        value={form.capacity}
                        onChange={(e) => update("capacity", e.target.value)}
                      />
                      <div className="hint">
                        Maximum number of volunteers who can register.
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="startTime">
                        Start time <span className="required">*</span>
                      </label>
                      <input
                        id="startTime"
                        type="time"
                        required
                        value={form.startTime}
                        onChange={(e) => update("startTime", e.target.value)}
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="endTime">
                        End time <span className="required">*</span>
                      </label>
                      <input
                        id="endTime"
                        type="time"
                        required
                        value={form.endTime}
                        onChange={(e) => update("endTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="split" />

                  <div className="section-label">
                    <span>
                      <MapPin size={15} />
                    </span>
                    Location and description
                  </div>

                  <div className="fields">
                    <div className="field full">
                      <label htmlFor="location">
                        Event location <span className="required">*</span>
                      </label>
                      <input
                        id="location"
                        required
                        value={form.location}
                        onChange={(e) => update("location", e.target.value)}
                        placeholder="Venue name, area, city"
                      />
                    </div>

                    <div className="field full">
                      <label htmlFor="description">
                        Event description <span className="required">*</span>
                      </label>
                      <textarea
                        id="description"
                        required
                        minLength={20}
                        maxLength={2000}
                        value={form.description}
                        onChange={(e) =>
                          update("description", e.target.value)
                        }
                        placeholder="Describe the purpose of the event, planned activities, and the impact volunteers can make..."
                      />
                      <div className="hint">
                        At least 20 characters. Help volunteers understand why
                        this event matters.
                      </div>
                    </div>

                    <div className="field full">
                      <label htmlFor="requirements">
                        Volunteer requirements (optional)
                      </label>
                      <textarea
                        id="requirements"
                        value={form.requirements}
                        onChange={(e) =>
                          update("requirements", e.target.value)
                        }
                        placeholder="Any skills, items to bring, age requirements, or other instructions..."
                        style={{ minHeight: 78 }}
                      />
                    </div>

                    <div className="field full">
                      <label htmlFor="contactEmail">
                        Organizer contact email (optional)
                      </label>
                      <input
                        id="contactEmail"
                        type="email"
                        value={form.contactEmail}
                        onChange={(e) =>
                          update("contactEmail", e.target.value)
                        }
                        placeholder="organizer@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-footer">
                    <span className="footer-note">
                      Review your details before publishing.
                    </span>

                    <div className="actions">
                      <Link className="btn" href="/organizer/events">
                        Cancel
                      </Link>

                      <button className="btn btn-primary" type="submit">
                        <CalendarPlus size={15} />
                        Create event
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="aside-stack">
                <section className="panel">
                  <div className="panel-head">
                    <h2>Quick checklist</h2>
                    <p>A few things to check before you publish.</p>
                  </div>

                  <div className="panel-body tips">
                    <div className="tip">
                      <span className="tip-icon">
                        <Calendar size={15} />
                      </span>
                      <div>
                        <strong>Pick a clear date and time</strong>
                        <p>
                          Give volunteers enough notice and include the expected
                          duration.
                        </p>
                      </div>
                    </div>

                    <div className="tip">
                      <span className="tip-icon">
                        <MapPin size={15} />
                      </span>
                      <div>
                        <strong>Make the venue easy to find</strong>
                        <p>
                          Add the venue name, neighborhood, and city.
                        </p>
                      </div>
                    </div>

                    <div className="tip">
                      <span className="tip-icon">
                        <UsersRound size={15} />
                      </span>
                      <div>
                        <strong>Set a realistic capacity</strong>
                        <p>
                          Choose a volunteer limit your team can coordinate.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </form>
        </div>
      </main>
      <OrganizerAIChat />
    </div>
  );
}