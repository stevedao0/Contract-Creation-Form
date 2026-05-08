import React from 'react';
type PreviewFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  hint?: string;
};
export function PreviewField({
  label,
  value,
  placeholder = 'Chưa đủ thông tin để tạo số hợp đồng',
  hint
}: PreviewFieldProps) {
  const isEmpty = !value || value.trim() === '';
  return (
    <div className="rounded-md border border-slate-300 bg-slate-900 text-slate-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex flex-col">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <span
          className={`mt-0.5 font-mono text-base sm:text-lg break-all ${isEmpty ? 'text-slate-500 italic font-sans text-sm' : 'text-white'}`}>
          
          {isEmpty ? placeholder : value}
        </span>
      </div>
      {hint &&
      <span className="text-[11px] text-slate-400 sm:text-right">{hint}</span>
      }
    </div>);

}