// Reports data — uses real VCPMC sample only.
// IMPORTANT: UI must show only canonical category labels.
// Raw DB values like "Phòng Thu Âm", "PTA", "restaurant", "hotel" must be
// mapped to canonical labels. "Phòng ghi âm" is legacy/dirty and excluded.

import { CONTRACT_RECORDS } from './contractRecords';

export type FieldCategoryKey =
'karaoke' |
'phong_thu_am' |
'cafe' |
'nha_hang' |
'khach_san' |
'khu_vui_choi' |
'tttm' |
'bar' |
'van_phong' |
'cua_hang' |
'rap_phim' |
'phong_tra' |
'cssk' |
'sieu_thi' |
'bieu_dien';

export type FieldCategory = {
  key: FieldCategoryKey;
  label: string;
  description: string;
  rawMatches: string[];
};

// Canonical field categories shown in UI.
// Each maps to one or more raw DB values.
export const FIELD_CATEGORIES: FieldCategory[] = [
{
  key: 'karaoke',
  label: 'Karaoke',
  description: 'Cơ sở có giấy phép phòng karaoke đạt chuẩn.',
  rawMatches: ['Karaoke']
},
{
  key: 'phong_thu_am',
  label: 'Phòng thu âm',
  description:
  'Cơ sở không thuộc điều kiện phân loại Karaoke, ghi nhận theo nhóm phòng thu âm.',
  rawMatches: ['Phòng thu âm', 'Phòng Thu Âm', 'PTA']
},
{
  key: 'cafe',
  label: 'Cà phê',
  description: 'Quán cà phê.',
  rawMatches: ['Cà phê', 'Cafe', 'Coffee', 'cafe']
},
{
  key: 'nha_hang',
  label: 'Nhà hàng',
  description: 'Nhà hàng ăn uống.',
  rawMatches: ['Nhà hàng', 'restaurant']
},
{
  key: 'khach_san',
  label: 'Khách sạn',
  description: 'Khách sạn lưu trú.',
  rawMatches: ['Khách sạn', 'Hotel', 'hotel']
},
{
  key: 'khu_vui_choi',
  label: 'Khu vui chơi',
  description: 'Khu vui chơi giải trí.',
  rawMatches: ['Khu vui chơi', 'Khu vui chơi giải trí', 'entertainment']
},
{
  key: 'tttm',
  label: 'Trung tâm thương mại',
  description: 'Trung tâm thương mại / Mall.',
  rawMatches: ['Trung tâm thương mại', 'TTTM', 'Mall', 'shopping_mall']
},
{
  key: 'bar',
  label: 'Bar',
  description: 'Bar / Lounge / Club.',
  rawMatches: ['Bar', 'Lounge', 'Club']
},
{
  key: 'van_phong',
  label: 'Văn phòng',
  description: 'Văn phòng làm việc.',
  rawMatches: ['Văn phòng', 'Office']
},
{
  key: 'cua_hang',
  label: 'Cửa hàng',
  description: 'Cửa hàng bán lẻ.',
  rawMatches: ['Cửa hàng', 'Store', 'Shop']
},
{
  key: 'rap_phim',
  label: 'Rạp phim',
  description: 'Rạp chiếu phim.',
  rawMatches: ['Rạp phim', 'Cinema']
},
{
  key: 'phong_tra',
  label: 'Phòng trà',
  description: 'Phòng trà / Acoustic.',
  rawMatches: ['Phòng trà', 'Acoustic', 'Tea room']
},
{
  key: 'cssk',
  label: 'Chăm sóc sức khỏe',
  description: 'Spa / Gym / Fitness.',
  rawMatches: ['Chăm sóc sức khỏe', 'Spa', 'Gym', 'Fitness']
},
{
  key: 'sieu_thi',
  label: 'Siêu thị',
  description: 'Siêu thị / Supermarket.',
  rawMatches: ['Siêu thị', 'Supermarket']
},
{
  key: 'bieu_dien',
  label: 'Biểu diễn',
  description: 'Sự kiện biểu diễn / Performance.',
  rawMatches: ['Biểu diễn', 'Performance', 'Event']
}];


// Reverse-lookup: raw DB value -> canonical category
const RAW_TO_CATEGORY: Record<string, FieldCategoryKey> = (() => {
  const map: Record<string, FieldCategoryKey> = {};
  for (const cat of FIELD_CATEGORIES) {
    for (const raw of cat.rawMatches) {
      map[raw.toLowerCase()] = cat.key;
    }
  }
  return map;
})();

export function mapRawFieldToCategory(
raw: string | null | undefined)
: FieldCategoryKey | null {
  if (!raw) return null;
  // "Phòng ghi âm" is dirty legacy data — explicitly excluded.
  if (raw.toLowerCase().trim() === 'phòng ghi âm') return null;
  return RAW_TO_CATEGORY[raw.toLowerCase().trim()] ?? null;
}

// Build field breakdown from real CONTRACT_RECORDS sample.
// Categories with no sample data show count = 0.
export function buildFieldBreakdown(): {
  key: FieldCategoryKey;
  label: string;
  description: string;
  count: number;
  hasSample: boolean;
}[] {
  const counts: Record<FieldCategoryKey, number> = {} as Record<
    FieldCategoryKey,
    number>;

  for (const cat of FIELD_CATEGORIES) counts[cat.key] = 0;

  for (const r of CONTRACT_RECORDS) {
    const key = mapRawFieldToCategory(r.linh_vuc_hien_thi);
    if (key) counts[key] += 1;
  }

  return FIELD_CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
    description: c.description,
    count: counts[c.key],
    hasSample: counts[c.key] > 0
  }));
}

// 3-year revenue data (2024 = no money data yet, kept null on purpose).
export const REVENUE_BY_YEAR_3Y: {
  year: string;
  revenue: number | null;
  contractCount: number;
  cumulative?: boolean;
}[] = [
{ year: '2024', revenue: null, contractCount: 136 },
{ year: '2025', revenue: 2_648_796_600, contractCount: 136 },
{ year: '2026', revenue: 1_075_536_342, contractCount: 42, cumulative: true }];


// Real expiring contracts (8 in next 60 days).
export type ExpiringReportRow = {
  id: string;
  contract_no: string;
  partner: string;
  field: string; // canonical UI label
  expire_date: string; // YYYY-MM-DD
  days_left: number;
  value: number;
};

const TODAY = new Date('2026-05-08');
const daysBetween = (target: string) =>
Math.ceil(
  (new Date(target).getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24)
);

export const EXPIRING_REPORT_ROWS: ExpiringReportRow[] = [
{
  id: 'r1',
  contract_no: '0534/2025/HĐQTGAN-PN/PR',
  partner: 'HỘ KINH DOANH KARAOKE 456',
  field: 'Karaoke',
  expire_date: '2026-05-09',
  days_left: daysBetween('2026-05-09'),
  value: 4_800_000
},
{
  id: 'r2',
  contract_no: '0523/2025/HĐQTGAN-PN/PR',
  partner: 'HỘ KINH DOANH QUANG MINH',
  field: 'Karaoke',
  expire_date: '2026-05-09',
  days_left: daysBetween('2026-05-09'),
  value: 21_750_000
},
{
  id: 'r3',
  contract_no: '0713/2025/HĐQTGAN-PN/PR',
  partner: 'CÔNG TY TNHH KARAOKE GIA ĐÌNH TÌNH CA',
  field: 'Karaoke',
  expire_date: '2026-05-13',
  days_left: daysBetween('2026-05-13'),
  value: 25_500_000
},
{
  id: 'r4',
  contract_no: '0984/2025/HĐQTGAN-PN/PR',
  partner: 'CÔNG TY TNHH MTV TÂN XUKA',
  field: 'Karaoke',
  expire_date: '2026-05-13',
  days_left: daysBetween('2026-05-13'),
  value: 8_800_000
},
{
  id: 'r5',
  contract_no: '0714/2025/HĐQTGAN-PN/PR',
  partner: 'HỘ KINH DOANH KARAOKE B-BOX',
  field: 'Karaoke',
  expire_date: '2026-05-15',
  days_left: daysBetween('2026-05-15'),
  value: 29_000_000
},
{
  id: 'r6',
  contract_no: '0564/2025/HĐQTGAN-PN/PR',
  partner: 'CÔNG TY TNHH KARAOKE THẢO NHI',
  field: 'Karaoke',
  expire_date: '2026-05-19',
  days_left: daysBetween('2026-05-19'),
  value: 16_000_000
},
{
  id: 'r7',
  contract_no: '0605/2025/HĐQTGAN-PN/PR',
  partner: 'CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI NGUYỄN NGỌC',
  field: 'Karaoke',
  expire_date: '2026-05-28',
  days_left: daysBetween('2026-05-28'),
  value: 29_000_000
},
{
  id: 'r8',
  contract_no: '0675/2025/HĐQTGAN-PN/PR',
  partner: 'HỘ KINH DOANH KARAOKE LIKE VIP',
  field: 'Karaoke',
  expire_date: '2026-05-30',
  days_left: daysBetween('2026-05-30'),
  value: 34_000_000
}];


// Workspace stats (real numbers).
export const REPORT_STATS = {
  totalContracts: 3365,
  active: 121,
  expiringIn30Days: 8,
  expiringIn60Days: 26,
  expired: 3107,
  pendingRenewal: 1,
  renewed: 1,
  totalWorks: 80_759,
  gcnDraft: 1_940,
  gcnTestPrinted: 6,
  gcnFinalPrinted: 655,
  contracts2026: 42,
  contracts2025: 136,
  revenue2026: 1_075_536_342,
  revenue2025: 2_648_796_600
};

// Insight bullets — real-data driven.
export const REPORT_INSIGHTS: {
  id: string;
  tone: 'rose' | 'amber' | 'indigo' | 'violet' | 'emerald';
  title: string;
  description: string;
}[] = [
{
  id: 'i1',
  tone: 'rose',
  title: '3.107 hợp đồng đã hết hạn',
  description:
  'Cần ưu tiên rà soát và đưa vào quy trình tái ký để khôi phục doanh thu.'
},
{
  id: 'i2',
  tone: 'amber',
  title: '26 hợp đồng sẽ hết hạn trong 60 ngày',
  description:
  'Trong đó 8 hợp đồng sẽ hết hạn trong 30 ngày — cần xử lý sớm.'
},
{
  id: 'i3',
  tone: 'emerald',
  title: 'Doanh thu 2026 đạt 1,075 tỷ',
  description:
  'Đến từ 42 hợp đồng — đang là dữ liệu lũy kế tính đến hôm nay.'
},
{
  id: 'i4',
  tone: 'violet',
  title: '1.940 GCN ở trạng thái bản nháp',
  description:
  'Phần lớn GCN chưa được cấp số. Cần đẩy nhanh quy trình cấp số & in.'
},
{
  id: 'i5',
  tone: 'indigo',
  title: 'Cần chuẩn hóa lĩnh vực cũ',
  description:
  'Các giá trị "PTA" / "Phòng Thu Âm" trong dữ liệu thô nên được chuẩn về "Phòng thu âm" để báo cáo nhất quán.'
}];