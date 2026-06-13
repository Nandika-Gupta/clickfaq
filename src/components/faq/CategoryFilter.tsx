import { motion } from 'framer-motion';
import type { FAQCategory } from '../../types';

interface CategoryFilterProps {
  categories: FAQCategory[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect(null)}
        className={`rounded-xl px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${
          selected === null
            ? 'bg-white text-black'
            : 'bg-brand-gray text-white/60 hover:bg-white/10 hover:text-white'
        }`}
      >
        All ({categories.reduce((sum, c) => sum + c.questions.length, 0)})
      </motion.button>
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(cat.id)}
          className={`rounded-xl px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${
            selected === cat.id
              ? 'bg-white text-black'
              : 'bg-brand-gray text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          {cat.name} ({cat.questions.length})
        </motion.button>
      ))}
    </div>
  );
}
