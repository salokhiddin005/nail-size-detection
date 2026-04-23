"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PasswordStrengthMeter, {
  evaluatePassword,
} from "@/components/PasswordStrength";

export default function SettingsPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [originalFullName, setOriginalFullName] = useState("");
  const [loading, setLoading] = useState(true);

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email ?? "");
        const name = (user.user_metadata?.full_name as string) ?? "";
        setFullName(name);
        setOriginalFullName(name);
      }
      setLoading(false);
    };
    load();
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");

    const cleanName = fullName.trim();
    if (!cleanName) {
      setProfileErr("Name cannot be empty.");
      return;
    }
    if (cleanName === originalFullName) {
      setProfileMsg("No changes to save.");
      return;
    }

    setProfileSaving(true);

    const { error: metaErr } = await supabase.auth.updateUser({
      data: { full_name: cleanName },
    });
    if (metaErr) {
      setProfileErr(metaErr.message);
      setProfileSaving(false);
      return;
    }

    if (userId) {
      const { error: syncErr } = await supabase
        .from("profiles")
        .update({ full_name: cleanName })
        .eq("id", userId);
      if (syncErr) {
        console.warn("Profile sync failed:", syncErr.message);
      }
    }

    setOriginalFullName(cleanName);
    setProfileMsg("Profile updated.");
    setProfileSaving(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg("");
    setPwdErr("");

    const check = evaluatePassword(newPwd);
    if (!check.valid) {
      setPwdErr(`Password needs ${check.issues.join(", ")}.`);
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdErr("New passwords do not match.");
      return;
    }

    setPwdSaving(true);

    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email,
      password: currentPwd,
    });
    if (verifyErr) {
      setPwdErr("Current password is incorrect.");
      setPwdSaving(false);
      return;
    }

    const { error: updateErr } = await supabase.auth.updateUser({
      password: newPwd,
    });
    if (updateErr) {
      setPwdErr(updateErr.message);
      setPwdSaving(false);
      return;
    }

    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setPwdMsg("Password updated.");
    setPwdSaving(false);
  };

  const deleteAccount = async () => {
    setDeleteErr("");
    setDeleting(true);

    const { error } = await supabase.rpc("delete_user");
    if (error) {
      setDeleteErr(error.message);
      setDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-12 text-white">
        <p className="text-sm text-white/60">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-white">
      <h1 className="mb-10 text-4xl font-semibold">Account settings</h1>

      <section className="glass mb-8 p-6">
        <h2 className="mb-1 text-xl font-semibold">Profile</h2>
        <p className="mb-6 text-sm text-white/60">
          Your public display name and email.
        </p>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/80">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
              required
              maxLength={100}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/80">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-white/50 outline-none"
            />
            <p className="mt-2 text-xs text-white/40">
              Email cannot be changed from this page.
            </p>
          </div>
          {profileErr ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {profileErr}
            </div>
          ) : null}
          {profileMsg ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {profileMsg}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={profileSaving || fullName.trim() === originalFullName}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {profileSaving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>

      <section className="glass mb-8 p-6">
        <h2 className="mb-1 text-xl font-semibold">Change password</h2>
        <p className="mb-6 text-sm text-white/60">
          Enter your current password and choose a new one.
        </p>
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/80">
              Current password
            </label>
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/80">
              New password
            </label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
              required
              minLength={8}
            />
            <PasswordStrengthMeter password={newPwd} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/80">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
              required
              minLength={8}
            />
          </div>
          {pwdErr ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {pwdErr}
            </div>
          ) : null}
          {pwdMsg ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {pwdMsg}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={pwdSaving}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pwdSaving ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>

      <section className="glass p-6">
        <h2 className="mb-1 text-xl font-semibold text-red-300">Danger zone</h2>
        <p className="mb-6 text-sm text-white/60">
          Permanently delete your account. This cannot be undone.
        </p>

        {showDeleteConfirm ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-5">
            <p className="mb-4 text-sm text-red-200">
              Are you absolutely sure? Your account, profile, and all associated
              data will be deleted. This cannot be undone.
            </p>
            {deleteErr ? (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {deleteErr}
              </div>
            ) : null}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteErr("");
                }}
                disabled={deleting}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteAccount}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, delete my account"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
          >
            Delete my account
          </button>
        )}
      </section>
    </main>
  );
}
