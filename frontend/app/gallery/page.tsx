

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useConfirm } from "@/components/ConfirmProvider";
import { useToast } from "@/components/ToastProvider";

type GalleryItem = {
  id: string | number;
  original_image_url: string | null;
  annotated_image_url: string | null;
  recommended_size: string | null;
  length_mm?: number | null;
  width_mm?: number | null;
  created_at: string;
};

export default function GalleryPage() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
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

        const { data, error } = await supabase
          .from("analysis_results")
          .select(
            "id, original_image_url, annotated_image_url, recommended_size, length_mm, width_mm, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setItems(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [router]);

  const handleShare = async (item: GalleryItem) => {
    const url = item.annotated_image_url || item.original_image_url;
    if (!url) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Nailytics result",
          text: `My nail size result${item.recommended_size ? ` - Size ${item.recommended_size}` : ""}`,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success("Image link copied to clipboard.");
    } catch (err) {
      console.error("Share failed:", err);
      toast.error("Could not share. Try downloading instead.");
    }
  };

  const handleDownload = async (item: GalleryItem) => {
    const url = item.annotated_image_url || item.original_image_url;
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `nailytics-result-${item.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(url, "_blank");
    }
  };

  const handleDelete = async (itemId: string | number) => {
    const ok = await confirm({
      title: "Delete from your gallery?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!ok) return;

    try {
      setDeletingId(itemId);

      const { error } = await supabase
        .from("analysis_results")
        .delete()
        .eq("id", itemId);

      if (error) {
        throw error;
      }

      setItems((prev) => prev.filter((item) => item.id !== itemId));

      if (selectedItem?.id === itemId) {
        setSelectedItem(null);
      }

      toast.success("Deleted from your gallery.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete this item.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-white/60">Loading gallery...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold">My Gallery</h1>
          <p className="mt-3 text-white/60">
            Your saved nail analysis outputs and processed images.
          </p>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <h2 className="text-2xl font-semibold text-red-300">Failed to load gallery</h2>
            <p className="mt-3 text-red-200/80">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
            <h2 className="text-2xl font-semibold">No gallery items yet</h2>
            <p className="mt-3 max-w-2xl text-white/60">
              Your gallery is empty for now. When you analyze an image or use the
              webcam, your outputs will be saved here.
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
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-white">
                      {item.recommended_size
                        ? `Size: ${item.recommended_size}`
                        : "Saved output"}
                    </p>
                    <span className="text-xs text-white/50">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <img
                    src={item.annotated_image_url || item.original_image_url || ""}
                    alt="Gallery output"
                    className="h-72 w-full rounded-2xl object-cover"
                  />

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleShare(item)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                      type="button"
                    >
                      Share
                    </button>

                    <button
                      onClick={() => handleDownload(item)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                      type="button"
                    >
                      Download
                    </button>

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                      type="button"
                    >
                      View details
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                      type="button"
                    >
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white shadow-2xl">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">Result details</h2>
                      <p className="mt-2 text-sm text-white/60">
                        Saved on {new Date(selectedItem.created_at).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedItem(null)}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                      type="button"
                    >
                      Close
                    </button>
                  </div>

                  <img
                    src={
                      selectedItem.annotated_image_url ||
                      selectedItem.original_image_url ||
                      ""
                    }
                    alt="Selected result"
                    className="max-h-[60vh] w-full rounded-2xl object-contain bg-black"
                  />

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/50">Recommended size</p>
                      <p className="mt-1 text-lg font-semibold">
                        {selectedItem.recommended_size || "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/50">Created</p>
                      <p className="mt-1 text-lg font-semibold">
                        {new Date(selectedItem.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/50">Length</p>
                      <p className="mt-1 text-lg font-semibold">
                        {selectedItem.length_mm ?? "-"} mm
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/50">Width</p>
                      <p className="mt-1 text-lg font-semibold">
                        {selectedItem.width_mm ?? "-"} mm
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleShare(selectedItem)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                      type="button"
                    >
                      Share
                    </button>

                    <button
                      onClick={() => handleDownload(selectedItem)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                      type="button"
                    >
                      Download
                    </button>

                    <button
                      onClick={() => setSelectedItem(null)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                      type="button"
                    >
                      Close
                    </button>

                    <button
                      onClick={() => handleDelete(selectedItem.id)}
                      disabled={deletingId === selectedItem.id}
                      className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                      type="button"
                    >
                      {deletingId === selectedItem.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}