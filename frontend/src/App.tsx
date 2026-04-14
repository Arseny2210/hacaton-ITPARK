import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { TicketListPage } from './pages/TicketListPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { TicketDetailPage } from './pages/TicketDetailPage';

const navItems = [
  { path: '/tickets', label: 'Заявки', icon: '📋' },
  { path: '/tickets/new', label: 'Новая', icon: '➕' },
];

function NavItem({ path, label, icon }: { path: string; label: string; icon: string }) {
  const location = useLocation();
  const isActive = location.pathname === path || (path === '/tickets' && location.pathname === '/');
  
  return (
    <Link
      to={path}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
        isActive 
          ? 'bg-indigo-50 text-indigo-600' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="sticky top-0 z-50 glass border-b border-slate-200/50">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/tickets" className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🎫</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">HelpDesk</h1>
                  <p className="text-xs text-slate-500 -mt-0.5">Система заявок</p>
                </div>
              </Link>
              
              <nav className="flex items-center gap-2">
                {navItems.map(item => (
                  <NavItem key={item.path} {...item} />
                ))}
              </nav>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/tickets" replace />} />
            <Route path="/tickets" element={<TicketListPage />} />
            <Route path="/tickets/new" element={<CreateTicketPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}