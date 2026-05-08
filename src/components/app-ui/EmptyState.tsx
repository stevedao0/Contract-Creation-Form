import React from 'react';
import { InboxIcon } from 'lucide-react';
export function EmptyState({
  title = 'Chưa có dữ liệu',
  description,
  action,
  icon





}: {title?: string;description?: string;action?: React.ReactNode;icon?: React.ReactNode;}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
        {icon ?? <InboxIcon className="h-5 w-5" />}
      </div>
      <p className="text-sm font-medium text-slate-900">{title}</p>
      {description &&
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
      }
      {action && <div className="mt-4">{action}</div>}
    </div>);

}