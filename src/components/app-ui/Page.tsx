import React from 'react';
export function Page({ children }: {children: React.ReactNode;}) {
  return (
    <div className="px-6 py-6 max-w-[1400px] mx-auto flex flex-col gap-5">
      {children}
    </div>);

}
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb





}: {title: string;description?: string;actions?: React.ReactNode;breadcrumb?: string;}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>
        {breadcrumb &&
        <p className="text-xs text-slate-500 mb-1">{breadcrumb}</p>
        }
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          {title}
        </h1>
        {description &&
        <p className="text-sm text-slate-500 mt-1">{description}</p>
        }
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>);

}