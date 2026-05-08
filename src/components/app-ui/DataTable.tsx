import React from 'react';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'right' | 'center';
  className?: string;
};
export function DataTable<
  T extends {
    id: string | number;
  }>(
{
  columns,
  rows,
  loading,
  empty,
  onRowClick






}: {columns: Column<T>[];rows: T[];loading?: boolean;empty?: React.ReactNode;onRowClick?: (row: T) => void;}) {
  if (loading) return <LoadingState />;
  if (!rows.length) return empty ?? <EmptyState />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/60">
            {columns.map((c) =>
            <th
              key={c.key}
              className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'}`}
              style={
              c.width ?
              {
                width: c.width
              } :
              undefined
              }>
              
                {c.header}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
          <tr
            key={row.id}
            onClick={() => onRowClick?.(row)}
            className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/70 ${onRowClick ? 'cursor-pointer' : ''}`}>
            
              {columns.map((c) =>
            <td
              key={c.key}
              className={`px-4 py-3 text-slate-700 ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''} ${c.className ?? ''}`}>
              
                  {c.render(row)}
                </td>
            )}
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}
export function DataTablePagination({
  page,
  total,
  pageSize,
  onPageChange





}: {page: number;total: number;pageSize: number;onPageChange: (p: number) => void;}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs text-slate-600">
      <span>
        Hiển thị{' '}
        <span className="font-medium text-slate-800">
          {from}–{to}
        </span>{' '}
        trong <span className="font-medium text-slate-800">{total}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="h-8 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40">
          
          Trước
        </button>
        <span className="px-2">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="h-8 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40">
          
          Sau
        </button>
      </div>
    </div>);

}