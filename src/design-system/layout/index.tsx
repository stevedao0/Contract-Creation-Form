import React from 'react';

export function EnterpriseAppShell({
  sidebar,
  topbar,
  children,
}: {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="vc-app">
      <div className="vc-shell">
        {sidebar}
        <div className="vc-main">
          {topbar}
          <main className="vc-content">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function WorkspaceSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return <aside className="vc-sidebar">{children}</aside>;
}

export function Topbar({ title, description, actions }: { title: string; description: string; actions?: React.ReactNode }) {
  return (
    <header className="vc-topbar">
      <div className="vc-topbar__title">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="vc-topbar__actions">{actions}</div>
    </header>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return <div className="vc-stack">{children}</div>;
}

export function PageHeader({ title, description, actions }: { title: React.ReactNode; description: string; actions?: React.ReactNode }) {
  return (
    <div className="vc-section-header">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {actions}
    </div>
  );
}

export function PageSection({ title, description, children, actions }: { title: string; description: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="vc-card">
      <div className="vc-section-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function ContentCard({ children }: { children: React.ReactNode }) {
  return <section className="vc-card">{children}</section>;
}

export function WorkspaceLayout({ primary, secondary }: { primary: React.ReactNode; secondary?: React.ReactNode }) {
  return <div className="vc-grid-2"><div>{primary}</div><div>{secondary}</div></div>;
}

export function DomainSwitcher({ items }: { items: string[] }) {
  return (
    <div className="vc-toolbar__group">
      {items.map((item, index) => (
        <span key={item} className={index === 0 ? 'vc-pill vc-pill--inverse' : 'vc-pill'}>
          {item}
        </span>
      ))}
    </div>
  );
}
