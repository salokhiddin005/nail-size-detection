export default function LoadingState() {
  return (
    <div className="glass p-12 text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-rose-400" />
      <h3 className="mt-6 text-lg font-semibold">Analyzing your photo…</h3>
      <p className="mt-2 text-sm text-white/60">
        Detecting card → finding nail → calibrating to millimetres
      </p>
    </div>
  );
}
