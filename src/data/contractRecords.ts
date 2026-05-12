export type RenewalStatus = 'NEW' | 'PENDING_RENEWAL' | 'RENEWED' | null;

export type ContractRecord = {
  id: number;
  contract_no: string;
  contract_year: number;
  don_vi_ten: string;
  ten_bang_hieu: string | null;
  dia_chi_su_dung: string;
  linh_vuc_hien_thi: string;
  region_code: string;
  field_code: string;
  ngay_lap_hop_dong: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  so_tien_value: number | null;
  renewal_status: RenewalStatus;
  is_renewable: boolean;
  loai_hinh_karaoke: string | null;
  tong_so_phong: number | null;
  tong_so_box: number | null;
};

// Reference "today" used for expiry computation in this prototype.
// Matches the system date so demo numbers stay stable.
export const TODAY = '2026-05-08';

export const CONTRACT_RECORDS: ContractRecord[] = [
{
  id: 4119,
  contract_no: '0645/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'CÔNG TY TNHH ĐẦU TƯ GIẢI TRÍ KARAOKE ICOOL 9',
  ten_bang_hieu: 'KARAOKE ICOOL',
  dia_chi_su_dung: '129A Cách Mạng Tháng 8, phường Bàn Cờ, Tp. Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-05-08',
  ngay_bat_dau: '2026-05-02',
  ngay_ket_thuc: '2027-05-01',
  so_tien_value: 64696320,
  renewal_status: 'NEW',
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 26,
  tong_so_box: null
},
{
  id: 4116,
  contract_no: '0513/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'CÔNG TY TNHH DREAM GAMES VIỆT NAM',
  ten_bang_hieu: 'KHU DREAM GAMES',
  dia_chi_su_dung:
  'Tầng 2, Trung tâm thương mại AEON – Tân Phú Celadon, số 30 đường Tân Thắng, P. Tân Sơn Nhì, Tp. HCM',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-09',
  ngay_bat_dau: '2026-04-22',
  ngay_ket_thuc: '2027-04-21',
  so_tien_value: 0,
  renewal_status: 'NEW',
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 0,
  tong_so_box: null
},
{
  id: 4115,
  contract_no: '0606/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'HỘ KINH DOANH KARAOKE THÀNH NGUYÊN369',
  ten_bang_hieu: 'KARAOKE THÀNH NGUYÊN 369',
  dia_chi_su_dung: 'Ấp Hải Sơn, xã Long Hải, Tp. Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-28',
  ngay_bat_dau: '2026-04-25',
  ngay_ket_thuc: '2027-05-24',
  so_tien_value: 15163200,
  renewal_status: 'NEW',
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 4,
  tong_so_box: null
},
{
  id: 4114,
  contract_no: '0618/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'HỘ KINH DOANH NGUYỄN THỊ THƠC NHI',
  ten_bang_hieu: 'PHÒNG THU ÂM RO ME',
  dia_chi_su_dung: '07 Lê Đại Hành, Phường Phú Thọ, Tp. Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-29',
  ngay_bat_dau: '2026-05-01',
  ngay_ket_thuc: '2027-04-30',
  so_tien_value: 24564384,
  renewal_status: 'NEW',
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 8,
  tong_so_box: null
},
{
  id: 4113,
  contract_no: '0614/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'HỘ KINH DOANH ĐINH THỊ XUÂN AN',
  ten_bang_hieu: 'PHÒNG THU ÂM 179',
  dia_chi_su_dung: '179 Trần Quý, phường Minh Phụng, Tp. Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-29',
  ngay_bat_dau: '2026-04-10',
  ngay_ket_thuc: '2027-04-09',
  so_tien_value: 7581600,
  renewal_status: 'NEW',
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 2,
  tong_so_box: null
},
{
  id: 4112,
  contract_no: '0581/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'CÔNG TY TNHH DỊCH VỤ TRẦN NGỌC THANH',
  ten_bang_hieu: 'KARAOKE NGỌC THANH',
  dia_chi_su_dung:
  '13/39/12 Đường số 4, Khu phố 3, phường Linh Xuân, Tp. Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-22',
  ngay_bat_dau: '2026-04-19',
  ngay_ket_thuc: '2027-04-18',
  so_tien_value: 36802097,
  renewal_status: 'NEW',
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 13,
  tong_so_box: null
},
{
  id: 4111,
  contract_no: '0561/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'DOANH NGHIỆP TƯ NHÂN KIM LAN KL',
  ten_bang_hieu: 'PHÒNG THU ÂM KIM LAN KL',
  dia_chi_su_dung:
  '44U Tân Thất Thuyết, phường Vĩnh Hội, Thành phố Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-20',
  ngay_bat_dau: '2026-04-11',
  ngay_ket_thuc: '2026-10-10',
  so_tien_value: 5686200,
  renewal_status: 'NEW',
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 3,
  tong_so_box: null
},
{
  id: 4109,
  contract_no: '0042/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'CÔNG TY TNHH DỊCH VỤ KARAOKE NGUYỄN',
  ten_bang_hieu: 'KARAOKE NGUYỄN',
  dia_chi_su_dung:
  '685 Lê Văn Việt, Khu phố Cầu Xây, Phường Tăng Nhơn Phú, TP Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-01-09',
  ngay_bat_dau: '2026-01-27',
  ngay_ket_thuc: '2027-01-26',
  so_tien_value: 25500000,
  renewal_status: 'NEW',
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 12,
  tong_so_box: null
},
{
  id: 4104,
  contract_no: '0553/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'HỘ KINH DOANH KARAOKE TÁO ĐỎ 81',
  ten_bang_hieu: 'KARAOKE TÁO ĐỎ',
  dia_chi_su_dung: '119 Lê Đức Thọ, phường Gò Vấp, Tp. Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-17',
  ngay_bat_dau: '2027-04-10',
  ngay_ket_thuc: '2027-10-09',
  so_tien_value: 13343616,
  renewal_status: 'PENDING_RENEWAL',
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 10,
  tong_so_box: null
},
{
  id: 4095,
  contract_no: '0504/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'CÔNG TY TNHH KARAOKE 64',
  ten_bang_hieu: 'KARAOKE 64',
  dia_chi_su_dung: '690-692 Sư Vạn Hạnh, Phường Hòa Hưng, Tp. Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-07',
  ngay_bat_dau: '2026-04-01',
  ngay_ket_thuc: '2027-03-31',
  so_tien_value: null,
  renewal_status: null,
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 6,
  tong_so_box: null
},
{
  id: 4094,
  contract_no: '0503/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'CÔNG TY TNHH KARAOKE KING STAR',
  ten_bang_hieu: 'CHI NHÁNH KARAOKE QUEEN STAR',
  dia_chi_su_dung: '378 Nguyễn Văn Lượng, Phường An Hộ Đông, Tp. Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-07',
  ngay_bat_dau: '2026-04-17',
  ngay_ket_thuc: '2026-10-16',
  so_tien_value: 23220000,
  renewal_status: null,
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 22,
  tong_so_box: null
},
{
  id: 4093,
  contract_no: '0502/2026/HĐQTGAN-PN/PR',
  contract_year: 2026,
  don_vi_ten: 'CHI NHÁNH KARAOKE LUCKY STAR CÔNG TY TNHH KARAOKE KING STAR',
  ten_bang_hieu: 'KARAOKE LUCKY STAR',
  dia_chi_su_dung:
  '346-346A-346/2 Phan Văn Trị, Phường Bình Lợi Trung, Tp. Hồ Chí Minh',
  linh_vuc_hien_thi: 'Karaoke',
  region_code: 'HĐQTGAN-PN',
  field_code: 'PR',
  ngay_lap_hop_dong: '2026-04-07',
  ngay_bat_dau: '2026-04-06',
  ngay_ket_thuc: '2026-10-05',
  so_tien_value: 17550000,
  renewal_status: null,
  is_renewable: true,
  loai_hinh_karaoke: 'PHONG',
  tong_so_phong: 16,
  tong_so_box: null
}];


// ---- Computed status helpers ----

export type ExpiryStatus = 'active' | 'expiring' | 'expired';

export function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso).getTime();
  const b = new Date(toIso).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(
endIso: string,
todayIso: string = TODAY)
: {status: ExpiryStatus;daysLeft: number;} {
  const daysLeft = daysBetween(todayIso, endIso);
  if (daysLeft < 0) return { status: 'expired', daysLeft };
  if (daysLeft <= 60) return { status: 'expiring', daysLeft };
  return { status: 'active', daysLeft };
}

export const RENEWAL_LABEL: Record<
  NonNullable<RenewalStatus> | 'UNKNOWN',
  string> =
{
  NEW: 'Hợp đồng mới',
  PENDING_RENEWAL: 'Chờ tái ký',
  RENEWED: 'Đã tái ký',
  UNKNOWN: 'Chưa xác định'
};