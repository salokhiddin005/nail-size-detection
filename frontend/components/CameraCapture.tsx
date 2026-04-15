// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { Camera as CameraIcon, RefreshCw } from "lucide-react";

// export default function CameraCapture({ onCapture }: { onCapture: (f: File) => void }) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);

//   const [error, setError] = useState<string | null>(null);
//   const [starting, setStarting] = useState(false);
//   const [ready, setReady] = useState(false);

//   const stopCamera = useCallback(() => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }

//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }

//     setReady(false);
//   }, []);

//   const startCamera = useCallback(async () => {
//     setError(null);
//     setStarting(true);
//     setReady(false);

//     stopCamera();

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1920 },
//           height: { ideal: 1080 },
//           facingMode: { ideal: "environment" },
//         },
//         audio: false,
//       });

//       streamRef.current = stream;

//       const video = videoRef.current;
//       if (!video) {
//         setStarting(false);
//         return;
//       }

//       video.srcObject = stream;

//       video.onloadedmetadata = async () => {
//         try {
//           await video.play();
//           setReady(true);
//         } catch (err: any) {
//           setError(err?.message || "Could not start camera preview.");
//         } finally {
//           setStarting(false);
//         }
//       };
//     } catch (err: any) {
//       const message =
//         err?.name === "NotAllowedError"
//           ? "Camera permission was denied. Please allow camera access in your browser."
//           : err?.name === "NotFoundError"
//             ? "No camera was found on this device."
//             : err?.message || "Could not access camera.";
//       setError(message);
//       setStarting(false);
//     }
//   }, [stopCamera]);

//   useEffect(() => {
//     startCamera();

//     return () => {
//       stopCamera();
//     };
//   }, [startCamera, stopCamera]);

//   const capturePhoto = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (!video.videoWidth || !video.videoHeight) {
//       setError("Camera is not ready yet. Please wait a moment and try again.");
//       return;
//     }

//     const fullW = video.videoWidth;
//     const fullH = video.videoHeight;

//     // Center crop for webcam, similar to a clean uploaded photo
//     const cropRatio = 0.70;
//     const cropW = Math.floor(fullW * cropRatio);
//     const cropH = Math.floor(fullH * cropRatio);
//     const sx = Math.floor((fullW - cropW) / 2);
//     const sy = Math.floor((fullH - cropH) / 2);

//     const canvas = document.createElement("canvas");
//     canvas.width = cropW;
//     canvas.height = cropH;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) {
//       setError("Could not capture the image.");
//       return;
//     }

//     ctx.drawImage(video, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

//     canvas.toBlob(
//       (blob) => {
//         if (!blob) {
//           setError("Failed to create image from camera capture.");
//           return;
//         }

//         const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
//         onCapture(file);
//       },
//       "image/jpeg",
//       0.95
//     );
//   };

//   return (
//     <div className="glass p-4">
//       <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
//         {error ? (
//           <div className="flex h-full items-center justify-center p-6 text-center text-white/80">
//             <div>
//               <p>{error}</p>
//               <button
//                 onClick={startCamera}
//                 className="btn-ghost mt-4 inline-flex items-center gap-2"
//                 type="button"
//               >
//                 <RefreshCw className="h-4 w-4" />
//                 Retry
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <video
//               ref={videoRef}
//               className="h-full w-full object-contain"
//               autoPlay
//               playsInline
//               muted
//             />

//             <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//               <div className="h-[52%] w-[70%] rounded-2xl border-2 border-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.18)]" />
//             </div>

//             <div className="absolute bottom-3 left-3 right-3">
//               <div className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm font-medium text-white/85 backdrop-blur">
//                 Keep the card and fingernail inside the center guide, then press Capture.
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {!error && (
//         <div className="mt-4 flex justify-center gap-3">
//           <button
//             onClick={startCamera}
//             className="btn-ghost inline-flex items-center gap-2"
//             type="button"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Restart camera
//           </button>

//           <button
//             onClick={capturePhoto}
//             className="btn-primary inline-flex items-center gap-2"
//             type="button"
//             disabled={!ready || starting}
//           >
//             <CameraIcon className="h-4 w-4" />
//             {starting ? "Starting..." : "Capture"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera as CameraIcon, RefreshCw } from "lucide-react";

export default function CameraCapture({ onCapture }: { onCapture: (f: File) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [ready, setReady] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setStarting(true);
    setReady(false);

    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        setStarting(false);
        return;
      }

      video.srcObject = stream;

      video.onloadedmetadata = async () => {
        try {
          await video.play();
          setReady(true);
        } catch (err: any) {
          setError(err?.message || "Could not start camera preview.");
        } finally {
          setStarting(false);
        }
      };
    } catch (err: any) {
      const message =
        err?.name === "NotAllowedError"
          ? "Camera permission was denied. Please allow camera access in your browser."
          : err?.name === "NotFoundError"
            ? "No camera was found on this device."
            : err?.message || "Could not access camera.";
      setError(message);
      setStarting(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const guide = guideRef.current;

    if (!video || !guide) return;

    if (!video.videoWidth || !video.videoHeight) {
      setError("Camera is not ready yet. Please wait a moment and try again.");
      return;
    }

    const videoRect = video.getBoundingClientRect();
    const guideRect = guide.getBoundingClientRect();

    if (videoRect.width <= 0 || videoRect.height <= 0) {
      setError("Camera preview is not ready.");
      return;
    }

    // Map guide box from displayed preview space -> real video pixel space
    const scaleX = video.videoWidth / videoRect.width;
    const scaleY = video.videoHeight / videoRect.height;

    const sx = Math.max(0, Math.round((guideRect.left - videoRect.left) * scaleX));
    const sy = Math.max(0, Math.round((guideRect.top - videoRect.top) * scaleY));
    const sw = Math.min(video.videoWidth - sx, Math.round(guideRect.width * scaleX));
    const sh = Math.min(video.videoHeight - sy, Math.round(guideRect.height * scaleY));

    if (sw <= 0 || sh <= 0) {
      setError("Could not determine capture area.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Could not capture the image.");
      return;
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Failed to create image from camera capture.");
          return;
        }

        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        onCapture(file);
      },
      "image/jpeg",
      0.95
    );
  };

  return (
    <div className="glass p-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        {error ? (
          <div className="flex h-full items-center justify-center p-6 text-center text-white/80">
            <div>
              <p>{error}</p>
              <button
                onClick={startCamera}
                className="btn-ghost mt-4 inline-flex items-center gap-2"
                type="button"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="h-full w-full object-contain"
              autoPlay
              playsInline
              muted
            />

            {/* Dark outside overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/35" />

              {/* Card guide area */}
              <div
                ref={guideRef}
                className="relative z-10 aspect-[1.586] w-[68%] max-w-[720px]"
              >
                {/* Transparent window effect */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />

                {/* Corner brackets */}
                <div className="absolute left-0 top-0 h-10 w-10 border-l-4 border-t-4 border-emerald-400 rounded-tl-xl" />
                <div className="absolute right-0 top-0 h-10 w-10 border-r-4 border-t-4 border-emerald-400 rounded-tr-xl" />
                <div className="absolute left-0 bottom-0 h-10 w-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                <div className="absolute right-0 bottom-0 h-10 w-10 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <div className="rounded-xl border border-white/15 bg-black/45 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur">
                Align the full card inside the green corner frame. Only the inside area will be captured.
              </div>
            </div>
          </>
        )}
      </div>

      {!error && (
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={startCamera}
            className="btn-ghost inline-flex items-center gap-2"
            type="button"
          >
            <RefreshCw className="h-4 w-4" />
            Restart camera
          </button>

          <button
            onClick={capturePhoto}
            className="btn-primary inline-flex items-center gap-2"
            type="button"
            disabled={!ready || starting}
          >
            <CameraIcon className="h-4 w-4" />
            {starting ? "Starting..." : "Capture"}
          </button>
        </div>
      )}
    </div>
  );
}