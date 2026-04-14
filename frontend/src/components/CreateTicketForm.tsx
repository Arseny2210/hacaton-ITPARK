import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/tickets';

interface CreateTicketFormProps {
  onSuccess?: () => void;
}

export function CreateTicketForm({ onSuccess }: CreateTicketFormProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      await ticketApi.create({ title, description });
      setTitle('');
      setDescription('');
      onSuccess?.();
      navigate('/tickets');
    } catch (err) {
      setError('Не удалось создать заявку. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { title: 'Не работает интернет', desc: 'Пропал интернет, не могу подключиться к сети' },
    { title: 'Забыл пароль', desc: 'Забыл пароль от рабочей почты, прошу сбросить' },
    { title: 'Нужен новый ПК', desc: 'Хочу заказать новый компьютер для работы' },
  ];

  const useTemplate = (template: typeof templates[0]) => {
    setTitle(template.title);
    setDescription(template.desc);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Templates */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-3">Быстрые шаблоны:</p>
        <div className="flex flex-wrap gap-2">
          {templates.map((t, i) => (
            <button
              key={i}
              onClick={() => useTemplate(t)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-600 transition-colors"
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Заголовок</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base"
            placeholder="Кратко опишите проблему"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none text-base"
            placeholder="Подробно опишите что случилось"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || !description.trim()}
          className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Создаём заявку...
            </span>
          ) : (
            '🚀 Создать заявку'
          )}
        </button>
      </form>
    </div>
  );
}