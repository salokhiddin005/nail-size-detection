"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { supabase } from "@/lib/supabase";
import AuthBackground from "@/components/AuthBackground";

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (HCAPTCHA_SITE_KEY && !captchaToken) {
      setError("Please complete the captcha first.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: captchaToken ?? undefined,
      },
    });

    captchaRef.current?.resetCaptcha();
    setCaptchaToken(null);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
  };

  return (
    <main className="relative min-h-screen px-6 py-12 text-white">
      <AuthBackground />
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-2 text-3xl font-semibold">Log in</h1>
        <p className="mb-6 text-sm text-white/60">
          Log in to access the full website.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm text-white/80">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-white/70 underline underline-offset-4 hover:text-white"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />
          </div>

          {HCAPTCHA_SITE_KEY ? (
            <div className="flex justify-center">
              <HCaptcha
                ref={captchaRef}
                sitekey={HCAPTCHA_SITE_KEY}
                theme="dark"
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
              />
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-white/60">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-white underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}