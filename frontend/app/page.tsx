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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/50">
            AI nail sizing
          </p>
          <h1 className="mb-4 text-5xl font-semibold md:text-7xl">
            Your perfect nail size.
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            Upload a photo, measure accurately, and access your dashboard,
            gallery, and analysis tools after login.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/analyze"
            className="rounded-xl bg-white px-5 py-3 font-medium text-black"
          >
            Measure now
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/20 px-5 py-3 text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/gallery"
            className="rounded-xl border border-white/20 px-5 py-3 text-white"
          >
            Gallery
          </Link>

          <Link
            href="/how-it-works"
            className="rounded-xl border border-white/20 px-5 py-3 text-white"
          >
            How it works
          </Link>
        </div>
      </div>
    </main>
  );
}