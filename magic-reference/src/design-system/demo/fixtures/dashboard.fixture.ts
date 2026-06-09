import { contractFixtures } from './contracts.fixture';
import { certificateFixtures } from './certificates.fixture';
import { dispatchFixtures } from './dispatches.fixture';

export const dashboardFixtures = {
  heroTitle: `${contractFixtures.length} hợp đồng mẫu theo shape thật, ${certificateFixtures.filter((row) => row.status === 'draft').length} GCN chờ phát hành, ${dispatchFixtures.filter((row) => row.priority === 'Khẩn').length} công văn ưu tiên khẩn.`,
  metricCards: [
    { label: 'Hợp đồng đang quản lý', value: '12.486', delta: '+8,2%', tone: 'accent' as const },
    { label: 'Doanh thu dự kiến', value: '128,4 tỷ', delta: '+12,4%', tone: 'success' as const },
    { label: 'GCN chờ phát hành', value: String(certificateFixtures.filter((row) => row.status === 'draft').length), delta: 'Có thiếu số GCN', tone: 'warning' as const },
    { label: 'Công văn cần xử lý', value: String(dispatchFixtures.length), delta: `${dispatchFixtures.filter((row) => row.priority === 'Khẩn').length} khẩn`, tone: 'info' as const },
  ],
  activities: [
    { title: 'Rà soát lô karaoke có danh sách phòng dài', meta: 'Dựa trên contract_levels read-only sample', time: '6 phút trước', tone: 'info' as const },
    { title: 'Phát hiện nhiều GCN thiếu số nhưng đã có context in thử', meta: 'certificate_records sample', time: '12 phút trước', tone: 'warning' as const },
    { title: 'Đồng bộ bộ nhãn domain và business location cho design lab', meta: 'domains + business_locations sample', time: '24 phút trước', tone: 'success' as const },
    { title: 'Công văn demo được suy diễn vì bảng bg_congvan hiện trống', meta: 'Không có hàng thật để snapshot', time: '45 phút trước', tone: 'danger' as const },
  ],
};
