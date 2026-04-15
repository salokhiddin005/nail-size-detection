import { Ruler, Sparkles, ShieldCheck, Smartphone } from "lucide-react";

const items = [
  {
    icon: Ruler,
    title: "Sub-millimetre accuracy",
    body: "Homography calibration using a standard ID-1 card compensates for camera tilt and perspective.",
  },
  {
    icon: Sparkles,
    title: "AI-powered detection",
    body: "A YOLO model trained on real fingernails finds the nail with high confidence in any pose.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy first",
    body: "Photos are processed in-memory and discarded. Nothing is stored unless you save it to your dashboard.",
  },
  {
    icon: Smartphone,
    title: "Works on any phone",
    body: "No app required. Open the site, capture from your camera, and get a result in seconds.",
  },
];

export default function FeatureGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass p-6">
            <Icon className="h-6 w-6 text-rose-400" />
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-white/60">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
