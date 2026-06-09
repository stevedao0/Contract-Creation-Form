export type DispatchFixtureRow = {
  id: string;
  dispatchNo: string;
  subject: string;
  destination: string;
  priority: 'Khẩn' | 'Chuẩn' | 'Theo dõi';
  status: 'Đã gửi' | 'Chờ ký' | 'Đang soạn';
  contractNo: string;
  issueDate: string;
  note?: string;
};

export const dispatchFixtures: DispatchFixtureRow[] = Array.from({ length: 20 }, (_, index) => ({
  id: `cv-${index + 1}`,
  dispatchNo: `CV-${String(180 + index).padStart(3, '0')}/2026/VCPMC`,
  subject: [
    'Đề nghị bổ sung chứng từ quyết toán kỳ gần nhất',
    'Thông báo lịch in GCN và khóa lô phát hành',
    'Rà soát hợp đồng karaoke sắp hết hạn',
    'Yêu cầu xác minh địa điểm kinh doanh và bảng hiệu',
    'Đôn đốc hoàn tất phụ lục phạm vi khai thác',
  ][index % 5],
  destination: [
    'Chi nhánh miền Nam',
    'Khối vận hành miền Bắc',
    'Phòng pháp chế & cấp phép',
    'Tổ khai thác nền tảng background',
    'Ban điều phối công văn',
  ][index % 5],
  priority: index % 6 === 0 ? 'Khẩn' : index % 2 === 0 ? 'Chuẩn' : 'Theo dõi',
  status: index % 5 === 0 ? 'Chờ ký' : index % 3 === 0 ? 'Đang soạn' : 'Đã gửi',
  contractNo: `${String(610 + index).padStart(4, '0')}/2026/${index % 2 === 0 ? 'HĐQTGAN-PN/PR' : 'HĐQTKARA-HN/PR'}`,
  issueDate: `2026-${String((index % 6) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
  note: index % 7 === 0 ? 'Dispatch fixtures are inferred because bg_congvan sample rows were empty.' : '',
}));
