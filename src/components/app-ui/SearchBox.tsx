import React from 'react';
import { SearchIcon } from 'lucide-react';
export function SearchBox({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  size = 'md',
  className = ''






}: {value: string;onChange: (v: string) => void;placeholder?: string;size?: 'sm' | 'md' | 'lg';className?: string;}) {
  const h = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-11' : 'h-9';
  const text = size === 'lg' ? 'text-base' : 'text-sm';
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${h} ${text} pl-9 pr-3 rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400`} />
      
    </div>);

}