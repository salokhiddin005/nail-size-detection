export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  valid: boolean;
  issues: string[];
};

export function evaluatePassword(password: string): PasswordStrength {
  const issues: string[] = [];

  if (password.length < 8) issues.push("at least 8 characters");
  if (!/[a-zA-Z]/.test(password)) issues.push("a letter");
  if (!/[0-9]/.test(password)) issues.push("a number");

  const valid = issues.length === 0;

  let score: PasswordStrength["score"] = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length >= 14) score = Math.min(4, score + 1) as PasswordStrength["score"];

  const labels = ["Too weak", "Weak", "Okay", "Strong", "Very strong"];
  const colors = [
    "bg-red-500",
    "bg-red-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-emerald-500",
  ];

  return {
    score,
    label: labels[score],
    color: colors[score],
    valid,
    issues,
  };
}

export default function PasswordStrengthMeter({
  password,
}: {
  password: string;
}) {
  if (!password) return null;

  const { score, label, color, issues } = evaluatePassword(password);
  const segments = 4;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition ${
              i < score ? color : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/60">{label}</span>
        {issues.length > 0 ? (
          <span className="text-white/40">Missing: {issues.join(", ")}</span>
        ) : (
          <span className="text-emerald-300/80">Looks good</span>
        )}
      </div>
    </div>
  );
}
