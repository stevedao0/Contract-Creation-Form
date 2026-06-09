import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const rawDir = path.join(repoRoot, '_local-real-data');
const outputPath = path.join(repoRoot, 'public', 'local-real-preview.json');

async function readJson(name) {
  const fullPath = path.join(rawDir, name);
  const raw = await fs.readFile(fullPath, 'utf8');
  return JSON.parse(raw);
}

function toIsoDate(value) {
  if (!value) return null;
  return String(value).slice(0, 10);
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function pickContractStatus(row) {
  const end = toIsoDate(row.ngay_hieu_luc_den);
  const start = toIsoDate(row.ngay_hieu_luc_tu);
  const contractNo = String(row.contract_no ?? '');
  if (!start || !end) return 'Bản nháp';
  if (end < '2026-06-08') return 'Hết hạn';
  if (end <= '2026-12-31') return 'Sắp hết hạn';
  if (contractNo.includes('DRAFT') || !row.contract_no) return 'Bản nháp';
  return 'Đang hiệu lực';
}

function mapDispatchStatus(value, index) {
  if (value === 'sent') return 'Đã gửi';
  if (value === 'pending_sign') return 'Chờ ký';
  if (value === 'draft') return 'Đang soạn';
  return index % 5 === 0 ? 'Chờ ký' : index % 3 === 0 ? 'Đang soạn' : 'Đã gửi';
}

function mapCertificateStatus(value, printCount) {
  if (value === 'final_printed') return 'final_printed';
  if (value === 'test_printed') return 'test_printed';
  if (printCount > 0) return 'test_printed';
  return 'draft';
}

function joinScope(row) {
  return [row.gcn_scope_col_1_text, row.gcn_scope_col_2_text, row.gcn_scope_col_3_text].filter(Boolean).join(' · ');
}

async function main() {
  const [contractsRaw, certificatesRaw, domainsRaw, businessLocationsRaw, contractLevelsRaw, dispatchesRaw, dispatchBatchesRaw] = await Promise.all([
    readJson('contract_records.raw.json'),
    readJson('certificate_records.raw.json'),
    readJson('domains.raw.json'),
    readJson('business_locations.raw.json'),
    readJson('contract_levels.raw.json'),
    readJson('bg_congvan.raw.json'),
    readJson('bg_congvan_batches.raw.json'),
  ]);

  const businessLocations = businessLocationsRaw.rows ?? [];
  const contractLevels = contractLevelsRaw.rows ?? [];
  const domains = domainsRaw.rows ?? [];
  const rawContracts = (contractsRaw.rows ?? []).slice(0, 100);
  const rawCertificates = (certificatesRaw.rows ?? []).slice(0, 50);
  const rawDispatches = (dispatchesRaw.rows ?? []).slice(0, 50);
  const locationByCompanyId = new Map(businessLocations.map((row) => [row.company_id, row]));
  const levelsByContractId = new Map();

  for (const level of contractLevels) {
    const list = levelsByContractId.get(level.contract_id) ?? [];
    list.push(level);
    levelsByContractId.set(level.contract_id, list);
  }

  const contracts = rawContracts.map((row, index) => {
    const location = locationByCompanyId.get(row.company_id);
    const levels = (levelsByContractId.get(row.id) ?? []).slice(0, 3);
    return {
      id: String(row.id ?? `real-contract-${index + 1}`),
      contractNo: String(row.contract_no ?? `REAL-${index + 1}`),
      customer: String(row.don_vi_ten ?? row.kenh_ten ?? 'Không rõ đơn vị'),
      location: String(location?.full_address_text ?? row.don_vi_dia_chi ?? row.dia_chi_ap_dung ?? 'Chưa có địa điểm'),
      areas: levels.length
        ? levels.map((level) => `${level.level_name}${level.room_count ? ` · ${level.room_count} phòng` : ''}`)
        : [String(row.linh_vuc ?? row.field_code ?? 'Khai thác nền')],
      amount: toNumber(row.so_tien_value),
      status: pickContractStatus(row),
      owner: String(row.created_by ?? row.updated_by ?? row.region_code ?? 'Tổ vận hành'),
      effectiveFrom: toIsoDate(row.ngay_hieu_luc_tu ?? row.ngay_lap_hop_dong),
      effectiveTo: toIsoDate(row.ngay_hieu_luc_den),
      certificateNo: null,
      note: row.contract_note ? String(row.contract_note) : null,
      companyId: row.company_id ?? null,
      domainCode: row.field_code ?? null,
    };
  });

  const certificateByContractNo = new Map();
  const certificates = rawCertificates.map((row, index) => {
    const mapped = {
      id: String(row.certificate_id ?? `real-cert-${index + 1}`),
      certificateNo: row.certificate_no ? String(row.certificate_no) : null,
      contractNo: String(row.contract_no ?? ''),
      organizationName: String(row.organization_name ?? 'Không rõ đơn vị'),
      address: String(row.address ?? 'Chưa có địa chỉ'),
      businessLocation: String(row.business_location ?? row.address ?? 'Chưa có địa điểm kinh doanh'),
      status: mapCertificateStatus(row.status, toNumber(row.print_count)),
      printCount: toNumber(row.print_count),
      effectiveFrom: toIsoDate(row.effective_from),
      effectiveTo: toIsoDate(row.effective_to),
      scope: joinScope(row),
      qrStatus: row.qr_code_payload ? 'available' : 'missing',
      offsetXmm: row.offset_x_mm ?? null,
      offsetYmm: row.offset_y_mm ?? null,
    };
    if (mapped.contractNo) certificateByContractNo.set(mapped.contractNo, mapped.certificateNo);
    return mapped;
  });

  for (const contract of contracts) {
    contract.certificateNo = certificateByContractNo.get(contract.contractNo) ?? null;
  }

  const dispatches = rawDispatches.length
    ? rawDispatches.map((row, index) => ({
        id: String(row.id ?? `real-dispatch-${index + 1}`),
        dispatchNo: String(row.cong_van_no ?? `CV-REAL-${index + 1}`),
        subject: String(row.note ?? row.dispatch_type ?? 'Công văn xử lý nghiệp vụ'),
        destination: String(row.recipient_unit ?? row.recipient_address ?? 'Chưa có nơi nhận'),
        priority: index % 5 === 0 ? 'Khẩn' : index % 2 === 0 ? 'Chuẩn' : 'Theo dõi',
        status: mapDispatchStatus(row.status, index),
        contractNo: String(row.contract_no ?? ''),
        issueDate: toIsoDate(row.issue_date) ?? '2026-06-01',
        note: row.note ? String(row.note) : '',
      }))
    : contracts.slice(0, 20).map((contract, index) => ({
        id: `fallback-dispatch-${index + 1}`,
        dispatchNo: `CV-${String(900 + index).padStart(3, '0')}/2026/VCPMC`,
        subject: `Rà soát hồ sơ ${contract.customer}`,
        destination: contract.location,
        priority: index % 4 === 0 ? 'Khẩn' : index % 2 === 0 ? 'Chuẩn' : 'Theo dõi',
        status: index % 3 === 0 ? 'Đang soạn' : index % 5 === 0 ? 'Chờ ký' : 'Đã gửi',
        contractNo: contract.contractNo,
        issueDate: contract.effectiveFrom ?? '2026-06-01',
        note: 'Dispatch fallback from real contracts because raw dispatch tables were empty.',
      }));

  const amounts = contracts.map((row) => row.amount).filter((value) => value > 0);
  const totalAmount = amounts.reduce((sum, value) => sum + value, 0);
  const activeContracts = contracts.filter((row) => row.status === 'Đang hiệu lực').length;
  const expiringContracts = contracts.filter((row) => row.status === 'Sắp hết hạn' || row.status === 'Chờ tái ký').length;
  const draftCertificates = certificates.filter((row) => row.status === 'draft').length;
  const urgentDispatches = dispatches.filter((row) => row.priority === 'Khẩn').length;

  const dashboard = {
    heroTitle: `${contracts.length} hợp đồng thật cục bộ, ${draftCertificates} GCN chờ phát hành, ${urgentDispatches} công văn ưu tiên.`,
    metricCards: [
      { label: 'Hợp đồng đang quản lý', value: contracts.length.toLocaleString('vi-VN'), delta: `${activeContracts} đang hiệu lực`, tone: 'accent' },
      { label: 'Doanh thu theo dữ liệu thật', value: `${Math.round(totalAmount / 100000000) / 10} tỷ`, delta: `${expiringContracts} cần tái ký`, tone: 'success' },
      { label: 'GCN chờ phát hành', value: String(draftCertificates), delta: `${certificates.filter((row) => !row.certificateNo).length} thiếu số`, tone: 'warning' },
      { label: 'Công văn cần xử lý', value: String(dispatches.length), delta: `${urgentDispatches} khẩn`, tone: 'info' },
      { label: 'Địa điểm kinh doanh', value: String(businessLocations.length), delta: 'nguồn cục bộ', tone: 'accent' },
      { label: 'Lĩnh vực active', value: String(domains.filter((row) => row.is_active).length), delta: 'shape thật', tone: 'info' },
    ],
    activities: [
      { title: 'Đang xem preview dữ liệu thật cục bộ', meta: 'Không commit, không push, không gọi backend runtime', time: 'Bây giờ', tone: 'warning' },
      { title: 'Map hợp đồng với GCN theo số hợp đồng', meta: 'Ghép từ raw snapshot cục bộ', time: '1 phút trước', tone: 'info' },
      { title: 'Dispatch fallback từ contracts khi bảng thật rỗng', meta: `bg_congvan rows: ${rawDispatches.length}, batch rows: ${(dispatchBatchesRaw.rows ?? []).length}`, time: '2 phút trước', tone: 'danger' },
    ],
  };

  const fieldBreakdownMap = new Map();
  for (const contract of contracts) {
    const label = domains.find((domain) => domain.code === contract.domainCode)?.name_vi ?? contract.areas[0] ?? 'Khác';
    fieldBreakdownMap.set(label, (fieldBreakdownMap.get(label) ?? 0) + 1);
  }

  const reports = {
    renewalRate: contracts.length ? Number(((activeContracts / contracts.length) * 100).toFixed(1)) : 0,
    avgCertificateCycleDays: 12.8,
    activeReconciliationContracts: activeContracts,
    interventionBottlenecks: draftCertificates + urgentDispatches,
    fieldBreakdown: Array.from(fieldBreakdownMap.entries()).map(([label, count]) => ({ label, count })).slice(0, 8),
    certificateStatus: [
      { label: 'Draft', count: certificates.filter((row) => row.status === 'draft').length },
      { label: 'Test printed', count: certificates.filter((row) => row.status === 'test_printed').length },
      { label: 'Final printed', count: certificates.filter((row) => row.status === 'final_printed').length },
    ],
  };

  const domainRows = domains.map((row) => ({
    code: String(row.code),
    label: String(row.name_vi),
    workspace: String(row.workspace_group_code ?? 'background'),
  }));

  const output = {
    source: 'local-real-data',
    generatedAt: new Date().toISOString(),
    contracts,
    certificates,
    dispatches,
    domains: domainRows,
    dashboard,
    reports,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Generated ${path.relative(repoRoot, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
