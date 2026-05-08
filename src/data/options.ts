export const YEAR_OPTIONS = ['2024', '2025', '2026', '2027'].map((y) => ({
  value: y,
  label: y
}));

export const REGION_CODE_OPTIONS = [
{ value: 'HĐQTGAN', label: 'HĐQTGAN' },
{ value: 'HĐQTG', label: 'HĐQTG' },
{ value: 'HĐNT', label: 'HĐNT' },
{ value: 'HĐDV', label: 'HĐDV' }];


export const KHU_VUC_OPTIONS = [
{ value: 'PN', label: 'PN — Phía Nam' },
{ value: 'HCM', label: 'HCM — Hồ Chí Minh' },
{ value: 'HN', label: 'HN — Hà Nội' },
{ value: 'DN', label: 'DN — Đà Nẵng' },
{ value: 'CT', label: 'CT — Cần Thơ' }];


export const MANG_OPTIONS = [
{ value: 'PR', label: 'PR' },
{ value: 'MR', label: 'MR' },
{ value: 'PR/MR', label: 'PR/MR' }];


export const LINH_VUC_OPTIONS = [
'Karaoke',
'Cà phê',
'Nhà hàng',
'Khách sạn',
'Khu vui chơi',
'Trung tâm thương mại',
'Bar',
'Văn phòng',
'Cửa hàng',
'Rạp phim',
'Phòng trà',
'Chăm sóc sức khỏe'].
map((v) => ({ value: v, label: v }));

export const NHOM_HD_OPTIONS = [
{ value: 'Background', label: 'Background' },
{ value: 'Media', label: 'Media' },
{ value: 'Event', label: 'Event' },
{ value: 'Other', label: 'Other' }];


export const NGUOI_THUC_HIEN_MAP: Record<string, string> = {
  Tuấn: 'tuan@vcpmc.org',
  Admin: 'admin@vcpmc.org',
  'Nhân viên 1': 'user1@vcpmc.org'
};

export const NGUOI_OPTIONS = Object.keys(NGUOI_THUC_HIEN_MAP).map((v) => ({
  value: v,
  label: v
}));

export const PROVINCE_OPTIONS = [
'TP. Hồ Chí Minh',
'Hà Nội',
'Đà Nẵng',
'Cần Thơ',
'Bình Dương',
'Đồng Nai'].
map((v) => ({ value: v, label: v }));

export const CONTRACT_STATUS_OPTIONS = [
{ value: 'active', label: 'Đang hiệu lực' },
{ value: 'expiring', label: 'Sắp hết hạn' },
{ value: 'expired', label: 'Hết hạn' },
{ value: 'draft', label: 'Bản nháp' }];


export const GCN_STATUS_OPTIONS = [
{ value: 'pending', label: 'Chờ in' },
{ value: 'printed_test', label: 'Đã in test' },
{ value: 'printed_official', label: 'Đã in chính thức' }];


export const WORKSPACES = ['Background', 'Karaoke'];