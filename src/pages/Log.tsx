import React, { useState } from 'react';
import { useSnow } from '../context/SnowContext';
import { formatPeriod, formatNumber, safeSum } from '../utils/formatters';
import { Trash2, Download, Search } from 'lucide-react';
import { SnowRecord } from '../types';

const Log: React.FC = () => {
  const { records, deleteRecord } = useSnow();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(record => 
    record.comment.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.periodFrom.includes(searchTerm)
  );

  const exportCSV = () => {
    // Basic CSV construction to avoid heavy libraries
    const headers = [
      'ID', 'Период', 'Тип', 'Всего Рейсов', 'Всего м3',
      'Сабитов Рейс', 'Сабитов м3',
      'Якорь Рейс', 'Якорь м3',
      'Шаховское Рейс', 'Шаховское м3',
      'Комментарий'
    ];

    const rows = records.map(r => {
        const totalTrips = safeSum(r.sabytov_trips, r.yakor_trips, r.shakh_trips);
        const totalM3 = safeSum(r.sabytov_m3, r.yakor_m3, r.shakh_m3);
        
        return [
          r.id,
          formatPeriod(r),
          r.shiftType === 'day' ? 'День' : 'Ночь',
          totalTrips,
          totalM3,
          r.sabytov_trips || '', r.sabytov_m3 || '',
          r.yakor_trips || '', r.yakor_m3 || '',
          r.shakh_trips || '', r.shakh_m3 || '',
          `"${r.comment.replace(/"/g, '""')}"` // Escape quotes for CSV
        ].join(',');
    });

    const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\n'); // Add BOM for Excel utf-8
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `snow_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Журнал периодов</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Поиск..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button 
            onClick={() => window.print()}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            title="Print"
          >
             🖨️
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left print-table">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-4 py-3 sticky left-0 bg-slate-50 z-10 w-48">Период</th>
                <th scope="col" className="px-2 py-3 text-center bg-slate-100 text-slate-900 font-bold border-r border-slate-200">Общ. Рейс</th>
                <th scope="col" className="px-2 py-3 text-center bg-slate-100 text-slate-900 font-bold border-r border-slate-200">Общ. М³</th>
                <th scope="col" className="px-2 py-3 text-center text-blue-700 border-l border-slate-200">Сабитов<br/><span className="text-[10px] text-slate-400">Рейс / М³</span></th>
                <th scope="col" className="px-2 py-3 text-center text-emerald-700 border-l border-slate-200">Якорь<br/><span className="text-[10px] text-slate-400">Рейс / М³</span></th>
                <th scope="col" className="px-2 py-3 text-center text-amber-700 border-l border-slate-200">Шаховское<br/><span className="text-[10px] text-slate-400">Рейс / М³</span></th>
                <th scope="col" className="px-4 py-3 w-64">Комментарий</th>
                <th scope="col" className="px-4 py-3 text-right no-print">Действ.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Нет записей за выбранный период
                  </td>
                </tr>
              ) : filteredRecords.map((record) => {
                const totalTrips = safeSum(record.sabytov_trips, record.yakor_trips, record.shakh_trips);
                const totalM3 = safeSum(record.sabytov_m3, record.yakor_m3, record.shakh_m3);
                
                return (
                  <tr key={record.id} className="hover:bg-slate-50 group transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 border-r md:border-none border-slate-100">
                      {formatPeriod(record)}
                    </td>
                    <td className="px-2 py-3 text-center font-bold bg-slate-50 border-r border-slate-200 text-slate-800">
                      {formatNumber(totalTrips)}
                    </td>
                    <td className="px-2 py-3 text-center font-bold bg-slate-50 border-r border-slate-200 text-slate-800">
                      {formatNumber(totalM3)}
                    </td>
                    
                    {/* Sabytov */}
                    <td className="px-2 py-3 text-center border-l border-slate-100">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-blue-600">{formatNumber(record.sabytov_trips)}</span>
                        <span className="text-xs text-slate-400">{formatNumber(record.sabytov_m3)}</span>
                      </div>
                    </td>

                    {/* Yakor */}
                    <td className="px-2 py-3 text-center border-l border-slate-100">
                       <div className="flex flex-col items-center">
                        <span className="font-semibold text-emerald-600">{formatNumber(record.yakor_trips)}</span>
                        <span className="text-xs text-slate-400">{formatNumber(record.yakor_m3)}</span>
                      </div>
                    </td>

                    {/* Shakh */}
                    <td className="px-2 py-3 text-center border-l border-slate-100">
                       <div className="flex flex-col items-center">
                        <span className="font-semibold text-amber-600">{formatNumber(record.shakh_trips)}</span>
                        <span className="text-xs text-slate-400">{formatNumber(record.shakh_m3)}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-500 text-xs italic break-words max-w-xs">
                      {record.comment || '-'}
                    </td>
                    <td className="px-4 py-3 text-right no-print">
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Log;
