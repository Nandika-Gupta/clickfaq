import type { Feedback, Ticket } from '../types';
import { getItem, setItem } from './storage';

const TICKETS_KEY = 'tickets';
const FEEDBACK_KEY = 'feedback';

function generateTicketId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `TKT-${num}`;
}

export function getTickets(): Ticket[] {
  return getItem<Ticket[]>(TICKETS_KEY, []);
}

export function submitTicket(
  data: Omit<Ticket, 'id' | 'createdAt' | 'status'>
): Ticket {
  const ticket: Ticket = {
    ...data,
    id: generateTicketId(),
    createdAt: new Date().toISOString(),
    status: 'open',
  };
  const existing = getTickets();
  setItem(TICKETS_KEY, [ticket, ...existing]);
  return ticket;
}

export function getFeedback(): Feedback[] {
  return getItem<Feedback[]>(FEEDBACK_KEY, []);
}

export function updateTicketStatus(
  ticketId: string,
  status: 'open' | 'in-progress' | 'resolved'
): Ticket | null {
  const tickets = getTickets();
  const index = tickets.findIndex((t) => t.id === ticketId);
  if (index > -1) {
    tickets[index].status = status;
    setItem(TICKETS_KEY, tickets);
    return tickets[index];
  }
  return null;
}

export function submitFeedback(
  data: Omit<Feedback, 'id' | 'createdAt'>
): Feedback {
  const entry: Feedback = {
    ...data,
    id: `fb-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const existing = getFeedback();
  setItem(FEEDBACK_KEY, [entry, ...existing]);
  return entry;
}
