import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  Send,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { StarRating } from '../components/ui/StarRating';
import { submitTicket, submitFeedback } from '../services/tickets';

const TICKET_CATEGORIES = [
  'General Inquiry',
  'Technical Issue',
  'Account & Access',
  'Internship Process',
  'ViBe Platform',
  'NOC & Documentation',
  'Other',
];

const PRIORITIES = [
  { value: 'low' as const, label: 'Low' },
  { value: 'medium' as const, label: 'Medium' },
  { value: 'high' as const, label: 'High' },
  { value: 'urgent' as const, label: 'Urgent' },
];

export default function TicketPage() {
  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    category: TICKET_CATEGORIES[0],
    priority: 'medium' as const,
    description: '',
  });
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketLoading(true);
    const ticket = submitTicket(ticketForm);
    setTicketId(ticket.id);
    setTicketLoading(false);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      rating,
      text: feedbackText,
      wasHelpful,
    });
    setFeedbackSubmitted(true);
  };

  const copyTicketId = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-medium tracking-tight">Raise a Ticket</h1>
          <p className="mt-2 text-sm text-white/40">
            Submit a support ticket or share your feedback about the FAQ experience.
          </p>
        </motion.div>

        {/* Ticket Form */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong mb-8 rounded-2xl p-6 sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Ticket size={20} />
            </div>
            <div>
              <h2 className="text-lg font-medium">Support Ticket</h2>
              <p className="text-sm text-white/40">
                Describe your issue and we'll get back to you.
              </p>
            </div>
          </div>

          {ticketId ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <CheckCircle2 size={48} className="mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-medium">Ticket Created Successfully</h3>
              <p className="mt-2 text-sm text-white/50">
                Save your ticket ID for future reference.
              </p>
              <div className="mt-4 inline-flex items-center gap-3 rounded-xl bg-brand-gray px-6 py-3">
                <span className="font-mono text-lg font-semibold">{ticketId}</span>
                <button
                  onClick={copyTicketId}
                  className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <button
                onClick={() => {
                  setTicketId(null);
                  setTicketForm({
                    name: '',
                    email: '',
                    category: TICKET_CATEGORIES[0],
                    priority: 'medium',
                    description: '',
                  });
                }}
                className="mt-6 text-sm text-white/40 underline hover:text-white"
              >
                Submit another ticket
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Name" required>
                  <input
                    type="text"
                    required
                    value={ticketForm.name}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, name: e.target.value })
                    }
                    placeholder="Your full name"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Email" required>
                  <input
                    type="email"
                    required
                    value={ticketForm.email}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, email: e.target.value })
                    }
                    placeholder="you@example.com"
                    className="form-input"
                  />
                </FormField>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Category" required>
                  <select
                    value={ticketForm.category}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, category: e.target.value })
                    }
                    className="form-input"
                  >
                    {TICKET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Priority" required>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) =>
                      setTicketForm({
                        ...ticketForm,
                        priority: e.target.value as typeof ticketForm.priority,
                      })
                    }
                    className="form-input"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Description" required>
                <textarea
                  required
                  rows={5}
                  value={ticketForm.description}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, description: e.target.value })
                  }
                  placeholder="Describe your issue in detail…"
                  className="form-input resize-none"
                />
              </FormField>

              <button
                type="submit"
                disabled={ticketLoading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50"
              >
                <Send size={18} />
                {ticketLoading ? 'Submitting…' : 'Submit Ticket'}
              </button>
            </form>
          )}
        </motion.section>

        {/* Feedback Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-6 sm:p-8"
        >
          <h2 className="mb-1 text-lg font-medium">Feedback</h2>
          <p className="mb-6 text-sm text-white/40">
            Help us improve the FAQ experience.
          </p>

          {feedbackSubmitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <CheckCircle2 size={40} className="mx-auto mb-3 text-green-400" />
              <p className="text-white/60">Thank you for your feedback!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-white">
                  Overall Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-white">
                  Was this FAQ helpful?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setWasHelpful(true)}
                    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors ${
                      wasHelpful === true
                        ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30'
                        : 'bg-brand-gray text-white/50 hover:bg-white/5'
                    }`}
                  >
                    <ThumbsUp size={16} /> Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setWasHelpful(false)}
                    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors ${
                      wasHelpful === false
                        ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
                        : 'bg-brand-gray text-white/50 hover:bg-white/5'
                    }`}
                  >
                    <ThumbsDown size={16} /> No
                  </button>
                </div>
              </div>

              <FormField label="Additional Feedback">
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what we can improve…"
                  className="form-input resize-none"
                />
              </FormField>

              <button
                type="submit"
                className="h-12 w-full rounded-xl border border-white/10 bg-brand-gray font-medium text-white transition-all hover:bg-white/5 active:scale-[0.98]"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </motion.section>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      {children}
    </div>
  );
}
