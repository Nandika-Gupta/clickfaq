import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircleQuestion, Send, CheckCircle2 } from 'lucide-react';
import { submitUnansweredQuestion } from '../../services/unanswered';

interface UnansweredSectionProps {
  searchQuery: string;
}

export function UnansweredSection({ searchQuery }: UnansweredSectionProps) {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    submitUnansweredQuestion(question, email || undefined, searchQuery || undefined);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-8 text-center"
      >
        <CheckCircle2 size={40} className="mx-auto mb-4 text-green-400" />
        <h3 className="text-lg font-medium">Question Submitted</h3>
        <p className="mt-2 text-sm text-white/50">
          Our team will review your question and may add it to the FAQ.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setQuestion('');
            setEmail('');
          }}
          className="mt-4 text-sm text-white/40 underline hover:text-white"
        >
          Submit another question
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <MessageCircleQuestion size={20} />
        </div>
        <div>
          <h3 className="text-lg font-medium">Still Need Help?</h3>
          <p className="text-sm text-white/40">
            Couldn't find your answer? Submit your question directly to our team.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">
            Your Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Describe what you're looking for…"
            rows={3}
            required
            className="w-full resize-none rounded-xl border-none bg-brand-gray px-4 py-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50"
        >
          <Send size={18} />
          Submit Question
        </button>
      </form>
    </motion.div>
  );
}
