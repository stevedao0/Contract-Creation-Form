import React, { useEffect, useState, useRef } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';
export type RowAction = {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  tone?: 'default' | 'danger';
};
export function RowActionsMenu({ actions }: {actions: RowAction[];}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Thao tác"
        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
        
        <MoreHorizontalIcon className="h-4 w-4" />
      </button>
      {open &&
      <div className="absolute right-0 top-9 z-20 w-48 rounded-md border border-slate-200 bg-white shadow-lg py-1">
          {actions.map((a, i) =>
        <button
          key={i}
          type="button"
          onClick={() => {
            a.onClick?.();
            setOpen(false);
          }}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-slate-50 ${a.tone === 'danger' ? 'text-rose-600' : 'text-slate-700'}`}>
          
              {a.icon && <span className="h-4 w-4 shrink-0">{a.icon}</span>}
              <span>{a.label}</span>
            </button>
        )}
        </div>
      }
    </div>);

}