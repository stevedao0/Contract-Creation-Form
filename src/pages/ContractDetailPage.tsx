import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, FileTextIcon, LockIcon, FileDownIcon, CheckCircle2Icon, XCircleIcon, Trash2Icon, AlertTriangleIcon, LoaderIcon } from 'lucide-react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { Button } from '../components/app-ui/Button';
import { EmptyState } from '../components/app-ui/EmptyState';
import { TableSkeleton } from '../components/app-ui/TableSkeleton';
import { StatusBadge } from '../components/app-ui/StatusBadge';
import { Modal } from '../components/app-ui/Modal';
import { formatCurrency, formatDate } from '../lib/format';
import { ApiContractDetail, getContractDetail, exportDocxTextDryRun, type ExportDryRunResult, exportDocxPreview, exportKvcSyntheticPreview, type ExportPreviewResult, getCertificateContextDryRun, type CertificateContextResult, createCertificateDraft, type CertificateDraftCreateResult, deleteContractCloneOnly, type DeleteContractCloneOnlyResult } from '../lib/contractsClient';
import { useAuth } from '../lib/auth';

const TOKEN_KEY = 'vcpmc_new_app_access_token';

function statusTone(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'active' || normalized === 'renewed') return 'success';
  if (normalized === 'expiring' || normalized === 'pending_renewal') return 'warning';
  if (normalized === 'expired') return 'danger';
  return 'neutral';
}

function karaokeCountDisplay(
  value: number | null | undefined,
  mode: string | null | undefined,
  appliesTo: 'PHONG' | 'BOX'
) {
  const normalized = String(mode || '').trim().toUpperCase();
  if (value == null && normalized && normalized !== appliesTo) return 'Không áp dụng';
  return value ?? '-';
}

export function ContractDetailPage({
  contractId,
  onBack,
  onEdit
}: {contractId: number | null;onBack: () => void;onEdit?: (id: number) => void;}) {
  // Auth
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.backendRole?.toLowerCase() === 'admin' || currentUser?.backendRole?.toLowerCase() === 'mod' || currentUser?.backendRole?.toLowerCase() === 'superuser';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState<ApiContractDetail | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportResult, setExportResult] = useState<ExportDryRunResult | null>(null);
  const [exportError, setExportError] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<ExportPreviewResult | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [gcnLoading, setGcnLoading] = useState(false);
  const [gcnResult, setGcnResult] = useState<CertificateContextResult | null>(null);
  const [gcnError, setGcnError] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<CertificateDraftCreateResult | null>(null);
  const [draftError, setDraftError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    loading: boolean;
    result: DeleteContractCloneOnlyResult | null;
  }>({ open: false, loading: false, result: null });

  const isSafeTestRecord = (no: string) => {
    const prefix = ['CLONE-NEWAPP-', 'TEST-NEWAPP-', 'MAKE-HD-', 'OLDAPP-DIRECT-', 'OLDAPP-FLOW-', 'UI-WORD-FALLBACK-', 'SMOKE-', 'MAKE-HD-SMOKE-', 'UI-TEST-', 'DELETE-TEST-'];
    return prefix.some(p => no.toUpperCase().startsWith(p));
  };

  const openDeleteConfirm = () => {
    if (!detail) return;
    setDeleteModal({ open: true, loading: false, result: null });
  };

  const confirmDetailDelete = async () => {
    if (!detail) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      const result = await deleteContractCloneOnly(token, detail.id);
      setDeleteModal((prev) => ({ ...prev, loading: false, result }));
    } catch (err: any) {
      setDeleteModal((prev) => ({
        ...prev,
        loading: false,
        result: {
          ok: false,
          mode: 'error',
          message: String(err?.message || 'Loi khi xoa'),
          write_performed: false,
          contract_id: detail.id,
          contract_no: detail.contract_no,
          deleted_contract_records: 0,
          deleted_certificate_records: 0,
          deleted_related_rows: 0,
          old_db_touched: false,
          blocked_final_certificates: 0,
          admin_delete_any_enabled: false,
          permission_used: null,
          warnings: [],
          errors: [{ field: 'catch', message: String(err?.message || 'Loi khi xoa') }],
        },
      }));
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, loading: false, result: null });
  };

  const handleExportDryRun = async () => {
    if (!detail) return;
    const token = localStorage.getItem('vcpmc_new_app_access_token');
    if (!token) {
      setExportError('Phien dang nhap khong hop le.');
      return;
    }
    setExportLoading(true);
    setExportError('');
    setExportResult(null);
    try {
      const result = await exportDocxTextDryRun(token, detail.id);
      setExportResult(result);
    } catch (err: any) {
      setExportError(String(err?.message || 'Loi khi render thu DOCX.'));
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportPreview = async () => {
    if (!detail) return;
    const token = localStorage.getItem('vcpmc_new_app_access_token');
    if (!token) {
      setPreviewError('Phien dang nhap khong hop le.');
      return;
    }
    setPreviewLoading(true);
    setPreviewError('');
    setPreviewResult(null);
    try {
      const result = await exportDocxPreview(token, detail.id, { include_blocks: true });
      setPreviewResult(result);
    } catch (err: any) {
      setPreviewError(String(err?.message || 'Loi khi tao preview DOCX.'));
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGcnContext = async () => {
    if (!detail) return;
    const token = localStorage.getItem('vcpmc_new_app_access_token');
    if (!token) {
      setGcnError('Phien dang nhap khong hop le.');
      return;
    }
    setGcnLoading(true);
    setGcnError('');
    setGcnResult(null);
    try {
      const result = await getCertificateContextDryRun(token, detail.id);
      setGcnResult(result);
    } catch (err: any) {
      setGcnError(String(err?.message || 'Loi khi lay du lieu GCN.'));
    } finally {
      setGcnLoading(false);
    }
  };

  const handleGcnDraftCreate = async () => {
    if (!detail) return;
    const token = localStorage.getItem('vcpmc_new_app_access_token');
    if (!token) {
      setDraftError('Phien dang nhap khong hop le.');
      return;
    }
    setDraftLoading(true);
    setDraftError('');
    setDraftResult(null);
    try {
      const result = await createCertificateDraft(token, detail.id, { client_confirmation: { clone_only_certificate_draft_confirmed: true } });
      setDraftResult(result);
    } catch (err: any) {
      setDraftError(String(err?.message || 'Loi khi tao GCN nháp.'));
    } finally {
      setDraftLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      if (!contractId) {
        setDetail(null);
        setLoading(false);
        setError('Khong co hop dong duoc chon.');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
          throw new Error('Phien dang nhap khong hop le. Vui long dang nhap lai.');
        }
        const data = await getContractDetail(token, contractId);
        if (cancelled) return;
        setDetail(data);
      } catch (err: any) {
        if (cancelled) return;
        setDetail(null);
        setError(String(err?.message || 'Khong tai duoc chi tiet hop dong.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [contractId]);

  return (
    <Page>
      <PageHeader
        breadcrumb="/bg/contracts/detail"
        title={detail ? `Chi tiet hop dong ${detail.contract_no}` : 'Chi tiet hop dong'}
        description="Read-only tu du lieu tren DB chinh (port 5432)."
        actions={
          <Button variant="secondary" leftIcon={<ArrowLeftIcon className="h-4 w-4" />} onClick={onBack}>
            Quay lai danh sach
          </Button>
        }
      />

      {loading ? (
        <TableSkeleton rows={10} cols={4} />
      ) : error || !detail ? (
        <EmptyState
          title="Khong tai duoc chi tiet hop dong"
          description={error || 'Du lieu khong ton tai hoac khong co quyen truy cap.'}
          icon={<FileTextIcon className="h-5 w-5" />}
          action={
            <Button variant="secondary" onClick={onBack}>
              Quay lai
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <ContentCard>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={statusTone(detail.status)}>{detail.status || 'unknown'}</StatusBadge>
              <span className="text-sm text-zinc-500">Nam hop dong: {detail.contract_year || '-'}</span>
              <span className="text-sm text-zinc-500">Ma: #{detail.id}</span>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">Don vi</p>
                <p className="font-semibold text-zinc-900">{detail.customer.name || '-'}</p>
              </div>
              <div>
                <p className="text-zinc-500">Bang hieu</p>
                <p className="font-semibold text-zinc-900">{detail.customer.signage || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-zinc-500">Dia chi phap ly</p>
                <p className="font-semibold text-zinc-900">{detail.customer.legal_address || '-'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-zinc-500">Dia chi su dung</p>
                <p className="font-semibold text-zinc-900">
                  {detail.customer.usage_address || detail.customer.address || '-'}
                </p>
              </div>
            </div>
          </ContentCard>

          <ContentCard>
            <h3 className="text-sm font-semibold text-zinc-900">Linh vuc va thoi gian</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">Linh vuc hien thi</p>
                <p className="font-semibold text-zinc-900">{detail.domain.display || '-'}</p>
              </div>
              <div>
                <p className="text-zinc-500">Field code</p>
                <p className="font-semibold text-zinc-900">{detail.domain.field_code || '-'}</p>
              </div>
              <div>
                <p className="text-zinc-500">Domain group</p>
                <p className="font-semibold text-zinc-900">{detail.domain.domain_group || '-'}</p>
              </div>
              <div>
                <p className="text-zinc-500">Ngay lap</p>
                <p className="font-semibold text-zinc-900">{formatDate(detail.dates.signed_date || '')}</p>
              </div>
              <div>
                <p className="text-zinc-500">Hieu luc tu</p>
                <p className="font-semibold text-zinc-900">{formatDate(detail.dates.start_date || '')}</p>
              </div>
              <div>
                <p className="text-zinc-500">Hieu luc den</p>
                <p className="font-semibold text-zinc-900">{formatDate(detail.dates.end_date || '')}</p>
              </div>
            </div>
          </ContentCard>

          <ContentCard>
            <h3 className="text-sm font-semibold text-zinc-900">Tai chinh va karaoke</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">Tiền trước GTGT</p>
                <p className="font-semibold text-zinc-900">
                  {detail.financial.amount_before_gtgt == null
                    ? '-'
                    : formatCurrency(detail.financial.amount_before_gtgt)}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">GTGT %</p>
                <p className="font-semibold text-zinc-900">
                  {detail.financial.gtgt_percent ?? '-'}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Tiền GTGT</p>
                <p className="font-semibold text-zinc-900">
                  {detail.financial.gtgt_amount == null
                    ? '-'
                    : formatCurrency(detail.financial.gtgt_amount)}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Tong tien</p>
                <p className="font-semibold text-zinc-900">
                  {(detail.financial.total_amount ?? detail.financial.amount) == null
                    ? '-'
                    : formatCurrency(detail.financial.total_amount ?? detail.financial.amount ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">Loai hinh karaoke</p>
                <p className="font-semibold text-zinc-900">{detail.karaoke.type || '-'}</p>
              </div>
              <div>
                <p className="text-zinc-500">So phong</p>
                <p className="font-semibold text-zinc-900">
                  {karaokeCountDisplay(detail.karaoke.room_count, detail.karaoke.type, 'PHONG')}
                </p>
              </div>
              <div>
                <p className="text-zinc-500">So box</p>
                <p className="font-semibold text-zinc-900">
                  {karaokeCountDisplay(detail.karaoke.box_count, detail.karaoke.type, 'BOX')}
                </p>
              </div>
            </div>
          </ContentCard>

          <ContentCard>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-900">Hanh dong</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {detail && onEdit ? (
                <Button variant="secondary" onClick={() => onEdit(detail.id)}>
                  Chinh sua hop dong
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  Chinh sua (Chua co hanh dong chinh sua)
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={handleGcnContext}
                disabled={gcnLoading || detail?.domain?.display !== 'Karaoke'}
                title={detail?.domain?.display !== 'Karaoke' ? 'Chi ho tro Karaoke' : ''}
              >
                {gcnLoading ? 'Dang lay du lieu...' : 'Xem du lieu GCN'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleGcnDraftCreate}
                disabled={draftLoading || detail?.domain?.display !== 'Karaoke'}
                title={detail?.domain?.display !== 'Karaoke' ? 'Chi ho tro Karaoke' : 'Bật CREATE_CERTIFICATE_WRITE_ENABLED, CREATE_CERTIFICATE_DRAFT_ONLY_ENABLED, CREATE_CERTIFICATE_CLONE_ONLY_ENABLED để tạo GCN nháp trên DB clone.'}
              >
                {draftLoading ? 'Dang tao...' : 'Tao GCN nhap'}
              </Button>
              {(isSafeTestRecord(detail?.contract_no || '') || isAdmin) && (
                <Button
                  variant="secondary"
                  tone="danger"
                  leftIcon={<Trash2Icon className="h-4 w-4" />}
                  onClick={openDeleteConfirm}
                >
                  Xoa hop dong
                </Button>
              )}
            </div>

            {/* GCN context error */}
            {gcnError && (
              <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-600/15">
                {gcnError}
              </div>
            )}

            {/* GCN Draft Create error */}
            {draftError && (
              <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-600/15">
                {draftError}
              </div>
            )}

            {/* GCN context result */}
            {gcnResult && (
              <div className="mt-3 space-y-2">
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ring-1 ${gcnResult.ok ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/15' : 'bg-rose-50 text-rose-700 ring-rose-600/15'}`}>
                  {gcnResult.ok ? (
                    <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 shrink-0" />
                  )}
                  <span className="font-semibold">
                    {gcnResult.ok ? 'Du lieu GCN san sang' : 'Khong lay duoc du lieu GCN'}
                  </span>
                </div>
                {gcnResult.ok && (
                  <div className="rounded-lg bg-zinc-50 p-3 text-xs space-y-1.5">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div><span className="text-zinc-500">So HĐ:</span> <span className="font-medium">{gcnResult.context.contract_no}</span></div>
                      <div><span className="text-zinc-500">So GCN:</span> <span className="font-medium">{gcnResult.context.certificate_no || '(chua co)'}</span></div>
                      <div className="col-span-2"><span className="text-zinc-500">To chuc:</span> <span className="font-medium">{gcnResult.context.organization_name}</span></div>
                      <div className="col-span-2"><span className="text-zinc-500">Dia chi:</span> <span className="font-medium">{gcnResult.context.address || '(chua co)'}</span></div>
                      <div className="col-span-2"><span className="text-zinc-500">Dia diem KD:</span> <span className="font-medium">{gcnResult.context.business_location || '(chua co)'}</span></div>
                      <div><span className="text-zinc-500">Hieu luc tu:</span> <span className="font-medium">{gcnResult.context.effective_from || '(chua co)'}</span></div>
                      <div><span className="text-zinc-500">Hieu luc den:</span> <span className="font-medium">{gcnResult.context.effective_to || '(chua co)'}</span></div>
                    </div>
                    {/* Safety flags */}
                    <div className="border-t border-zinc-200 pt-1.5 mt-1.5 space-y-0.5">
                      <div>
                        <span className="text-zinc-500">write_performed:</span>{' '}
                        <span className={gcnResult.write_performed ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                          {gcnResult.write_performed ? 'YES ⚠️' : 'NO ✓'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">print_enabled:</span>{' '}
                        <span className={gcnResult.print_enabled ? 'text-amber-600 font-bold' : 'text-zinc-400'}>
                          {String(gcnResult.print_enabled)}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">qr_generation_enabled:</span>{' '}
                        <span className={gcnResult.qr_generation_enabled ? 'text-amber-600 font-bold' : 'text-zinc-400'}>
                          {String(gcnResult.qr_generation_enabled)}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">locked_layout:</span>{' '}
                        <span className="text-emerald-600">LOCKED ✓</span>
                      </div>
                    </div>
                    {gcnResult.context.warnings.length > 0 && (
                      <div className="border-t border-zinc-200 pt-1.5 mt-1.5">
                        {gcnResult.context.warnings.map((w, i) => <p key={i} className="text-amber-600">- {w}</p>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* GCN Draft Create Result */}
            {draftResult && (
              <div className="mt-3 space-y-2">
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ring-1 ${draftResult.ok ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/15' : 'bg-rose-50 text-rose-700 ring-rose-600/15'}`}>
                  {draftResult.ok ? (
                    <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 shrink-0" />
                  )}
                  <span className="font-semibold">
                    {draftResult.ok ? 'GCN nháp đã được tạo thành công' : 'Tạo GCN nháp thất bại'}
                  </span>
                </div>
                {draftResult.ok && draftResult.created && (
                  <div className="rounded-lg bg-zinc-50 p-3 text-xs space-y-1.5">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div><span className="text-zinc-500">certificate_id:</span> <span className="font-medium">{draftResult.created.certificate_id}</span></div>
                      <div><span className="text-zinc-500">contract_id:</span> <span className="font-medium">{draftResult.created.contract_id}</span></div>
                      <div><span className="text-zinc-500">certificate_no:</span> <span className="font-medium">{draftResult.created.certificate_no || '(NULL)'}</span></div>
                      <div><span className="text-zinc-500">status:</span> <span className="font-medium">{draftResult.created.status}</span></div>
                    </div>
                    <div className="border-t border-zinc-200 pt-1.5 mt-1.5 space-y-0.5">
                      <div>
                        <span className="text-zinc-500">write_performed:</span>{' '}
                        <span className={draftResult.write_performed ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                          {draftResult.write_performed ? 'YES ⚠️' : 'NO ✓'}
                        </span>
                      </div>
                      <div><span className="text-zinc-500">print_enabled:</span> <span className="text-emerald-600">false ✓</span></div>
                      <div><span className="text-zinc-500">qr_generation_enabled:</span> <span className="text-emerald-600">false ✓</span></div>
                    </div>
                  </div>
                )}
                {!draftResult.ok && draftResult.errors && draftResult.errors.length > 0 && (
                  <div className="rounded-lg bg-rose-50 p-2 text-xs text-rose-700 space-y-0.5">
                    {draftResult.errors.map((e, i) => <p key={i}>- {e.field}: {e.message}</p>)}
                  </div>
                )}
              </div>
            )}
          </ContentCard>

          <ContentCard>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-900">Xuat DOCX (dry-run)</h3>
              <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                <LockIcon className="h-3.5 w-3.5" /> Dev-only
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Chi render thu text placeholders, chua xuat file chinh thuc, chua ghi DB.
            </p>
            <div className="mt-3 flex flex-col gap-3">
              <Button
                variant="secondary"
                leftIcon={<FileDownIcon className="h-4 w-4" />}
                onClick={handleExportDryRun}
                disabled={
                  exportLoading ||
                  !detail ||
                  !['Karaoke', 'KVC', 'Khu vui choi'].includes(detail.domain.display || '')
                }
              >
                {exportLoading ? 'Dang render...' : 'Test render Word (dry-run)'}
              </Button>
              {exportError && (
                <p className="text-xs text-red-600">Loi: {exportError}</p>
              )}
              {exportResult && (
                <div className="rounded-lg bg-zinc-50 p-3 text-xs">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-zinc-500">Domain:</span>
                    <span className="font-medium">{exportResult.domain_label}</span>
                    <span className="text-zinc-500">Template:</span>
                    <span className="font-medium truncate" title={exportResult.template_path}>
                      {exportResult.template_path.split('\\').pop()}
                    </span>
                    <span className="text-zinc-500">File size:</span>
                    <span className="font-medium">
                      {exportResult.file_size ? `${(exportResult.file_size / 1024).toFixed(1)} KB` : '-'}
                    </span>
                    <span className="text-zinc-500">Placeholders:</span>
                    <span className="font-medium">
                      {exportResult.placeholders_attempted.length} tim thay, {exportResult.placeholders_in_context} trong context
                    </span>
                    <span className="text-zinc-500">db_write:</span>
                    <span className={exportResult.db_write_performed ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {exportResult.db_write_performed ? 'YES' : 'NO'}
                    </span>
                    <span className="text-zinc-500">docx_path_attached:</span>
                    <span className={exportResult.docx_path_attached ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {exportResult.docx_path_attached ? 'YES' : 'NO'}
                    </span>
                    <span className="text-zinc-500">pricing_blocks:</span>
                    <span className={exportResult.pricing_blocks_inserted ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {exportResult.pricing_blocks_inserted ? 'INSERTED' : 'NOT YET'}
                    </span>
                  </div>
                  {exportResult.warnings.length > 0 && (
                    <div className="mt-2">
                      {exportResult.warnings.map((w, i) => (
                        <p key={i} className="text-amber-600">- {w}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ContentCard>

          <ContentCard>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-zinc-900">Xuat DOCX Preview</h3>
              <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                <LockIcon className="h-3.5 w-3.5" /> Preview only
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Tao Word preview tam de kiem tra layout. File preview de kiem tra, chua ghi DB, chua xuat chinh thuc.
            </p>
            <div className="mt-3 flex flex-col gap-3">
              <Button
                variant="secondary"
                leftIcon={<FileDownIcon className="h-4 w-4" />}
                onClick={handleExportPreview}
                disabled={
                  previewLoading ||
                  !detail ||
                  !['Karaoke', 'KVC', 'Khu vui choi'].includes(detail.domain.display || '')
                }
              >
                {previewLoading ? 'Dang tao preview...' : 'Tao Word preview tam'}
              </Button>
              {previewError && (
                <p className="text-xs text-red-600">Loi: {previewError}</p>
              )}
              {previewResult && (
                <div className="rounded-lg bg-zinc-50 p-3 text-xs">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-zinc-500">Domain:</span>
                    <span className="font-medium">{previewResult.domain_label}</span>
                    <span className="text-zinc-500">Preview file:</span>
                    <span className="font-medium truncate" title={previewResult.preview_path || ''}>
                      {previewResult.preview_path?.split('\\').pop()}
                    </span>
                    <span className="text-zinc-500">File size:</span>
                    <span className="font-medium">
                      {previewResult.file_size ? `${(previewResult.file_size / 1024).toFixed(1)} KB` : '-'}
                    </span>
                    <span className="text-zinc-500">db_write:</span>
                    <span className={previewResult.db_write_performed ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {previewResult.db_write_performed ? 'YES' : 'NO'}
                    </span>
                    <span className="text-zinc-500">docx_path_attached:</span>
                    <span className={previewResult.docx_path_attached ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {previewResult.docx_path_attached ? 'YES' : 'NO'}
                    </span>
                    <span className="text-zinc-500">official_export:</span>
                    <span className={previewResult.official_export ? 'text-red-600 font-bold' : 'text-green-600'}>
                      {previewResult.official_export ? 'YES' : 'NO'}
                    </span>
                    <span className="text-zinc-500">synthetic:</span>
                    <span className={previewResult.synthetic_preview ? 'text-amber-600' : 'text-green-600'}>
                      {previewResult.synthetic_preview ? 'YES' : 'NO'}
                    </span>
                  </div>
                  {previewResult.warnings.length > 0 && (
                    <div className="mt-2">
                      {previewResult.warnings.map((w, i) => (
                        <p key={i} className="text-amber-600">- {w}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ContentCard>

          <ContentCard>
            <details>
              <summary className="cursor-pointer text-sm font-semibold text-zinc-900">Raw technical info (safe)</summary>
              <pre className="mt-3 text-xs leading-5 text-zinc-700 overflow-auto bg-zinc-50 p-3 rounded-lg ring-1 ring-zinc-200">
{JSON.stringify(detail.raw, null, 2)}
              </pre>
            </details>
          </ContentCard>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && detail && (
        <Modal open onClose={closeDeleteModal} title={`Xác nhận xóa — ${detail.contract_no}`} size="lg">
          <div className="space-y-4">
            {!deleteModal.loading && !deleteModal.result && (
              <div className="space-y-3">
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-600/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangleIcon className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      {isAdmin ? (
                        <>
                          <p className="font-semibold">Xoa vinh vien khoi DB chinh</p>
                          <p className="mt-1 text-xs text-amber-700">
                            Hợp đồng: <strong>{detail.contract_no}</strong>
                          </p>
                          <p className="mt-0.5 text-xs text-amber-700">
                            ID: <strong>{detail.id}</strong>
                          </p>
                          <p className="mt-0.5 text-xs text-amber-700">
                            Đơn vị: <strong>{detail.customer?.name || '(không rõ)'}</strong>
                          </p>
                          <p className="mt-2 text-xs text-amber-700 font-semibold">
                            Admin dang xoa record khoi DB chinh. Thao tac nay se xoa vinh vien record tren DB chinh (port 5432).
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold">Xóa record test này khỏi DB clone?</p>
                          <p className="mt-1 text-xs text-amber-700">
                            Hợp đồng: <strong>{detail.contract_no}</strong>
                          </p>
                          <p className="mt-0.5 text-xs text-amber-700">
                            Không ảnh hưởng app cũ.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" onClick={closeDeleteModal}>Hủy</Button>
                  <Button variant="primary" tone="danger" onClick={confirmDetailDelete} leftIcon={<Trash2Icon className="h-4 w-4" />}>
                    {isAdmin ? 'Xoa vinh vien khoi DB chinh' : 'Xoa record test'}
                  </Button>
                </div>
              </div>
            )}

            {deleteModal.loading && (
              <div className="flex items-center gap-3 py-8 justify-center">
                <LoaderIcon className="h-5 w-5 animate-spin text-indigo-600" />
                <span className="text-sm text-zinc-600">Đang xử lý...</span>
              </div>
            )}

            {deleteModal.result && (
              <div className="space-y-3">
                <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm ${deleteModal.result.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {deleteModal.result.ok ? (
                    <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 shrink-0" />
                  )}
                  <span className="font-semibold">
                    {deleteModal.result.ok ? 'Xóa thành công' : 'Xóa thất bại'}
                  </span>
                </div>

                {deleteModal.result.ok && (
                  <div className="rounded-lg bg-zinc-50 p-4 text-xs space-y-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      <div><span className="text-zinc-500">contract_id:</span> <span className="font-medium">{deleteModal.result.contract_id}</span></div>
                      <div><span className="text-zinc-500">contract_no:</span> <span className="font-medium">{deleteModal.result.contract_no}</span></div>
                      <div><span className="text-zinc-500">deleted_contract_records:</span> <span className="font-medium">{deleteModal.result.deleted_contract_records}</span></div>
                      <div><span className="text-zinc-500">deleted_certificate_records:</span> <span className="font-medium">{deleteModal.result.deleted_certificate_records}</span></div>
                      <div><span className="text-zinc-500">mode:</span> <span className="font-medium">{deleteModal.result.mode}</span></div>
                      <div><span className="text-zinc-500">permission_used:</span> <span className="font-medium">{deleteModal.result.permission_used || '-'}</span></div>
                    </div>
                    <div className="border-t border-zinc-200 pt-2 mt-2 space-y-1">
                      <div>
                        <span className="text-zinc-500">write_performed:</span>{' '}
                        <span className={deleteModal.result.write_performed ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                          {deleteModal.result.write_performed ? 'YES ⚠️' : 'NO ✓'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">old_db_touched:</span>{' '}
                        <span className={deleteModal.result.old_db_touched ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                          {deleteModal.result.old_db_touched ? 'YES ⚠️' : 'NO ✓'}
                        </span>
                      </div>
                    </div>
                    {deleteModal.result.warnings && deleteModal.result.warnings.length > 0 && (
                      <div className="border-t border-zinc-200 pt-2 mt-2 space-y-1">
                        <span className="text-zinc-500">Warnings:</span>
                        {deleteModal.result.warnings.map((w, i) => (
                          <p key={i} className="text-amber-600">- {w}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!deleteModal.result.ok && (
                  <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
                    <p className="font-semibold">Không thể xóa record này.</p>
                    <p className="mt-1">{deleteModal.result.message}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button variant="secondary" onClick={() => { closeDeleteModal(); if (deleteModal.result?.ok) onBack(); }}>
                    {deleteModal.result?.ok ? 'Quay lại danh sách' : 'Đóng'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </Page>
  );
}
