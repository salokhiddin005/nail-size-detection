// "use client";

// import { useEffect, useState } from "react";
// import UploadDropzone from "@/components/UploadDropzone";
// import CameraCapture from "@/components/CameraCapture";
// import LoadingState from "@/components/LoadingState";
// import ResultsCard, { AnalyzeResult } from "@/components/ResultsCard";
// import ErrorMessage from "@/components/ErrorMessage";

// type Stage = "idle" | "preview" | "loading" | "result" | "error";

// const ERROR_TITLES: Record<string, string> = {
//   no_card: "We couldn't find a card",
//   no_nail: "We couldn't find your nail",
// };

// export default function AnalyzePage() {
//   const [tab, setTab] = useState<"upload" | "camera">("upload");
//   const [stage, setStage] = useState<Stage>("idle");
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [result, setResult] = useState<AnalyzeResult | null>(null);
//   const [error, setError] = useState<{ title: string; message: string } | null>(null);

//   const analyzeFile = async (targetFile: File) => {
//     setStage("loading");
//     setError(null);

//     try {
//       const fd = new FormData();
//       fd.append("image", targetFile);

//       const res = await fetch("http://127.0.0.1:8000/api/analyze", {
//         method: "POST",
//         body: fd,
//       });

//       const text = await res.text();
//       let data: any = null;

//       try {
//         data = JSON.parse(text);
//       } catch {
//         throw new Error(text || "Server did not return valid JSON.");
//       }

//       if (!res.ok || !data?.ok) {
//         setError({
//           title: ERROR_TITLES[data?.error] || "Analysis failed",
//           message:
//             data?.message ||
//             "Please try another photo with the card and nail clearly visible.",
//         });
//         setStage("error");
//         return;
//       }

//       setResult(data as AnalyzeResult);
//       setStage("result");
//     } catch (e: any) {
//       setError({
//         title: "Network error",
//         message: e?.message || "Could not reach the API.",
//       });
//       setStage("error");
//     }
//   };

//   const onFile = (f: File) => {
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl);
//     }

//     setFile(f);
//     setPreviewUrl(URL.createObjectURL(f));
//     setResult(null);
//     setError(null);

//     if (tab === "camera") {
//       analyzeFile(f);
//     } else {
//       setStage("preview");
//     }
//   };

//   const reset = () => {
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl);
//     }

//     setStage("idle");
//     setFile(null);
//     setPreviewUrl(null);
//     setResult(null);
//     setError(null);
//   };

//   useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   const analyze = async () => {
//     if (!file) return;
//     await analyzeFile(file);
//   };

//   return (
//     <section className="mx-auto max-w-4xl px-6 py-16">
//       <div className="text-center">
//         <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
//           Measure your nail
//         </h1>
//         <p className="mt-3 text-white/60">
//           Place a finger on a standard bank card. Upload or capture a photo.
//         </p>
//       </div>

//       <div className="mt-10 space-y-6">
//         {(stage === "idle" || stage === "preview") && (
//           <>
//             <div className="flex justify-center gap-2">
//               <button
//                 onClick={() => {
//                   setTab("upload");
//                   if (stage !== "preview") {
//                     setError(null);
//                   }
//                 }}
//                 className={`rounded-full px-5 py-2 text-sm font-medium ${
//                   tab === "upload"
//                     ? "bg-white text-black"
//                     : "text-white/70 hover:text-white"
//                 }`}
//                 type="button"
//               >
//                 Upload
//               </button>

//               <button
//                 onClick={() => {
//                   setTab("camera");
//                   if (stage !== "preview") {
//                     setError(null);
//                   }
//                 }}
//                 className={`rounded-full px-5 py-2 text-sm font-medium ${
//                   tab === "camera"
//                     ? "bg-white text-black"
//                     : "text-white/70 hover:text-white"
//                 }`}
//                 type="button"
//               >
//                 Camera
//               </button>
//             </div>

//             {stage === "idle" && tab === "upload" && <UploadDropzone onFile={onFile} />}
//             {stage === "idle" && tab === "camera" && <CameraCapture onCapture={onFile} />}

//             {stage === "preview" && previewUrl && (
//               <div className="glass p-4">
//                 <img
//                   src={previewUrl}
//                   alt="Preview"
//                   className="max-h-[60vh] w-full rounded-xl bg-black object-contain"
//                 />

//                 <div className="mt-4 flex flex-wrap justify-center gap-3">
//                   <button onClick={reset} className="btn-ghost" type="button">
//                     Choose different
//                   </button>

//                   <button onClick={analyze} className="btn-primary" type="button">
//                     Analyze photo
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {stage === "loading" && <LoadingState />}

//         {stage === "result" && result && <ResultsCard result={result} onReset={reset} />}

//         {stage === "error" && error && (
//           <ErrorMessage
//             title={error.title}
//             message={error.message}
//             onRetry={reset}
//           />
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import UploadDropzone from "@/components/UploadDropzone";
import CameraCapture from "@/components/CameraCapture";
import LoadingState from "@/components/LoadingState";
import ResultsCard, { AnalyzeResult } from "@/components/ResultsCard";
import ErrorMessage from "@/components/ErrorMessage";
import { supabase } from "@/lib/supabase";

type Stage = "idle" | "preview" | "loading" | "result" | "error";

const ERROR_TITLES: Record<string, string> = {
  no_card: "We couldn't find a card",
  no_nail: "We couldn't find your nail",
  unauthorized: "Please log in",
};

export default function AnalyzePage() {
  const [tab, setTab] = useState<"upload" | "camera">("upload");
  const [stage, setStage] = useState<Stage>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);

  const analyzeFile = async (targetFile: File) => {
    setStage("loading");
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError({
          title: "Please log in",
          message: "You need to be logged in to save results to your dashboard and gallery.",
        });
        setStage("error");
        return;
      }

      const fd = new FormData();
      fd.append("image", targetFile);
      fd.append("source", tab === "camera" ? "webcam" : "upload");

      const res = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        body: fd,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const text = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok) {
        const detail =
          data?.detail ||
          data?.message ||
          text ||
          "Please try another photo with the card and nail clearly visible.";

        setError({
          title: ERROR_TITLES[data?.error] || "Analysis failed",
          message: detail,
        });
        setStage("error");
        return;
      }

      if (!data?.ok) {
        setError({
          title: ERROR_TITLES[data?.error] || "Analysis failed",
          message:
            data?.message ||
            "Please try another photo with the card and nail clearly visible.",
        });
        setStage("error");
        return;
      }

      setResult(data as AnalyzeResult);
      setStage("result");
    } catch (e: any) {
      setError({
        title: "Network error",
        message: e?.message || "Could not reach the API.",
      });
      setStage("error");
    }
  };

  const onFile = (f: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setError(null);

    if (tab === "camera") {
      analyzeFile(f);
    } else {
      setStage("preview");
    }
  };

  const reset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setStage("idle");
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const analyze = async () => {
    if (!file) return;
    await analyzeFile(file);
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Measure your nail
        </h1>
        <p className="mt-3 text-white/60">
          Place a finger on a standard bank card. Upload or capture a photo.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {(stage === "idle" || stage === "preview") && (
          <>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  setTab("upload");
                  if (stage !== "preview") {
                    setError(null);
                  }
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium ${
                  tab === "upload"
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                }`}
                type="button"
              >
                Upload
              </button>

              <button
                onClick={() => {
                  setTab("camera");
                  if (stage !== "preview") {
                    setError(null);
                  }
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium ${
                  tab === "camera"
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                }`}
                type="button"
              >
                Camera
              </button>
            </div>

            {stage === "idle" && tab === "upload" && <UploadDropzone onFile={onFile} />}
            {stage === "idle" && tab === "camera" && <CameraCapture onCapture={onFile} />}

            {stage === "preview" && previewUrl && (
              <div className="glass p-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[60vh] w-full rounded-xl bg-black object-contain"
                />

                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button onClick={reset} className="btn-ghost" type="button">
                    Choose different
                  </button>

                  <button onClick={analyze} className="btn-primary" type="button">
                    Analyze photo
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {stage === "loading" && <LoadingState />}

        {stage === "result" && result && <ResultsCard result={result} onReset={reset} />}

        {stage === "error" && error && (
          <ErrorMessage
            title={error.title}
            message={error.message}
            onRetry={reset}
          />
        )}
      </div>
    </section>
  );
}