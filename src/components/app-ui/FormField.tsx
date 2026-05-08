import React from 'react';
import { FieldShell } from './FieldShell';
type FormFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  helper?: string;
  type?: 'text' | 'email';
  className?: string;
};
export function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  helper,
  type = 'text',
  className
}: FormFieldProps) {
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      required={required}
      helper={helper}
      className={className}>
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 px-3 text-sm rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400" />
      
    </FieldShell>);

}