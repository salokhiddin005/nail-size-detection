export default function AuthBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b0a06] via-[#2a0f08] to-[#0f0604]" />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: 'url("/bg.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      <div className="absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-rose-500/45 blur-[160px] animate-drift-a" />
      <div className="absolute -right-48 -bottom-48 h-[640px] w-[640px] rounded-full bg-amber-500/35 blur-[170px] animate-drift-b" />
      <div className="absolute left-1/4 top-1/3 h-[420px] w-[420px] rounded-full bg-pink-400/25 blur-[130px] animate-drift-c" />
      <div className="absolute right-1/4 top-1/5 h-[340px] w-[340px] rounded-full bg-orange-500/25 blur-[120px] animate-drift-d" />
      <div className="absolute left-2/3 bottom-1/4 h-[300px] w-[300px] rounded-full bg-fuchsia-500/15 blur-[110px] animate-drift-a" />

      <div className="grain absolute inset-0 opacity-[0.08] mix-blend-overlay" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
