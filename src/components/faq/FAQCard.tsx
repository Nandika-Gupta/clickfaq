import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Eye, MousePointer, Expand } from 'lucide-react';
import type { FAQ, HeatmapLevel } from '../../types';
import {
  trackView,
  trackClick,
  trackExpansion,
  getEngagement,
  HEATMAP_COLORS,
} from '../../services/engagement';

interface FAQCardProps {
  faq: FAQ;
  question: string;
  answer: string;
  heatmapLevel: HeatmapLevel;
  isExpanded: boolean;
  onToggle: () => void;
}

export function FAQCard({
  faq,
  question,
  answer,
  heatmapLevel,
  isExpanded,
  onToggle,
}: FAQCardProps) {
  const [engagement, setEngagement] = useState(getEngagement(faq.id));

  useEffect(() => {
    setEngagement(trackView(faq.id));
  }, [faq.id]);

  const handleToggle = () => {
    setEngagement(trackClick(faq.id));
    if (!isExpanded) {
      setEngagement(trackExpansion(faq.id));
    }
    onToggle();
  };

  const borderColor = HEATMAP_COLORS[heatmapLevel];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl transition-shadow duration-300"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        boxShadow: `0 0 0 1px ${borderColor}22`,
      }}
    >
      <button
        onClick={handleToggle}
        className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
        aria-expanded={isExpanded}
      >
        <div className="flex-1 space-y-1">
          <span className="text-xs font-medium text-white/30">{faq.number}</span>
          <h3 className="text-sm font-medium leading-relaxed text-white sm:text-base">
            {question}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="mt-1 shrink-0"
        >
          <ChevronDown size={20} className="text-white/40" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-5 pt-3 pb-5">
              <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap text-white/70">
                {answer}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-white/25">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {engagement.views}
                </span>
                <span className="flex items-center gap-1">
                  <MousePointer size={12} /> {engagement.clicks}
                </span>
                <span className="flex items-center gap-1">
                  <Expand size={12} /> {engagement.expansions}
                </span>
                <span
                  className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: borderColor, backgroundColor: `${borderColor}15` }}
                >
                  {heatmapLevel}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
