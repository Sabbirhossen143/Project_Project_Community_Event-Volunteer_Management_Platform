
"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, X } from "lucide-react";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const suggestions = [
  "Find volunteer opportunities",
  "Suggest a community event",
  "How can I help my community?",
];

export default function VolunteerAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! 👋 I'm your UnityVol AI Assistant. How can I help you with volunteering today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = input.trim();
    if (!message) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: message },
      {
        role: "assistant",
        text: `Thanks for your message! 😊 You asked: "${message}". I can help with volunteer opportunities, event planning, and community activities. Connect an AI API to enable intelligent, personalized replies.`,
      },
    ]);

    setInput("");
  }

  return (
    <>
      {isOpen && (
        <section
          className="vol-ai-window"
          role="dialog"
          aria-label="UnityVol AI Assistant"
        >
          <header className="vol-ai-header">
            <div className="vol-ai-avatar">
              <Sparkles size={22} />
            </div>

            <div className="vol-ai-heading">
              <strong>UnityVol AI Assistant</strong>
              <span>
                <i className="vol-ai-online" />
                Here to help you
              </span>
            </div>

            <button
              className="vol-ai-close"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={19} />
            </button>
          </header>

          <div className="vol-ai-intro">
            Ask about volunteering, community events, or finding the right
            opportunity for you.
          </div>

          <div className="vol-ai-suggestions">
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

          <div className="vol-ai-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`vol-ai-message ${message.role}`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="vol-ai-form" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
            />

            <button type="submit" aria-label="Send message">
              <Send size={17} />
            </button>
          </form>

          <p className="vol-ai-disclaimer">
            Demo mode · AI API connection required for real AI replies.
          </p>
        </section>
      )}

      {!isOpen && (
        <button
          className="vol-ai-launcher"
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI assistant"
        >
          <Sparkles size={20} />
          <span>Ask UnityVol AI</span>
        </button>
      )}

      <style jsx>{`
        .vol-ai-launcher {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 19px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #10a875, #087a57);
          color: white;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          box-shadow: 0 12px 32px #087a5740;
          transition: transform 0.2s ease;
        }

        .vol-ai-launcher:hover {
          transform: translateY(-3px);
        }

        .vol-ai-window {
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
          animation: vol-ai-in 0.18s ease-out;
        }

        @keyframes vol-ai-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .vol-ai-header {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 16px;
          background: linear-gradient(120deg, #102b3b, #0d6048);
          color: white;
        }

        .vol-ai-avatar {
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

        .vol-ai-heading {
          flex: 1;
          min-width: 0;
        }

        .vol-ai-heading strong {
          display: block;
          font-size: 13px;
        }

        .vol-ai-heading span {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 5px;
          color: #c5e5d8;
          font-size: 10px;
        }

        .vol-ai-online {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #63e6a8;
        }

        .vol-ai-close {
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

        .vol-ai-intro {
          padding: 12px 15px;
          color: #8492a4;
          font-size: 11px;
          line-height: 1.6;
        }

        .vol-ai-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          padding: 0 14px 12px;
        }

        .vol-ai-suggestions button {
          padding: 8px 10px;
          border: 1px solid #dcece5;
          border-radius: 7px;
          background: #f4fbf7;
          color: #147d5c;
          font-size: 10px;
          cursor: pointer;
        }

        .vol-ai-messages {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 10px;
          min-height: 80px;
          overflow-y: auto;
          padding: 14px;
          border-top: 1px solid #edf1f5;
        }

        .vol-ai-message {
          max-width: 88%;
          padding: 10px 12px;
          border-radius: 12px;
          overflow-wrap: anywhere;
          font-size: 12px;
          line-height: 1.65;
        }

        .vol-ai-message.assistant {
          align-self: flex-start;
          border: 1px solid #e5eee9;
          background: #f5faf7;
          color: #405b4e;
        }

        .vol-ai-message.user {
          align-self: flex-end;
          background: #0d9669;
          color: white;
        }

        .vol-ai-form {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #edf1f5;
        }

        .vol-ai-form input {
          width: 100%;
          min-width: 0;
          padding: 11px 12px;
          border: 1px solid #e0e7f0;
          border-radius: 9px;
          outline: none;
          font-size: 12px;
        }

        .vol-ai-form input:focus {
          border-color: #0d9669;
        }

        .vol-ai-form button {
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

        .vol-ai-disclaimer {
          margin: 0;
          padding: 0 12px 12px;
          color: #8492a4;
          font-size: 10px;
          line-height: 1.5;
        }

        @media (max-width: 650px) {
          .vol-ai-launcher {
            right: 14px;
            bottom: 14px;
            padding: 12px 15px;
          }

          .vol-ai-window {
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
