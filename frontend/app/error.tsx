"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-white">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-7xl font-bold text-transparent">
          Oops
        </div>
        <h1 className="mb-3 text-2xl font-semibold">Something went wrong</h1>
        <p className="mb-8 text-sm text-white/60">
          An unexpected error occurred. Try again, or head back home.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
