import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="glass border-rose-500/30 p-8 text-center">
      <AlertTriangle className="mx-auto h-10 w-10 text-rose-400" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/70">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost mt-6">
          Try another photo
        </button>
      )}
    </div>
  );
}
