// "use client";

// import Link from "next/link";
// import { Sparkles } from "lucide-react";

// const navItems = [
//   { href: "/how-it-works", label: "How it works" },
//   { href: "/dashboard", label: "Dashboard" },
//   { href: "/gallery", label: "Gallery" },
//   { href: "/about", label: "About" },
//   { href: "/contact", label: "Contact" },
// ];

// export default function Navbar() {
//   return (
//     <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
//       <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//         <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-white">
//           <Sparkles className="h-5 w-5 text-rose-400" />
//           <span>Nailytics</span>
//         </Link>

//         <nav className="hidden items-center gap-8 md:flex">
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="text-sm text-white/70 transition hover:text-white"
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>

//         <Link
//           href="/analyze"
//           className="rounded-full bg-gradient-to-r from-rose-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:scale-[1.02]"
//         >
//           Try it now
//         </Link>
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const hiddenPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const shouldHideNavbar = hiddenPaths.includes(pathname);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading || shouldHideNavbar || !isLoggedIn) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-pink-400" />
          <span className="text-2xl font-semibold">Nailytics</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex">
          <Link href="/how-it-works" className="transition hover:text-white">
            How it works
          </Link>

          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>

          <Link href="/gallery" className="transition hover:text-white">
            Gallery
          </Link>

          <Link href="/about" className="transition hover:text-white">
            About
          </Link>

          <Link href="/contact" className="transition hover:text-white">
            Contact
          </Link>

          <Link
            href="/analyze"
            className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Try it now
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-full border border-red-500/40 bg-red-500/15 px-5 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/25 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </header>
  );
}