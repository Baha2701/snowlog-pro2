import React, { useState, useEffect } from 'react';
import { useSnow } from '../context/SnowContext';
import { InputGroup } from '../components/InputGroup';
import { ShiftType } from '../types';
import { Save, Calculator, Calendar } from 'lucide-react';

const EntryForm: React.FC = () => {
  const { addRecord } = useSnow();
  const [isSaved, setIsSaved] = useState(false);

  // Period State
  const [periodFrom, setPeriodFrom] = useState(new Date().toISOString().split('T')[0]);
  const [periodTo, setPeriodTo] = useState(new Date().toISOString().split('T')[0]);
  const [shiftType, setShiftType] = useState<ShiftType>('night');
  
  // Data State
  const [sabytovTrips, setSabytovTrips] = useState<number | ''>('');
  const [sabytovM3, setSabytovM3] = useState<number | ''>('');
  
  const [yakorTrips, setYakorTrips] = useState<number | ''>('');
  const [yakorM3, setYakorM3] = useState<number | ''>('');
  
  const [shakhTrips, setShakhTrips] = useState<number | ''>('');
  const [shakhM3, setShakhM3] = useState<number | ''>('');
  
  const [comment, setComment] = useState('');

  // Auto-update periodTo when periodFrom changes or shift changes
  useEffect(() => {
    if (shiftType === 'night') {
      const fromDate = new Date(periodFrom);
      const nextDay = new Date(fromDate);
      nextDay.setDate(fromDate.getDate() + 1);
      setPeriodTo(nextDay.toISOString().split('T')[0]);
    } else {
      setPeriodTo(periodFrom);
    }
  }, [periodFrom, shiftType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addRecord({
      periodFrom,
      periodTo,
      shiftType,
      sabytov_trips: sabytovTrips === '' ? null : sabytovTrips,
      sabytov_m3: sabytovM3 === '' ? null : sabytovM3,
      yakor_trips: yakorTrips === '' ? null : yakorTrips,
      yakor_m3: yakorM3 === '' ? null : yakorM3,
      shakh_trips: shakhTrips === '' ? null : shakhTrips,
      shakh_m3: shakhM3 === '' ? null : shakhM3,
      comment,
    });

    // Reset fields
    setSabytovTrips('');
    setSabytovM3('');
    setYakorTrips('');
    setYakorM3('');
    setShakhTrips('');
    setShakhM3('');
    setComment('');
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Real-time calculations for the footer summary
  const currentTotalTrips = (Number(sabytovTrips) || 0) + (Number(yakorTrips) || 0) + (Number(shakhTrips) || 0);
  const currentTotalM3 = (Number(sabytovM3) || 0) + (Number(yakorM3) || 0) + (Number(shakhM3) || 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Новая запись
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Смена</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setShiftType('night')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${shiftType === 'night' ? 'bg-indigo-900 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
              >
                🌙 Ночь
              </button>
              <button
                type="button"
                onClick={() => setShiftType('day')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${shiftType === 'day' ? 'bg-orange-400 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
              >
                ☀️ День
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Начало</label>
              <input
                type="date"
                required
                value={periodFrom}
                onChange={(e) => setPeriodFrom(e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Конец</label>
              <input
                type="date"
                required
                value={periodTo}
                onChange={(e) => setPeriodTo(e.target.value)}
                className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup
          label="ИП САБИТОВ"
          subLabel="Полигон СОЛНЕЧНЫЙ"
          colorClass="border-l-4 border-l-blue-500"
          trips={sabytovTrips}
          m3={sabytovM3}
          onTripsChange={setSabytovTrips}
          onM3Change={setSabytovM3}
        />

        <InputGroup
          label="Якорь"
          subLabel="ТОО «Genco Enterpises»"
          colorClass="border-l-4 border-l-emerald-500"
          trips={yakorTrips}
          m3={yakorM3}
          onTripsChange={setYakorTrips}
          onM3Change={setYakorM3}
        />

        <InputGroup
          label="Шаховское"
          subLabel="ТОО «КызылжарТазалык»"
          colorClass="border-l-4 border-l-amber-500"
          trips={shakhTrips}
          m3={shakhM3}
          onTripsChange={setShakhTrips}
          onM3Change={setShakhM3}
        />

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-sm font-medium text-slate-600 mb-2">Комментарий</label>
          <textarea
            className="w-full rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-primary text-sm min-h-[80px]"
            placeholder="Например: Вывоза не было, работала техника..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-10 md:static md:bg-transparent md:border-0 md:p-0 md:backdrop-blur-none">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-semibold uppercase">Итого за смену</span>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-slate-900 text-lg">{currentTotalTrips} рейсов</span>
                <span className="text-sm text-slate-600">/ {currentTotalM3} м³</span>
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Сохранить
            </button>
          </div>
        </div>
      </form>

      {isSaved && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-xl z-50 animate-bounce flex items-center gap-2">
          ✅ Запись сохранена
        </div>
      )}
    </div>
  );
};

export default EntryForm;
