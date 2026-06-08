import { certificateFixtures, contractFixtures, dashboardFixtures, dispatchFixtures, domainFixtures, reportFixtures } from './fixtures';

export type DataMode = 'sanitized-fixture' | 'local-real';

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

export type ContractRow = {
  id: string;
  contractNo: string;
  customer: string;
  location: string;
  areas: string[];
  amount: number;
  status: 'Đang hiệu lực' | 'Sắp hết hạn' | 'Chờ tái ký' | 'Bản nháp' | 'Hết hạn';
  owner: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  certificateNo: string | null;
  note?: string | null;
  companyId?: number | null;
  domainCode?: string | null;
};

export type DispatchRow = {
  id: string;
  dispatchNo: string;
  subject: string;
  destination: string;
  priority: 'Khẩn' | 'Chuẩn' | 'Theo dõi';
  status: 'Đã gửi' | 'Chờ ký' | 'Đang soạn';
  contractNo: string;
  issueDate: string;
  note?: string;
};

export type CertificateRow = {
  id: string;
  certificateNo: string | null;
  contractNo: string;
  organizationName: string;
  address: string;
  businessLocation: string;
  status: 'draft' | 'test_printed' | 'final_printed';
  printCount: number;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  scope: string;
  qrStatus?: string;
  offsetXmm?: number | null;
  offsetYmm?: number | null;
};

export type DomainRow = {
  code: string;
  label: string;
  workspace: string;
};

export type ReportRow = { label: string; count: number };

export type DashboardData = {
  heroTitle: string;
  metricCards: MetricItem[];
  activities: ActivityItem[];
};

export type ReportsData = {
  renewalRate: number;
  avgCertificateCycleDays: number;
  activeReconciliationContracts: number;
  interventionBottlenecks: number;
  fieldBreakdown: ReportRow[];
  certificateStatus: ReportRow[];
};

export type DemoDataSet = {
  dataMode: DataMode;
  demoNav: NavItem[];
  metricCards: MetricItem[];
  demoActivities: ActivityItem[];
  contractRows: ContractRow[];
  dispatchRows: DispatchRow[];
  certificateRows: CertificateRow[];
  expiringContractRows: ContractRow[];
  riskyCertificateRows: CertificateRow[];
  priorityDispatchRows: DispatchRow[];
  domainLabels: string[];
  reportBreakdown: ReportRow[];
  dashboard: DashboardData;
  reports: ReportsData;
};

const baseNav = [
  { id: 'overview', label: 'Tổng quan hệ thống', caption: 'Foundation · Tokens' },
  { id: 'gallery', label: 'Bộ thành phần', caption: 'Stress · States' },
  { id: 'dashboard', label: 'Enterprise Dashboard', caption: 'Command center', badge: 'Live-shaped' },
  { id: 'contracts', label: 'Contracts Workspace', caption: 'Dense contract ops' },
  { id: 'dispatches', label: 'Dispatches Workspace', caption: 'Official-letter queue' },
  { id: 'create', label: 'Contract Creation', caption: 'Guided business form' },
  { id: 'print', label: 'Certificate Print', caption: 'Print-control station' },
  { id: 'reports', label: 'Reports Workspace', caption: 'Analytics & exports' },
] satisfies NavItem[];

export function buildDemoDataSet(input: {
  dataMode: DataMode;
  contractRows: ContractRow[];
  dispatchRows: DispatchRow[];
  certificateRows: CertificateRow[];
  domainRows: DomainRow[];
  dashboard: DashboardData;
  reports: ReportsData;
}): DemoDataSet {
  const { dataMode, contractRows, dispatchRows, certificateRows, domainRows, dashboard, reports } = input;

  return {
    dataMode,
    demoNav: baseNav.map((item) => {
      if (item.id === 'contracts') return { ...item, badge: String(contractRows.length) };
      if (item.id === 'dispatches') return { ...item, badge: String(dispatchRows.length) };
      if (item.id === 'print') return { ...item, badge: String(certificateRows.filter((row) => row.status === 'draft').length) };
      return item;
    }),
    metricCards: dashboard.metricCards,
    demoActivities: dashboard.activities,
    contractRows,
    dispatchRows,
    certificateRows,
    expiringContractRows: contractRows.filter((row) => row.status === 'Sắp hết hạn' || row.status === 'Chờ tái ký' || row.status === 'Hết hạn').slice(0, 12),
    riskyCertificateRows: certificateRows.filter((row) => row.status === 'draft' || row.certificateNo === null).slice(0, 10),
    priorityDispatchRows: dispatchRows.filter((row) => row.priority === 'Khẩn' || row.status !== 'Đã gửi').slice(0, 12),
    domainLabels: domainRows.map((item) => item.label),
    reportBreakdown: reports.fieldBreakdown,
    dashboard,
    reports,
  };
}

export const sanitizedDemoData: DemoDataSet = buildDemoDataSet({
  dataMode: 'sanitized-fixture',
  contractRows: contractFixtures as ContractRow[],
  dispatchRows: dispatchFixtures as DispatchRow[],
  certificateRows: certificateFixtures as CertificateRow[],
  domainRows: domainFixtures.map((item) => ({ code: item.code, label: item.label, workspace: item.workspace })) as DomainRow[],
  dashboard: {
    heroTitle: dashboardFixtures.heroTitle,
    metricCards: [
      ...dashboardFixtures.metricCards,
      { label: 'Hợp đồng sắp hết hạn', value: String(contractFixtures.filter((row) => row.status === 'Sắp hết hạn').length), delta: '7 ngày tới', tone: 'warning' },
      { label: 'Tỷ lệ tái ký', value: `${reportFixtures.renewalRate}%`, delta: 'cao hơn tháng trước', tone: 'accent' },
    ],
    activities: dashboardFixtures.activities,
  },
  reports: {
    renewalRate: reportFixtures.renewalRate,
    avgCertificateCycleDays: reportFixtures.avgCertificateCycleDays,
    activeReconciliationContracts: reportFixtures.activeReconciliationContracts,
    interventionBottlenecks: reportFixtures.interventionBottlenecks,
    fieldBreakdown: reportFixtures.fieldBreakdown,
    certificateStatus: reportFixtures.certificateStatus,
  },
});

type LocalRealPreviewPayload = {
  source?: string;
  generatedAt?: string;
  contracts?: ContractRow[];
  certificates?: CertificateRow[];
  dispatches?: DispatchRow[];
  domains?: DomainRow[];
  dashboard?: DashboardData;
  reports?: ReportsData;
};

function isValidPayload(payload: LocalRealPreviewPayload): payload is Required<LocalRealPreviewPayload> {
  return Array.isArray(payload.contracts)
    && Array.isArray(payload.certificates)
    && Array.isArray(payload.dispatches)
    && Array.isArray(payload.domains)
    && !!payload.dashboard
    && !!payload.reports;
}

export async function loadDemoData(): Promise<DemoDataSet> {
  try {
    const response = await fetch('/local-real-preview.json', { cache: 'no-store' });
    if (!response.ok) return sanitizedDemoData;
    const payload = await response.json() as LocalRealPreviewPayload;
    if (!isValidPayload(payload)) return sanitizedDemoData;
    return buildDemoDataSet({
      dataMode: 'local-real',
      contractRows: payload.contracts,
      dispatchRows: payload.dispatches,
      certificateRows: payload.certificates,
      domainRows: payload.domains,
      dashboard: payload.dashboard,
      reports: payload.reports,
    });
  } catch {
    return sanitizedDemoData;
  }
}
