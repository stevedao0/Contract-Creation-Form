import React, { useEffect, useState } from 'react';
import {
  FilePlusIcon,
  SearchIcon,
  FileTextIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  Music2Icon,
  WalletIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  AwardIcon,
  PrinterIcon,
  MailIcon,
  BarChart3Icon,
  ListIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { MetricStrip } from '../components/app-ui/MetricCard';
import { HeroPanel } from '../components/app-ui/HeroPanel';
import { Button } from '../components/app-ui/Button';
import { Select } from '../components/app-ui/Select';
import { ProgressStatusPanel } from '../components/app-ui/ProgressStatusPanel';
import { ExpiringList } from '../components/app-ui/ExpiringList';
import { RouteKey } from '../data/routes';
import { formatNumber } from '../lib/format';
import { TOKEN_KEY } from '../lib/authClient';
import { apiRequest } from '../lib/apiClient';
import { EnterpriseBadge, EnterprisePage, EnterprisePanel, EnterpriseSectionHeader, EnterpriseSummaryStrip } from '../components/enterprise';


const YEAR_OPTIONS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
];

// =============================================================================
// Types — mirror backend Pydantic schemas
// =============================================================================

type RevenueYearItem = {
  year: number;
  contract_count: number;
  total_revenue: number | null;
  cumulative: boolean;
  isNull?: boolean;
  isCurrent?: boolean;
};

type ExpiringContractItem = {
  id: number;
  contract_no: string;
  partner: string;
  field: string;
  expire_date: string | null;
  days_left: number;
  value: number | null;
};

type ReportsSummary = {
  total_contracts: number;
  active_count: number;
  expiring_30d_count: number;
  expiring_60d_count: number;
  expired_count: number;
  pending_renewal_count: number;
  new_count: number;
  unknown_status_count: number;
  revenue_by_year: RevenueYearItem[];
  expiring_contracts: ExpiringContractItem[];
  field_breakdown: { key: string; label: string; count: number }[];
  certificate_total: number;
  gcn_draft: number;
  gcn_test_printed: number;
  gcn_final_printed: number;
  total_works: number;
};

export function DashboardPage({
  userEmail,
  onNavigate,
}: {
  userEmail: string;
  onNavigate: (k: RouteKey) => void;
}) {
  const [year, setYear] = useState('2026');
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
          if (!cancelled) {
            setError('Không có phiên đăng nhập.');
            setLoading(false);
          }
          return;
        }
        const data = await apiRequest<ReportsSummary>('/reports/summary', { token });
        if (!cancelled) setSummary(data);
      } catch (err: any) {
        if (!cancelled) setError(String(err?.message || 'Không tải được dữ liệu tổng quan.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reloadTick]);

  const triggerRefresh = () => setReloadTick((v) => v + 1);

  // Derive stats from real API response
  const stats = summary
    ? {
        totalContracts: summary.total_contracts,
        active: summary.active_count,
        expiring30: summary.expiring_30d_count,
        expiring60: summary.expiring_60d_count,
        expired: summary.expired_count,
        pendingRenewal: summary.pending_renewal_count,
        gcnDraft: summary.gcn_draft,
        gcnFinalPrinted: summary.gcn_final_printed,
        totalWorks: summary.total_works,
        revenue2026:
          (summary.revenue_by_year ?? []).find((y) => y.year === new Date().getFullYear())
            ?.total_revenue ?? 0,
        revenue2025:
          (summary.revenue_by_year ?? [])
            .find((y) => y.year === new Date().getFullYear() - 1)
            ?.total_revenue ?? 0,
        contracts2026:
          (summary.revenue_by_year ?? [])
            .find((y) => y.year === new Date().getFullYear())
            ?.contract_count ?? 0,
      }
    : null;

  const revenue2026 = stats?.revenue2026 ?? 0;
  const revenue2025 = stats?.revenue2025 ?? 0;

  const revenueDeltaPct =
    revenue2025 > 0 ? ((revenue2026 - revenue2025) / revenue2025) * 100 : null;

  // Revenue chart data from API
  const chartData = (summary?.revenue_by_year ?? []).map((y) => ({
    year: String(y.year),
    revenue: y.total_revenue ?? 0,
    revenueBn: y.total_revenue != null ? y.total_revenue / 1_000_000_000 : 0,
    contract_count: y.contract_count,
  }));

  // Status breakdown from real data
  const statusBreakdown = stats
    ? [
        { name: 'Đang hiệu lực', value: stats.active, tone: 'success' as const },
        { name: 'Sắp hết 60 ngày', value: stats.expiring60, tone: 'warning' as const },
        { name: 'Hết hạn', value: stats.expired, tone: 'danger' as const },
        { name: 'Chờ tái ký', value: stats.pendingRenewal, tone: 'violet' as const },
      ]
    : [];

  // Expiring list from API
  const expiringItems = (summary?.expiring_contracts ?? []).map((c) => ({
    id: String(c.id),
    partner: c.partner,
    contractNo: c.contract_no,
    expireDate: c.expire_date ?? '',
    daysLeft: c.days_left,
    value: c.value,
  }));
  const dashboardQueue = expiringItems.slice(0, 6);
  const commandHighlights = stats
    ? [
        { label: 'GCN bản nháp', value: formatNumber(stats.gcnDraft), tone: 'warning' as const },
        { label: 'Chờ tái ký', value: formatNumber(stats.pendingRenewal), tone: 'violet' as const },
        { label: 'Hết hạn', value: formatNumber(stats.expired), tone: 'danger' as const },
      ]
    : [];

  return (
    <Page>
      <EnterprisePage>
      <PageHeader
        title="Command Center"
        description="Operational summary cho workspace Background Music với dữ liệu thật từ hệ thống."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCwIcon className="h-4 w-4" />}
              onClick={triggerRefresh}
              disabled={loading}
            />
            <Select
              value={year}
              onChange={setYear}
              options={YEAR_OPTIONS}
              className="w-32"
            />
          </div>
        }
      />

      <EnterprisePanel className="vc-enterprise-command-header">
        <EnterpriseSectionHeader
          eyebrow="Enterprise command center"
          title={<span>Xin chào, <span className="text-[var(--vc-enterprise-accent-strong)]">{userEmail}</span></span>}
          description={
            stats
              ? `Đang theo dõi ${formatNumber(stats.totalContracts)} hợp đồng, ${formatNumber(stats.expiring30 + stats.expiring60)} việc cần chú ý và ${formatNumber(stats.gcnDraft)} GCN bản nháp.`
              : error
                ? error
                : 'Đang tải dữ liệu vận hành...'
          }
          actions={stats ? <EnterpriseBadge tone="accent">{formatNumber(stats.totalContracts)} contracts</EnterpriseBadge> : undefined}
        />
      </EnterprisePanel>

      <EnterpriseSummaryStrip
        items={[
          {
            label: 'Tổng hợp đồng',
            value: loading ? '—' : formatNumber(stats?.totalContracts ?? 0),
            tone: 'accent',
            icon: <FileTextIcon className="h-4 w-4" />,
            hint: 'Workspace Background',
          },
          {
            label: 'Còn hiệu lực',
            value: loading ? '—' : formatNumber(stats?.active ?? 0),
            tone: 'success',
            icon: <CheckCircle2Icon className="h-4 w-4" />,
            hint:
              stats && stats.totalContracts > 0
                ? `${((stats.active / stats.totalContracts) * 100).toFixed(1)}% tổng số`
                : 'Tổng Background',
          },
          {
            label: 'Sắp hết 60 ngày',
            value: loading ? '—' : formatNumber(stats?.expiring60 ?? 0),
            tone: 'warning',
            icon: <AlertTriangleIcon className="h-4 w-4" />,
            hint:
              stats && stats.expiring30 > 0
                ? `Trong đó ${stats.expiring30} hết trong 30 ngày`
                : 'Cần xử lý sớm',
          },
          {
            label: 'Tác phẩm',
            value: loading ? '—' : formatNumber(stats?.totalWorks ?? 0),
            tone: 'violet',
            icon: <Music2Icon className="h-4 w-4" />,
            hint: 'Đang quản lý',
          },
          {
            label: 'GCN đã in',
            value: loading ? '—' : formatNumber(stats?.gcnFinalPrinted ?? 0),
            tone: 'success',
            icon: <AwardIcon className="h-4 w-4" />,
            hint:
              stats && stats.gcnDraft > 0
                ? `${formatNumber(stats.gcnDraft)} bản nháp chờ phát hành`
                : 'Bản chính thức',
          },
          {
            label: 'Doanh thu 2026',
            value:
              loading
                ? '—'
                : revenue2026 > 0
                  ? `${(revenue2026 / 1_000_000_000).toFixed(2)} tỷ`
                  : 'Chưa có',
            tone: 'teal',
            icon: <WalletIcon className="h-4 w-4" />,
            delta:
              revenueDeltaPct !== null
                ? `${revenueDeltaPct >= 0 ? '+' : ''}${revenueDeltaPct.toFixed(1)}% so với 2025`
                : undefined,
            hint: revenueDeltaPct !== null ? 'So với 2025' : 'Chưa có dữ liệu năm trước',
          },
        ]}
      />

      <div className="vc-enterprise-command-grid">
        <div className="vc-enterprise-command-main">
        <ContentCard
          title="Doanh thu theo năm"
          description="Đơn vị: tỷ VND · So sánh qua các năm (lũy kế đến nay)"
          className="lg:col-span-2"
          accent
          actions={
            <div className="flex items-center gap-3 text-[11px]">
              {chartData.map((d, i) => (
                <div key={d.year} className="inline-flex items-center gap-1.5 text-zinc-500">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      i === chartData.length - 1
                        ? 'bg-gradient-to-br from-amber-600 to-amber-600'
                        : 'bg-zinc-400'
                    }`}
                  />
                  {d.year}
                </div>
              ))}
            </div>
          }
        >
          {chartData.length === 0 || chartData.every((d) => d.revenueBn === 0) ? (
            <div className="h-72 flex items-center justify-center text-sm text-zinc-400">
              Chưa có dữ liệu doanh thu để hiển thị
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 16,
                    left: -10,
                    bottom: 0,
                  }}
                  barCategoryGap="35%"
                  onMouseLeave={() => setHoverIdx(null)}
                >
                  <defs>
                    <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.85} />
                    </linearGradient>
                    <linearGradient id="barFillHover" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="barFillPrev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4d4d8" stopOpacity={1} />
                      <stop offset="100%" stopColor="#a1a1aa" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis
                    dataKey="year"
                    stroke="#a1a1aa"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={4}
                  />
                  <YAxis
                    stroke="#a1a1aa"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-4}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(99,102,241,0.06)' }}
                    contentStyle={{
                      border: 'none',
                      borderRadius: 10,
                      background: 'rgba(15, 15, 25, 0.92)',
                      color: '#fff',
                      fontSize: 12,
                      padding: '8px 12px',
                      boxShadow: '0 10px 30px rgba(15,15,25,0.25)',
                    }}
                    labelStyle={{
                      color: '#a5b4fc',
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(v: number) => [
                      `${v.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} tỷ`,
                      'Doanh thu',
                    ]}
                  />
                  <Bar
                    dataKey="revenueBn"
                    radius={[6, 6, 0, 0]}
                    onMouseEnter={(_, idx) => setHoverIdx(idx)}
                  >
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          i === chartData.length - 1
                            ? hoverIdx === i
                              ? 'url(#barFillHover)'
                              : 'url(#barFill)'
                            : 'url(#barFillPrev)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ContentCard>
        </div>

        <div className="vc-enterprise-side-stack">
          <EnterprisePanel>
            <EnterpriseSectionHeader
              eyebrow="Command status"
              title="Tỷ lệ trạng thái hợp đồng"
              description="Phân bổ toàn bộ workspace Background"
              actions={stats ? <EnterpriseBadge tone="accent">{formatNumber(stats.totalContracts)} hợp đồng</EnterpriseBadge> : undefined}
            />
          {statusBreakdown.length > 0 && stats ? (
            <ProgressStatusPanel
              items={statusBreakdown}
              mode="relative"
              helper={`Tổng ${formatNumber(stats.totalContracts)} hợp đồng. Số "Còn hiệu lực" đã bao gồm ${stats.expiring60} đang sắp hết 60 ngày.`}
            />
          ) : (
            <div className="py-8 text-center text-sm text-zinc-400">
              {loading ? 'Đang tải...' : 'Chưa có dữ liệu'}
            </div>
          )}
          </EnterprisePanel>
          <EnterprisePanel className="vc-enterprise-intelligence-panel">
            <EnterpriseSectionHeader
              eyebrow="Intelligence"
              title="Operational signals"
              description="Tín hiệu ưu tiên được tổng hợp từ dữ liệu dashboard đang có."
              actions={stats ? <EnterpriseBadge tone="neutral">Real data only</EnterpriseBadge> : undefined}
            />
            <div className="mt-4 grid gap-3">
              {commandHighlights.length > 0 ? commandHighlights.map((item) => (
                <div key={item.label} className="vc-enterprise-queue-item">
                  <div>
                    <div className="vc-enterprise-label">{item.label}</div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{item.value}</div>
                  </div>
                  <EnterpriseBadge tone={item.tone}>{item.label}</EnterpriseBadge>
                </div>
              )) : (
                <div className="py-8 text-center text-sm text-zinc-400">
                  {loading ? 'Đang tải...' : 'Chưa có tín hiệu vận hành'}
                </div>
              )}
            </div>
            <div className="mt-4 rounded-2xl border border-[rgba(18,45,37,0.08)] bg-[rgba(15,143,114,0.04)] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="vc-enterprise-label">Queue sắp hết hạn</div>
                  <div className="mt-2 text-sm text-zinc-700">
                    {dashboardQueue.length > 0 ? `${dashboardQueue.length} hợp đồng ưu tiên xử lý đầu tiên.` : 'Không có hợp đồng cần ưu tiên ngay.'}
                  </div>
                </div>
                <EnterpriseBadge tone="warning">{formatNumber(expiringItems.length)}</EnterpriseBadge>
              </div>
            </div>
          </EnterprisePanel>
        </div>
      </div>
      <div className="vc-enterprise-command-grid vc-enterprise-lower-grid">
        <ContentCard
          title="Hợp đồng sắp hết hạn"
          description={
            expiringItems.length > 0
              ? `${expiringItems.length} hợp đồng sắp hết · hiển thị ưu tiên ${dashboardQueue.length} dòng đầu tiên`
              : 'Trong 60 ngày tới'
          }
          className="lg:col-span-2"
          padded={false}
          actions={
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRightIcon className="h-3.5 w-3.5" />}
              onClick={() => onNavigate('contracts.list')}
            >
              Xem tất cả
            </Button>
          }
        >
          {dashboardQueue.length > 0 ? (
            <ExpiringList items={dashboardQueue} />
          ) : (
            <div className="py-12 text-center text-sm text-zinc-400">
              {loading ? 'Đang tải...' : 'Không có hợp đồng sắp hết trong 60 ngày tới'}
            </div>
          )}
        </ContentCard>

        <ContentCard title="Hoạt động gần đây" padded={false} className="vc-enterprise-panel">
          <div className="py-12 text-center text-sm text-zinc-400">
            Chưa có dữ liệu hoạt động
          </div>
        </ContentCard>
      </div>

      {/* Quick actions — real navigation only */}
      <ContentCard
        title="Thao tác nhanh"
        description="Đi tới các trang nghiệp vụ chính"
        accent
        className="vc-enterprise-panel"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
          { label: 'Tạo hợp đồng', icon: FilePlusIcon, route: 'contracts.create' as RouteKey },
            { label: 'Danh sách HĐ', icon: ListIcon, route: 'contracts.list' as RouteKey },
            { label: 'In GCN', icon: PrinterIcon, route: 'contracts.print' as RouteKey },
            { label: 'Công văn', icon: MailIcon, route: 'dispatch' as RouteKey },
            { label: 'Báo cáo', icon: BarChart3Icon, route: 'reports' as RouteKey },

          ].map((a) => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.route)}
              className="group flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-xl ring-1 ring-zinc-200/80 bg-white hover:bg-amber-50/60 hover:ring-amber-200 transition text-zinc-700 hover:text-amber-800"
            >
              <a.icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              <span className="text-xs font-medium tracking-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </ContentCard>
      </EnterprisePage>
    </Page>
  );
}

