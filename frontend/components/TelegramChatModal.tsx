"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

export default function TelegramChatModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSent(false);
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/telegram-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, website }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not send. Please try again.");
        setLoading(false);
        return;
      }

      setSent(true);
      setName("");
      setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass relative w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-white/50 transition hover:bg-white/5 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-2 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-sky-400" />
          <h2 className="text-xl font-semibold">Chat with us</h2>
        </div>
        <p className="mb-6 text-sm text-white/60">
          Send a quick message — it goes straight to our team.
        </p>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-center text-sm text-emerald-200">
              Message sent ✓ Thanks — we&apos;ll get back to you soon.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                width: 1,
                height: 1,
                opacity: 0,
              }}
            />

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name or nickname"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-sky-400"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">
                Message
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-sky-400"
                required
                maxLength={2000}
                autoFocus
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
