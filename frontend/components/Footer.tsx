"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const hiddenPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];

export default function Footer() {
  const pathname = usePathname();
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <footer className="mt-32 border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-white/50 md:flex-row">
        <p>
          © {new Date().getFullYear()} Nailytics. AI-calibrated measurements for
          the perfect fit.
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/privacy" className="transition hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-white">
            Terms
          </Link>
          <Link href="/contact" className="transition hover:text-white">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
