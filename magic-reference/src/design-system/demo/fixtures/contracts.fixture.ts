export type ContractFixtureRow = {
  id: string;
  contractNo: string;
  customer: string;
  location: string;
  areas: string[];
  amount: number;
  status: 'Đang hiệu lực' | 'Sắp hết hạn' | 'Chờ tái ký' | 'Bản nháp' | 'Hết hạn';
  owner: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  certificateNo: string | null;
  note?: string | null;
};

const baseRows: ContractFixtureRow[] = [
  { id: '4206', contractNo: '0675/2026/HDQTGAN-PN', customer: 'Công ty TNHH Dịch vụ Giải trí Hoàng Minh Phát', location: '1388 đường số 12, phường Trung Tâm, TP. Hồ Chí Minh', areas: ['Karaoke'], amount: 186000000, status: 'Bản nháp', owner: 'Tổ khai thác miền Nam', effectiveFrom: '2026-03-11', effectiveTo: '2027-03-10', certificateNo: '0900', note: null },
  { id: '4119', contractNo: '0645/2026/HĐQTGAN-PN/PR', customer: 'Công ty TNHH Đầu tư Giải trí Sông Ngân 9', location: '129A trục chính nội khu, phường Bàn Cờ, TP. Hồ Chí Minh', areas: ['Karaoke', 'Phòng VIP'], amount: 924000000, status: 'Đang hiệu lực', owner: 'Tổ giấy phép trung tâm', effectiveFrom: '2026-05-02', effectiveTo: '2027-05-01', certificateNo: null, note: '26 phòng · stress case chiều rộng dài' },
  { id: '4116', contractNo: '0573/2026/HĐQTGAN-PN/PR', customer: 'Công ty Cổ phần Tư vấn Đầu tư Giải trí Duyên Hải Bắc Bộ', location: 'Lô T339, cụm thương mại tầng 3-4, quận cảng trung tâm, TP. Hải Phòng', areas: ['Box âm nhạc', 'Trung tâm thương mại'], amount: 312000000, status: 'Đang hiệu lực', owner: 'Phòng nền tảng background', effectiveFrom: '2026-04-01', effectiveTo: '2027-03-31', certificateNo: '0286/2026.GCN_KVC', note: null },
  { id: '4115', contractNo: '0606/2026/HĐQTGAN-PN/PR', customer: 'Hộ kinh doanh Karaoke Thành Nguyên 369', location: 'Ấp Hải Sơn, xã Long Phát, TP. Hồ Chí Minh', areas: ['Karaoke'], amount: 148500000, status: 'Sắp hết hạn', owner: 'Cụm theo dõi tái ký', effectiveFrom: '2026-04-25', effectiveTo: '2027-05-24', certificateNo: '0284/2026.GCN_KA', note: null },
  { id: '4021', contractNo: '0528/2026/HĐQTKARA-HN/PR', customer: 'Công ty TNHH Nhà hàng Mỹ Thuật Việt Nam Signature Collection', location: '53 trục thương mại trung tâm, phường Tân Định, Quận 1, TP. Hồ Chí Minh', areas: ['Nhà hàng', 'Tiệc cưới'], amount: 274300000, status: 'Đang hiệu lực', owner: 'Miền Nam 01', effectiveFrom: '2026-02-15', effectiveTo: '2027-02-14', certificateNo: '0219/2026.GCN_NH', note: null },
  { id: '3958', contractNo: '0491/2026/HĐQTGAN-DN/PR', customer: 'Công ty Cổ phần Dịch vụ Văn hóa Biển Xanh', location: 'Tuyến ven sông số 8, quận Hải Châu, TP. Đà Nẵng', areas: ['Bar', 'Lounge'], amount: 96500000, status: 'Chờ tái ký', owner: 'Miền Trung', effectiveFrom: '2026-01-20', effectiveTo: '2026-12-31', certificateNo: null, note: 'Chưa có số GCN' },
  { id: '3884', contractNo: '0459/2025/HĐQTKARA-CT/PR', customer: 'Khách sạn Riverside Garden Premium Hospitality and Convention Services', location: 'Khu đô thị bờ sông, quận Ninh Kiều, TP. Cần Thơ', areas: ['Khách sạn', 'Sảnh sự kiện'], amount: 451000000, status: 'Hết hạn', owner: 'Tây Nam Bộ', effectiveFrom: '2025-05-01', effectiveTo: '2026-04-30', certificateNo: '0112/2025.GCN_HS', note: 'Expired contract stress case' },
  { id: '3772', contractNo: '0412/2026/HĐQTKVC-PN/PR', customer: 'Công ty TNHH Trung tâm Mua sắm Sao Việt Mega Mall Operations', location: 'Đại lộ thương mại 88, phường Tân Phú, TP. Hồ Chí Minh', areas: ['Trung tâm thương mại', 'Sự kiện'], amount: 1180000000, status: 'Đang hiệu lực', owner: 'Enterprise key accounts', effectiveFrom: '2026-01-05', effectiveTo: '2027-01-04', certificateNo: '0102/2026.GCN_TTTM', note: null },
  { id: '3701', contractNo: '0394/2026/HĐQTKARA-HP/PR', customer: 'Công ty TNHH Giải trí Queen Premium Rooms Hải Phòng', location: '18 trục dân cư 34, phường trung tâm, quận ven cảng, TP. Hải Phòng', areas: ['Karaoke'], amount: 132000000, status: 'Đang hiệu lực', owner: 'Bắc Bộ', effectiveFrom: '2026-01-01', effectiveTo: '2026-12-31', certificateNo: null, note: null },
  { id: '3622', contractNo: '0378/2026/HĐQTBAR-HCM/PR', customer: 'Công ty TNHH Không gian Giải trí The Copper Room & After Hours Social Club', location: 'Tầng mái khu phức hợp trung tâm, Quận 3, TP. Hồ Chí Minh', areas: ['Bar'], amount: 287000000, status: 'Sắp hết hạn', owner: 'Nightlife vertical', effectiveFrom: '2026-03-01', effectiveTo: '2026-08-31', certificateNo: '0098/2026.GCN_BAR', note: 'Very long customer name' },
];

const fakeOwners = ['Miền Nam 01', 'Miền Nam 02', 'Miền Bắc 01', 'Phòng GCN', 'Phòng Pháp chế', 'Tổ tái ký', 'Khối reports'];
const fakeAreas = [['Karaoke'], ['Khách sạn'], ['Nhà hàng'], ['Karaoke', 'Phòng VIP'], ['Trung tâm thương mại'], ['Bar', 'Lounge']];
const statuses: ContractFixtureRow['status'][] = ['Đang hiệu lực', 'Đang hiệu lực', 'Đang hiệu lực', 'Sắp hết hạn', 'Chờ tái ký', 'Bản nháp', 'Hết hạn'];

export const contractFixtures: ContractFixtureRow[] = Array.from({ length: 50 }, (_, index) => {
  const seed = baseRows[index % baseRows.length];
  if (index < baseRows.length) return seed;
  const year = index % 5 === 0 ? 2025 : 2026;
  const number = String(500 + index).padStart(4, '0');
  const areaSet = fakeAreas[index % fakeAreas.length];
  return {
    ...seed,
    id: `fx-${index + 1}`,
    contractNo: `${number}/${year}/${index % 3 === 0 ? 'HĐQTGAN-PN/PR' : index % 3 === 1 ? 'HĐQTKARA-HN/PR' : 'HĐQTKVC-DN/PR'}`,
    customer: `${index % 4 === 0 ? 'Công ty TNHH' : index % 4 === 1 ? 'Công ty Cổ phần' : index % 4 === 2 ? 'Hộ kinh doanh' : 'Doanh nghiệp tư nhân'} ${['Âm Thanh Sao Việt', 'Giải trí Hồng Phúc', 'Dịch vụ Thương mại Đại Nam', 'Không gian Văn hóa Ánh Dương', 'Nhà hàng Nhịp Sống Mới'][index % 5]} ${index + 1}`,
    location: `${10 + index} ${['đường nội bộ', 'đại lộ trung tâm', 'trục thương mại', 'đường ven sông'][index % 4]}, ${['phường Bình An', 'phường Tân Lập', 'phường Minh Khai', 'phường Phú Hòa'][index % 4]}, ${['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'][index % 5]}`,
    areas: areaSet,
    amount: 85000000 + index * 17500000,
    status: statuses[index % statuses.length],
    owner: fakeOwners[index % fakeOwners.length],
    effectiveFrom: year === 2025 ? `2025-${String((index % 12) + 1).padStart(2, '0')}-01` : `2026-${String((index % 12) + 1).padStart(2, '0')}-01`,
    effectiveTo: year === 2025 ? `2026-${String((index % 12) + 1).padStart(2, '0')}-28` : `2027-${String((index % 12) + 1).padStart(2, '0')}-28`,
    certificateNo: index % 6 === 0 ? null : `${String(200 + index).padStart(4, '0')}/${year}.GCN_${index % 2 === 0 ? 'KA' : 'KVC'}`,
    note: index % 9 === 0 ? 'Thiếu số GCN hoặc cần rà soát hồ sơ pháp lý.' : null,
  };
});
