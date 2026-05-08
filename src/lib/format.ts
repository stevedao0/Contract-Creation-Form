export function formatCurrency(v: number) {
  if (!v && v !== 0) return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(v);
}

export function formatDate(v: string) {
  if (!v || v === '—') return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatNumber(v: number) {
  return new Intl.NumberFormat('vi-VN').format(v);
}