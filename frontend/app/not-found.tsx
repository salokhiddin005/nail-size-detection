import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-white">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 bg-gradient-to-br from-pink-400 via-rose-400 to-violet-400 bg-clip-text text-8xl font-bold text-transparent">
          404
        </div>
        <h1 className="mb-3 text-2xl font-semibold">Page not found</h1>
        <p className="mb-8 text-sm text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            href="/analyze"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5"
          >
            Try the analyzer
          </Link>
        </div>
      </div>
    </main>
  );
}
