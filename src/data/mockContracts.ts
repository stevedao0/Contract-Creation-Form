// Recent contracts for the dashboard "Hợp đồng gần đây" panel.
// Sourced from the real CONTRACT_RECORDS sample — no fake names.

import { CONTRACT_RECORDS, getExpiryStatus } from './contractRecords';

export type DashboardContractRow = {
  id: string;
  contractNo: string;
  partner: string;
  field: string;
  signedDate: string;
  value: number | null;
  status: 'active' | 'expiring' | 'expired' | 'draft' | 'pending';
  brand: string | null;
};

const FEATURED_IDS = [4119, 4114, 4113, 4112, 4111, 4109];

export const RECENT_CONTRACTS: DashboardContractRow[] = FEATURED_IDS.map((id) =>
CONTRACT_RECORDS.find((r) => r.id === id)
).
filter((r): r is NonNullable<typeof r> => Boolean(r)).
map((r) => {
  const exp = getExpiryStatus(r.ngay_ket_thuc);
  let status: DashboardContractRow['status'] = exp.status;
  if (r.renewal_status === 'PENDING_RENEWAL') status = 'pending';
  return {
    id: String(r.id),
    contractNo: r.contract_no,
    partner: r.don_vi_ten,
    brand: r.ten_bang_hieu,
    field: r.linh_vuc_hien_thi,
    signedDate: r.ngay_lap_hop_dong,
    value: r.so_tien_value,
    status
  };
});