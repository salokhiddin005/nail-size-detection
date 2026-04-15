const steps = [
  {
    n: "01",
    title: "Place finger on a bank card",
    body: "Any standard credit, debit, or ID card works — they're all 85.60 × 53.98 mm.",
  },
  {
    n: "02",
    title: "Snap or upload a photo",
    body: "Use your webcam or drop in a photo. Make sure the full card and your nail are visible.",
  },
  {
    n: "03",
    title: "AI does the rest",
    body: "We detect the card, find your nail, calibrate to millimetres, and recommend a size — instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <h2 className="text-4xl font-semibold tracking-tight">Three steps. Real measurements.</h2>
        <p className="mt-3 text-white/60">
          No rulers. No special equipment. Just your phone and any card you carry.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="glass p-8">
            <div className="bg-gradient-to-br from-rose-400 to-violet-400 bg-clip-text text-5xl font-semibold text-transparent">
              {s.n}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-white/60">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
