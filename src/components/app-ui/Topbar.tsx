import React, { useEffect, useState, useRef } from 'react';
import {
  BellIcon,
  ChevronDownIcon,
  SearchIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon } from
'lucide-react';
export function Topbar({
  workspace,
  onWorkspaceChange,
  workspaces,
  userEmail





}: {workspace: string;onWorkspaceChange: (w: string) => void;workspaces: string[];userEmail: string;}) {
  const [wsOpen, setWsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const wsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wsRef.current && !wsRef.current.contains(e.target as Node))
      setWsOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node))
      setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-10">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm hợp đồng, GCN, đối tác..."
          className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300" />
        
      </div>

      <div className="flex-1" />

      {/* Workspace */}
      <div ref={wsRef} className="relative">
        <button
          type="button"
          onClick={() => setWsOpen((o) => !o)}
          className="h-9 px-3 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm text-slate-700">
          
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <span className="font-medium">{workspace}</span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>
        {wsOpen &&
        <div className="absolute right-0 top-11 w-48 rounded-md border border-slate-200 bg-white shadow-lg py-1 z-20">
            <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500">
              Workspace
            </p>
            {workspaces.map((w) =>
          <button
            key={w}
            type="button"
            onClick={() => {
              onWorkspaceChange(w);
              setWsOpen(false);
            }}
            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 ${w === workspace ? 'text-slate-900 font-medium' : 'text-slate-700'}`}>
            
                {w}
              </button>
          )}
          </div>
        }
      </div>

      {/* Notifications */}
      <button
        type="button"
        aria-label="Thông báo"
        className="relative h-9 w-9 inline-flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
        
        <BellIcon className="h-4.5 w-4.5" />
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
      </button>

      {/* User */}
      <div ref={userRef} className="relative">
        <button
          type="button"
          onClick={() => setUserOpen((o) => !o)}
          className="h-9 pl-1 pr-2 inline-flex items-center gap-2 rounded-md hover:bg-slate-100">
          
          <span className="h-7 w-7 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center">
            A
          </span>
          <span className="hidden sm:inline text-sm text-slate-700 max-w-[160px] truncate">
            {userEmail}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>
        {userOpen &&
        <div className="absolute right-0 top-11 w-56 rounded-md border border-slate-200 bg-white shadow-lg py-1 z-20">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-900 truncate">
                {userEmail}
              </p>
              <p className="text-xs text-slate-500">Quản trị viên</p>
            </div>
            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              <UserIcon className="h-4 w-4" /> Hồ sơ
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              <SettingsIcon className="h-4 w-4" /> Cài đặt
            </button>
            <div className="my-1 border-t border-slate-100" />
            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50">
              <LogOutIcon className="h-4 w-4" /> Đăng xuất
            </button>
          </div>
        }
      </div>
    </header>);

}