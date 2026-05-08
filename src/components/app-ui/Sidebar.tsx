import React, { useState } from 'react';
import {
  LayoutDashboardIcon,
  FileTextIcon,
  FilePlusIcon,
  ListIcon,
  AwardIcon,
  PaperclipIcon,
  MailIcon,
  BarChart3Icon,
  SearchIcon,
  ShieldIcon,
  ChevronDownIcon,
  ChevronRightIcon } from
'lucide-react';
export type RouteKey =
'dashboard' |
'contracts.list' |
'contracts.create' |
'contracts.gcn' |
'appendices' |
'dispatch' |
'reports' |
'search' |
'admin';
type Item = {
  key: RouteKey;
  label: string;
  icon: React.ReactNode;
};
type Group = {
  label?: string;
  items: Item[];
};
type ParentGroup = {
  label: string;
  icon: React.ReactNode;
  childKeys: RouteKey[];
  children: Item[];
};
const TOP: Item[] = [
{
  key: 'dashboard',
  label: 'Dashboard',
  icon: <LayoutDashboardIcon className="h-4 w-4" />
}];

const CONTRACTS: ParentGroup = {
  label: 'Hợp đồng',
  icon: <FileTextIcon className="h-4 w-4" />,
  childKeys: ['contracts.list', 'contracts.create', 'contracts.gcn'],
  children: [
  {
    key: 'contracts.list',
    label: 'Danh sách hợp đồng',
    icon: <ListIcon className="h-4 w-4" />
  },
  {
    key: 'contracts.create',
    label: 'Tạo hợp đồng',
    icon: <FilePlusIcon className="h-4 w-4" />
  },
  {
    key: 'contracts.gcn',
    label: 'GCN',
    icon: <AwardIcon className="h-4 w-4" />
  }]

};
const REST: Item[] = [
{
  key: 'appendices',
  label: 'Phụ lục',
  icon: <PaperclipIcon className="h-4 w-4" />
},
{
  key: 'dispatch',
  label: 'Công văn',
  icon: <MailIcon className="h-4 w-4" />
},
{
  key: 'reports',
  label: 'Báo cáo',
  icon: <BarChart3Icon className="h-4 w-4" />
},
{
  key: 'search',
  label: 'Tìm kiếm',
  icon: <SearchIcon className="h-4 w-4" />
}];

const ADMIN: Item[] = [
{
  key: 'admin',
  label: 'Admin',
  icon: <ShieldIcon className="h-4 w-4" />
}];

export function Sidebar({
  current,
  onNavigate



}: {current: RouteKey;onNavigate: (k: RouteKey) => void;}) {
  const [contractsOpen, setContractsOpen] = useState(
    CONTRACTS.childKeys.includes(current)
  );
  const renderItem = (it: Item) => {
    const active = current === it.key;
    return (
      <button
        key={it.key}
        type="button"
        onClick={() => onNavigate(it.key)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'}`}>
        
        <span
          className={`shrink-0 ${active ? 'text-indigo-300' : 'text-slate-400'}`}>
          
          {it.icon}
        </span>
        <span className="truncate">{it.label}</span>
      </button>);

  };
  const renderGroupLabel = (label: string) =>
  <p className="px-3 mt-4 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </p>;

  const contractsActive = CONTRACTS.childKeys.includes(current);
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-slate-900 text-slate-200 h-screen sticky top-0">
      {/* Brand */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b border-slate-800">
        <div className="h-7 w-7 rounded-md bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
          V
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-white">VCPMC</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            Contract Suite
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {renderGroupLabel('Tổng quan')}
        <div className="flex flex-col gap-0.5">{TOP.map(renderItem)}</div>

        {renderGroupLabel('Nghiệp vụ')}
        <div className="flex flex-col gap-0.5">
          {/* Contracts parent */}
          <button
            type="button"
            onClick={() => setContractsOpen((o) => !o)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${contractsActive ? 'text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'}`}>
            
            <span className="shrink-0 text-slate-400">{CONTRACTS.icon}</span>
            <span className="flex-1 text-left">{CONTRACTS.label}</span>
            {contractsOpen ?
            <ChevronDownIcon className="h-4 w-4 text-slate-500" /> :

            <ChevronRightIcon className="h-4 w-4 text-slate-500" />
            }
          </button>
          {contractsOpen &&
          <div className="ml-4 pl-2 border-l border-slate-800 flex flex-col gap-0.5 my-1">
              {CONTRACTS.children.map(renderItem)}
            </div>
          }
          {REST.map(renderItem)}
        </div>

        {renderGroupLabel('Hệ thống')}
        <div className="flex flex-col gap-0.5">{ADMIN.map(renderItem)}</div>
      </nav>

      <div className="px-4 py-3 border-t border-slate-800 text-[11px] text-slate-500">
        v1.0.0 · Internal
      </div>
    </aside>);

}