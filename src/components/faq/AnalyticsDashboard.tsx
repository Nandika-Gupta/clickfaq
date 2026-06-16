import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, MousePointer, Expand, BarChart3, TrendingUp, Award } from 'lucide-react';
import type { FAQ } from '../../types';
import {
  getAllEngagement,
  getEngagementScore,
  computeHeatmapLevels,
  HEATMAP_COLORS,
} from '../../services/engagement';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  faqs: FAQ[];
  categories: { id: string; name: string }[];
}

export function AnalyticsDashboard({
  isOpen,
  onClose,
  faqs,
  categories,
}: AnalyticsDashboardProps) {
  if (!isOpen) return null;

  const engagementStore = getAllEngagement();
  const heatmapLevels = computeHeatmapLevels(faqs.map((f) => f.id));

  let greenCount = 0;
  let yellowCount = 0;
  let orangeCount = 0;
  let redCount = 0;
  let totalViews = 0;
  let totalClicks = 0;
  let totalExpansions = 0;

  faqs.forEach((faq) => {
    const level = heatmapLevels[faq.id] ?? 'green';
    if (level === 'green') greenCount++;
    else if (level === 'yellow') yellowCount++;
    else if (level === 'orange') orangeCount++;
    else if (level === 'red') redCount++;

    const eng = engagementStore[faq.id] ?? { views: 0, clicks: 0, expansions: 0 };
    totalViews += eng.views;
    totalClicks += eng.clicks;
    totalExpansions += eng.expansions;
  });

  const totalFaqsCount = faqs.length || 1;

  // Top 5 FAQs
  const sortedFaqs = [...faqs]
    .map((faq) => {
      const eng = engagementStore[faq.id] ?? { views: 0, clicks: 0, expansions: 0 };
      const score = getEngagementScore(eng);
      return { faq, eng, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Category stats
  const categoryStats = categories
    .map((cat) => {
      let catViews = 0;
      let catScore = 0;
      const catFaqs = faqs.filter((f) => f.categoryId === cat.id);
      catFaqs.forEach((faq) => {
        const eng = engagementStore[faq.id] ?? { views: 0, clicks: 0, expansions: 0 };
        catViews += eng.views;
        catScore += getEngagementScore(eng);
      });
      return {
        id: cat.id,
        name: cat.name,
        views: catViews,
        score: catScore,
        count: catFaqs.length,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="glass-strong relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 shadow-2xl border border-white/10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Close analytics"
          >
            <X size={18} />
          </button>

          {/* Title */}
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="text-white" size={24} />
            <h2 className="text-xl font-semibold tracking-tight text-white">
              FAQ Engagement Analytics
            </h2>
          </div>

          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass rounded-2xl p-4 text-center">
                <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Eye size={16} />
                </div>
                <div className="text-lg font-bold text-white">{totalViews}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">Views</div>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400">
                  <MousePointer size={16} />
                </div>
                <div className="text-lg font-bold text-white">{totalClicks}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">Clicks</div>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Expand size={16} />
                </div>
                <div className="text-lg font-bold text-white">{totalExpansions}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">Expands</div>
              </div>
            </div>

            {/* Heatmap Levels Distribution */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <TrendingUp size={14} /> Heatmap Distribution
              </h3>
              <div className="flex h-3 overflow-hidden rounded-full bg-white/5">
                <div
                  style={{ width: `${(greenCount / totalFaqsCount) * 100}%` }}
                  className="bg-green-500 transition-all"
                  title={`Green (Low engagement): ${greenCount}`}
                />
                <div
                  style={{ width: `${(yellowCount / totalFaqsCount) * 100}%` }}
                  className="bg-yellow-500 transition-all"
                  title={`Yellow (Mild engagement): ${yellowCount}`}
                />
                <div
                  style={{ width: `${(orangeCount / totalFaqsCount) * 100}%` }}
                  className="bg-orange-500 transition-all"
                  title={`Orange (High engagement): ${orangeCount}`}
                />
                <div
                  style={{ width: `${(redCount / totalFaqsCount) * 100}%` }}
                  className="bg-red-500 transition-all"
                  title={`Red (Intense engagement): ${redCount}`}
                />
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1" />
                  <span className="text-white/60">Green</span>
                  <div className="font-semibold text-white mt-0.5">{greenCount}</div>
                </div>
                <div>
                  <span className="inline-block h-2 w-2 rounded-full bg-yellow-500 mr-1" />
                  <span className="text-white/60">Yellow</span>
                  <div className="font-semibold text-white mt-0.5">{yellowCount}</div>
                </div>
                <div>
                  <span className="inline-block h-2 w-2 rounded-full bg-orange-500 mr-1" />
                  <span className="text-white/60">Orange</span>
                  <div className="font-semibold text-white mt-0.5">{orangeCount}</div>
                </div>
                <div>
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1" />
                  <span className="text-white/60">Red</span>
                  <div className="font-semibold text-white mt-0.5">{redCount}</div>
                </div>
              </div>
            </div>

            {/* Top FAQs list */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <Award size={14} /> Top Performing FAQs
              </h3>
              <div className="space-y-2.5">
                {sortedFaqs.every((f) => f.score === 0) ? (
                  <p className="text-center py-4 text-xs text-white/30">
                    No engagement tracked yet. Interact with FAQs to see them here.
                  </p>
                ) : (
                  sortedFaqs.map(({ faq, eng, score }, i) => (
                    <div
                      key={faq.id}
                      className="flex items-center justify-between gap-4 border-b border-white/5 pb-2 last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/40 flex items-center gap-1">
                          <span>#{i + 1}</span>
                          <span className="font-mono">{faq.number}</span>
                          <span className="text-[10px] rounded px-1 py-0.2" style={{ backgroundColor: `${HEATMAP_COLORS[heatmapLevels[faq.id] ?? 'green']}20`, color: HEATMAP_COLORS[heatmapLevels[faq.id] ?? 'green'] }}>
                            Score: {score}
                          </span>
                        </p>
                        <p className="text-xs text-white/80 truncate mt-0.5">
                          {faq.question}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 shrink-0">
                        <span className="flex items-center gap-0.5"><Eye size={10} /> {eng.views}</span>
                        <span className="flex items-center gap-0.5"><MousePointer size={10} /> {eng.clicks}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Category leaderboard */}
            <div className="glass rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Category Leaderboard
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categoryStats.map((cat, idx) => (
                  <div key={cat.id} className="rounded-xl bg-white/[0.02] border border-white/5 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white/30 uppercase">#{idx + 1}</span>
                      <span className="text-[10px] text-white/50">{cat.count} FAQs</span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{cat.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-white/40 pt-1">
                      <span>{cat.views} views</span>
                      <span className="font-medium text-white/60">Score: {cat.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
