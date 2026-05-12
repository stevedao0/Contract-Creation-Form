import React, { useMemo, useState } from 'react';
import {
  RefreshCwIcon,
  DownloadIcon,
  WalletIcon,
  CalendarRangeIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  AwardIcon,
  FileTextIcon,
  XCircleIcon,
  EyeIcon,
  BellRingIcon,
  FilePlusIcon,
  RotateCcwIcon,
  PrinterIcon,
  Music2Icon,
  PlayIcon } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell } from
'recharts';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { MetricStrip } from '../components/app-ui/MetricCard';
import { Button } from '../components/app-ui/Button';
import { Select } from '../components/app-ui/Select';
import { StatusBadge } from '../components/app-ui/StatusBadge';
import { FilterBar, FilterField } from '../components/app-ui/FilterBar';
import { Tabs } from '../components/app-ui/Tabs';
import { EmployeePerformanceTable } from '../components/app-ui/EmployeePerformanceTable';
import { ExportReportDialog } from '../components/app-ui/ExportReportDialog';
import { RowActionsMenu } from '../components/app-ui/RowActionsMenu';
import { EmptyState } from '../components/app-ui/EmptyState';
import { TableSkeleton } from '../components/app-ui/TableSkeleton';
import {
  FIELD_CATEGORIES,
  REVENUE_BY_YEAR_3Y,
  EXPIRING_REPORT_ROWS,
  REPORT_STATS } from
'../data/reportData';
import {
  EMPLOYEE_PERFORMANCE,
  PENDING_ROWS,
  PENDING_CATEGORY_LABEL,
  getPendingPriority,
  filterSignedByScope,
  SignedScope } from
'../data/reportEmployees';
import { CONTRACT_RECORDS } from '../data/contractRecords';
import { CERTIFICATE_RECORDS } from '../data/certificateRecords';
import { formatCurrency, formatDate, formatNumber } from '../lib/format';
import { RouteKey } from '../data/routes';
import { useAuth } from '../lib/auth';
const REPORT_TYPE_OPTIONS = [
{
  value: 'overview',
  label: 'Tổng quan'
},
{
  value: 'employee',
  label: 'Theo nhân viên'
},
{
  value: 'signed',
  label: 'Hợp đồng đã ký'
},
{
  value: 'pending',
  label: 'Hợp đồng chưa ký'
},
{
  value: 'expiring',
  label: 'Hợp đồng sắp hết hạn'
},
{
  value: 'gcn',
  label: 'GCN'
},
{
  value: 'revenue',
  label: 'Doanh thu'
}];

const TIME_OPTIONS = [
{
  value: 'week',
  label: 'Tuần này'
},
{
  value: 'month',
  label: 'Tháng này'
},
{
  value: 'quarter',
  label: 'Quý này'
},
{
  value: 'year',
  label: 'Năm này'
},
{
  value: 'custom',
  label: 'Tùy chỉnh'
}];

const EMPLOYEE_OPTIONS = [
{
  value: 'Tuấn',
  label: 'Tuấn'
},
{
  value: 'Admin',
  label: 'Admin'
},
{
  value: 'Nhân viên 1',
  label: 'Nhân viên 1'
}];

const FIELD_OPTIONS = FIELD_CATEGORIES.map((c) => ({
  value: c.label,
  label: c.label
}));
const STATUS_OPTIONS = [
{
  value: 'signed',
  label: 'Đã ký'
},
{
  value: 'unsigned',
  label: 'Chưa ký'
},
{
  value: 'draft',
  label: 'Bản nháp'
},
{
  value: 'expiring',
  label: 'Sắp hết hạn'
},
{
  value: 'expired',
  label: 'Hết hạn'
},
{
  value: 'pending_renewal',
  label: 'Chờ tái ký'
},
{
  value: 'renewed',
  label: 'Đã tái ký'
}];

const EXPIRING_FILTER_TABS = [
{
  value: '7d',
  label: '7 ngày'
},
{
  value: '30d',
  label: '30 ngày'
},
{
  value: '60d',
  label: '60 ngày'
},
{
  value: 'quarter',
  label: 'Quý tới'
}];

const SIGNED_TABS = [
{
  value: 'week',
  label: 'Tuần'
},
{
  value: 'month',
  label: 'Tháng'
},
{
  value: 'quarter',
  label: 'Quý'
},
{
  value: 'year',
  label: 'Năm'
}];

const GCN_STATUS_LABEL: Record<string, string> = {
  draft: 'Bản nháp',
  test_printed: 'In thử',
  final_printed: 'In chính thức',
  no_gcn: 'Chưa tạo GCN'
};
export function ReportsPage({
  onNavigate


}: {onNavigate: (k: RouteKey) => void;}) {
  const { hasPermission } = useAuth();
  const canExport = hasPermission('reports.export');
  // Control center
  const [reportType, setReportType] = useState('overview');
  const [time, setTime] = useState('year');
  const [employee, setEmployee] = useState('');
  const [field, setField] = useState('');
  const [status, setStatus] = useState('');
  // Loading + dialog
  const [loading, setLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  // Section-local tab states
  const [signedScope, setSignedScope] = useState<SignedScope>('month');
  const [expiringScope, setExpiringScope] = useState('30d');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const hasActiveFilter =
  reportType !== 'overview' ||
  time !== 'year' ||
  !!employee ||
  !!field ||
  !!status;
  const clearFilters = () => {
    setReportType('overview');
    setTime('year');
    setEmployee('');
    setField('');
    setStatus('');
  };
  const triggerRefresh = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 700);
  };
  // Signed contracts filtered by tab + employee/field
  const signedRows = useMemo(() => {
    let rows = filterSignedByScope(signedScope);
    if (employee) rows = rows.filter((r) => r.assignee === employee);
    if (field) rows = rows.filter((r) => r.field === field);
    return rows;
  }, [signedScope, employee, field]);
  const signedSummary = useMemo(() => {
    const count = signedRows.length;
    const totalValue = signedRows.reduce((s, r) => s + (r.value ?? 0), 0);
    const avg = count > 0 ? totalValue / count : 0;
    return {
      count,
      totalValue,
      avg
    };
  }, [signedRows]);
  // Pending rows joined with contract records
  const pendingRowsResolved = useMemo(() => {
    return PENDING_ROWS.map((p) => {
      const c = CONTRACT_RECORDS.find((r) => r.id === p.contractRecordId);
      return c ?
      {
        ...p,
        contract: c
      } :
      null;
    }).filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, []);
  const filteredPending = useMemo(() => {
    let rows = pendingRowsResolved;
    if (employee) rows = rows.filter((r) => r.assignee === employee);
    return rows;
  }, [pendingRowsResolved, employee]);
  // Expiring filtered
  const filteredExpiring = useMemo(() => {
    let rows = EXPIRING_REPORT_ROWS;
    if (expiringScope === '7d') rows = rows.filter((r) => r.days_left <= 7);else
    if (expiringScope === '30d')
    rows = rows.filter((r) => r.days_left <= 30);else
    if (expiringScope === '60d')
    rows = rows.filter((r) => r.days_left <= 60);else
    rows = rows.filter((r) => r.days_left <= 92);
    return rows;
  }, [expiringScope]);
  // Cert table — first 5 from real cert records
  const certRows = CERTIFICATE_RECORDS.slice(0, 5);
  return (
    <Page>
      <PageHeader
        breadcrumb="/bg/reports"
        title="Báo cáo"
        description="Theo dõi hợp đồng, hiệu suất xử lý theo nhân viên, doanh thu, GCN và danh sách cần tái ký."
        actions={
        <>
            <Button
            variant="secondary"
            leftIcon={<RefreshCwIcon className="h-4 w-4" />}
            onClick={triggerRefresh}>
            
              Làm mới
            </Button>
            <Button
            variant="primary"
            leftIcon={<DownloadIcon className="h-4 w-4" />}
            onClick={() => setExportOpen(true)}
            disabled={!canExport}
            title={!canExport ? 'Không có quyền xuất báo cáo' : undefined}>
            
              Xuất báo cáo
            </Button>
          </>
        } />
      

      {/* Report Control Center */}
      <FilterBar
        hasActive={hasActiveFilter}
        onClear={clearFilters}
        resultSummary={
        <span>
            Đang xem{' '}
            <span className="font-semibold text-zinc-900">
              {REPORT_TYPE_OPTIONS.find((o) => o.value === reportType)?.label}
            </span>{' '}
            ·{' '}
            <span className="font-semibold text-zinc-900">
              {TIME_OPTIONS.find((o) => o.value === time)?.label}
            </span>
            {employee &&
          <>
                {' '}
                · nhân viên{' '}
                <span className="font-semibold text-zinc-900">{employee}</span>
              </>
          }
            {field &&
          <>
                {' '}
                · lĩnh vực{' '}
                <span className="font-semibold text-zinc-900">{field}</span>
              </>
          }
          </span>
        }>
        
        <FilterField label="Loại báo cáo" width="w-52">
          <Select
            value={reportType}
            onChange={setReportType}
            options={REPORT_TYPE_OPTIONS} />
          
        </FilterField>
        <FilterField label="Thời gian" width="w-36">
          <Select value={time} onChange={setTime} options={TIME_OPTIONS} />
        </FilterField>
        <FilterField label="Nhân viên" width="w-40">
          <Select
            value={employee}
            onChange={setEmployee}
            options={EMPLOYEE_OPTIONS}
            placeholder="Tất cả" />
          
        </FilterField>
        <FilterField label="Lĩnh vực" width="w-44">
          <Select
            value={field}
            onChange={setField}
            options={FIELD_OPTIONS}
            placeholder="Tất cả" />
          
        </FilterField>
        <FilterField label="Trạng thái" width="w-40">
          <Select
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            placeholder="Tất cả" />
          
        </FilterField>
        <FilterField label=" " width="w-auto">
          <Button variant="primary" size="md" onClick={triggerRefresh}>
            Tạo báo cáo
          </Button>
        </FilterField>
      </FilterBar>

      {/* Section 1 — KPI tổng quan */}
      <MetricStrip
        items={[
        {
          label: 'Tổng hợp đồng',
          value: formatNumber(REPORT_STATS.totalContracts),
          tone: 'indigo',
          icon: <FileTextIcon className="h-4 w-4" />,
          hint: 'Workspace Background'
        },
        {
          label: 'Đã ký 2026',
          value: formatNumber(REPORT_STATS.contracts2026),
          tone: 'violet',
          icon: <CalendarRangeIcon className="h-4 w-4" />,
          hint: 'Năm hiện tại'
        },
        {
          label: 'Còn hiệu lực',
          value: formatNumber(REPORT_STATS.active),
          tone: 'emerald',
          icon: <CheckCircle2Icon className="h-4 w-4" />,
          hint: '3,6% tổng'
        },
        {
          label: 'Sắp hết 60 ngày',
          value: formatNumber(REPORT_STATS.expiringIn60Days),
          tone: 'amber',
          icon: <AlertTriangleIcon className="h-4 w-4" />,
          hint: `Trong đó ${REPORT_STATS.expiringIn30Days} hết 30 ngày`
        },
        {
          label: 'Hết hạn',
          value: formatNumber(REPORT_STATS.expired),
          tone: 'rose',
          icon: <XCircleIcon className="h-4 w-4" />,
          hint: 'Cần rà soát tái ký'
        }]
        } />
      

      <MetricStrip
        items={[
        {
          label: 'Doanh thu 2026',
          value: '1,075 tỷ',
          tone: 'cyan',
          icon: <WalletIcon className="h-4 w-4" />,
          hint: 'Lũy kế đến hôm nay'
        },
        {
          label: 'Doanh thu 2025',
          value: '2,649 tỷ',
          tone: 'emerald',
          icon: <WalletIcon className="h-4 w-4" />,
          hint: 'Cả năm'
        },
        {
          label: 'Tác phẩm',
          value: formatNumber(REPORT_STATS.totalWorks),
          tone: 'sky',
          icon: <Music2Icon className="h-4 w-4" />,
          hint: 'Đang quản lý'
        },
        {
          label: 'GCN bản nháp',
          value: formatNumber(REPORT_STATS.gcnDraft),
          tone: 'amber',
          icon: <FileTextIcon className="h-4 w-4" />,
          hint: 'Chờ cấp số & in'
        },
        {
          label: 'GCN in chính thức',
          value: formatNumber(REPORT_STATS.gcnFinalPrinted),
          tone: 'violet',
          icon: <AwardIcon className="h-4 w-4" />,
          hint: 'Đã phát hành'
        }]
        } />
      

      {/* Section 2 — Hiệu suất nhân viên */}
      <ContentCard
        title="Hiệu suất xử lý theo nhân viên"
        description="Theo dõi tải công việc và tỷ lệ hoàn thành. Số liệu nhân viên là dữ liệu nội bộ."
        padded={false}
        accent
        actions={
        <Tabs
          tabs={[
          {
            value: '',
            label: 'Tất cả'
          },
          {
            value: 'Tuấn',
            label: 'Tuấn'
          },
          {
            value: 'Admin',
            label: 'Admin'
          },
          {
            value: 'Nhân viên 1',
            label: 'NV 1'
          }]
          }
          value={employee}
          onChange={setEmployee} />

        }>
        
        <EmployeePerformanceTable
          items={
          employee ?
          EMPLOYEE_PERFORMANCE.filter((e) => e.name === employee) :
          EMPLOYEE_PERFORMANCE
          } />
        
      </ContentCard>

      {/* Section 3 — Hợp đồng đã ký */}
      <ContentCard
        title="Hợp đồng đã ký"
        description="Tổng hợp hợp đồng đã ký theo khoảng thời gian từ dữ liệu thật."
        padded={false}
        accent
        actions={
        <Tabs
          tabs={SIGNED_TABS}
          value={signedScope}
          onChange={(v) => setSignedScope(v as SignedScope)} />

        }>
        
        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4 px-5 py-4 border-b border-zinc-100/80 bg-zinc-50/40">
          <SummaryStat
            label="Hợp đồng đã ký"
            value={formatNumber(signedSummary.count)}
            suffix="hợp đồng" />
          
          <SummaryStat
            label="Tổng giá trị"
            value={formatCurrency(signedSummary.totalValue)}
            highlight />
          
          <SummaryStat
            label="Trung bình / hợp đồng"
            value={
            signedSummary.count > 0 ?
            formatCurrency(Math.round(signedSummary.avg)) :
            '—'
            } />
          
        </div>

        {loading ?
        <TableSkeleton rows={6} cols={8} /> :
        signedRows.length === 0 ?
        <EmptyState
          title="Không có hợp đồng đã ký trong khoảng thời gian này"
          description="Thử mở rộng khoảng thời gian (tuần → tháng → quý → năm)."
          icon={<XCircleIcon className="h-5 w-5" />} /> :


        <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-b from-indigo-50/30 via-zinc-50 to-zinc-50/30 border-b border-zinc-200">
                  <Th>Số hợp đồng</Th>
                  <Th>Ngày ký</Th>
                  <Th>Đơn vị / Bảng hiệu</Th>
                  <Th>Lĩnh vực</Th>
                  <Th>Người thực hiện</Th>
                  <Th align="right">Giá trị</Th>
                  <Th>Thời hạn</Th>
                  <Th>GCN</Th>
                </tr>
              </thead>
              <tbody>
                {signedRows.map((r) =>
              <tr
                key={r.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-indigo-50/30 transition-colors cursor-pointer"
                onClick={() => onNavigate('contracts.list')}>
                
                    <td className="px-4 py-3.5 align-top whitespace-nowrap">
                      <span className="font-mono text-[13px] font-semibold text-indigo-700 group-hover/row:text-indigo-900 transition-colors">
                        {r.contract_no}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 align-top tabular-nums text-[13px] whitespace-nowrap text-zinc-700">
                      {formatDate(r.signedDate)}
                    </td>
                    <td className="px-4 py-3.5 align-top max-w-[260px]">
                      <p className="text-[14px] font-semibold text-zinc-900 leading-snug line-clamp-2">
                        {r.partner}
                      </p>
                      {r.brand &&
                  <p className="mt-0.5 text-[12px] text-zinc-500 truncate">
                          {r.brand}
                        </p>
                  }
                    </td>
                    <td className="px-4 py-3.5 align-top text-[13px] text-zinc-700">
                      {r.field}
                    </td>
                    <td className="px-4 py-3.5 align-top text-[13px]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-[10px] font-bold inline-flex items-center justify-center shrink-0">
                          {r.assignee.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="text-zinc-700">{r.assignee}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 align-top text-right tabular-nums whitespace-nowrap">
                      {r.value == null ?
                  <span className="text-zinc-400 italic text-xs">
                          Chưa có
                        </span> :
                  r.value === 0 ?
                  <span className="text-zinc-500 text-xs">Chưa tính</span> :

                  <span className="font-semibold text-zinc-900 text-[13px]">
                          {formatCurrency(r.value)}
                        </span>
                  }
                    </td>
                    <td className="px-4 py-3.5 align-top whitespace-nowrap">
                      <p className="text-zinc-700 tabular-nums text-[12px]">
                        {formatDate(r.startDate)}
                      </p>
                      <p className="text-zinc-500 tabular-nums text-[11px]">
                        → {formatDate(r.endDate)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <StatusBadge
                    tone={
                    r.gcnStatus === 'final_printed' ?
                    'success' :
                    r.gcnStatus === 'test_printed' ?
                    'warning' :
                    r.gcnStatus === 'draft' ?
                    'neutral' :
                    'danger'
                    }
                    dot>
                    
                        {GCN_STATUS_LABEL[r.gcnStatus]}
                      </StatusBadge>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }
      </ContentCard>

      {/* Section 4 — Hợp đồng chưa ký / chờ xử lý */}
      <ContentCard
        title="Hợp đồng chưa ký / chờ xử lý"
        description="Hồ sơ đang tồn — biết đang thiếu bước gì và ai phụ trách."
        padded={false}
        accent
        actions={
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<EyeIcon className="h-3.5 w-3.5" />}
          onClick={() => onNavigate('contracts.list')}>
          
            Xem tất cả
          </Button>
        }>
        
        {/* Category strip */}
        <div className="flex flex-wrap gap-1.5 px-5 py-3 border-b border-zinc-100/80 bg-zinc-50/40">
          {(
          Object.keys(PENDING_CATEGORY_LABEL) as Array<
            keyof typeof PENDING_CATEGORY_LABEL>).

          map((k) => {
            const count = filteredPending.filter((r) => r.category === k).length;
            return (
              <span
                key={k}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ring-1 ring-inset ${count > 0 ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/15' : 'bg-zinc-100 text-zinc-500 ring-zinc-900/5'}`}>
                
                <span
                  className={`h-1.5 w-1.5 rounded-full ${count > 0 ? 'bg-indigo-500' : 'bg-zinc-300'}`} />
                
                {PENDING_CATEGORY_LABEL[k]}
                <span className="font-bold tabular-nums">{count}</span>
              </span>);

          })}
        </div>

        {filteredPending.length === 0 ?
        <EmptyState
          title="Không có hồ sơ nào đang chờ xử lý"
          description="Tốt — workspace đang sạch."
          icon={<CheckCircle2Icon className="h-5 w-5" />} /> :


        <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-b from-amber-50/30 via-zinc-50 to-zinc-50/30 border-b border-zinc-200">
                  <Th>Đơn vị / Bảng hiệu</Th>
                  <Th>Lĩnh vực</Th>
                  <Th>Người phụ trách</Th>
                  <Th>Ngày tạo</Th>
                  <Th align="right">Số ngày tồn</Th>
                  <Th>Thiếu bước</Th>
                  <Th>Ưu tiên</Th>
                  <th className="w-10 pr-3" />
                </tr>
              </thead>
              <tbody>
                {filteredPending.map((p) => {
                const priority = getPendingPriority(p.daysStuck);
                return (
                  <tr
                    key={p.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-amber-50/20 transition-colors">
                    
                      <td className="px-4 py-3.5 align-top max-w-[260px]">
                        <p className="text-[14px] font-semibold text-zinc-900 leading-snug line-clamp-2">
                          {p.contract.don_vi_ten}
                        </p>
                        {p.contract.ten_bang_hieu &&
                      <p className="mt-0.5 text-[12px] text-zinc-500 truncate">
                            {p.contract.ten_bang_hieu}
                          </p>
                      }
                      </td>
                      <td className="px-4 py-3.5 align-top text-[13px] text-zinc-700">
                        {p.contract.linh_vuc_hien_thi}
                      </td>
                      <td className="px-4 py-3.5 align-top text-[13px]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-[10px] font-bold inline-flex items-center justify-center shrink-0">
                            {p.assignee.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="text-zinc-700">{p.assignee}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-top tabular-nums text-[13px] whitespace-nowrap text-zinc-700">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 align-top text-right tabular-nums whitespace-nowrap text-[13px]">
                        <span
                        className={`font-semibold ${p.daysStuck > 14 ? 'text-rose-700' : p.daysStuck >= 7 ? 'text-amber-700' : 'text-zinc-700'}`}>
                        
                          {p.daysStuck} ngày
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-top text-[13px] max-w-[220px]">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/15">
                          {PENDING_CATEGORY_LABEL[p.category]}
                        </span>
                        <p className="mt-1 text-[11.5px] text-zinc-500 leading-snug line-clamp-1">
                          {p.missingStep}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <StatusBadge tone={priority.tone} dot>
                          {priority.label}
                        </StatusBadge>
                      </td>
                      <td className="pr-3 pl-1 align-top text-right">
                        <RowActionsMenu
                        actions={[
                        {
                          label: 'Mở hồ sơ',
                          icon: <EyeIcon className="h-4 w-4" />,
                          onClick: () => onNavigate('contracts.list')
                        },
                        {
                          label: 'Bổ sung thông tin',
                          icon: <FilePlusIcon className="h-4 w-4" />,
                          onClick: () => onNavigate('contracts.create')
                        },
                        {
                          label: 'Gửi nhắc xử lý',
                          icon: <BellRingIcon className="h-4 w-4" />,
                          onClick: () => {}
                        }]
                        } />
                      
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }
      </ContentCard>

      {/* Section 5 — Hợp đồng sắp hết hạn cần tái ký */}
      <ContentCard
        title="Hợp đồng sắp hết hạn cần tái ký"
        description="Ưu tiên xử lý theo mức độ khẩn cấp."
        padded={false}
        accent
        actions={
        <Tabs
          tabs={EXPIRING_FILTER_TABS}
          value={expiringScope}
          onChange={setExpiringScope} />

        }>
        
        {filteredExpiring.length === 0 ?
        <EmptyState
          title="Không có hợp đồng sắp hết hạn"
          description="Thử mở rộng khoảng thời gian."
          icon={<XCircleIcon className="h-5 w-5" />} /> :


        <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-b from-rose-50/30 via-zinc-50 to-zinc-50/30 border-b border-zinc-200">
                  <Th>Số hợp đồng</Th>
                  <Th>Đơn vị</Th>
                  <Th>Ngày hết hạn</Th>
                  <Th align="right">Còn lại</Th>
                  <Th align="right">Giá trị</Th>
                  <Th>Người phụ trách</Th>
                  <Th>Trạng thái tái ký</Th>
                  <Th>Ưu tiên</Th>
                  <th className="w-10 pr-3" />
                </tr>
              </thead>
              <tbody>
                {filteredExpiring.map((r, i) => {
                const priority =
                r.days_left <= 7 ?
                {
                  label: 'Khẩn cấp',
                  tone: 'danger' as const
                } :
                r.days_left <= 30 ?
                {
                  label: 'Cao',
                  tone: 'warning' as const
                } :
                {
                  label: 'Theo dõi',
                  tone: 'info' as const
                };
                const assignee = ['Tuấn', 'Admin', 'Nhân viên 1'][i % 3];
                return (
                  <tr
                    key={r.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-rose-50/20 transition-colors">
                    
                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <span className="font-mono text-[13px] font-semibold text-indigo-700">
                          {r.contract_no}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-top max-w-[280px]">
                        <p className="text-[14px] font-semibold text-zinc-900 leading-snug line-clamp-2">
                          {r.partner}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 align-top tabular-nums text-[13px] whitespace-nowrap text-zinc-700">
                        {formatDate(r.expire_date)}
                      </td>
                      <td className="px-4 py-3.5 align-top text-right tabular-nums whitespace-nowrap text-[13px]">
                        <span
                        className={`font-semibold ${r.days_left <= 7 ? 'text-rose-700' : r.days_left <= 30 ? 'text-amber-700' : 'text-zinc-700'}`}>
                        
                          {r.days_left} ngày
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-top text-right tabular-nums whitespace-nowrap">
                        <span className="font-semibold text-zinc-900 text-[13px]">
                          {formatCurrency(r.value)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-top text-[13px]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-[10px] font-bold inline-flex items-center justify-center shrink-0">
                            {assignee.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="text-zinc-700">{assignee}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <StatusBadge tone="orange" dot>
                          Chờ tái ký
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <StatusBadge tone={priority.tone} dot>
                          {priority.label}
                        </StatusBadge>
                      </td>
                      <td className="pr-3 pl-1 align-top text-right">
                        <RowActionsMenu
                        actions={[
                        {
                          label: 'Xem hợp đồng',
                          icon: <EyeIcon className="h-4 w-4" />,
                          onClick: () => onNavigate('contracts.list')
                        },
                        {
                          label: 'Tạo hợp đồng tái ký',
                          icon: <RotateCcwIcon className="h-4 w-4" />,
                          onClick: () => onNavigate('contracts.create')
                        },
                        {
                          label: 'Gửi nhắc xử lý',
                          icon: <BellRingIcon className="h-4 w-4" />,
                          onClick: () => {}
                        },
                        {
                          label: 'Xuất dòng này',
                          icon: <DownloadIcon className="h-4 w-4" />,
                          onClick: () => setExportOpen(true)
                        }]
                        } />
                      
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }
      </ContentCard>

      {/* Section 6 — Doanh thu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ContentCard
          title="Doanh thu theo năm"
          description="Đơn vị: tỷ VND · 2026 đang là dữ liệu lũy kế đến hôm nay"
          className="lg:col-span-2"
          accent>
          
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart
                data={REVENUE_BY_YEAR_3Y.map((y) => ({
                  ...y,
                  revenueBn: y.revenue == null ? 0 : y.revenue / 1000000000,
                  isNull: y.revenue == null
                }))}
                margin={{
                  top: 10,
                  right: 16,
                  left: -10,
                  bottom: 0
                }}
                barCategoryGap="35%"
                onMouseLeave={() => setHoverIdx(null)}>
                
                <defs>
                  <linearGradient id="rep2BarFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0.85} />
                    
                  </linearGradient>
                  <linearGradient
                    id="rep2BarFillHover"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient
                    id="rep2BarFillPrev"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    
                    <stop offset="0%" stopColor="#d4d4d8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a1a1aa" stopOpacity={1} />
                  </linearGradient>
                  <pattern
                    id="rep2NullPattern"
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                    patternTransform="rotate(45)">
                    
                    <rect width="6" height="6" fill="#f4f4f5" />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="6"
                      stroke="#d4d4d8"
                      strokeWidth="2" />
                    
                  </pattern>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e4e4e7"
                  vertical={false} />
                
                <XAxis
                  dataKey="year"
                  stroke="#a1a1aa"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={4} />
                
                <YAxis
                  stroke="#a1a1aa"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-4} />
                
                <Tooltip
                  cursor={{
                    fill: 'rgba(99,102,241,0.06)'
                  }}
                  contentStyle={{
                    border: 'none',
                    borderRadius: 10,
                    background: 'rgba(15, 15, 25, 0.92)',
                    color: '#fff',
                    fontSize: 12,
                    padding: '8px 12px',
                    boxShadow: '0 10px 30px rgba(15,15,25,0.25)'
                  }}
                  labelStyle={{
                    color: '#a5b4fc',
                    fontWeight: 600,
                    marginBottom: 2
                  }}
                  itemStyle={{
                    color: '#fff'
                  }}
                  formatter={(_v: number, _n, p) => {
                    const d: any = p?.payload;
                    if (!d || d.isNull) return ['Chưa có dữ liệu', 'Doanh thu'];
                    return [
                    `${d.revenueBn.toLocaleString('vi-VN', {
                      maximumFractionDigits: 2
                    })} tỷ`,
                    'Doanh thu'];

                  }} />
                
                <Bar
                  dataKey="revenueBn"
                  radius={[6, 6, 0, 0]}
                  onMouseEnter={(_, idx) => setHoverIdx(idx)}
                  minPointSize={4}>
                  
                  {REVENUE_BY_YEAR_3Y.map((y, i) => {
                    if (y.revenue == null)
                    return <Cell key={i} fill="url(#rep2NullPattern)" />;
                    if (i === REVENUE_BY_YEAR_3Y.length - 1)
                    return (
                      <Cell
                        key={i}
                        fill={
                        hoverIdx === i ?
                        'url(#rep2BarFillHover)' :
                        'url(#rep2BarFill)'
                        } />);


                    return <Cell key={i} fill="url(#rep2BarFillPrev)" />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-[11px] text-zinc-500 leading-relaxed border-t border-zinc-100 pt-3">
            2024 chưa có dữ liệu tiền (cột pattern gạch). 2026 là dữ liệu lũy kế
            đến hôm nay.
          </p>
        </ContentCard>

        <ContentCard
          title="Tỷ lệ & trung bình"
          description="Số hợp đồng và giá trị trung bình"
          accent>
          
          <div className="space-y-4">
            <YearStat
              year="2026"
              count={REPORT_STATS.contracts2026}
              revenue={REPORT_STATS.revenue2026}
              tone="indigo"
              note="Lũy kế" />
            
            <YearStat
              year="2025"
              count={REPORT_STATS.contracts2025}
              revenue={REPORT_STATS.revenue2025}
              tone="emerald" />
            
            <YearStat
              year="2024"
              count={136}
              revenue={null}
              tone="neutral"
              note="Chưa có dữ liệu tiền" />
            
          </div>
        </ContentCard>
      </div>

      {/* Section 7 — GCN Report */}
      <ContentCard
        title="Báo cáo GCN"
        description="Trạng thái cấp số & in giấy chứng nhận."
        padded={false}
        accent
        actions={
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<EyeIcon className="h-3.5 w-3.5" />}
          onClick={() => onNavigate('contracts.gcn')}>
          
            Xem tất cả GCN
          </Button>
        }>
        
        {/* GCN metric strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-5 py-4 border-b border-zinc-100/80 bg-zinc-50/40">
          <SummaryStat
            label="Bản nháp"
            value={formatNumber(REPORT_STATS.gcnDraft)}
            tone="amber" />
          
          <SummaryStat
            label="In thử"
            value={formatNumber(REPORT_STATS.gcnTestPrinted)}
            tone="cyan" />
          
          <SummaryStat
            label="In chính thức"
            value={formatNumber(REPORT_STATS.gcnFinalPrinted)}
            tone="emerald" />
          
          <SummaryStat
            label="Chưa cấp số"
            value={formatNumber(REPORT_STATS.gcnDraft)}
            tone="rose" />
          
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-b from-violet-50/30 via-zinc-50 to-zinc-50/30 border-b border-zinc-200">
                <Th>Số GCN</Th>
                <Th>Số hợp đồng</Th>
                <Th>Đơn vị</Th>
                <Th>Trạng thái</Th>
                <Th align="right">Số lần in</Th>
                <Th>Ngày in</Th>
              </tr>
            </thead>
            <tbody>
              {certRows.map((c) =>
              <tr
                key={c.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-violet-50/20 transition-colors cursor-pointer"
                onClick={() => onNavigate('contracts.gcn')}>
                
                  <td className="px-4 py-3.5 align-top whitespace-nowrap">
                    {c.certificate_no ?
                  <span className="font-mono text-[13px] font-semibold text-violet-700">
                        {c.certificate_no}
                      </span> :

                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/15">
                        Chưa cấp số
                      </span>
                  }
                  </td>
                  <td className="px-4 py-3.5 align-top whitespace-nowrap">
                    <span className="font-mono text-[13px] font-medium text-indigo-700">
                      {c.contract_no}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top max-w-[260px]">
                    <p className="text-[13px] font-semibold text-zinc-900 leading-snug line-clamp-2">
                      {c.organization_name}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <StatusBadge
                    tone={
                    c.status === 'final_printed' ?
                    'success' :
                    c.status === 'test_printed' ?
                    'warning' :
                    'neutral'
                    }
                    dot>
                    
                      {GCN_STATUS_LABEL[c.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3.5 align-top text-right tabular-nums whitespace-nowrap">
                    {c.print_count > 0 ?
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/15">
                        <PrinterIcon className="h-3 w-3" />
                        {c.print_count} lần
                      </span> :

                  <span className="text-[12px] text-zinc-400 italic">
                        Chưa in
                      </span>
                  }
                  </td>
                  <td className="px-4 py-3.5 align-top tabular-nums text-[13px] whitespace-nowrap text-zinc-700">
                    {c.printed_at ? formatDate(c.printed_at.slice(0, 10)) : '—'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ContentCard>

      <ExportReportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        defaultType={
        reportType === 'overview' ?
        'summary' :
        reportType === 'employee' ?
        'employee' :
        reportType === 'signed' ?
        'signed' :
        reportType === 'pending' ?
        'pending' :
        reportType === 'expiring' ?
        'expiring' :
        reportType === 'gcn' ?
        'gcn' :
        'revenue'
        }
        timeLabel={
        TIME_OPTIONS.find((t) => t.value === time)?.label ?? 'Năm này'
        } />
      
    </Page>);

}
function Th({
  children,
  align = 'left'



}: {children: React.ReactNode;align?: 'left' | 'right' | 'center';}) {
  return (
    <th
      className={`px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700 ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}>
      
      {children}
    </th>);

}
function SummaryStat({
  label,
  value,
  suffix,
  highlight,
  tone






}: {label: string;value: string;suffix?: string;highlight?: boolean;tone?: 'amber' | 'cyan' | 'emerald' | 'rose';}) {
  const dotColor = tone ?
  tone === 'amber' ?
  'bg-amber-500' :
  tone === 'cyan' ?
  'bg-cyan-500' :
  tone === 'emerald' ?
  'bg-emerald-500' :
  'bg-rose-500' :
  'bg-indigo-500';
  return (
    <div>
      <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        {label}
      </span>
      <p
        className={`mt-1 text-xl font-semibold tracking-tight tabular-nums ${highlight ? 'text-emerald-700' : 'text-zinc-900'}`}>
        
        {value}
        {suffix &&
        <span className="text-xs font-normal text-zinc-500 ml-1">
            {suffix}
          </span>
        }
      </p>
    </div>);

}
function YearStat({
  year,
  count,
  revenue,
  tone,
  note






}: {year: string;count: number;revenue: number | null;tone: 'indigo' | 'emerald' | 'neutral';note?: string;}) {
  const dotColor =
  tone === 'indigo' ?
  'bg-indigo-500' :
  tone === 'emerald' ?
  'bg-emerald-500' :
  'bg-zinc-400';
  const avg = revenue && count > 0 ? Math.round(revenue / count) : null;
  return (
    <div className="rounded-xl ring-1 ring-zinc-900/[0.06] bg-white p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
          Năm {year}
        </span>
        {note &&
        <span className="text-[10px] text-zinc-400 italic">{note}</span>
        }
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Hợp đồng
          </p>
          <p className="text-base font-semibold text-zinc-900 tabular-nums">
            {formatNumber(count)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
            TB / HĐ
          </p>
          <p className="text-base font-semibold text-zinc-900 tabular-nums">
            {avg ? formatCurrency(avg) : '—'}
          </p>
        </div>
      </div>
    </div>);

}