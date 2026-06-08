import React from 'react';
import { toneClassMap, cx, Tone } from '../utils';

export function Button({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'ghost' | 'subtle';
  className?: string;
}) {
  return <button className={cx('vc-button', variant !== 'default' && `vc-button--${variant}`, className)}>{children}</button>;
}

export function IconButton({ icon }: { icon: React.ReactNode }) {
  return <button className="vc-button vc-button--ghost" aria-label="action">{icon}</button>;
}

export function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={cx('vc-badge', toneClassMap[tone])}>{children}</span>;
}

export function Chip({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={cx('vc-chip', toneClassMap[tone])}>{children}</span>;
}

export function StatusBadge({ children, tone = 'accent' }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={cx('vc-badge', toneClassMap[tone])}>{children}</span>;
}

export function Card({ children, dense = false }: { children: React.ReactNode; dense?: boolean }) {
  return <section className={cx('vc-card', dense && 'vc-card--dense')}>{children}</section>;
}

export function Panel({ children }: { children: React.ReactNode }) {
  return <section className="vc-panel">{children}</section>;
}

export function Tooltip({ label }: { label: string }) {
  return <span className="vc-pill">{label}</span>;
}

export function Dialog({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="vc-dialog">
      <div className="vc-section-header">
        <div>
          <h3>{title}</h3>
          <p>Dialog visual for enterprise confirmation flows.</p>
        </div>
      </div>
      {children}
      <div className="vc-dialog__footer">
        <Button variant="ghost">Hủy</Button>
        <Button variant="primary">Xác nhận</Button>
      </div>
    </div>
  );
}

export function DropdownMenu({ items }: { items: string[] }) {
  return (
    <div className="vc-stack">
      {items.map((item) => (
        <div key={item} className="vc-pill">{item}</div>
      ))}
    </div>
  );
}

export function Tabs({ items, active }: { items: string[]; active: string }) {
  return (
    <div className="vc-toolbar__group">
      {items.map((item) => (
        <button key={item} className={cx('vc-button', item === active ? 'vc-button--subtle' : 'vc-button--ghost')}>
          {item}
        </button>
      ))}
    </div>
  );
}

export function ScrollArea({ children }: { children: React.ReactNode }) {
  return <div style={{ maxHeight: 280, overflow: 'auto' }}>{children}</div>;
}

export function Separator() {
  return <div style={{ height: 1, background: 'var(--vc-border)', width: '100%' }} />;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="vc-empty">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function Skeleton() {
  return (
    <div className="vc-skeleton vc-stack">
      <div className="vc-skeleton__bar" />
      <div className="vc-skeleton__bar" style={{ width: '74%' }} />
      <div className="vc-skeleton__bar" style={{ width: '56%' }} />
    </div>
  );
}
