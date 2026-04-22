"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthBackground from "@/components/AuthBackground";
import PasswordStrengthMeter, {
  evaluatePassword,
} from "@/components/PasswordStrength";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [canReset, setCanReset] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setCanReset(true);
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        setCanReset(true);
      }
      setReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordCheck = evaluatePassword(password);
    if (!passwordCheck.valid) {
      setError(`Password needs ${passwordCheck.issues.join(", ")}.`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    await supabase.auth.signOut();

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  if (!ready) {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-6 py-12 text-white">
        <AuthBackground />
        <p className="text-sm text-white/60">Loading...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen px-6 py-12 text-white">
      <AuthBackground />
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="mb-2 text-3xl font-semibold">Set new password</h1>
        <p className="mb-6 text-sm text-white/60">
          Enter your new password below.
        </p>

        {success ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Password updated. Redirecting you to the login page...
            </div>
            <Link
              href="/login"
              className="inline-block text-sm text-white underline underline-offset-4"
            >
              Go to log in now
            </Link>
          </div>
        ) : !canReset ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              This password reset link is invalid or has expired. Please request
              a new one.
            </div>
            <Link
              href="/forgot-password"
              className="inline-block text-sm text-white underline underline-offset-4"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white/80">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
                required
                minLength={8}
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
                required
                minLength={8}
              />
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
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
