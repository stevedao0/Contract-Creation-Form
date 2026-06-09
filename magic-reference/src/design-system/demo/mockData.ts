import { certificateFixtures, contractFixtures, dashboardFixtures, dispatchFixtures, domainFixtures, reportFixtures } from './fixtures';

export type NavItem = {
  id: string;
  label: string;
  caption?: string;
  badge?: string;
};

export type MetricItem = {
  label: string;
  value: string;
  delta?: string;
  tone?: 'accent' | 'success' | 'warning' | 'danger' | 'info';
};

export type ActivityItem = {
  title: string;
  meta: string;
  time: string;
  tone?: 'success' | 'warning' | 'info' | 'danger';
};

export type ContractRow = (typeof contractFixtures)[number];
export type DispatchRow = (typeof dispatchFixtures)[number];
export type CertificateRow = (typeof certificateFixtures)[number];

export const demoNav: NavItem[] = [
  { id: 'overview', label: 'Tổng quan hệ thống', caption: 'Foundation · Tokens' },
  { id: 'gallery', label: 'Bộ thành phần', caption: 'Stress · States' },
  { id: 'dashboard', label: 'Enterprise Dashboard', caption: 'Command center', badge: 'Live-shaped' },
  { id: 'contracts', label: 'Contracts Workspace', caption: 'Dense contract ops', badge: String(contractFixtures.length) },
  { id: 'dispatches', label: 'Dispatches Workspace', caption: 'Official-letter queue', badge: String(dispatchFixtures.length) },
  { id: 'create', label: 'Contract Creation', caption: 'Guided business form' },
  { id: 'print', label: 'Certificate Print', caption: 'Print-control station', badge: String(certificateFixtures.filter((row) => row.status === 'draft').length) },
  { id: 'reports', label: 'Reports Workspace', caption: 'Analytics & exports' },
];

export const metricCards: MetricItem[] = [
  ...dashboardFixtures.metricCards,
  { label: 'Hợp đồng sắp hết hạn', value: String(contractFixtures.filter((row) => row.status === 'Sắp hết hạn').length), delta: '7 ngày tới', tone: 'warning' },
  { label: 'Tỷ lệ tái ký', value: `${reportFixtures.renewalRate}%`, delta: 'cao hơn tháng trước', tone: 'accent' },
];

export const demoActivities: ActivityItem[] = dashboardFixtures.activities;
export const contractRows: ContractRow[] = contractFixtures;
export const dispatchRows: DispatchRow[] = dispatchFixtures;
export const certificateRows: CertificateRow[] = certificateFixtures;
export const expiringContractRows = contractFixtures.filter((row) => row.status === 'Sắp hết hạn' || row.status === 'Chờ tái ký' || row.status === 'Hết hạn').slice(0, 12);
export const riskyCertificateRows = certificateFixtures.filter((row) => row.status === 'draft' || row.certificateNo === null).slice(0, 10);
export const priorityDispatchRows = dispatchFixtures.filter((row) => row.priority === 'Khẩn' || row.status !== 'Đã gửi').slice(0, 12);
export const domainLabels = domainFixtures.map((item) => item.label);
export const reportBreakdown = reportFixtures.fieldBreakdown;
