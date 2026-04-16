"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AnalysisResult = {
  id: string | number;
  length_mm: number | null;
  width_mm: number | null;
  recommended_size: string | null;
  original_image_url: string | null;
  annotated_image_url: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError.message);
        }

        if (profile?.full_name) {
          setUserName(profile.full_name);
        } else {
          const fallbackName =
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User";

          setUserName(fallbackName);

          const { error: upsertError } = await supabase.from("profiles").upsert({
            id: user.id,
            full_name: fallbackName,
            email: user.email,
          });

          if (upsertError) {
            console.error("Profile upsert error:", upsertError.message);
          }
        }

        const { data, error } = await supabase
          .from("analysis_results")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setResults(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleDelete = async (id: string | number) => {
    const confirmed = window.confirm("Delete this result?");
    if (!confirmed) return;

    try {
      setDeletingId(id);

      const { error } = await supabase
        .from("analysis_results")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setResults((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete result.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold">
            {userName ? `${userName}'s Dashboard` : "My Dashboard"}
          </h1>
          <p className="mt-3 text-white/60">
            Your personal nail measurement history and analysis results.
          </p>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <h2 className="text-2xl font-semibold text-red-300">
              Failed to load history
            </h2>
            <p className="mt-3 text-red-200/80">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
            <h2 className="text-2xl font-semibold">No analyses yet</h2>
            <p className="mt-3 max-w-2xl text-white/60">
              Your dashboard is empty. Start analyzing to see results here.
            </p>

            <div className="mt-6">
              <Link
                href="/analyze"
                className="inline-flex rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 font-medium text-white transition hover:opacity-90"
              >
                Try it now
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {results.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Analysis #{item.id}
                  </h2>
                  <span className="text-xs text-white/50">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-white/70">
                  <p>
                    <span className="text-white">Length:</span>{" "}
                    {item.length_mm ?? "-"} mm
                  </p>
                  <p>
                    <span className="text-white">Width:</span>{" "}
                    {item.width_mm ?? "-"} mm
                  </p>
                  <p>
                    <span className="text-white">Size:</span>{" "}
                    {item.recommended_size ?? "-"}
                  </p>
                </div>

                {item.annotated_image_url && (
                  <img
                    src={item.annotated_image_url}
                    alt="Result"
                    className="mt-5 h-56 w-full rounded-2xl object-cover"
                  />
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="mt-4 w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  {deletingId === item.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}