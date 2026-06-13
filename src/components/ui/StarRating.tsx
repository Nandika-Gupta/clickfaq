import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 transition-transform hover:scale-110 active:scale-95"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            size={28}
            className={
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-white/20'
            }
          />
        </button>
      ))}
    </div>
  );
}
