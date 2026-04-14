import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/tickets';
import type { Ticket } from '../types/ticket';

const priorityConfig = {
  low: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: 'Низкий приоритет' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'Средний приоритет' },
  high: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Высокий приоритет' },
};

const statusConfig = {
  open: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Открыта' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'В работе' },
  closed: { bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Закрыта' },
};

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    if (!id) return;
    try {
      const data = await ticketApi.getById(Number(id));
      setTicket(data);
    } catch {
      setError('Заявка не найдена');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: Ticket['status']) => {
    if (!ticket) return;
    setUpdating(true);
    try {
      const updated = await ticketApi.updateStatus(ticket.id, { status });
      setTicket(updated);
    } catch {
      setError('Не удалось обновить статус');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!ticket || !window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;
    setUpdating(true);
    try {
      await ticketApi.delete(ticket.id);
      navigate('/tickets');
    } catch {
      setError('Не удалось удалить заявку');
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-red-200">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-slate-600 text-lg">{error || 'Заявка не найдена'}</p>
        <button 
          onClick={() => navigate('/tickets')} 
          className="mt-4 btn-secondary"
        >
          ← К списку заявок
        </button>
      </div>
    );
  }

  const priority = priorityConfig[ticket.priority];
  const status = statusConfig[ticket.status];
  const date = new Date(ticket.created_at);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <span>←</span>
        <span>К списку заявок</span>
      </button>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-mono text-slate-400">#{ticket.id}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority.bg} ${priority.text}`}>
                  {priority.label}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
              <p className="text-sm text-slate-400 mt-2">
                Создано {date.toLocaleString('ru-RU')}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Описание</h2>
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
        </div>

        {/* AI Response */}
        {ticket.ai_response && (
          <div className={`p-6 ${priority.bg} border-b ${priority.border}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🤖</span>
              <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                AI Анализ
              </h2>
              <span className="ml-auto text-xs px-2 py-1 bg-white rounded-lg text-slate-500">
                {ticket.ai_method === 'keyword' ? '📝 Ключевые слова' : '🦙 AI'}
              </span>
            </div>
            <p className="text-slate-700">{ticket.ai_response}</p>
          </div>
        )}

        {/* Status actions */}
        <div className="p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Изменить статус
          </h2>
          <div className="flex flex-wrap gap-3">
            {(['open', 'in_progress', 'closed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={updating || ticket.status === s}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  ticket.status === s
                    ? statusConfig[s].bg + ' ' + statusConfig[s].text
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {statusConfig[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleDelete}
          disabled={updating}
          className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium transition-colors disabled:opacity-50"
        >
          🗑️ Удалить заявку
        </button>
      </div>
    </div>
  );
}