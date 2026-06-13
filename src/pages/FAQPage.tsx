import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { FAQCard } from '../components/faq/FAQCard';
import { CategoryFilter } from '../components/faq/CategoryFilter';
import { UnansweredSection } from '../components/faq/UnansweredSection';
import { HeatmapLegend } from '../components/faq/HeatmapLegend';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { useFAQTranslation } from '../hooks/useFAQTranslation';
import { computeHeatmapLevels } from '../services/engagement';
import faqData from '../data/faqs.json';
import type { FAQ, FAQDataset } from '../types';

const data = faqData as FAQDataset;

export default function FAQPage() {
  const { language, setIsTranslating, isTranslating } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const allFaqs = data.faqs as FAQ[];

  const filteredFaqs = useMemo(() => {
    let result = allFaqs;
    if (selectedCategory) {
      result = result.filter((f) => f.categoryId === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.categoryName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allFaqs, selectedCategory, search]);

  const translations = useFAQTranslation(filteredFaqs, language, setIsTranslating);

  const heatmapLevels = useMemo(
    () => computeHeatmapLevels(allFaqs.map((f) => f.id)),
    [allFaqs, expandedIds]
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(filteredFaqs.map((f) => f.id)));
  const collapseAll = () => setExpandedIds(new Set());

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Vicharanashala Internship — {data.totalCount} questions across{' '}
            {data.categories.length} categories
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search
              size={20}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions, answers, or categories…"
              className="glass h-14 w-full rounded-2xl pr-12 pl-12 text-white placeholder:text-white/25 focus:ring-2 focus:ring-white/20 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <CategoryFilter
            categories={data.categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </motion.div>

        {/* Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <HeatmapLegend />
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ChevronDown size={14} /> Expand all
            </button>
            <button
              onClick={collapseAll}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ChevronUp size={14} /> Collapse all
            </button>
          </div>
        </div>

        {/* Translation loading */}
        {isTranslating && (
          <div className="mb-4 flex justify-center">
            <LoadingSpinner label="Translating content…" />
          </div>
        )}

        {/* Results count */}
        <p className="mb-4 text-sm text-white/30">
          Showing {filteredFaqs.length} of {allFaqs.length} questions
          {search && ` for "${search}"`}
        </p>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const translated = translations[faq.id];
            return (
              <FAQCard
                key={faq.id}
                faq={faq}
                question={translated?.question ?? faq.question}
                answer={translated?.answer ?? faq.answer}
                heatmapLevel={heatmapLevels[faq.id] ?? 'green'}
                isExpanded={expandedIds.has(faq.id)}
                onToggle={() => toggleExpand(faq.id)}
              />
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <p className="text-lg text-white/40">No matching FAQs found.</p>
            <p className="mt-2 text-sm text-white/25">
              Try a different search term or browse all categories.
            </p>
          </motion.div>
        )}

        {/* Unanswered Section */}
        <div className="mt-12">
          <UnansweredSection searchQuery={search} />
        </div>
      </div>
    </div>
  );
}
