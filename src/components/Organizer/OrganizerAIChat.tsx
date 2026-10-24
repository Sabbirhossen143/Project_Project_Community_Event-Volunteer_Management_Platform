
"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, CalendarDays, Users, Bell, ClipboardList } from "lucide-react";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const suggestions = [
  "How do I create a new event?",
  "How can I manage volunteer registrations?",
  "How can I track event participation?",
  "How do I manage upcoming events?",
];

const organizerReplies: Record<string, string> = {
  event:
    "To organize an event, open your Events page, select the option to create an event, and provide its title, date, location, description, and volunteer requirements.",
  volunteer:
    "To manage volunteer registrations, open your registrations or volunteers section. Review applications, check participant details, and update registration statuses using the options available in your dashboard.",
  registration:
    "You can review volunteer registrations from your registration management page. Check pending applications and confirm or update them according to your event's requirements.",
  participation:
    "To track participation, open the relevant event and review its registered volunteers and attendance information, if those features are enabled in your dashboard.",
  upcoming:
    "Visit your Events page to review upcoming events. Check each event's date, location, registration status, and volunteer requirements.",
  notification:
    "Check the notifications section for event reminders and registration updates. Make sure your event dates and registration statuses are up to date.",
  dashboard:
    "Your Organizer Dashboard helps you review events, registrations, and activity. Open the relevant section to see its available information.",
};

function getOrganizerReply(message: string) {
  const text = message.toLowerCase();

  if (text.includes("registration") || text.includes("register") || text.includes("application")) {
    return organizerReplies.registration;
  }

  if (text.includes("volunteer")) {
    return organizerReplies.volunteer;
  }

  if (text.includes("participation") || text.includes("attendance")) {
    return organizerReplies.participation;
  }

  if (text.includes("upcoming") || text.includes("schedule") || text.includes("date")) {
    return organizerReplies.upcoming;
  }

  if (text.includes("notification") || text.includes("reminder")) {
    return organizerReplies.notification;
  }

  if (text.includes("dashboard") || text.includes("overview")) {
    return organizerReplies.dashboard;
  }

  if (text.includes("event") || text.includes("create") || text.includes("organize")) {
    return organizerReplies.event;
  }

  return "I'm your UnityVol Organizer AI Assistant. I can guide you through event management, volunteer registrations, participation tracking, and organizer dashboard tasks. Tell me what you need help with.";
}

export default function OrganizerAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi, Organizer! 👋 I'm your UnityVol Organizer AI Assistant. I can help you manage events, registrations, and community activities.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const message = input.trim();
  if (!message || isLoading) return;

  const history = [
    ...messages.slice(-10).map((item) => ({
      role: item.role,
      content: item.text,
    })),
    { role: "user" as const, content: message },
  ];

  setMessages((current) => [
    ...current,
    { role: "user", text: message },
  ]);
  setInput("");
  setIsLoading(true);

  try {
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assistantType: "organizer",
        messages: history,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI response failed.");
    }

    setMessages((current) => [
      ...current,
      { role: "assistant", text: data.reply },
    ]);
  } catch (error) {
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: error instanceof Error
          ? error.message
          : "Something went wrong.",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <>
      {isOpen && (
        <section
          className="org-ai-window"
          role="dialog"
          aria-label="Organizer AI Assistant"
        >
          <header className="org-ai-header">
            <div className="org-ai-avatar">
              <Sparkles size={22} />
            </div>

            <div className="org-ai-heading">
              <strong>Organizer AI Assistant</strong>
              <span>
                <i className="org-ai-online" />
                Here to help you organize
              </span>
            </div>

            <button
              className="org-ai-close"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={19} />
            </button>
          </header>

          <div className="org-ai-intro">
            Ask about event planning, volunteer registrations, and organizer tasks.
          </div>

          <div className="org-ai-features">
            <span><CalendarDays size={13} /> Events</span>
            <span><Users size={13} /> Volunteers</span>
            <span><ClipboardList size={13} /> Registrations</span>
            <span><Bell size={13} /> Reminders</span>
          </div>

          <div className="org-ai-suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="org-ai-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`org-ai-message ${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {isLoading && (
  <div className="org-ai-message assistant">
    Thinking...
  </div>
)}

            <div ref={messagesEndRef} />
          </div>

          <form className="org-ai-form" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about organizer tasks..."
              aria-label="Type your message"
            />

            <button
  type="submit"
  aria-label="Send message"
  disabled={isLoading}
>
              <Send size={17} />
            </button>
          </form>

          <p className="org-ai-disclaimer">
            AI API for intelligent, context-aware replies.
          </p>
        </section>
      )}

      {!isOpen && (
        <button
          className="org-ai-launcher"
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Organizer AI Assistant"
        >
          <Sparkles size={20} />
          <span>Ask Organizer AI</span>
        </button>
      )}

      <style jsx>{`
        .org-ai-launcher {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 19px;
          border: 1px solid #ffffff35;
          border-radius: 999px;
          background: linear-gradient(135deg, #102b3b, #0d9669);
          color: white;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          box-shadow: 0 12px 32px #102b3b30;
          transition: transform 0.2s ease;
        }

        .org-ai-launcher:hover {
          transform: translateY(-3px);
        }

        .org-ai-window {
          position: fixed;
          right: 24px;
          bottom: 88px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          width: min(390px, calc(100vw - 28px));
          height: min(560px, calc(100dvh - 115px));
          min-height: 360px;
          overflow: hidden;
          border: 1px solid #dfe9e4;
          border-radius: 18px;
          background: white;
          box-shadow: 0 24px 70px #132b3c30;
          animation: org-ai-in 0.18s ease-out;
        }

        @keyframes org-ai-in {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .org-ai-header {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 16px;
          background: linear-gradient(120deg, #102b3b, #0d6048);
          color: white;
        }

        .org-ai-avatar {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border: 1px solid #ffffff30;
          border-radius: 13px;
          background: #ffffff18;
          color: #75f0bd;
        }

        .org-ai-heading { flex: 1; min-width: 0; }
        .org-ai-heading strong { display: block; font-size: 13px; }
        .org-ai-heading span {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 5px;
          color: #c5e5d8;
          font-size: 10px;
        }

        .org-ai-online {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #63e6a8;
        }

        .org-ai-close {
          display: grid;
          place-items: center;
          width: 33px;
          height: 33px;
          border: none;
          border-radius: 9px;
          background: #ffffff16;
          color: white;
          cursor: pointer;
        }

        .org-ai-intro {
          padding: 12px 15px 8px;
          color: #8492a4;
          font-size: 11px;
          line-height: 1.6;
        }

        .org-ai-features {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding: 0 14px 12px;
        }

        .org-ai-features span {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 8px;
          border-radius: 7px;
          background: #f1f8f4;
          color: #147d5c;
          font-size: 10px;
        }

        .org-ai-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding: 0 14px 12px;
        }

        .org-ai-suggestions button {
          padding: 8px 10px;
          border: 1px solid #dcece5;
          border-radius: 7px;
          background: #f4fbf7;
          color: #147d5c;
          font-size: 10px;
          cursor: pointer;
          text-align: left;
        }

        .org-ai-messages {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 10px;
          min-height: 80px;
          overflow-y: auto;
          padding: 14px;
          border-top: 1px solid #edf1f5;
        }

        .org-ai-message {
          max-width: 88%;
          padding: 10px 12px;
          border-radius: 12px;
          overflow-wrap: anywhere;
          font-size: 12px;
          line-height: 1.65;
        }

        .org-ai-message.assistant {
          align-self: flex-start;
          border: 1px solid #e5eee9;
          background: #f5faf7;
          color: #405b4e;
        }

        .org-ai-message.user {
          align-self: flex-end;
          background: #0d9669;
          color: white;
        }

        .org-ai-form {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #edf1f5;
        }

        .org-ai-form input {
          width: 100%;
          min-width: 0;
          padding: 11px 12px;
          border: 1px solid #e0e7f0;
          border-radius: 9px;
          outline: none;
          font-size: 12px;
        }

        .org-ai-form input:focus { border-color: #0d9669; }

        .org-ai-form button {
          display: grid;
          place-items: center;
          width: 42px;
          flex-shrink: 0;
          border: none;
          border-radius: 9px;
          background: #0d9669;
          color: white;
          cursor: pointer;
        }

        .org-ai-disclaimer {
          margin: 0;
          padding: 0 12px 12px;
          color: #8492a4;
          font-size: 10px;
          line-height: 1.5;
        }

        @media (max-width: 650px) {
          .org-ai-launcher {
            right: 14px;
            bottom: 14px;
            padding: 12px 15px;
          }

          .org-ai-window {
            right: 10px;
            bottom: 76px;
            width: calc(100vw - 20px);
            height: min(560px, calc(100dvh - 95px));
            min-height: 320px;
          }
        }
      `}</style>
    </>
  );
}
