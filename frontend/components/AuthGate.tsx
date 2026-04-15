"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PUBLIC_ROUTES = ["/login", "/signup"];

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Session error:", error.message);
      }

      const session = data.session;
      const isPublic = PUBLIC_ROUTES.includes(pathname);

      // 🚫 NOT LOGGED IN → FORCE SIGNUP
      if (!session && !isPublic) {
        router.replace("/signup");
        return;
      }

      // ✅ LOGGED IN → BLOCK LOGIN/SIGNUP PAGES
      if (session && isPublic) {
        router.replace("/dashboard");
        return;
      }

      setReady(true);
    };

    checkSession();

    // 🔁 listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        const isPublic = PUBLIC_ROUTES.includes(pathname);

        if (!session && !isPublic) {
          router.replace("/signup");
          return;
        }

        if (session && isPublic) {
          router.replace("/dashboard");
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}