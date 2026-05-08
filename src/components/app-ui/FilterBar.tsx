import React from 'react';
import { XIcon } from 'lucide-react';
export function FilterBar({
  children,
  onClear,
  hasActive




}: {children: React.ReactNode;onClear?: () => void;hasActive?: boolean;}) {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-3 flex flex-wrap items-end gap-3">
      <div className="flex flex-wrap items-end gap-3 flex-1 min-w-0">
        {children}
      </div>
      {onClear &&
      <button
        type="button"
        onClick={onClear}
        disabled={!hasActive}
        className="h-9 inline-flex items-center gap-1 px-3 text-sm rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent">
        
          <XIcon className="h-4 w-4" />
          Xóa lọc
        </button>
      }
    </div>);

}
export function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Tất cả',
  width = 'w-44'










}: {label: string;value: string;onChange: (v: string) => void;options: {value: string;label: string;}[];placeholder?: string;width?: string;}) {
  return (
    <div className={`flex flex-col gap-1 ${width}`}>
      <label className="text-[11px] font-medium text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 px-2.5 text-sm rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400">
        
        <option value="">{placeholder}</option>
        {options.map((o) =>
        <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )}
      </select>
    </div>);

}