import React from 'react';
type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
const toneMap: Record<Tone, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  info: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-500/20'
};
export function StatusBadge({
  tone = 'neutral',
  children



}: {tone?: Tone;children: React.ReactNode;}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ring-inset ${toneMap[tone]}`}>
      
      {children}
    </span>);

}