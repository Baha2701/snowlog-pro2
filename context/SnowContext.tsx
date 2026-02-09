import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SnowRecord, DashboardStats } from '../types';

interface SnowContextType {
  records: SnowRecord[];
  addRecord: (record: Omit<SnowRecord, 'id' | 'createdAt'>) => void;
  deleteRecord: (id: string) => void;
  getStats: (filteredRecords: SnowRecord[]) => DashboardStats;
}

const SnowContext = createContext<SnowContextType | undefined>(undefined);

const STORAGE_KEY = 'snow_log_data_v1';

export const SnowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<SnowRecord[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse records", e);
      }
    }
  }, []);

  // Save to local storage whenever records change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const addRecord = (newRecord: Omit<SnowRecord, 'id' | 'createdAt'>) => {
    const record: SnowRecord = {
      ...newRecord,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setRecords(prev => [record, ...prev]); // Newest first
  };

  const deleteRecord = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const getStats = (data: SnowRecord[]): DashboardStats => {
    const stats: DashboardStats = {
      total: { trips: 0, m3: 0 },
      sabytov: { trips: 0, m3: 0 },
      yakor: { trips: 0, m3: 0 },
      shakh: { trips: 0, m3: 0 },
    };

    data.forEach(r => {
      // Helpers to handle nulls safely
      const s_trips = r.sabytov_trips || 0;
      const s_m3 = r.sabytov_m3 || 0;
      const y_trips = r.yakor_trips || 0;
      const y_m3 = r.yakor_m3 || 0;
      const sh_trips = r.shakh_trips || 0;
      const sh_m3 = r.shakh_m3 || 0;

      // Organization totals
      stats.sabytov.trips += s_trips;
      stats.sabytov.m3 += s_m3;

      stats.yakor.trips += y_trips;
      stats.yakor.m3 += y_m3;

      stats.shakh.trips += sh_trips;
      stats.shakh.m3 += sh_m3;

      // Grand total
      stats.total.trips += (s_trips + y_trips + sh_trips);
      stats.total.m3 += (s_m3 + y_m3 + sh_m3);
    });

    return stats;
  };

  return (
    <SnowContext.Provider value={{ records, addRecord, deleteRecord, getStats }}>
      {children}
    </SnowContext.Provider>
  );
};

export const useSnow = () => {
  const context = useContext(SnowContext);
  if (!context) {
    throw new Error('useSnow must be used within a SnowProvider');
  }
  return context;
};
