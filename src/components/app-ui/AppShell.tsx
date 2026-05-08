import React from 'react';
import { Sidebar, RouteKey } from './Sidebar';
import { Topbar } from './Topbar';
export function AppShell({
  current,
  onNavigate,
  workspace,
  onWorkspaceChange,
  workspaces,
  userEmail,
  children








}: {current: RouteKey;onNavigate: (k: RouteKey) => void;workspace: string;onWorkspaceChange: (w: string) => void;workspaces: string[];userEmail: string;children: React.ReactNode;}) {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex">
      <Sidebar current={current} onNavigate={onNavigate} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          workspace={workspace}
          onWorkspaceChange={onWorkspaceChange}
          workspaces={workspaces}
          userEmail={userEmail} />
        
        <main className="flex-1 min-w-0">{children}</main>
        <footer className="px-6 py-3 text-[11px] text-slate-500 border-t border-slate-200 bg-white">
          © 2026 VCPMC · Internal use only
        </footer>
      </div>
    </div>);

}