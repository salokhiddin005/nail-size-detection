import { Mail } from "lucide-react";

export default function Page() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-center text-5xl font-semibold tracking-tight">
        Get in touch
      </h1>
      <p className="mt-4 text-center text-white/60">
        Questions, partnership ideas, or feedback — we&apos;d love to hear.
      </p>

      <form className="glass mt-12 space-y-5 p-8" action="#" method="post">
        <div>
          <label className="text-xs uppercase tracking-wider text-white/60">Name</label>
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-rose-400"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-white/60">Email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-rose-400"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-white/60">Message</label>
          <textarea
            rows={5}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-rose-400"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Send message
        </button>
      </form>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/60">
        <Mail className="h-4 w-4" /> hello@nailytics.app
      </div>
    </section>
  );
}
