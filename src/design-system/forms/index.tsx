import React from 'react';
import { cx } from '../utils';

export function TextField({
  label,
  hint,
  required,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={cx('vc-field', className)}>
      <label>
        {label}
        {required && <span style={{ color: 'var(--vc-accent)', marginLeft: 4 }}>*</span>}
      </label>
      <input className="vc-input" placeholder={`Nhập ${label.toLowerCase()}…`} />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function Textarea({ label, hint, rows = 3 }: { label: string; hint?: string; rows?: number }) {
  return (
    <div className="vc-field">
      <label>{label}</label>
      <textarea className="vc-textarea" rows={rows} placeholder={`Mô tả ${label.toLowerCase()}…`} />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function SelectField({ label, options, hint }: { label: string; options: string[]; hint?: string }) {
  return (
    <div className="vc-field">
      <label>{label}</label>
      <select className="vc-select">
        <option value="">— Chọn {label} —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function NumberInput({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="vc-field">
      <label>{label}</label>
      <input className="vc-input" type="number" placeholder="0" />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function MoneyInput({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="vc-field">
      <label>{label}</label>
      <input className="vc-input" type="text" placeholder="0 đ" />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function PercentInput({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="vc-field">
      <label>{label}</label>
      <input className="vc-input" type="number" step="0.01" min="0" max="100" placeholder="0.00" />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function DatePicker({ label }: { label: string }) {
  return (
    <div className="vc-field">
      <label>{label}</label>
      <input className="vc-input" type="date" />
    </div>
  );
}

export function FileUpload({ label }: { label: string }) {
  return (
    <div className="vc-field">
      <label>{label}</label>
      <div
        className="vc-empty"
        style={{
          padding: 'var(--vc-space-5)',
          textAlign: 'center',
          cursor: 'pointer',
          borderStyle: 'dashed',
          borderRadius: 'var(--vc-radius-md)',
        }}
      >
        <p style={{ margin: 0, color: 'var(--vc-text-soft)', fontSize: '0.84rem' }}>
          Kéo thả file hoặc <strong style={{ color: 'var(--vc-accent)' }}>duyệt file</strong>
        </p>
      </div>
    </div>
  );
}

export function FormHint({ text }: { text: string }) {
  return <small style={{ color: 'var(--vc-text-muted)', fontSize: '0.76rem' }}>{text}</small>;
}

export function FormError({ text }: { text: string }) {
  return <small style={{ color: 'var(--vc-danger-soft)', fontSize: '0.76rem' }}>{text}</small>;
}

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="vc-field">
      <label>{label}</label>
      {children}
    </div>
  );
}
