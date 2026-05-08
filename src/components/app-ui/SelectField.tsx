import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { FieldShell } from './FieldShell';
type Option = {
  value: string;
  label: string;
};
type SelectFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  helper?: string;
  className?: string;
};
export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = '-- Chọn --',
  required,
  helper,
  className
}: SelectFieldProps) {
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      required={required}
      helper={helper}
      className={className}>
      
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full h-9 pl-3 pr-8 text-sm rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400">
          
          <option value="">{placeholder}</option>
          {options.map((opt) =>
          <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )}
        </select>
        <ChevronDownIcon
          aria-hidden
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        
      </div>
    </FieldShell>);

}