import React from 'react';

interface InputGroupProps {
  label: string;
  subLabel?: string;
  colorClass: string;
  trips: number | '';
  m3: number | '';
  onTripsChange: (val: number | '') => void;
  onM3Change: (val: number | '') => void;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  subLabel,
  colorClass,
  trips,
  m3,
  onTripsChange,
  onM3Change,
}) => {
  return (
    <div className={`p-4 rounded-xl border ${colorClass} bg-white shadow-sm`}>
      <div className="mb-3">
        <h3 className="font-bold text-gray-800 text-lg">{label}</h3>
        {subLabel && <p className="text-xs text-gray-500 uppercase font-semibold">{subLabel}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Рейсы</label>
          <input
            type="number"
            min="0"
            className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
            placeholder="0"
            value={trips}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value));
              onTripsChange(val);
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Объём (м³)</label>
          <input
            type="number"
            min="0"
            className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
            placeholder="0.0"
            value={m3}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value));
              onM3Change(val);
            }}
          />
        </div>
      </div>
    </div>
  );
};
