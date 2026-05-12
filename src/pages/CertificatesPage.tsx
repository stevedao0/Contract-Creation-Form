import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangleIcon,
  AwardIcon,
  CheckCircle2Icon,
  EyeIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HashIcon,
  PrinterIcon,
  RefreshCwIcon,
  XCircleIcon } from
'lucide-react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { MetricStrip } from '../components/app-ui/MetricCard';
import { Button } from '../components/app-ui/Button';
import { Select } from '../components/app-ui/Select';
import { SearchBox } from '../components/app-ui/SearchBox';
import { StatusBadge } from '../components/app-ui/StatusBadge';
import { Checkbox } from '../components/app-ui/Checkbox';
import { RowActionsMenu } from '../components/app-ui/RowActionsMenu';
import { FilterBar, FilterField } from '../components/app-ui/FilterBar';
import { Pagination } from '../components/app-ui/Pagination';
import { TableSkeleton } from '../components/app-ui/TableSkeleton';
import { EmptyState } from '../components/app-ui/EmptyState';
import { SummaryHero } from '../components/app-ui/SummaryHero';
import { CertificateQuickView } from '../components/app-ui/CertificateQuickView';
import { CertificatePaperPreview } from '../modules/certificates/CertificatePaperPreview';
import { GCN_LOCKED_OFFSET } from '../modules/certificates/certificateLayoutLocked';
import type { CertificatePreviewData } from '../modules/certificates/certificateTypes';
import {
  CERTIFICATE_STATUS_LABEL,
  CertificateRecord,
  CertificateStatus } from
'../data/certificateRecords';
import {
  getCertificate,
  getCertificateContextDryRun,
  listCertificates,
  type ApiCertificateRecord,
  type CertificatePreviewContext,
  type CertificatesSummary } from
'../lib/certificatesClient';
import { formatDate, formatNumber } from '../lib/format';
import { RouteKey } from '../data/routes';

const TOKEN_KEY = 'vcpmc_new_app_access_token';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Bản nháp' },
  { value: 'test_printed', label: 'In thử' },
  { value: 'final_printed', label: 'In chính thức' },
];

const YEAR_OPTIONS = [
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
];

const HAS_NUMBER_OPTIONS = [
  { value: 'has', label: 'Đã có số GCN' },
  { value: 'missing', label: 'Chưa cấp số' },
];

const EMPTY_SUMMARY: CertificatesSummary = {
  total: 0,
  draft: 0,
  test_printed: 0,
  final_printed: 0,
  missing_number: 0,
  printed_multiple: 0,
};

function asStatus(value: string): CertificateStatus {
  if (value === 'test_printed' || value === 'final_printed') return value;
  return 'draft';
}

function mapApiRecord(row: ApiCertificateRecord): CertificateRecord {
  return {
    id: row.id,
    certificate_id: row.certificate_id,
    contract_id: row.contract_id,
    certificate_no: row.certificate_no,
    certificate_issue_date: row.certificate_issue_date,
    status: asStatus(row.status),
    organization_name: row.organization_name || 'Chưa có tên đơn vị',
    business_registration_no: row.business_registration_no,
    business_sign_name: row.business_sign_name,
    business_location: row.business_location,
    address: row.address || row.business_location || '',
    contract_no: row.contract_no || '',
    effective_from: row.effective_from || '',
    effective_to: row.effective_to || '',
    gcn_scope_col_1_text: row.gcn_scope_col_1_text,
    gcn_scope_col_2_text: row.gcn_scope_col_2_text,
    gcn_scope_col_3_text: row.gcn_scope_col_3_text,
    offset_x_mm: row.offset_x_mm,
    offset_y_mm: row.offset_y_mm,
    created_at: row.created_at || '',
    printed_at: row.printed_at,
    printed_by: row.printed_by,
    print_count: row.print_count,
    has_qr_image: row.has_qr_image,
  };
}

function contextToPreviewData(context: CertificatePreviewContext, offsetX: number, offsetY: number): CertificatePreviewData {
  return {
    certificate_no: context.certificate_no || '',
    certificate_issue_date: context.certificate_issue_date || '',
    certificate_issue_day: context.certificate_issue_day || '',
    certificate_issue_month: context.certificate_issue_month || '',
    certificate_issue_year: context.certificate_issue_year || '',
    organization_name: context.organization_name || '',
    business_registration_no: context.business_registration_no || '',
    address: context.address || '',
    business_sign_name: context.business_sign_name || '',
    business_location: context.business_location || context.address || '',
    contract_no: context.contract_no || '',
    effective_from: context.effective_from || '',
    effective_to: context.effective_to || '',
    gcn_scope_col_1_text: context.gcn_scope_col_1_text || '',
    gcn_scope_col_2_text: context.gcn_scope_col_2_text || '',
    gcn_scope_col_3_text: context.gcn_scope_col_3_text || '',
    qr_image_data: context.qr_image_data || '',
    offset_x_mm: offsetX,
    offset_y_mm: offsetY,
  };
}

export function CertificatesPage({
  onNavigate: _onNavigate
}: {onNavigate: (k: RouteKey) => void;}) {
  const [records, setRecords] = useState<CertificateRecord[]>([]);
  const [summary, setSummary] = useState<CertificatesSummary>(EMPTY_SUMMARY);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<CertificateStatus | ''>('');
  const [yearFilter, setYearFilter] = useState('');
  const [hasNumberFilter, setHasNumberFilter] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [quickView, setQuickView] = useState<CertificateRecord | null>(null);
  const [previewContext, setPreviewContext] = useState<CertificatePreviewContext | null>(null);
  const [contextError, setContextError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [previewOffsetX, setPreviewOffsetX] = useState(GCN_LOCKED_OFFSET.defaultXmm);
  const [previewOffsetY, setPreviewOffsetY] = useState(GCN_LOCKED_OFFSET.defaultYmm);
  const [showPreviewSafeArea, setShowPreviewSafeArea] = useState(true);

  const hasActiveFilter = !!keyword || !!statusFilter || !!yearFilter || !!hasNumberFilter;

  useEffect(() => {
    let cancelled = false;
    async function fetchCertificates() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoadError('Chưa đăng nhập hoặc token không còn trong trình duyệt.');
        return;
      }
      setLoading(true);
      setLoadError('');
      try {
        const response = await listCertificates(token, {
          page,
          page_size: pageSize,
          q: keyword.trim() || undefined,
          status: statusFilter || undefined,
          year: yearFilter || undefined,
        });
        if (cancelled) return;
        setRecords(response.items.map(mapApiRecord));
        setSummary(response.summary);
        setTotal(response.total);
        setTotalPages(response.total_pages);
        setSelected(new Set());
      } catch (error: any) {
        if (!cancelled) {
          setRecords([]);
          setTotal(0);
          setTotalPages(0);
          setLoadError(String(error?.message || 'Không tải được danh sách GCN.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchCertificates();
    return () => {
      cancelled = true;
    };
  }, [keyword, statusFilter, yearFilter, page, pageSize, refreshNonce]);

  const displayRecords = useMemo(() => {
    if (hasNumberFilter === 'has') return records.filter((record) => !!record.certificate_no);
    if (hasNumberFilter === 'missing') return records.filter((record) => !record.certificate_no);
    return records;
  }, [records, hasNumberFilter]);

  const rangeFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeTo = total === 0 ? 0 : Math.min(total, (page - 1) * pageSize + displayRecords.length);
  const visibleIds = displayRecords.map((record) => record.id);
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someSelected = !allSelected && visibleIds.some((id) => selected.has(id));

  const previewCertificate = useMemo<CertificatePreviewData>(() => {
    if (previewContext) return contextToPreviewData(previewContext, previewOffsetX, previewOffsetY);
    return {
      certificate_no: '0137/2026.GCN_KA',
      certificate_issue_date: '2026-05-10',
      organization_name: 'CONG TY TNHH DEMO GCN CLONE ONLY',
      business_registration_no: '0312345678',
      address: 'Dia chi don vi demo tren DB clone',
      business_sign_name: 'KARAOKE DEMO LOCKED LAYOUT',
      business_location: 'Dia diem su dung demo tren form in san',
      contract_no: 'CLONE-NEWAPP-GCN-P0-PREVIEW',
      effective_from: '2026-05-10',
      effective_to: '2027-05-09',
      gcn_scope_col_1_text: 'Phong 101\nPhong 102\nPhong 103',
      gcn_scope_col_2_text: '3 phong',
      gcn_scope_col_3_text: 'Karaoke\n(phong)',
      offset_x_mm: previewOffsetX,
      offset_y_mm: previewOffsetY,
    };
  }, [previewContext, previewOffsetX, previewOffsetY]);

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(visibleIds));
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setKeyword('');
    setStatusFilter('');
    setYearFilter('');
    setHasNumberFilter('');
    setPage(1);
  };

  const openQuickView = async (record: CertificateRecord) => {
    setQuickView(record);
    setContextError('');
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const [detail, contextResponse] = await Promise.all([
        getCertificate(token, record.id),
        getCertificateContextDryRun(token, record.id),
      ]);
      setQuickView(mapApiRecord(detail.certificate));
      setPreviewContext(contextResponse.context);
      setPreviewOffsetX(Number(contextResponse.context.offset_x_mm || 0));
      setPreviewOffsetY(Number(contextResponse.context.offset_y_mm || 0));
    } catch (error: any) {
      setContextError(String(error?.message || 'Không tải được context dry-run.'));
    }
  };

  const statusTone = (record: CertificateRecord) =>
    record.status === 'final_printed' ? 'success' : record.status === 'test_printed' ? 'warning' : 'neutral';

  return (
    <Page>
      <PageHeader
        breadcrumb="/bg/contracts/certificates"
        title="Quản lý giấy chứng nhận"
        description="Đọc GCN từ DB clone. Pha này chưa cấp số, chưa in, chưa lưu offset."
        actions={
          <>
            <Button
              variant="secondary"
              leftIcon={<RefreshCwIcon className="h-4 w-4" />}
              onClick={() => setRefreshNonce((value) => value + 1)}
              disabled={loading}>
              Làm mới
            </Button>
            <Button variant="secondary" leftIcon={<FileSpreadsheetIcon className="h-4 w-4" />} disabled title="GCN-P1 read-only">
              Xuất Excel đang khóa
            </Button>
            <Button variant="secondary" leftIcon={<PrinterIcon className="h-4 w-4" />} disabled title="GCN-P1 read-only">
              In hàng loạt đang khóa
            </Button>
            <Button variant="primary" leftIcon={<AwardIcon className="h-4 w-4" />} disabled title="GCN-P1 read-only">
              Tạo GCN đang khóa
            </Button>
          </>
        } />

      <SummaryHero
        label="Operations Summary · Giấy chứng nhận"
        title="Tình trạng cấp & in giấy chứng nhận"
        description="Số liệu đọc từ certificate_records trên DB clone, không ghi dữ liệu."
        stats={[
          { label: 'Tổng GCN', value: summary.total, tone: 'indigo' },
          { label: 'Bản nháp', value: summary.draft, tone: 'amber' },
          { label: 'In thử', value: summary.test_printed, tone: 'cyan' },
          { label: 'In chính thức', value: summary.final_printed, tone: 'emerald' },
          { label: 'Chưa cấp số', value: summary.missing_number, tone: 'rose' },
        ]} />

      <MetricStrip
        items={[
          { label: 'Bản nháp', value: formatNumber(summary.draft), tone: 'amber', icon: <FileTextIcon className="h-4 w-4" />, hint: 'Đọc từ DB clone' },
          { label: 'In thử', value: formatNumber(summary.test_printed), tone: 'cyan', icon: <PrinterIcon className="h-4 w-4" />, hint: 'Chỉ hiển thị trạng thái cũ' },
          { label: 'In chính thức', value: formatNumber(summary.final_printed), tone: 'emerald', icon: <CheckCircle2Icon className="h-4 w-4" />, hint: 'Không kích hoạt in' },
          { label: 'Đã in nhiều lần', value: formatNumber(summary.printed_multiple), tone: 'violet', icon: <PrinterIcon className="h-4 w-4" />, hint: 'print_count > 1' },
          { label: 'Chưa cấp số', value: formatNumber(summary.missing_number), tone: 'rose', icon: <AlertTriangleIcon className="h-4 w-4" />, hint: 'Không tự cấp số' },
        ]} />

      <ContentCard
        title={previewContext ? 'Context dry-run only - chưa ghi DB, chưa in, chưa tạo QR.' : 'GCN preview shell only - chưa tạo GCN, chưa ghi DB, chưa in.'}
        description="Preview dùng hằng số layout đã khóa từ app cũ. Offset chỉ dịch trên màn hình, không lưu DB và không gọi in."
        accent>
        <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="rounded-lg bg-amber-50/70 p-3 ring-1 ring-amber-200">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-800">
                Locked layout
              </p>
              <p className="mt-1 text-sm leading-5 text-amber-900">
                GCN dùng giấy in sẵn. Không auto-center, không redesign, không đổi offset khóa.
              </p>
            </div>
            {previewContext &&
              <div className="rounded-lg bg-emerald-50/70 p-3 ring-1 ring-emerald-200">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800">
                  Context dry-run
                </p>
                <p className="mt-1 text-sm leading-5 text-emerald-900">
                  Context dry-run only - chưa ghi DB, chưa in, chưa tạo QR.
                </p>
                <p className="mt-1 text-xs text-emerald-800">
                  Nguồn: {previewContext.mode === 'existing_certificate' ? 'certificate_records' : 'contract_records'}
                </p>
                {!previewContext.certificate_no &&
                  <p className="mt-1 text-xs font-medium text-amber-800">
                    Chưa cấp số GCN: preview để trống số, không tự sinh số.
                  </p>
                }
              </div>
            }
            {contextError &&
              <div className="rounded-lg bg-rose-50/70 p-3 text-sm text-rose-700 ring-1 ring-rose-200">
                {contextError}
              </div>
            }
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
                Dịch ngang preview (mm)
                <input
                  className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
                  type="number"
                  step={String(GCN_LOCKED_OFFSET.stepMm)}
                  value={String(previewOffsetX)}
                  onChange={(event) => setPreviewOffsetX(Number(event.target.value || 0))}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
                Dịch dọc preview (mm)
                <input
                  className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
                  type="number"
                  step={String(GCN_LOCKED_OFFSET.stepMm)}
                  value={String(previewOffsetY)}
                  onChange={(event) => setPreviewOffsetY(Number(event.target.value || 0))}
                />
              </label>
            </div>
            <Checkbox checked={showPreviewSafeArea} onChange={setShowPreviewSafeArea} label="Hiện khung canh" />
            <Button variant="secondary" leftIcon={<PrinterIcon className="h-4 w-4" />} disabled title="GCN-P1 read-only">
              In đang khóa
            </Button>
          </div>
          <CertificatePaperPreview certificate={previewCertificate} showSafeArea={showPreviewSafeArea} showCoordinates />
        </div>
      </ContentCard>

      <FilterBar
        hasActive={hasActiveFilter}
        onClear={clearFilters}
        resultSummary={
          <span>
            Hiển thị <span className="font-semibold text-zinc-900 tabular-nums">{rangeFrom}-{rangeTo}</span> trong{' '}
            <span className="font-semibold text-zinc-900 tabular-nums">{formatNumber(total)}</span> GCN
          </span>
        }>
        <FilterField label="Tìm kiếm" width="flex-1 min-w-[280px]">
          <SearchBox
            value={keyword}
            onChange={(value) => {
              setKeyword(value);
              setPage(1);
            }}
            placeholder="Tìm số GCN, số hợp đồng, đơn vị, bảng hiệu..."
          />
        </FilterField>
        <FilterField label="Trạng thái" width="w-44">
          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value as CertificateStatus | '');
              setPage(1);
            }}
            options={STATUS_OPTIONS}
            placeholder="Tất cả"
          />
        </FilterField>
        <FilterField label="Năm" width="w-32">
          <Select
            value={yearFilter}
            onChange={(value) => {
              setYearFilter(value);
              setPage(1);
            }}
            options={YEAR_OPTIONS}
            placeholder="Tất cả"
          />
        </FilterField>
        <FilterField label="Tình trạng số" width="w-44">
          <Select
            value={hasNumberFilter}
            onChange={(value) => {
              setHasNumberFilter(value);
              setPage(1);
            }}
            options={HAS_NUMBER_OPTIONS}
            placeholder="Tất cả"
          />
        </FilterField>
      </FilterBar>

      <ContentCard padded={false}>
        {selected.size > 0 &&
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
            Đã chọn {selected.size} GCN. Các thao tác in/xuất/cấp số đang khóa trong pha read-only.
            <Button variant="ghost" size="sm" className="ml-2" onClick={() => setSelected(new Set())}>
              Bỏ chọn
            </Button>
          </div>
        }

        {loadError &&
          <div className="border-b border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        }

        {loading ?
          <TableSkeleton rows={8} cols={7} /> :
          displayRecords.length === 0 ?
            <EmptyState
              title={total === 0 ? 'Chưa có GCN trong DB clone hoặc chưa bật tạo GCN.' : 'Không tìm thấy GCN phù hợp'}
              description={total === 0 ? 'Backend chỉ đọc certificate_records, không tạo bản ghi mới.' : 'Thử điều chỉnh từ khóa hoặc xóa các bộ lọc để xem lại danh sách.'}
              action={<Button variant="secondary" onClick={clearFilters}>Xóa bộ lọc</Button>}
              icon={<XCircleIcon className="h-5 w-5" />}
            /> :
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-b from-violet-50/40 via-zinc-50 to-zinc-50/30 border-b border-zinc-200">
                    <th className="w-10 pl-5 pr-2 py-3.5">
                      <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} ariaLabel="Chọn tất cả" />
                    </th>
                    <Th>Số GCN</Th>
                    <Th>Số hợp đồng</Th>
                    <Th>Đơn vị / Bảng hiệu</Th>
                    <Th>Địa chỉ</Th>
                    <Th>Hiệu lực</Th>
                    <Th>Trạng thái in</Th>
                    <Th align="right">Số lần in</Th>
                    <Th>Ngày tạo / In</Th>
                    <th className="w-10 pr-3" />
                  </tr>
                </thead>
                <tbody>
                  {displayRecords.map((record) => {
                    const isSelected = selected.has(record.id);
                    const hasNumber = !!record.certificate_no;
                    return (
                      <tr
                        key={record.id}
                        onClick={() => openQuickView(record)}
                        className={`group/row relative border-b border-zinc-100 last:border-0 transition-all cursor-pointer ${isSelected ? 'bg-violet-50/60 hover:bg-violet-50/80' : 'hover:bg-violet-50/30 hover:shadow-[inset_0_1px_0_rgba(139,92,246,0.06),inset_0_-1px_0_rgba(139,92,246,0.06)]'}`}>
                        <td className="relative pl-5 pr-2 py-3.5 align-top">
                          <span aria-hidden className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-violet-400 to-indigo-400 transition-opacity ${isSelected ? 'opacity-100 shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'opacity-0 group-hover/row:opacity-90'}`} />
                          <Checkbox checked={isSelected} onChange={() => toggleOne(record.id)} ariaLabel={`Chọn ${record.certificate_no ?? record.contract_no}`} />
                        </td>
                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          {hasNumber ?
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openQuickView(record);
                              }}
                              className="font-mono text-[13px] font-semibold text-violet-700 hover:text-violet-900 group-hover/row:underline underline-offset-[3px] decoration-violet-300/70 decoration-1 transition-colors tracking-tight">
                              {record.certificate_no}
                            </button> :
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/15">
                              <HashIcon className="h-2.5 w-2.5" />
                              Chưa cấp số
                            </span>
                          }
                        </td>
                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          <span className="font-mono text-[13px] font-medium text-indigo-700 group-hover/row:text-indigo-900 transition-colors">
                            {record.contract_no || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 align-top max-w-[280px]">
                          <p className="text-[14px] font-semibold text-zinc-900 leading-snug line-clamp-2" title={record.organization_name}>
                            {record.organization_name}
                          </p>
                          {record.business_sign_name &&
                            <p className="mt-0.5 text-[12px] text-zinc-500 truncate" title={record.business_sign_name}>
                              {record.business_sign_name}
                            </p>
                          }
                        </td>
                        <td className="px-4 py-3.5 align-top max-w-[260px]">
                          <p className="text-[12.5px] text-zinc-600 leading-snug line-clamp-2" title={record.address}>
                            {record.address || '—'}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          <p className="text-zinc-700 tabular-nums text-[13px]">{formatDate(record.effective_from)}</p>
                          <p className="text-zinc-500 tabular-nums text-[12px]">→ {formatDate(record.effective_to)}</p>
                        </td>
                        <td className="px-4 py-3.5 align-top">
                          <StatusBadge tone={statusTone(record)} dot>
                            {CERTIFICATE_STATUS_LABEL[record.status]}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3.5 align-top text-right whitespace-nowrap">
                          {record.print_count > 0 ?
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/15 tabular-nums">
                              <PrinterIcon className="h-3 w-3" />
                              {record.print_count} lần
                            </span> :
                            <span className="text-[12px] text-zinc-400 italic">Chưa in</span>
                          }
                        </td>
                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          <p className="text-zinc-700 tabular-nums text-[13px]">{formatDate(record.created_at.slice(0, 10))}</p>
                          {record.printed_at ?
                            <p className="text-zinc-500 tabular-nums text-[12px]">In: {formatDate(record.printed_at.slice(0, 10))}</p> :
                            <p className="text-zinc-400 text-[12px] italic">Chưa in</p>
                          }
                        </td>
                        <td className="pr-3 pl-1 align-top text-right">
                          <RowActionsMenu
                            actions={[
                              { label: 'Xem chi tiết', icon: <EyeIcon className="h-4 w-4" />, onClick: () => openQuickView(record) },
                              { label: 'Cấp/sửa số GCN đang khóa', icon: <HashIcon className="h-4 w-4" />, onClick: () => {} },
                              { label: 'In đang khóa', icon: <PrinterIcon className="h-4 w-4" />, onClick: () => {} },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        }

        {!loading && displayRecords.length > 0 &&
          <Pagination
            page={page}
            totalPages={Math.max(1, totalPages)}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            total={total}
            rangeFrom={rangeFrom}
            rangeTo={rangeTo}
          />
        }
      </ContentCard>

      <CertificateQuickView record={quickView} onClose={() => setQuickView(null)} />
    </Page>
  );
}

function Th({
  children,
  align = 'left'
}: {children: React.ReactNode;align?: 'left' | 'right' | 'center';}) {
  return (
    <th className={`px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-700 ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}>
      {children}
    </th>
  );
}
