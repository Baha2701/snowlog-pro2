export type ShiftType = 'day' | 'night';

export interface SnowRecord {
  id: string;
  periodFrom: string; // ISO Date String YYYY-MM-DD
  periodTo: string;   // ISO Date String YYYY-MM-DD
  shiftType: ShiftType;
  
  // Data Blocks
  sabytov_trips: number | null;
  sabytov_m3: number | null;
  
  yakor_trips: number | null;
  yakor_m3: number | null;
  
  shakh_trips: number | null;
  shakh_m3: number | null;
  
  comment: string;
  createdAt: number;
}

export interface Totals {
  trips: number;
  m3: number;
}

export interface DashboardStats {
  total: Totals;
  sabytov: Totals;
  yakor: Totals;
  shakh: Totals;
}
