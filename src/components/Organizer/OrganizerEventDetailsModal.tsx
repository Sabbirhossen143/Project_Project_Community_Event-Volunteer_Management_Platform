
"use client";

import { useEffect, useState } from "react";
import {
  X,
  CalendarDays,
  MapPin,
  Users,
  Share2,
  Check,
  Clock3,
  Tag,
} from "lucide-react";

export type OrganizerEvent = {
  id: string | number;
  title: string;
  category: string;
  date: string;
  location: string;
  registered: number;
  capacity: number;
  status: "Upcoming" | "Completed" | "Draft";
  image?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
};

type Props = {
  event: OrganizerEvent | null;
  onClose: () => void;
};

export default function OrganizerEventDetailsModal({
  event,
  onClose,
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!event) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [event, onClose]);

  if (!event) return null;
  const activeEvent = event;

  const percentage =
    event.capacity > 0
      ? Math.min(
          Math.round((event.registered / event.capacity) * 100),
          100
        )
      : 0;

  const remaining = Math.max(
    event.capacity - event.registered,
    0
  );

  async function shareEvent() {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("event", String(activeEvent.id));

    const shareData = {
      title: activeEvent.title,
      text: `Check out ${activeEvent.title} — ${activeEvent.date} at ${activeEvent.location}.`,
      url: shareUrl.toString(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        window.prompt("Copy this event link:", shareData.url);
      }
    }
  }

  return (
    <div
      className="event-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
      >
        {/* Header */}
        <header className="event-modal-header">
          <div>
            <span className="event-modal-eyebrow">
              ORGANIZER WORKSPACE
            </span>
            <h2 id="event-modal-title">Event Details</h2>
          </div>

          <button
            className="event-modal-close"
            onClick={onClose}
            aria-label="Close event details"
          >
            <X size={18} />
          </button>
        </header>

        {/* Content */}
        <div className="event-modal-body">
          {/* Event summary */}
          <div className="event-modal-hero">
            <div className="event-modal-emoji">
              {event.image || "🎉"}
            </div>

            <div className="event-modal-hero-content">
              <span
                className={`event-modal-status ${event.status.toLowerCase()}`}
              >
                {event.status}
              </span>

              <h3>{event.title}</h3>

              <span className="event-modal-category">
                <Tag size={13} />
                {event.category}
              </span>
            </div>
          </div>

          {/* Statistics */}
          <div className="event-modal-stats">
            <div className="event-modal-stat">
              <span>Registered</span>
              <strong>{event.registered}</strong>
              <small>Volunteers</small>
            </div>

            <div className="event-modal-stat">
              <span>Capacity</span>
              <strong>{event.capacity}</strong>
              <small>{remaining} slots left</small>
            </div>

            <div className="event-modal-stat">
              <span>Filled</span>
              <strong>{percentage}%</strong>
              <small>Registration</small>
            </div>
          </div>

          {/* Progress */}
          <div className="event-modal-progress">
            <div className="event-modal-progress-label">
              <span>Volunteer registration</span>
              <strong>
                {event.registered}/{event.capacity}
              </strong>
            </div>

            <div className="event-modal-progress-track">
              <span style={{ width: `${percentage}%` }} />
            </div>
          </div>

          {/* Event information */}
          <div className="event-modal-info-grid">
            <div className="event-modal-info">
              <span className="event-modal-info-icon">
                <CalendarDays size={17} />
              </span>

              <div>
                <small>Event date</small>
                <strong>{event.date}</strong>
              </div>
            </div>

            <div className="event-modal-info">
              <span className="event-modal-info-icon">
                <MapPin size={17} />
              </span>

              <div>
                <small>Location</small>
                <strong>{event.location}</strong>
              </div>
            </div>

            <div className="event-modal-info">
              <span className="event-modal-info-icon">
                <Clock3 size={17} />
              </span>

              <div>
                <small>Event time</small>
                <strong>
                  {event.startTime || "Not specified"}
                  {event.endTime ? ` – ${event.endTime}` : ""}
                </strong>
              </div>
            </div>

            <div className="event-modal-info">
              <span className="event-modal-info-icon">
                <Users size={17} />
              </span>

              <div>
                <small>Available slots</small>
                <strong>{remaining} remaining</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="event-modal-description">
            <h4>About this event</h4>

            <p>
              {event.description ||
                `Join us for ${event.title}, an initiative in the ${event.category.toLowerCase()} category. Help make a positive impact in the community.`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="event-modal-footer">
          <button
            className="event-modal-secondary"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="event-modal-share"
            onClick={shareEvent}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? "Link Copied!" : "Share Event"}
          </button>
        </footer>
      </section>

      <style jsx global>{`
        .event-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: rgba(12, 27, 45, 0.52);
          backdrop-filter: blur(3px);
          animation: eventModalFade 0.18s ease;
        }

        .event-modal {
          width: min(100%, 520px);
          max-height: 85vh;
          max-height: 85dvh;
          overflow-y: auto;
          overscroll-behavior: contain;
          border: 1px solid #e5edf3;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 18px 55px #0f172a30;
          animation: eventModalSlide 0.2s ease;
        }

        .event-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 15px 19px;
          border-bottom: 1px solid #edf1f5;
        }

        .event-modal-eyebrow {
          color: #0d9669;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .event-modal-header h2 {
          margin: 3px 0 0;
          color: #17243b;
          font-size: 19px;
          font-weight: 800;
        }

        .event-modal-close {
          display: grid;
          width: 32px;
          height: 32px;
          flex: none;
          place-items: center;
          border: 1px solid #e5ebf2;
          border-radius: 9px;
          background: #fff;
          color: #64748b;
          cursor: pointer;
        }

        .event-modal-close:hover {
          background: #f1f5f9;
          color: #17243b;
        }

        .event-modal-body {
          padding: 17px 19px;
        }

        .event-modal-hero {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 13px;
          border: 1px solid #dcefe5;
          border-radius: 12px;
          background: linear-gradient(120deg, #effcf5, #f8fbff);
        }

        .event-modal-emoji {
          display: grid;
          width: 54px;
          height: 54px;
          flex: none;
          place-items: center;
          overflow: hidden;
          border-radius: 12px;
          background: #d9f4e6;
          font-size: 27px;
        }

        .event-modal-hero-content {
          min-width: 0;
        }

        .event-modal-status {
          display: inline-flex;
          padding: 4px 8px;
          border-radius: 20px;
          background: #d9f8e8;
          color: #087b56;
          font-size: 9px;
          font-weight: 800;
        }

        .event-modal-status.completed {
          background: #e8efff;
          color: #456cc4;
        }

        .event-modal-status.draft {
          background: #fff1d8;
          color: #a66a08;
        }

        .event-modal-hero h3 {
          margin: 5px 0;
          color: #17243b;
          font-size: 17px;
          line-height: 1.35;
          overflow-wrap: anywhere;
        }

        .event-modal-category {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #718096;
          font-size: 11px;
        }

        .event-modal-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
          margin-top: 13px;
        }

        .event-modal-stat {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 4px;
          padding: 10px 11px;
          border: 1px solid #e7edf4;
          border-radius: 10px;
          background: #fff;
        }

        .event-modal-stat span,
        .event-modal-stat small {
          color: #8290a3;
          font-size: 9px;
        }

        .event-modal-stat strong {
          color: #17243b;
          font-size: 21px;
          font-weight: 800;
        }

        .event-modal-progress {
          margin-top: 15px;
        }

        .event-modal-progress-label {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 7px;
          color: #607089;
          font-size: 10px;
        }

        .event-modal-progress-label strong {
          color: #17243b;
        }

        .event-modal-progress-track {
          height: 6px;
          overflow: hidden;
          border-radius: 20px;
          background: #eaf0f5;
        }

        .event-modal-progress-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #0d9669, #42d5a0);
          transition: width 0.25s ease;
        }

        .event-modal-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 16px;
        }

        .event-modal-info {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          min-width: 0;
          padding: 10px;
          border: 1px solid #e8edf3;
          border-radius: 10px;
        }

        .event-modal-info-icon {
          display: grid;
          width: 31px;
          height: 31px;
          flex: none;
          place-items: center;
          border-radius: 8px;
          background: #e9f9f1;
          color: #0d9669;
        }

        .event-modal-info > div {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 4px;
        }

        .event-modal-info small {
          color: #8492a6;
          font-size: 9px;
        }

        .event-modal-info strong {
          color: #34435a;
          font-size: 11px;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .event-modal-description {
          margin-top: 16px;
          padding-top: 13px;
          border-top: 1px solid #edf1f5;
        }

        .event-modal-description h4 {
          margin: 0 0 6px;
          color: #26364d;
          font-size: 12px;
        }

        .event-modal-description p {
          margin: 0;
          color: #718096;
          font-size: 11px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .event-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 12px 19px 16px;
          border-top: 1px solid #edf1f5;
        }

        .event-modal-secondary,
        .event-modal-share {
          display: inline-flex;
          min-height: 36px;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 13px;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .event-modal-secondary {
          border: 1px solid #dfe7ef;
          background: #fff;
          color: #526177;
        }

        .event-modal-share {
          border: 1px solid #0d9669;
          background: #0d9669;
          color: #fff;
        }

        .event-modal-share:hover {
          background: #087b56;
        }

        @keyframes eventModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes eventModalSlide {
          from {
            opacity: 0;
            transform: translateY(8px) scale(.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        
@media (max-width: 600px) {
  .event-modal-overlay {
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  .event-modal {
    width: 100%;
    max-width: 400px;
    max-height: 78dvh;
    overflow-y: auto;
    border-radius: 14px;
  }

  .event-modal-header {
    padding: 10px 13px;
  }

  .event-modal-eyebrow {
    font-size: 8px;
  }

  .event-modal-header h2 {
    font-size: 16px;
  }

  .event-modal-close {
    width: 29px;
    height: 29px;
  }

  .event-modal-body {
    padding: 10px 13px;
  }

  .event-modal-hero {
    gap: 9px;
    padding: 9px;
    border-radius: 10px;
  }

  .event-modal-emoji {
    width: 40px;
    height: 40px;
    border-radius: 9px;
    font-size: 21px;
  }

  .event-modal-hero h3 {
    margin: 4px 0;
    font-size: 14px;
    line-height: 1.3;
  }

  .event-modal-category {
    font-size: 10px;
  }

  .event-modal-stats {
    gap: 6px;
    margin-top: 9px;
  }

  .event-modal-stat {
    gap: 3px;
    padding: 7px;
    border-radius: 8px;
  }

  .event-modal-stat span,
  .event-modal-stat small {
    font-size: 8px;
    line-height: 1.3;
  }

  .event-modal-stat strong {
    font-size: 17px;
  }

  .event-modal-progress {
    margin-top: 10px;
  }

  .event-modal-progress-label {
    margin-bottom: 5px;
    font-size: 9px;
  }

  .event-modal-progress-track {
    height: 5px;
  }

  .event-modal-info-grid {
    gap: 6px;
    margin-top: 11px;
  }

  .event-modal-info {
    gap: 6px;
    padding: 7px;
    border-radius: 8px;
  }

  .event-modal-info-icon {
    width: 25px;
    height: 25px;
    border-radius: 7px;
  }

  .event-modal-info-icon svg {
    width: 14px;
    height: 14px;
  }

  .event-modal-info > div {
    gap: 3px;
  }

  .event-modal-info small {
    font-size: 8px;
  }

  .event-modal-info strong {
    font-size: 10px;
    line-height: 1.3;
  }

  .event-modal-description {
    margin-top: 11px;
    padding-top: 9px;
  }

  .event-modal-description h4 {
    margin-bottom: 4px;
    font-size: 11px;
  }

  .event-modal-description p {
    font-size: 10px;
    line-height: 1.45;
  }

  .event-modal-footer {
    gap: 7px;
    padding: 9px 13px 11px;
  }

  .event-modal-secondary,
  .event-modal-share {
    min-height: 32px;
    gap: 5px;
    padding: 0 10px;
    border-radius: 8px;
    font-size: 10px;
  }
}


        @media (prefers-reduced-motion: reduce) {
          .event-modal-overlay,
          .event-modal {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
