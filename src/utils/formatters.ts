import { SnowRecord } from '../types';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatPeriod = (record: SnowRecord) => {
  const from = formatDate(record.periodFrom);
  const to = formatDate(record.periodTo);
  const type = record.shiftType === 'day' ? '(день)' : '(ночь)';
  
  if (from === to) {
    return `${from} ${type}`;
  }
  return `${from} – ${to} ${type}`;
};

export const formatNumber = (num: number | null) => {
  if (num === null || num === undefined || num === 0) return '-';
  return num.toLocaleString('ru-RU');
};

export const safeSum = (...args: (number | null)[]) => {
  return args.reduce((acc, curr) => (acc || 0) + (curr || 0), 0) || 0;
};
