import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SnowProvider } from './context/SnowContext';
import EntryForm from './pages/EntryForm';
import Log from './pages/Log';
import Dashboard from './pages/Dashboard';
import { PenTool, Table, BarChart3, Snowflake } from 'lucide-react';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <div className={`${isActive ? 'bg-primary/10' : ''} p-1.5 rounded-xl transition-colors`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
};

const HeaderLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
    >
      {label}
    </Link>
  )
}

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Bar (Desktop) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-primary p-1.5 rounded-lg">
                <Snowflake className="text-white w-5 h-5" />
             </div>
             <h1 className="text-lg font-bold text-slate-900 tracking-tight">SnowLog Pro</h1>
          </div>
          
          <nav className="hidden md:flex gap-2">
            <HeaderLink to="/" label="Ввод данных" />
            <HeaderLink to="/log" label="Журнал" />
            <HeaderLink to="/dashboard" label="Сводка" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <Routes>
          <Route path="/" element={<EntryForm />} />
          <Route path="/log" element={<Log />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-between px-2 z-50 pb-safe no-print">
        <NavLink to="/" icon={<PenTool className="w-5 h-5" />} label="Ввод" />
        <NavLink to="/log" icon={<Table className="w-5 h-5" />} label="Журнал" />
        <NavLink to="/dashboard" icon={<BarChart3 className="w-5 h-5" />} label="Сводка" />
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SnowProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </SnowProvider>
  );
};

export default App;
