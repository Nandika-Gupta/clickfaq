import { HEATMAP_COLORS } from '../../services/engagement';
import type { HeatmapLevel } from '../../types';

const LEVELS: { level: HeatmapLevel; label: string }[] = [
  { level: 'green', label: 'Low engagement' },
  { level: 'yellow', label: 'Medium' },
  { level: 'orange', label: 'High' },
  { level: 'red', label: 'Most viewed' },
];

export function HeatmapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
      <span className="font-medium text-white/60">Engagement Heatmap:</span>
      {LEVELS.map(({ level, label }) => (
        <span key={level} className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: HEATMAP_COLORS[level] }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}
