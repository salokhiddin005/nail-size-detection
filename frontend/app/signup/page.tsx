"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthBackground from "@/components/AuthBackground";
import PasswordStrengthMeter, {
  evaluatePassword,
} from "@/components/PasswordStrength";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordCheck = evaluatePassword(password);
    if (!passwordCheck.valid) {
      setError(`Password needs ${passwordCheck.issues.join(", ")}.`);
      return;
    }

    setLoading(true);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const emailRedirectTo = `${window.location.origin}/login`;

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
        },
        emailRedirectTo,
      },
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    setSentEmail(cleanEmail);
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen px-6 py-12 text-white">
      <AuthBackground />
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-2 text-3xl font-semibold">Create account</h1>
        <p className="mb-6 text-sm text-white/60">
          Sign up to access the full website.
        </p>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Check your inbox. We sent a verification link to{" "}
              <span className="font-medium">{sentEmail}</span>. Click it to
              activate your account, then log in.
            </div>
            <Link
              href="/login"
              className="inline-block text-sm text-white underline underline-offset-4"
            >
              Back to log in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/80">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
                required
              />
            </div>

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
              <label className="mb-2 block text-sm text-white/80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
                required
                minLength={8}
              />
              <PasswordStrengthMeter password={password} />
            </div>

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
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-center text-xs text-white/50">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-white"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-white"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        )}

        <p className="mt-6 text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
