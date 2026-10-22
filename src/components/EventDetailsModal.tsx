
"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  X,
  HandHeart,
  CheckCircle2,
  Heart,
  Users,
  ClipboardCheck,
  ArrowUpRight,
} from "lucide-react";

export type EventDetailsData = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  color: string;
  textColor: string;
  status?: string;
  organizer?: string;
  duration?: string;
  requirements?: string[];
  activities?: string[];
};

type Props = {
  event: EventDetailsData | null;
  onClose: () => void;
};

export default function EventDetailsModal({
  event,
  onClose,
}: Props) {
  if (!event) return null;

  const activities =
    event.activities?.length
      ? event.activities
      : getActivities(event.category);

  const requirements =
    event.requirements?.length
      ? event.requirements
      : [
          "Arrive at the event location on time.",
          "Follow the event coordinator's instructions.",
          "Work respectfully with other volunteers.",
        ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div
          className="relative shrink-0 px-6 pb-7 pt-7 sm:px-9 sm:pt-9"
          style={{
            background: `linear-gradient(125deg, ${event.color}, #ffffff)`,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close event details"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/80 text-slate-600 transition hover:bg-white"
          >
            <X size={19} />
          </button>

          <div
            className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-white/80 bg-white/80"
            style={{ color: event.textColor }}
          >
            <HandHeart size={29} />
          </div>

          <span
            className="inline-flex rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold"
            style={{ color: event.textColor }}
          >
            {event.category}
          </span>

          <h2
            id="event-modal-title"
            className="mt-3 max-w-xl pr-7 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl"
          >
            {event.title}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Discover the event, learn what you may be involved in,
            and review the event information before participating.
          </p>
        </div>

        <div className="overflow-y-auto">
          <div className="grid gap-3 px-5 py-5 sm:grid-cols-3 sm:px-8">
            <InfoCard
              icon={<CalendarDays size={19} />}
              label="Event date"
              value={event.date}
            />

            <InfoCard
              icon={<Clock3 size={19} />}
              label="Start time"
              value={event.time}
            />

            <InfoCard
              icon={<MapPin size={19} />}
              label="Location"
              value={event.location}
            />
          </div>

          <div className="space-y-6 px-5 pb-6 sm:px-8">
            <section>
              <SectionTitle
                icon={<ClipboardCheck size={18} />}
                title="About this event"
              />

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {event.description}
              </p>
            </section>

            <section>
              <SectionTitle
                icon={<Users size={18} />}
                title="What you may do"
              />

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {activities.map((activity) => (
                  <div
                    key={activity}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <span className="text-xs leading-5 text-slate-700">
                      {activity}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle
                icon={<ClipboardCheck size={18} />}
                title="Before you participate"
              />

              <ul className="mt-3 space-y-3">
                {requirements.map((requirement) => (
                  <li
                    key={requirement}
                    className="flex items-start gap-3 text-xs leading-5 text-slate-600"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
              <Heart
                size={19}
                className="mt-0.5 shrink-0 text-rose-500"
              />

              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Make your time count
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Your time and effort can help support a meaningful
                  community initiative. Please confirm any specific
                  instructions with the event organizer.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-[10px] text-slate-400">
            Event ID: #{event.id}
            {event.status ? ` · ${event.status}` : ""}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-xs font-extrabold text-white transition hover:bg-emerald-800"
          >
            Got it
            <ArrowUpRight size={15} />
          </button>
        </footer>
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-white p-4">
      <div className="mb-3 text-emerald-700">{icon}</div>

      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-xs font-extrabold leading-5 text-slate-800">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
      <span className="text-emerald-700">{icon}</span>
      {title}
    </h3>
  );
}

function getActivities(category: string): string[] {
  switch (category) {
    case "Environment":
      return [
        "Support tree planting and green spaces.",
        "Help keep the activity area organized.",
        "Encourage environmental awareness.",
        "Coordinate with fellow volunteers.",
      ];

    case "Education":
      return [
        "Assist participants during learning activities.",
        "Help prepare learning materials.",
        "Support workshop or classroom coordination.",
        "Encourage a welcoming learning environment.",
      ];

    case "Healthcare":
      return [
        "Help organize visitor flow.",
        "Guide visitors to the appropriate area.",
        "Support event logistics and coordination.",
        "Help maintain an orderly environment.",
      ];

    case "Community":
      return [
        "Help organize supplies and materials.",
        "Assist with activity setup and coordination.",
        "Work together with the volunteer team.",
        "Help keep the distribution area organized.",
      ];

    default:
      return [
        "Help prepare the event area.",
        "Support the event team with assigned tasks.",
        "Communicate with fellow volunteers.",
        "Help ensure activities run smoothly.",
      ];
  }
}
