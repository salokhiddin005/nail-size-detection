import Link from "next/link";

export default function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="glass p-12 text-center">
        <h2 className="text-4xl font-semibold tracking-tight">Ready to find your size?</h2>
        <p className="mt-3 text-white/60">It takes 10 seconds. Free, no signup.</p>
        <Link href="/analyze" className="btn-primary mt-8">
          Try Nailytics now
        </Link>
      </div>
    </section>
  );
}
