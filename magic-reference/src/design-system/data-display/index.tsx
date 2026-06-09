import React from 'react';
import { ActivityItem, ContractRow, DispatchRow } from '../demo/mockData';
import { formatMoney, toneClassMap, cx } from '../utils';
import { Badge, Button, Chip } from '../primitives';

export function TableShell({ title, description, toolbar, children }: { title: string; description: string; toolbar?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="vc-card vc-table-shell">
      <div className="vc-section-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        {toolbar}
      </div>
      {children}
    </section>
  );
}

export function TableToolbar({ children }: { children: React.ReactNode }) {
  return <div className="vc-toolbar">{children}</div>;
}

export function TablePagination() {
  return (
    <div className="vc-toolbar" style={{ marginTop: 'var(--vc-space-4)' }}>
      <div className="vc-toolbar__group">
        <span className="vc-pill">1–30 / 248</span>
        <span className="vc-pill">Mật độ: Comfortable</span>
      </div>
      <div className="vc-toolbar__group">
        <Button variant="ghost">Trước</Button>
        <Button variant="ghost">Sau</Button>
      </div>
    </div>
  );
}

export function TableDensityToggle() {
  return <div className="vc-pill">Compact · Comfortable · Detailed</div>;
}

export function BulkActionsBar() {
  return (
    <div className="vc-alert">
      <strong>12 dòng đã chọn</strong>
      <p style={{ marginBottom: 0 }}>Thao tác hàng loạt cho hợp đồng, GCN hoặc công văn đang được thể hiện như một thanh điều khiển cố định.</p>
    </div>
  );
}

export function EmptyTableState() {
  return <div className="vc-empty"><strong>Không có bản ghi</strong><p>Thử thay đổi bộ lọc hoặc tạo hợp đồng mới.</p></div>;
}

export function LoadingTableState() {
  return <div className="vc-skeleton"><div className="vc-skeleton__bar" /><div className="vc-skeleton__bar" style={{ width: '88%' }} /><div className="vc-skeleton__bar" style={{ width: '72%' }} /></div>;
}

export function ErrorTableState() {
  return <div className="vc-alert"><strong>Không tải được workspace</strong><p>Demo này chỉ dùng mock data và mô phỏng trạng thái lỗi để hoàn thiện thiết kế.</p></div>;
}

export function ContractStatusBadge({ status }: { status: ContractRow['status'] }) {
  const tone = status === 'Đang hiệu lực' ? 'success' : status === 'Sắp hết hạn' ? 'warning' : status === 'Chờ tái ký' ? 'violet' : 'neutral';
  return <Badge tone={tone}>{status}</Badge>;
}

export function DispatchStatusBadge({ status }: { status: DispatchRow['status'] }) {
  const tone = status === 'Đã gửi' ? 'success' : status === 'Chờ ký' ? 'warning' : 'info';
  return <Badge tone={tone}>{status}</Badge>;
}

export function ContractNoCell({ contractNo }: { contractNo: string }) {
  const parts = contractNo.split('/');
  return (
    <div>
      <div className="vc-table__primary">{parts.slice(0, 2).join('/')}</div>
      <div className="vc-table__secondary">{parts.slice(2).join('/')}</div>
    </div>
  );
}

export function CustomerCell({ customer }: { customer: string }) {
  return <div className="vc-table__primary">{customer}</div>;
}

export function BusinessLocationCell({ location }: { location: string }) {
  return <div className="vc-table__secondary">{location}</div>;
}

export function UsageAreaChipGroup({ areas }: { areas: string[] }) {
  return <div className="vc-chip-group">{areas.map((area) => <Chip key={area} tone="teal">{area}</Chip>)}</div>;
}

export function RoyaltyAmountCell({ amount }: { amount: number }) {
  return <div className="vc-table__primary">{formatMoney(amount)}</div>;
}

export function RowActions() {
  return <Button variant="ghost">Mở menu</Button>;
}

export function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <div className="vc-stack">
      {items.map((item) => (
        <div key={item.title} className="vc-card vc-card--dense">
          <div className="vc-section-header" style={{ marginBottom: 0 }}>
            <div>
              <h3 style={{ fontSize: '0.96rem' }}>{item.title}</h3>
              <p>{item.meta}</p>
            </div>
            <span className={cx('vc-pill', toneClassMap[item.tone ?? 'info'])}>{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecentList({ items }: { items: string[] }) {
  return <div className="vc-stack">{items.map((item) => <div key={item} className="vc-pill">{item}</div>)}</div>;
}

export function AlertPanel({ title, description }: { title: string; description: string }) {
  return <div className="vc-alert"><strong>{title}</strong><p>{description}</p></div>;
}
