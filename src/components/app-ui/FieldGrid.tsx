import React from 'react';
type FieldGridProps = {
  cols?: 1 | 2 | 3;
  children: React.ReactNode;
};
const colsMap: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3'
};
export function FieldGrid({ cols = 3, children }: FieldGridProps) {
  return (
    <div className={`grid grid-cols-1 ${colsMap[cols]} gap-x-5 gap-y-4`}>
      {children}
    </div>);

}