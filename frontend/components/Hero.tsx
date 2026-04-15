import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-wider text-white/70">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
          AI vision, calibrated to 0.1 mm
        </span>
        <h1 className="mt-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-7xl">
          Your perfect nail size.
          <br />
          From a single photo.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
          Snap your fingernail next to any standard bank card. Our AI measures
          it in millimetres and recommends the size that actually fits — no
          rulers, no guesswork.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link href="/analyze" className="btn-primary">
            <Camera className="h-4 w-4" /> Measure my nail
          </Link>
          <Link href="/how-it-works" className="btn-ghost">
            How it works <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
