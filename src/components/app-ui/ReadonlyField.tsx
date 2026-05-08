import React from 'react';
import { FieldShell } from './FieldShell';
type ReadonlyFieldProps = {
  label: string;
  value: string;
  helper?: string;
  placeholder?: string;
  className?: string;
  mono?: boolean;
};
export function ReadonlyField({
  label,
  value,
  helper,
  placeholder = '—',
  className,
  mono
}: ReadonlyFieldProps) {
  return (
    <FieldShell label={label} helper={helper} className={className}>
      <div
        className={`h-9 px-3 flex items-center text-sm rounded-md border border-slate-200 bg-slate-50 text-slate-700 ${mono ? 'font-mono' : ''}`}>
        
        {value ? value : <span className="text-slate-400">{placeholder}</span>}
      </div>
    </FieldShell>);

}