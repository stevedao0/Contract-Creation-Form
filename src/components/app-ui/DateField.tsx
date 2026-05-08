import React from 'react';
import { FieldShell } from './FieldShell';
type DateFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  helper?: string;
  className?: string;
};
export function DateField({
  id,
  label,
  value,
  onChange,
  required,
  helper,
  className
}: DateFieldProps) {
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      required={required}
      helper={helper}
      className={className}>
      
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 px-3 text-sm rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400" />
      
    </FieldShell>);

}