import { Link } from 'react-router-dom';
import type { Ticket } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
}

const priorityConfig = {
  low: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500', label: 'Низкий' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500', label: 'Средний' },
  high: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', label: 'Высокий' },
};

const statusConfig = {
  open: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Открыта' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'В работе' },
  closed: { bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Закрыта' },
};

export function TicketCard({ ticket }: TicketCardProps) {
  const priority = priorityConfig[ticket.priority];
  const status = statusConfig[ticket.status];
  const date = new Date(ticket.created_at);
  const timeAgo = getTimeAgo(date);

  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block bg-white rounded-2xl p-5 border border-slate-100 card-hover hover:border-indigo-200"
    >
      <div className="flex items-start gap-4">
        {/* Priority dot */}
        <div className={`w-2 h-2 rounded-full ${priority.dot} mt-2 shrink-0`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-slate-900 truncate">{ticket.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500 line-clamp-2">{ticket.description}</p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${priority.bg} ${priority.text}`}>
                {priority.label}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>#{ticket.id}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}