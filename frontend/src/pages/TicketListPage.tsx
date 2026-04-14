import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TicketList } from '../components/TicketList';
import { ticketApi } from '../api/tickets';
import type { Ticket } from '../types/ticket';

type FilterStatus = 'all' | 'open' | 'in_progress' | 'closed';
type FilterPriority = 'all' | 'low' | 'medium' | 'high';

const statusLabels = {
  all: 'Все',
  open: 'Открытые',
  in_progress: 'В работе',
  closed: 'Закрытые',
};

const priorityLabels = {
  all: 'Все приоритеты',
  high: '🔴 Высокий',
  medium: '🟡 Средний',
  low: '🔵 Низкий',
};

export function TicketListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await ticketApi.getAll();
      setTickets(data);
    } catch {
      setError('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      closed: tickets.filter(t => t.status === 'closed').length,
      high: tickets.filter(t => t.priority === 'high').length,
      medium: tickets.filter(t => t.priority === 'medium').length,
      low: tickets.filter(t => t.priority === 'low').length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchSearch = search === '' || 
        ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Всего" value={stats.total} color="indigo" />
        <StatCard label="Открытых" value={stats.open} color="amber" />
        <StatCard label="В работе" value={stats.inProgress} color="blue" />
        <StatCard label="Закрытых" value={stats.closed} color="green" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="🔍 Поиск по заявкам..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as FilterStatus)}
            className="px-4 py-2.5 bg-slate-50 border-0 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as FilterPriority)}
            className="px-4 py-2.5 bg-slate-50 border-0 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Найдено: <span className="font-semibold text-slate-700">{filteredTickets.length}</span> заявок
        </p>
      </div>

      {/* Ticket List */}
      <TicketList tickets={filteredTickets} loading={loading} error={error} onRefresh={loadTickets} />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'from-indigo-500 to-indigo-600',
    amber: 'from-amber-400 to-amber-500', 
    blue: 'from-blue-400 to-blue-500',
    green: 'from-emerald-400 to-emerald-500',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} p-4 rounded-2xl text-white shadow-lg`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}