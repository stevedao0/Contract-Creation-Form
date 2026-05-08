import React from 'react';
export function FormActions({
  primary,
  secondary,
  tertiary,
  align = 'right'














}: {primary?: {label: string;onClick?: () => void;};secondary?: {label: string;onClick?: () => void;};tertiary?: {label: string;onClick?: () => void;};align?: 'left' | 'right';}) {
  return (
    <div
      className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      
      {tertiary &&
      <button
        type="button"
        onClick={tertiary.onClick}
        className="h-9 px-4 text-sm font-medium rounded-md text-slate-600 hover:bg-slate-100">
        
          {tertiary.label}
        </button>
      }
      {secondary &&
      <button
        type="button"
        onClick={secondary.onClick}
        className="h-9 px-4 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
        
          {secondary.label}
        </button>
      }
      {primary &&
      <button
        type="button"
        onClick={primary.onClick}
        className="h-9 px-4 text-sm font-medium rounded-md bg-slate-900 text-white hover:bg-slate-800">
        
          {primary.label}
        </button>
      }
    </div>);

}