export type NavItem = {
  id: string;
  label: string;
  caption?: string;
  badge?: string;
};

export type MetricItem = {
  label: string;
  value: string;
  delta?: string;
  tone?: 'accent' | 'success' | 'warning' | 'danger' | 'info';
};

export type ActivityItem = {
  title: string;
  meta: string;
  time: string;
  tone?: 'success' | 'warning' | 'info' | 'danger';
};

export type ContractRow = {
  id: string;
  contractNo: string;
  customer: string;
  location: string;
  areas: string[];
  amount: number;
  status: 'Đang hiệu lực' | 'Sắp hết hạn' | 'Chờ tái ký' | 'Bản nháp';
  owner: string;
};

export type DispatchRow = {
  id: string;
  dispatchNo: string;
  subject: string;
  destination: string;
  priority: 'Khẩn' | 'Chuẩn' | 'Theo dõi';
  status: 'Đã gửi' | 'Chờ ký' | 'Đang soạn';
};

export const demoNav: NavItem[] = [
  { id: 'overview', label: 'Tổng quan hệ thống', caption: 'Foundation · Tokens' },
  { id: 'gallery', label: 'Bộ thành phần', caption: 'Primitives · Patterns' },
  { id: 'dashboard', label: 'Enterprise Dashboard', caption: 'Cockpit · KPI', badge: 'Live mock' },
  { id: 'contracts', label: 'Contracts Workspace', caption: 'Dense table workspace' },
  { id: 'dispatches', label: 'Dispatches Workspace', caption: 'Công văn điều hành' },
  { id: 'create', label: 'Contract Creation', caption: 'Guided business form' },
  { id: 'print', label: 'Certificate Print', caption: 'Print control center' },
  { id: 'reports', label: 'Reports Workspace', caption: 'Insight & exports' },
];

export const metricCards: MetricItem[] = [
  { label: 'Hợp đồng đang quản lý', value: '12.486', delta: '+8.2%', tone: 'accent' },
  { label: 'Doanh thu dự kiến', value: '128,4 tỷ', delta: '+12,4%', tone: 'success' },
  { label: 'GCN chờ phát hành', value: '184', delta: '18 quá hạn', tone: 'warning' },
  { label: 'Công văn cần xử lý', value: '29', delta: '04 khẩn', tone: 'info' },
];

export const demoActivities: ActivityItem[] = [
  { title: 'Đối soát công văn karaoke miền Nam', meta: 'Phòng Pháp chế · Điều phối', time: '6 phút trước', tone: 'info' },
  { title: 'Hợp đồng VCPMC/2026/0824 chờ tái ký', meta: 'Khách hàng sắp hết hạn 14 ngày', time: '12 phút trước', tone: 'warning' },
  { title: 'Đã khóa lô GCN in chính thức tháng 06', meta: 'Chu kỳ phát hành · Thành công', time: '24 phút trước', tone: 'success' },
  { title: 'Phát hiện thiếu trường địa chỉ kinh doanh', meta: 'Luồng tạo hợp đồng · Cần rà soát', time: '45 phút trước', tone: 'danger' },
];

export const contractRows: ContractRow[] = [
  {
    id: 'ct-0824',
    contractNo: '0824/2026/HĐQTGAN-PN/PR',
    customer: 'Công ty TNHH Dịch vụ Âm nhạc Ánh Sao',
    location: 'Quận 1, TP.HCM',
    areas: ['Karaoke', 'Khách sạn', 'Sảnh sự kiện'],
    amount: 248000000,
    status: 'Đang hiệu lực',
    owner: 'Mai Anh',
  },
  {
    id: 'ct-0758',
    contractNo: '0758/2026/HĐQTKARA-HN/PR',
    customer: 'Nhà hàng Melody Signature',
    location: 'Ba Đình, Hà Nội',
    areas: ['Nhà hàng', 'Phòng VIP'],
    amount: 126500000,
    status: 'Sắp hết hạn',
    owner: 'Đức Nam',
  },
  {
    id: 'ct-0663',
    contractNo: '0663/2026/HĐQTGAN-DN/PR',
    customer: 'Karaoke Blue Harbor',
    location: 'Hải Châu, Đà Nẵng',
    areas: ['Karaoke'],
    amount: 89400000,
    status: 'Chờ tái ký',
    owner: 'Lan Hương',
  },
  {
    id: 'ct-0619',
    contractNo: '0619/2026/HĐQTKARA-CT/PR',
    customer: 'Khách sạn Green Riverside',
    location: 'Ninh Kiều, Cần Thơ',
    areas: ['Khách sạn', 'Lounge'],
    amount: 173200000,
    status: 'Bản nháp',
    owner: 'Quốc Bình',
  },
];

export const dispatchRows: DispatchRow[] = [
  {
    id: 'cv-188',
    dispatchNo: 'CV-188/2026/VCPMC',
    subject: 'Đề nghị bổ sung chứng từ quyết toán quý II',
    destination: 'Chi nhánh miền Nam',
    priority: 'Khẩn',
    status: 'Chờ ký',
  },
  {
    id: 'cv-172',
    dispatchNo: 'CV-172/2026/VCPMC',
    subject: 'Thông báo lịch in GCN đợt tháng 06',
    destination: 'Phòng Khai thác',
    priority: 'Chuẩn',
    status: 'Đã gửi',
  },
  {
    id: 'cv-161',
    dispatchNo: 'CV-161/2026/VCPMC',
    subject: 'Rà soát hợp đồng karaoke tồn đọng',
    destination: 'Khối vận hành miền Bắc',
    priority: 'Theo dõi',
    status: 'Đang soạn',
  },
];
