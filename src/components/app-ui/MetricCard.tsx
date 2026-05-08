import React from 'react';
import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';
export type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  delta?: {
    value: string;
    tone: 'up' | 'down' | 'flat';
  };
  icon?: React.ReactNode;
};
export function MetricCard({
  label,
  value,
  hint,
  delta,
  icon
}: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        {icon &&
        <span className="h-7 w-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center">
            {icon}
          </span>
        }
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-semibold text-slate-900 tabular-nums">
          {value}
        </span>
        {delta &&
        <span
          className={`inline-flex items-center text-xs font-medium ${delta.tone === 'up' ? 'text-emerald-600' : delta.tone === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
          
            {delta.tone === 'up' ?
          <ArrowUpRightIcon className="h-3.5 w-3.5" /> :
          delta.tone === 'down' ?
          <ArrowDownRightIcon className="h-3.5 w-3.5" /> :
          null}
            {delta.value}
          </span>
        }
      </div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>);

}
export function MetricStrip({ items }: {items: MetricCardProps[];}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((m, i) =>
      <MetricCard key={i} {...m} />
      )}
    </div>);

}