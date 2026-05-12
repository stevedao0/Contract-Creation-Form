// Employee performance + pending-contracts data for the Reports page.
// Numbers for individual users are reasonable mocks (prototype),
// but all org/contract names referenced come from real CONTRACT_RECORDS.

import { CONTRACT_RECORDS, getExpiryStatus } from './contractRecords';

export type EmployeeKey = 'tuan' | 'admin' | 'nv1';

export type EmployeePerformance = {
  key: EmployeeKey;
  name: string;
  email: string;
  signedThisWeek: number;
  signedThisMonth: number;
  signedThisYear: number;
  pending: number;
  expiringAssigned: number;
  revenue: number;
  gcnHandled: number;
  completionRate: number; // 0..100
};

export const EMPLOYEE_PERFORMANCE: EmployeePerformance[] = [
{
  key: 'tuan',
  name: 'Tuấn',
  email: 'tuan@vcpmc.org',
  signedThisWeek: 5,
  signedThisMonth: 18,
  signedThisYear: 42,
  pending: 4,
  expiringAssigned: 7,
  revenue: 520_000_000,
  gcnHandled: 32,
  completionRate: 86
},
{
  key: 'admin',
  name: 'Admin',
  email: 'admin@vcpmc.org',
  signedThisWeek: 2,
  signedThisMonth: 9,
  signedThisYear: 21,
  pending: 3,
  expiringAssigned: 5,
  revenue: 310_000_000,
  gcnHandled: 18,
  completionRate: 78
},
{
  key: 'nv1',
  name: 'Nhân viên 1',
  email: 'user1@vcpmc.org',
  signedThisWeek: 1,
  signedThisMonth: 6,
  signedThisYear: 14,
  pending: 6,
  expiringAssigned: 8,
  revenue: 245_000_000,
  gcnHandled: 11,
  completionRate: 64
}];


export type PerformanceTone = 'good' | 'watch' | 'overload';

export function getPerformanceTone(p: EmployeePerformance): PerformanceTone {
  if (p.completionRate >= 80 && p.pending <= 4) return 'good';
  if (p.completionRate < 70 || p.pending >= 6) return 'overload';
  return 'watch';
}

// ---- Pending contracts (chờ xử lý) ----

export type PendingCategory =
'draft' |
'awaiting_partner' |
'missing_partner_info' |
'missing_finance' |
'awaiting_approval' |
'no_gcn';

export const PENDING_CATEGORY_LABEL: Record<PendingCategory, string> = {
  draft: 'Bản nháp',
  awaiting_partner: 'Chờ khách phản hồi',
  missing_partner_info: 'Thiếu thông tin đối tác',
  missing_finance: 'Thiếu dữ liệu tài chính',
  awaiting_approval: 'Chờ duyệt',
  no_gcn: 'Chưa tạo GCN'
};

export type PendingRow = {
  id: string;
  contractRecordId: number; // ref to CONTRACT_RECORDS
  category: PendingCategory;
  assignee: string;
  createdAt: string; // YYYY-MM-DD
  daysStuck: number;
  missingStep: string;
};

const TODAY = new Date('2026-05-08');
const daysSince = (d: string) =>
Math.max(
  0,
  Math.floor(
    (TODAY.getTime() - new Date(d).getTime()) / (1000 * 60 * 60 * 24)
  )
);

// Picks real contract records and assigns realistic stuck reasons.
// All org/brand names come from CONTRACT_RECORDS — none fabricated.
export const PENDING_ROWS: PendingRow[] = [
{
  id: 'p1',
  contractRecordId: 4095, // KARAOKE 64 — so_tien_value: null
  category: 'missing_finance',
  assignee: 'Nhân viên 1',
  createdAt: '2026-04-07',
  daysStuck: daysSince('2026-04-07'),
  missingStep: 'Thiếu giá trị hợp đồng'
},
{
  id: 'p2',
  contractRecordId: 4116, // DREAM GAMES VN — so_tien=0, phong=0
  category: 'missing_partner_info',
  assignee: 'Tuấn',
  createdAt: '2026-04-09',
  daysStuck: daysSince('2026-04-09'),
  missingStep: 'Thiếu số phòng & dữ liệu tài chính'
},
{
  id: 'p3',
  contractRecordId: 4104, // KARAOKE TÁO ĐỎ — PENDING_RENEWAL
  category: 'awaiting_partner',
  assignee: 'Admin',
  createdAt: '2026-04-22',
  daysStuck: daysSince('2026-04-22'),
  missingStep: 'Chờ phản hồi tái ký từ đối tác'
},
{
  id: 'p4',
  contractRecordId: 4094, // KING STAR — renewal_status: null
  category: 'awaiting_approval',
  assignee: 'Tuấn',
  createdAt: '2026-04-28',
  daysStuck: daysSince('2026-04-28'),
  missingStep: 'Chờ duyệt từ trưởng phòng'
},
{
  id: 'p5',
  contractRecordId: 4093, // LUCKY STAR — renewal_status: null
  category: 'no_gcn',
  assignee: 'Nhân viên 1',
  createdAt: '2026-05-01',
  daysStuck: daysSince('2026-05-01'),
  missingStep: 'Chưa tạo GCN sau khi ký'
},
{
  id: 'p6',
  contractRecordId: 4109, // KARAOKE NGUYỄN
  category: 'draft',
  assignee: 'Admin',
  createdAt: '2026-05-04',
  daysStuck: daysSince('2026-05-04'),
  missingStep: 'Bản nháp chưa hoàn tất'
}];


export function getPendingPriority(daysStuck: number): {
  label: string;
  tone: 'danger' | 'warning' | 'neutral';
} {
  if (daysStuck > 14) return { label: 'Cao', tone: 'danger' };
  if (daysStuck >= 7) return { label: 'Theo dõi', tone: 'warning' };
  return { label: 'Bình thường', tone: 'neutral' };
}

// ---- Signed contracts feed (uses real CONTRACT_RECORDS) ----

export type SignedScope = 'week' | 'month' | 'quarter' | 'year';

const ASSIGNEE_BY_INDEX = ['Tuấn', 'Admin', 'Nhân viên 1'] as const;

// All 12 records → annotate with mock assignee + mock GCN status,
// keep real contract numbers, dates, partners, values.
export const SIGNED_FEED = CONTRACT_RECORDS.map((r, i) => ({
  id: r.id,
  contract_no: r.contract_no,
  signedDate: r.ngay_lap_hop_dong,
  startDate: r.ngay_bat_dau,
  endDate: r.ngay_ket_thuc,
  partner: r.don_vi_ten,
  brand: r.ten_bang_hieu,
  field: r.linh_vuc_hien_thi,
  assignee: ASSIGNEE_BY_INDEX[i % 3],
  value: r.so_tien_value,
  gcnStatus:
  i % 4 === 0 ?
  'final_printed' :
  i % 4 === 1 ?
  'test_printed' :
  i % 4 === 2 ?
  'draft' :
  'no_gcn'
}));

export function filterSignedByScope(
scope: SignedScope,
todayIso: string = '2026-05-08')
{
  const today = new Date(todayIso);
  return SIGNED_FEED.filter((r) => {
    const signed = new Date(r.signedDate);
    const days = Math.floor(
      (today.getTime() - signed.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (scope === 'week') return days <= 7;
    if (scope === 'month') return days <= 31;
    if (scope === 'quarter') return days <= 92;
    return true;
  });
}