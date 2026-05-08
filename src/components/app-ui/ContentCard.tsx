import React, { Component } from 'react';
export function ContentCard({
  title,
  description,
  actions,
  children,
  padded = true,
  className = ''







}: {title?: string;description?: string;actions?: React.ReactNode;children: React.ReactNode;padded?: boolean;className?: string;}) {
  return (
    <section
      className={`bg-white border border-slate-200 rounded-md ${className}`}>
      
      {(title || actions) &&
      <header className="px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
          <div>
            {title &&
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          }
            {description &&
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          }
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      }
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>);

}
export function SectionCard(props: ComponentProps<typeof ContentCard>) {
  return <ContentCard {...props} />;
}