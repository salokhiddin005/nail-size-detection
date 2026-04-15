// import { CheckCircle2, RotateCcw } from "lucide-react";

// export type AnalyzeResult = {
//   ok: true;
//   card?: { confidence?: number; bbox?: number[][] | number[] | null };
//   nail?: { confidence?: number; bbox?: number[] | null };
//   measurement: { length_mm: number; width_mm: number };
//   recommended_size: string;
//   original: string;
//   annotated: string;
// };

// export default function ResultsCard({
//   result,
//   onReset,
// }: {
//   result: AnalyzeResult;
//   onReset: () => void;
// }) {
//   const { measurement, recommended_size, nail, card, annotated, original } = result;

//   const nailConfidence =
//     typeof nail?.confidence === "number"
//       ? `${(nail.confidence * 100).toFixed(1)}%`
//       : "—";

//   const cardConfidence =
//     typeof card?.confidence === "number"
//       ? `${(card.confidence * 100).toFixed(1)}%`
//       : "—";

//   return (
//     <div className="space-y-6">
//       <div className="glass p-8">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <CheckCircle2 className="h-6 w-6 text-emerald-400" />
//             <h2 className="text-2xl font-semibold">Measurement complete</h2>
//           </div>
//           <button onClick={onReset} className="btn-ghost" type="button">
//             <RotateCcw className="h-4 w-4" /> New photo
//           </button>
//         </div>

//         <div className="mt-8 grid gap-4 md:grid-cols-3">
//           <Stat label="Length" value={`${measurement.length_mm.toFixed(2)} mm`} />
//           <Stat label="Width" value={`${measurement.width_mm.toFixed(2)} mm`} />
//           <Stat label="Recommended size" value={recommended_size} accent />
//         </div>

//         <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-white/50">
//           <div>
//             Nail confidence:{" "}
//             <span className="text-white/80">{nailConfidence}</span>
//           </div>
//           <div>
//             Card confidence:{" "}
//             <span className="text-white/80">{cardConfidence}</span>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2">
//         <ImagePanel title="Original" src={original} />
//         <ImagePanel title="Detected" src={annotated} />
//       </div>
//     </div>
//   );
// }

// function Stat({
//   label,
//   value,
//   accent,
// }: {
//   label: string;
//   value: string;
//   accent?: boolean;
// }) {
//   return (
//     <div
//       className={`rounded-xl border p-5 ${
//         accent
//           ? "border-rose-400/40 bg-gradient-to-br from-rose-500/15 to-violet-500/15"
//           : "border-white/10 bg-white/[0.03]"
//       }`}
//     >
//       <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
//       <div
//         className={`mt-2 text-3xl font-semibold ${
//           accent
//             ? "bg-gradient-to-r from-rose-300 to-violet-300 bg-clip-text text-transparent"
//             : ""
//         }`}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }

// function ImagePanel({ title, src }: { title: string; src: string }) {
//   return (
//     <div className="glass p-3">
//       <div className="px-2 pb-2 pt-1 text-xs uppercase tracking-wider text-white/50">
//         {title}
//       </div>
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img src={src} alt={title} className="w-full rounded-xl" />
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  RotateCcw,
  Ruler,
  Sparkles,
  ShieldCheck,
  ScanSearch,
  Download,
} from "lucide-react";

export type AnalyzeResult = {
  ok: true;
  card: { score: number };
  nail: { conf: number; bbox: number[] };
  measurement: { length_mm: number; width_mm: number };
  recommended_size: string;
  original: string;
  annotated: string;
};

function formatPercent(value: number) {
  if (Number.isNaN(value)) return "—";
  return `${Math.round(value * 100)}%`;
}

function formatMm(value: number) {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(1)} mm`;
}

function getQualityLabel(score: number) {
  if (!Number.isFinite(score)) return "Unknown";
  if (score >= 0.9) return "Excellent";
  if (score >= 0.75) return "High";
  if (score >= 0.6) return "Good";
  return "Needs review";
}

function getSizeExplanation(size: string, width: number, length: number) {
  const safeSize = size || "Recommended";
  const ratio =
    Number.isFinite(width) && Number.isFinite(length) && length > 0
      ? width / length
      : null;

  if (ratio === null) {
    return `${safeSize} is the best match based on the detected nail region and card calibration.`;
  }

  if (ratio < 0.6) {
    return `${safeSize} looks suitable because your nail appears relatively slim compared with its length.`;
  }

  if (ratio < 0.75) {
    return `${safeSize} is a balanced fit based on the detected width-to-length proportion.`;
  }

  return `${safeSize} is recommended because the detected nail shape appears wider and benefits from a roomier fit.`;
}

function downloadImage(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-white/60">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-xl font-semibold tracking-tight text-white">{value}</div>
      {hint ? <p className="mt-1 text-sm text-white/45">{hint}</p> : null}
    </div>
  );
}

export default function ResultsCard({
  result,
  onReset,
}: {
  result: AnalyzeResult;
  onReset: () => void;
}) {
  const { measurement, recommended_size, nail, card, annotated, original } = result;

  const length = measurement?.length_mm;
  const width = measurement?.width_mm;

  const nailConf = nail?.conf ?? NaN;
  const cardScore = card?.score ?? NaN;

  const nailQuality = getQualityLabel(nailConf);
  const cardQuality = getQualityLabel(cardScore);

  const explanation = getSizeExplanation(recommended_size, width, length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
        <div className="border-b border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-transparent to-cyan-400/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Measurement complete
                  </h2>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    Ready
                  </span>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-white/65">
                  Your nail was measured using the detected reference card and nail
                  region. Review the result below and rescan if you want a second pass.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => downloadImage(annotated, "nailytics-result.png")}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Save result
              </button>

              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.02]"
              >
                <RotateCcw className="h-4 w-4" />
                Scan again
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/30">
              <img
                src={annotated}
                alt="Annotated nail measurement result"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={<Ruler className="h-4 w-4 text-white/80" />}
                label="Length"
                value={formatMm(length)}
                hint="Detected vertical nail span"
              />
              <StatCard
                icon={<Ruler className="h-4 w-4 text-white/80" />}
                label="Width"
                value={formatMm(width)}
                hint="Detected horizontal nail span"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-white/70">
                <Sparkles className="h-5 w-5 text-fuchsia-300" />
                <span className="text-sm font-medium">Recommendation</span>
              </div>

              <div className="rounded-[22px] border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/15 to-cyan-400/10 p-5">
                <p className="text-sm text-white/60">Recommended size</p>
                <div className="mt-2 text-4xl font-semibold tracking-tight text-white">
                  {recommended_size || "—"}
                </div>
                <p className="mt-3 text-sm leading-6 text-white/70">{explanation}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={<ScanSearch className="h-4 w-4 text-white/80" />}
                label="Nail detection"
                value={formatPercent(nailConf)}
                hint={nailQuality}
              />
              <StatCard
                icon={<ShieldCheck className="h-4 w-4 text-white/80" />}
                label="Card calibration"
                value={formatPercent(cardScore)}
                hint={cardQuality}
              />
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="mb-3 text-sm font-medium text-white/75">What this means</p>
              <ul className="space-y-2 text-sm leading-6 text-white/60">
                <li>• The card was used as the real-world size reference.</li>
                <li>• The nail region was detected and converted into millimeters.</li>
                <li>• Your suggested size is based on the measured nail proportions.</li>
              </ul>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="mb-3 text-sm font-medium text-white/75">Images</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={original}
                    alt="Original upload"
                    className="h-32 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={annotated}
                    alt="Annotated output"
                    className="h-32 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}