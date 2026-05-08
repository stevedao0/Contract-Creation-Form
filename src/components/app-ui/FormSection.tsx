import React from 'react';
type FormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};
export function FormSection({
  title,
  description,
  children
}: FormSectionProps) {
  return (
    <section className="border border-slate-200 rounded-md bg-white">
      <header className="px-5 py-3 border-b border-slate-200 bg-slate-50/60">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description &&
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        }
      </header>
      <div className="p-5">{children}</div>
    </section>);

}