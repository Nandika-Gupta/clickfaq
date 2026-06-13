import type { UnansweredQuestion } from '../types';
import { getItem, setItem } from './storage';

const KEY = 'unanswered_questions';

export function getUnansweredQuestions(): UnansweredQuestion[] {
  return getItem<UnansweredQuestion[]>(KEY, []);
}

export function submitUnansweredQuestion(
  question: string,
  email?: string,
  searchQuery?: string
): UnansweredQuestion {
  const entry: UnansweredQuestion = {
    id: `uq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    question: question.trim(),
    email: email?.trim(),
    submittedAt: new Date().toISOString(),
    status: 'pending',
    searchQuery,
  };

  const existing = getUnansweredQuestions();
  setItem(KEY, [entry, ...existing]);
  return entry;
}
