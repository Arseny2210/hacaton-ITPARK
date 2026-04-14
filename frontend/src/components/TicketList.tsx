import { TicketCard } from './TicketCard';
import type { Ticket } from '../types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export function TicketList({ tickets, loading, error, onRefresh }: TicketListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500">Загрузка заявок...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-red-600 font-medium">{error}</p>
            {onRefresh && (
              <button 
                onClick={onRefresh}
                className="text-red-500 text-sm underline mt-1"
              >
                Попробовать again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-slate-500 text-lg">Заявок не найдено</p>
        <p className="text-slate-400 text-sm mt-1">Создайте новую заявку</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket, index) => (
        <div 
          key={ticket.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <TicketCard ticket={ticket} />
        </div>
      ))}
    </div>
  );
}