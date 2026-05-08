import React, { useState } from 'react';
import { AppShell } from './components/app-ui/AppShell';
import { RouteKey } from './components/app-ui/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ContractsListPage } from './pages/ContractsListPage';
import { CreateContractPage } from './pages/CreateContractPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SearchPage } from './pages/SearchPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { WORKSPACES } from './data/options';
const USER_EMAIL = 'admin@vcpmc.org';
export function App() {
  const [route, setRoute] = useState<RouteKey>('dashboard');
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const renderPage = () => {
    switch (route) {
      case 'dashboard':
        return <DashboardPage userEmail={USER_EMAIL} onNavigate={setRoute} />;
      case 'contracts.list':
        return <ContractsListPage onNavigate={setRoute} />;
      case 'contracts.create':
        return <CreateContractPage onNavigate={setRoute} />;
      case 'contracts.gcn':
        return <CertificatesPage />;
      case 'appendices':
        return (
          <PlaceholderPage
            title="Phụ lục hợp đồng"
            description="Quản lý các phụ lục đính kèm hợp đồng." />);


      case 'dispatch':
        return (
          <PlaceholderPage
            title="Công văn"
            description="Theo dõi công văn gửi đi và nhận về." />);


      case 'reports':
        return <ReportsPage />;
      case 'search':
        return <SearchPage />;
      case 'admin':
        return (
          <PlaceholderPage
            title="Quản trị hệ thống"
            description="Phân quyền, người dùng và cấu hình." />);


      default:
        return null;
    }
  };
  return (
    <AppShell
      current={route}
      onNavigate={setRoute}
      workspace={workspace}
      onWorkspaceChange={setWorkspace}
      workspaces={WORKSPACES}
      userEmail={USER_EMAIL}>
      
      {renderPage()}
    </AppShell>);

}