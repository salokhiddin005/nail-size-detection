"use client";

import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import TelegramChatModal from "@/components/TelegramChatModal";

export default function ContactPage() {
  const [chatOpen, setChatOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Could not send message. Please try again.");
        setLoading(false);
        return;
      }

      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-center text-5xl font-semibold tracking-tight">
        Get in touch
      </h1>
      <p className="mt-4 text-center text-white/60">
        Questions, partnership ideas, or feedback — we&apos;d love to hear.
      </p>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-6 py-3 text-sm font-medium text-sky-200 transition hover:bg-sky-500/20 hover:text-white"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on Telegram
        </button>
      </div>

      {sent ? (
        <div className="glass mt-10 p-8 text-center">
          <p className="text-2xl font-semibold text-emerald-300">Message sent</p>
          <p className="mt-3 text-white/70">
            Thanks for reaching out. We&apos;ll get back to you soon.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-6 text-sm text-white/60 underline underline-offset-4 hover:text-white"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass mt-10 space-y-5 p-8">
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
            <label className="text-xs uppercase tracking-wider text-white/60">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-rose-400"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-white/60">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-rose-400"
              required
              maxLength={200}
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-white/60">
              Message
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-rose-400"
              required
              maxLength={5000}
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
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>
        </form>
      )}

      <TelegramChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </section>
  );
}
