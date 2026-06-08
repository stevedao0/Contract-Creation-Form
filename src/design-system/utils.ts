export type Tone =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'teal'
  | 'violet';

export const toneClassMap: Record<Tone, string> = {
  neutral: 'vc-tone-neutral',
  accent: 'vc-tone-accent',
  success: 'vc-tone-success',
  warning: 'vc-tone-warning',
  danger: 'vc-tone-danger',
  info: 'vc-tone-info',
  teal: 'vc-tone-teal',
  violet: 'vc-tone-violet',
};

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value);
}
