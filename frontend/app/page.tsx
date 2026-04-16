// import Hero from "@/components/Hero";
// import FeatureGrid from "@/components/FeatureGrid";
// import HowItWorks from "@/components/HowItWorks";
// import CTASection from "@/components/CTASection";

// export default function Home() {
//   return (
//     <>
//       <Hero />
//       <FeatureGrid />
//       <HowItWorks />
//       <CTASection />
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, Images, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url("/bg.jpg")' }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.10),transparent_24%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/60 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-pink-400" />
              AI Nail Sizing
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl xl:text-8xl">
              Your perfect
              <span className="block bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                nail size.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
              Upload a photo, measure accurately, and manage your sizing journey
              with a cleaner dashboard, gallery, and instant analysis tools.
            </p>

            <div className="mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-white/85">
                    Start with your first measurement
                  </p>
                  <p className="mt-1 text-sm text-white/50">
                    Use a standard bank card and a clear nail photo for the best result.
                  </p>
                </div>

                <Link
                  href="/analyze"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-95"
                >
                  Measure now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-4 h-px bg-white/10" />

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Link
                  href="/dashboard"
                  className="group rounded-2xl border border-white/10 bg-black/30 px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                      <LayoutDashboard className="h-4 w-4 text-white/80" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Dashboard</p>
                      <p className="mt-1 text-xs text-white/45">
                        View your measurement history
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/gallery"
                  className="group rounded-2xl border border-white/10 bg-black/30 px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                      <Images className="h-4 w-4 text-white/80" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Gallery</p>
                      <p className="mt-1 text-xs text-white/45">
                        Browse saved results
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/how-it-works"
                  className="group rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-4 transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div>
                    <p className="text-sm font-medium text-white">How it works</p>
                    <p className="mt-1 text-xs text-white/45">
                      Learn the measurement process
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}