export default function Footer() {
  return (
    <footer className="mt-32 border-t border-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-10 text-sm text-white/50 md:flex-row">
        <p>© {new Date().getFullYear()} Nailytics. AI-calibrated measurements for the perfect fit.</p>
        <p>Built with computer vision + a standard ID-1 card (85.60 × 53.98 mm).</p>
      </div>
    </footer>
  );
}
