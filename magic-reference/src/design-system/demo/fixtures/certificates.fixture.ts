export type CertificateFixtureRow = {
  id: string;
  certificateNo: string | null;
  contractNo: string;
  organizationName: string;
  address: string;
  businessLocation: string;
  status: 'draft' | 'test_printed' | 'final_printed';
  printCount: number;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  scope: string;
};

export const certificateFixtures: CertificateFixtureRow[] = Array.from({ length: 20 }, (_, index) => ({
  id: `gcn-${index + 1}`,
  certificateNo: index % 5 === 0 ? null : `${String(280 + index).padStart(4, '0')}/2026.GCN_${index % 2 === 0 ? 'KA' : 'KVC'}`,
  contractNo: `${String(570 + index).padStart(4, '0')}/2026/${index % 2 === 0 ? 'HĐQTGAN-PN/PR' : 'HDQTGAN-PN'}`,
  organizationName: [
    'Công ty TNHH Dịch vụ Giải trí Hồng Phúc',
    'Công ty Cổ phần Trung tâm Âm nhạc Duyên Hải',
    'Hộ kinh doanh Karaoke Hoàng Gia 68',
    'Công ty TNHH Nhà hàng Sự kiện Phố Ánh Trăng',
  ][index % 4],
  address: `${120 + index} trục nội khu số ${index % 9}, phường Minh Khai, ${index % 2 === 0 ? 'TP. Hồ Chí Minh' : 'TP. Hải Phòng'}`,
  businessLocation: `${index % 3 === 0 ? 'Tầng trệt + lầu 1, cụm karaoke' : index % 3 === 1 ? 'Khối thương mại tầng 3-4' : 'Khu dịch vụ nhà hàng và sảnh phụ trợ'}, ${index % 2 === 0 ? 'quận trung tâm' : 'quận cảng'}`,
  status: index % 4 === 0 ? 'draft' : index % 3 === 0 ? 'final_printed' : 'test_printed',
  printCount: index % 4 === 0 ? 0 : (index % 5) + 1,
  effectiveFrom: `2026-${String((index % 5) + 1).padStart(2, '0')}-01`,
  effectiveTo: `2027-${String((index % 5) + 1).padStart(2, '0')}-28`,
  scope: index % 2 === 0 ? 'Karaoke · 4 phòng · bảng hiệu chuẩn in dọc' : 'Box âm nhạc · 2 cụm · có QR và kiểm soát offset',
}));
