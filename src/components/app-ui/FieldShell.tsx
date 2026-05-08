import React from 'react';
type FieldShellProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  helper?: string;
  className?: string;
  children: React.ReactNode;
};
export function FieldShell({
  label,
  htmlFor,
  required,
  helper,
  className = '',
  children
}: FieldShellProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-xs font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-600 ml-0.5">*</span>}
      </label>
      {children}
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>);

}