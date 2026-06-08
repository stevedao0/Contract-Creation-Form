import { contractFixtures } from './fixtures/contracts.fixture';
import { dispatchFixtures } from './fixtures/dispatches.fixture';
import { dashboardFixtures } from './fixtures/dashboard.fixture';

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

export const demoNav: NavItem[] = [
  { id: 'overview', label: 'Tổng quan hệ thống', caption: 'Foundation · Tokens' },
  { id: 'gallery', label: 'Bộ thành phần', caption: 'Primitives · Patterns' },
  { id: 'dashboard', label: 'Enterprise Dashboard', caption: 'Cockpit · KPI', badge: 'Real-shaped' },
  { id: 'contracts', label: 'Contracts Workspace', caption: 'Dense table workspace' },
  { id: 'dispatches', label: 'Dispatches Workspace', caption: 'Công văn điều hành' },
  { id: 'create', label: 'Contract Creation', caption: 'Guided business form' },
  { id: 'print', label: 'Certificate Print', caption: 'Print control center' },
  { id: 'reports', label: 'Reports Workspace', caption: 'Insight & exports' },
];

export const metricCards: MetricItem[] = dashboardFixtures.metricCards;
export const demoActivities: ActivityItem[] = dashboardFixtures.activities;
export const contractRows: ContractRow[] = contractFixtures;
export const dispatchRows: DispatchRow[] = dispatchFixtures;
