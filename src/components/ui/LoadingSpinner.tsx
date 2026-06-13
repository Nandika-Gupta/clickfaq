import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  label?: string;
}

export function LoadingSpinner({ size = 20, label }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-white/60">
      <Loader2 size={size} className="animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
