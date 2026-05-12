// Real certificate_records sample data from VCPMC.
// Do NOT generate certificate_no for null rows — show "Chưa cấp số".

export type CertificateStatus = 'draft' | 'test_printed' | 'final_printed';

export type CertificateRecord = {
  id: number;
  certificate_id?: number;
  contract_id?: number;
  certificate_no: string | null;
  certificate_issue_date?: string | null;
  status: CertificateStatus;
  organization_name: string;
  business_registration_no?: string | null;
  business_sign_name: string | null;
  business_location?: string | null;
  address: string;
  contract_no: string;
  effective_from: string; // YYYY-MM-DD
  effective_to: string;
  gcn_scope_col_1_text?: string | null;
  gcn_scope_col_2_text?: string | null;
  gcn_scope_col_3_text?: string | null;
  offset_x_mm?: number;
  offset_y_mm?: number;
  created_at: string; // YYYY-MM-DD HH:mm:ss
  printed_at: string | null;
  printed_by?: string | null;
  print_count: number;
  has_qr_image?: boolean;
};

export const CERTIFICATE_RECORDS: CertificateRecord[] = [
{
  id: 2736,
  certificate_no: null,
  status: 'draft',
  organization_name: 'CÔNG TY TNHH ĐẦU TƯ GIẢI TRÍ KARAOKE ICOOL 9',
  business_sign_name: 'KARAOKE ICOOL',
  address: '129A Cách Mạng Tháng 8, phường Bàn Cờ, Tp. Hồ Chí Minh',
  contract_no: '0645/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-05-02',
  effective_to: '2027-05-01',
  created_at: '2026-05-08 03:35:16',
  printed_at: null,
  print_count: 0
},
{
  id: 2735,
  certificate_no: '0286/2026.GCN_KVC',
  status: 'test_printed',
  organization_name: 'CTY CỔ PHẦN TƯ VẤN ĐẦU TƯ GIẢI TRÍ VI – CN HẢI PHÒNG',
  business_sign_name: 'AEON MALL HẢI PHÒNG',
  address:
  'Lô T339,T460-1 T3, T4 TTTM Aeonmall HP Lê Chân, P.Lê Chân, Tp.Hải Phòng',
  contract_no: '0573/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-04-01',
  effective_to: '2027-03-31',
  created_at: '2026-05-07 03:07:32',
  printed_at: '2026-05-07 04:00:28',
  print_count: 5
},
{
  id: 2734,
  certificate_no: '0284/2026.GCN_KA',
  status: 'test_printed',
  organization_name: 'HỘ KINH DOANH KARAOKE THÀNH NGUYÊN369',
  business_sign_name: 'KARAOKE THÀNH NGUYÊN 369',
  address: 'Ấp Hải Sơn, xã Long Hải, Tp. Hồ Chí Minh',
  contract_no: '0606/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-04-25',
  effective_to: '2027-05-24',
  created_at: '2026-05-07 01:48:34',
  printed_at: '2026-05-07 03:01:33',
  print_count: 6
},
{
  id: 2733,
  certificate_no: null,
  status: 'draft',
  organization_name: 'HỘ KINH DOANH NGUYỄN THỊ THƠC NHI',
  business_sign_name: 'PHÒNG THU ÂM RO ME',
  address: '07 Lê Đại Hành, Phường Phú Thọ, Tp. Hồ Chí Minh',
  contract_no: '0618/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-05-01',
  effective_to: '2027-04-30',
  created_at: '2026-04-29 08:32:59',
  printed_at: null,
  print_count: 0
},
{
  id: 2732,
  certificate_no: null,
  status: 'draft',
  organization_name: 'HỘ KINH DOANH ĐINH THỊ XUÂN AN',
  business_sign_name: 'PHÒNG THU ÂM 179',
  address: '179 Trần Quý, phường Minh Phụng, Tp. Hồ Chí Minh',
  contract_no: '0614/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-04-10',
  effective_to: '2027-04-09',
  created_at: '2026-04-29 06:43:13',
  printed_at: null,
  print_count: 0
},
{
  id: 2731,
  certificate_no: '0137/2026.GCN_KA',
  status: 'final_printed',
  organization_name: 'CÔNG TY TNHH DỊCH VỤ TRẦN NGỌC THANH',
  business_sign_name: 'KARAOKE NGỌC THANH',
  address:
  '13/39/12 Đường số 4, Khu phố 3, phường Linh Xuân, Tp. Hồ Chí Minh',
  contract_no: '0581/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-04-19',
  effective_to: '2027-04-18',
  created_at: '2026-04-22 03:24:30',
  printed_at: '2026-04-22 06:43:01',
  print_count: 2
},
{
  id: 2730,
  certificate_no: '0135/2026.GCN_KA',
  status: 'test_printed',
  organization_name: 'DOANH NGHIỆP TƯ NHÂN KIM LAN KL',
  business_sign_name: 'PHÒNG THU ÂM KIM LAN KL',
  address: '44U Tân Thất Thuyết, phường Vĩnh Hội, Thành phố Hồ Chí Minh',
  contract_no: '0561/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-04-11',
  effective_to: '2026-10-10',
  created_at: '2026-04-20 03:53:58',
  printed_at: '2026-04-20 04:07:19',
  print_count: 1
},
{
  id: 2728,
  certificate_no: null,
  status: 'draft',
  organization_name: 'CÔNG TY TNHH DỊCH VỤ KARAOKE NGUYỄN',
  business_sign_name: 'KARAOKE NGUYỄN',
  address:
  '685 Lê Văn Việt, Khu phố Cầu Xây, Phường Tăng Nhơn Phú, TP Hồ Chí Minh',
  contract_no: '0042/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-01-27',
  effective_to: '2027-01-26',
  created_at: '2026-04-20 02:18:58',
  printed_at: null,
  print_count: 0
},
{
  id: 2720,
  certificate_no: '0131/2026.GCN_KA',
  status: 'final_printed',
  organization_name: 'HỘ KINH DOANH KARAOKE TÁO ĐỎ 81',
  business_sign_name: 'KARAOKE TÁO ĐỎ',
  address: '119 Lê Đức Thọ, phường Gò Vấp, Tp. Hồ Chí Minh',
  contract_no: '0553/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-04-10',
  effective_to: '2026-10-09',
  created_at: '2026-04-17 04:11:53',
  printed_at: '2026-04-17 04:17:21',
  print_count: 2
},
{
  id: 2714,
  certificate_no: null,
  status: 'draft',
  organization_name: 'CÔNG TY TNHH KARAOKE 64',
  business_sign_name: 'KARAOKE 64',
  address: '690-692 Sư Vạn Hạnh, Phường Hòa Hưng, Tp. Hồ Chí Minh',
  contract_no: '0504/2026/HĐQTGAN-PN/PR',
  effective_from: '2026-04-01',
  effective_to: '2027-03-31',
  created_at: '2026-04-15 13:33:02',
  printed_at: null,
  print_count: 0
}];


// Real workspace-wide counts (full DB), not just the 10 sample rows above.
export const CERTIFICATE_STATS = {
  total: 2601,
  draft: 1940,
  testPrinted: 6,
  finalPrinted: 655,
  missingNumber: 1940, // every draft is missing a number
  printedMultiple: 3 // rows in sample with print_count > 1 (2735=5, 2734=6, 2731=2, 2720=2 → 4 visible; keep small for hint)
};

export const CERTIFICATE_STATUS_LABEL: Record<CertificateStatus, string> = {
  draft: 'Bản nháp',
  test_printed: 'In thử',
  final_printed: 'In chính thức'
};

export const CERTIFICATE_STATUS_TONE: Record<
  CertificateStatus,
  'neutral' | 'warning' | 'success'> =
{
  draft: 'neutral',
  test_printed: 'warning',
  final_printed: 'success'
};
