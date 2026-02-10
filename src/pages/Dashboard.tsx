import { supabase } from "../utils/supabase";
import React, { useState, useMemo } from 'react';
import { useSnow } from '../context/SnowContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { formatNumber } from '../utils/formatters';
import { Filter } from 'lucide-react';

const Dashboard: React.FC = () => {
  const handleLogout = async () => {
 await supabase.auth.signOut();
window.location.href = "/login";
};
const { records, getStats } = useSnow();
  
  // Default to current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endOfDay = now.toISOString().split('T')[0];

  const [dateFrom, setDateFrom] = useState(startOfMonth);
  const [dateTo, setDateTo] = useState(endOfDay);

  const filteredRecords = useMemo(() => {
    return records.filter(r => r.periodFrom >= dateFrom && r.periodFrom <= dateTo);
  }, [records, dateFrom, dateTo]);

  const stats = useMemo(() => getStats(filteredRecords), [filteredRecords, getStats]);
  const allTimeStats = useMemo(() => getStats(records), [records, getStats]);

  const chartData = [
    { name: 'Сабитов', trips: stats.sabytov.trips, m3: stats.sabytov.m3, color: '#3b82f6' },
    { name: 'Якорь', trips: stats.yakor.trips, m3: stats.yakor.m3, color: '#10b981' },
    { name: 'Шаховское', trips: stats.shakh.trips, m3: stats.shakh.m3, color: '#f59e0b' },
  ];

  return (
      <div className="max-w-6xl mx-auto pb-24 space-y-6">
  <div className="flex justify-end mb-4">
  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Выйти
  </button>
</div>  
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-slate-700">Фильтр периода</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">С даты</label>
            <input 
              type="date" 
              value={dateFrom} 
              onChange={e => setDateFrom(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase">По дату</label>
            <input 
              type="date" 
              value={dateTo} 
              onChange={e => setDateTo(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Selected Period Stats */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Итоги за выбранный период</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Всего" trips={stats.total.trips} m3={stats.total.m3} isTotal />
          <StatCard title="ИП Сабитов" trips={stats.sabytov.trips} m3={stats.sabytov.m3} color="border-l-blue-500" />
          <StatCard title="Якорь" trips={stats.yakor.trips} m3={stats.yakor.m3} color="border-l-emerald-500" />
          <StatCard title="Шаховское" trips={stats.shakh.trips} m3={stats.shakh.m3} color="border-l-amber-500" />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
        <h3 className="font-bold text-slate-700 mb-4">Сравнение объемов (м³)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`${formatNumber(value)} м³`, 'Объем']}
            />
            <Bar dataKey="m3" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* All Time Stats */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Накопительно (За все время)</h3>
        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-slate-400 text-xs uppercase mb-1">Всего рейсов</p>
                <p className="text-3xl font-bold text-white">{formatNumber(allTimeStats.total.trips)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase mb-1">Всего м³</p>
                <p className="text-3xl font-bold text-sky-400">{formatNumber(allTimeStats.total.m3)}</p>
              </div>
              <div className="col-span-2 flex flex-col justify-center">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-blue-300">Сабитов</span>
                   <span>{formatNumber(allTimeStats.sabytov.m3)}</span>
                 </div>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-emerald-300">Якорь</span>
                   <span>{formatNumber(allTimeStats.yakor.m3)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-amber-300">Шаховское</span>
                   <span>{formatNumber(allTimeStats.shakh.m3)}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; trips: number; m3: number; isTotal?: boolean; color?: string }> = ({ 
  title, trips, m3, isTotal, color 
}) => (
  <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 ${color ? `border-l-4 ${color}` : ''} ${isTotal ? 'bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200' : ''}`}>
    <h4 className="text-slate-500 text-xs uppercase font-bold mb-2">{title}</h4>
    <div className="flex justify-between items-end">
      <div>
        <span className="text-2xl font-bold text-slate-800 block">{formatNumber(trips)}</span>
        <span className="text-xs text-slate-500">рейсов</span>
      </div>
      <div className="text-right">
        <span className={`text-xl font-bold block ${isTotal ? 'text-primary' : 'text-slate-700'}`}>{formatNumber(m3)}</span>
        <span className="text-xs text-slate-500">м³</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
