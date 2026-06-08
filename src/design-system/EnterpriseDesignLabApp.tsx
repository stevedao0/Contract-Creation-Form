import React, { useMemo, useState } from 'react';
import './foundation/enterprise.css';
import {
  certificateRows,
  contractRows,
  demoActivities,
  demoNav,
  dispatchRows,
  domainLabels,
  expiringContractRows,
  metricCards,
  priorityDispatchRows,
  reportBreakdown,
  riskyCertificateRows,
} from './demo/mockData';
import { Badge, Button, Card, Chip, Dialog, EmptyState, IconButton, Panel, ScrollArea, Separator, Skeleton, Tabs, Tooltip } from './primitives';
import { EnterpriseAppShell, WorkspaceSidebar, Topbar, Page, PageHeader, PageSection, WorkspaceLayout, DomainSwitcher } from './layout';
import { TextField, Textarea, SelectField, MoneyInput, PercentInput, DatePicker, FileUpload } from './forms';
import { ActivityList, AlertPanel, BulkActionsBar, ContractNoCell, ContractStatusBadge, CustomerCell, BusinessLocationCell, UsageAreaChipGroup, RoyaltyAmountCell, DispatchStatusBadge, EmptyTableState, ErrorTableState, LoadingTableState, RecentList, RowActions, TableDensityToggle, TablePagination, TableShell, TableToolbar } from './data-display';

const fmtDate = (value: string | null) => value ?? '—';
const compactMoney = (value: number) => `${(value / 1000000).toLocaleString('vi-VN')} triệu`;
const metricTrend = ['▁▂▃▄▅▆▇', '▇▆▅▄▃▂▁', '▁▃▅▃▆▅▇', '▂▂▃▄▅▅▆', '▁▂▂▃▅▆▇', '▃▄▃▅▄▆▇'];

function OverviewScreen() {
  return (
    <Page>
      <PageHeader
        title="VCPMC Enterprise OS"
        description="Real-data-shaped command center language for contracts, certificates, dispatches, and reporting workflows."
        actions={<Badge tone="accent">Main only · fixture-shaped</Badge>}
      />
      <div className="vc-hero vc-hero--dense">
        <div className="vc-hero__headline">
          <div className="vc-eyebrow">Data shape first</div>
          <h1>Designed around long Vietnamese contract identifiers, dense customer records, realistic royalty ranges, and print-control edge cases.</h1>
          <p>The command center now uses the sanitized fixture set as the visual baseline instead of short invented demo rows.</p>
          <div className="vc-toolbar__group">
            <div className="vc-pill vc-pill--accent">Contract no up to 24 chars</div>
            <div className="vc-pill">Customer up to 73 chars</div>
            <div className="vc-pill">Address up to 76 chars</div>
          </div>
        </div>
        <Panel>
          <div className="vc-section-header">
            <div>
              <h3>UI constraints from fixtures</h3>
              <p>Current baseline needed denser rows, better truncation hierarchy, clearer money alignment, and stronger print queue warning states.</p>
            </div>
          </div>
          <RecentList items={[
            'Mono contract numbers with stable width',
            'Long customer + address hierarchy in one cell',
            'Draft GCN rows without certificate number',
            'Urgent dispatch queues with next-action cues',
            'Compact status chips and sticky workspace controls',
          ]} />
        </Panel>
      </div>
    </Page>
  );
}

function GalleryScreen() {
  const stressContract = contractRows[9];
  const pendingCert = riskyCertificateRows[0];
  const urgentDispatch = priorityDispatchRows[0];

  return (
    <Page>
      <PageHeader title="Component Gallery" description="Stress examples proving the system handles realistic field lengths, states, and dense workflows." actions={<Badge tone="teal">Stress-tested</Badge>} />
      <div className="vc-gallery-grid">
        <Card>
          <h3>Long customer cell</h3>
          <CustomerCell customer={stressContract.customer} />
          <BusinessLocationCell location={stressContract.location} />
          <div className="vc-inline-note">Truncation + hierarchy for customer and address in compact rows.</div>
        </Card>
        <Card>
          <h3>Money + contract state</h3>
          <ContractNoCell contractNo={stressContract.contractNo} />
          <div style={{ marginTop: 10 }}><RoyaltyAmountCell amount={stressContract.amount} /></div>
          <div className="vc-toolbar__group" style={{ marginTop: 10 }}>
            <ContractStatusBadge status={stressContract.status} />
            <Badge tone="warning">Expired / renewal risk</Badge>
          </div>
        </Card>
        <Card>
          <h3>Certificate warning state</h3>
          <div className="vc-stack-sm">
            <div className="vc-table__primary">{pendingCert.organizationName}</div>
            <div className="vc-table__secondary">{pendingCert.certificateNo ?? 'Chưa có số GCN'}</div>
            <div className="vc-toolbar__group">
              <Badge tone="warning">Pending certificate</Badge>
              <Badge tone="danger">Missing number</Badge>
            </div>
          </div>
        </Card>
        <Card>
          <h3>Urgent dispatch</h3>
          <div className="vc-stack-sm">
            <div className="vc-table__primary">{urgentDispatch.dispatchNo}</div>
            <div className="vc-table__secondary">{urgentDispatch.subject}</div>
            <div className="vc-toolbar__group">
              <Badge tone="danger">{urgentDispatch.priority}</Badge>
              <DispatchStatusBadge status={urgentDispatch.status} />
            </div>
          </div>
        </Card>
      </div>
      <div className="vc-grid-3">
        <EmptyTableState />
        <LoadingTableState />
        <ErrorTableState />
      </div>
      <div className="vc-grid-2">
        <Card>
          <h3>Selection + bulk actions</h3>
          <BulkActionsBar />
          <div className="vc-inline-note">Shows selected-row pattern and dense action rhythm.</div>
        </Card>
        <Card>
          <h3>Density states</h3>
          <div className="vc-toolbar__group">
            <TableDensityToggle />
            <div className="vc-pill">Compact</div>
            <div className="vc-pill">Comfortable</div>
          </div>
          <div style={{ marginTop: 12 }}><Separator /></div>
          <div style={{ marginTop: 12 }}><Tooltip label="Column visibility control" /></div>
        </Card>
      </div>
    </Page>
  );
}

function DashboardScreen() {
  return (
    <Page>
      <PageHeader title="Enterprise Dashboard" description="Premium operational cockpit using real-data-shaped contract, certificate, and dispatch fixtures." actions={<Button variant="primary">Xuất snapshot</Button>} />
      <div className="vc-command-strip">
        {metricCards.slice(0, 6).map((item, index) => (
          <Card key={item.label}>
            <div className="vc-metric-card">
              <div className="vc-metric-card__top">
                <span>{item.label}</span>
                <Badge tone={item.tone ?? 'accent'}>{index === 2 ? 'Risk' : index === 5 ? 'SLA' : 'Ổn định'}</Badge>
              </div>
              <strong>{item.value}</strong>
              <div className="vc-metric-card__bottom">
                <span>{item.delta}</span>
                <span className="vc-trend">{metricTrend[index]}</span>
              </div>
              <small>{index % 2 === 0 ? 'So với 7 ngày trước' : 'Cập nhật theo queue nội bộ'}</small>
            </div>
          </Card>
        ))}
      </div>
      <div className="vc-grid-2 vc-grid-2--asymmetric">
        <Card>
          <div className="vc-section-header">
            <div>
              <h3>Revenue & contract health cockpit</h3>
              <p>Revenue trend, domain mix, health distribution, and command risk score in one dense workbench.</p>
            </div>
            <Badge tone="accent">SLA 92/100</Badge>
          </div>
          <div className="vc-cockpit-grid">
            <div className="vc-chart-panel">
              <div className="vc-chart-title">Doanh thu theo chu kỳ</div>
              <div className="vc-line-visual">▁▂▃▄▅▆▇▆▅▆▇</div>
              <div className="vc-inline-note">128,4 tỷ dự kiến · trục chính đang tăng theo hợp đồng key account.</div>
            </div>
            <div className="vc-chart-panel">
              <div className="vc-chart-title">Phân bổ theo lĩnh vực</div>
              {reportBreakdown.map((item) => (
                <div key={item.label} className="vc-bar-row"><span>{item.label}</span><div><i style={{ width: `${item.count / 4}px` }} /></div><strong>{item.count}</strong></div>
              ))}
            </div>
            <div className="vc-chart-panel">
              <div className="vc-chart-title">Contract health</div>
              {['Đang hiệu lực', 'Sắp hết hạn', 'Chờ tái ký', 'Bản nháp', 'Hết hạn'].map((status) => (
                <div key={status} className="vc-health-row"><span>{status}</span><strong>{contractRows.filter((row) => row.status === status).length}</strong></div>
              ))}
            </div>
            <div className="vc-chart-panel">
              <div className="vc-chart-title">Risk summary</div>
              <div className="vc-risk-score">74</div>
              <div className="vc-inline-note">4 GCN draft thiếu số · 3 công văn khẩn · 12 hợp đồng cần theo dõi tái ký.</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="vc-section-header">
            <div>
              <h3>Intelligence panel</h3>
              <p>Today risk summary, approvals, print warnings, and suggested next actions.</p>
            </div>
          </div>
          <ActivityList items={demoActivities} />
          <div className="vc-stack-sm" style={{ marginTop: 16 }}>
            <div className="vc-pill">7 pending approvals</div>
            <div className="vc-pill">4 print warnings</div>
            <div className="vc-pill">2 batch review lanes</div>
          </div>
        </Card>
      </div>
      <div className="vc-grid-3">
        <QueueCard title="Expiring contracts queue" rows={expiringContractRows.slice(0, 5).map((row, index) => ({
          primary: row.customer,
          secondary: `${row.contractNo} · hết hiệu lực ${fmtDate(row.effectiveTo)}`,
          tag: index < 2 ? 'Ưu tiên' : row.status,
        }))} />
        <QueueCard title="Certificate print queue" rows={riskyCertificateRows.slice(0, 5).map((row) => ({
          primary: row.organizationName,
          secondary: `${row.contractNo} · ${row.certificateNo ?? 'Chưa có số GCN'}`,
          tag: row.status,
        }))} />
        <QueueCard title="Dispatch follow-up queue" rows={priorityDispatchRows.slice(0, 5).map((row) => ({
          primary: row.subject,
          secondary: `${row.dispatchNo} · ${row.contractNo}`,
          tag: row.priority,
        }))} />
      </div>
    </Page>
  );
}

function ContractsScreen() {
  const rows = contractRows.slice(0, 18);
  return (
    <Page>
      <PageHeader title="Contracts Workspace" description="Dense contract command desk designed around real field lengths, status distributions, and renewal pressure." actions={<Button variant="primary">Tạo hợp đồng</Button>} />
      <div className="vc-workspace-tabs"><Tabs items={['Tất cả', 'Sắp hết hạn', 'Chờ tái ký', 'Thiếu GCN', 'Key accounts']} active="Tất cả" /></div>
      <BulkActionsBar />
      <TableShell
        title="Danh sách hợp đồng"
        description="Sticky controls, compact row hierarchy, long-text handling, selected-row sample, and footer summary."
        toolbar={
          <TableToolbar>
            <div className="vc-toolbar__group vc-toolbar__sticky">
              <input className="vc-input" placeholder="Tìm theo số hợp đồng, khách hàng, địa bàn…" style={{ minWidth: 320 }} />
              <div className="vc-pill">Trạng thái</div>
              <div className="vc-pill">Lĩnh vực</div>
              <div className="vc-pill">Phụ trách</div>
              <div className="vc-pill">Ngày hiệu lực</div>
              <div className="vc-pill">Chế độ cột</div>
            </div>
            <div className="vc-toolbar__group">
              <TableDensityToggle />
              <Button variant="ghost">Hiện/ẩn cột</Button>
              <Button variant="ghost">Lưu view</Button>
            </div>
          </TableToolbar>
        }
      >
        <table className="vc-table vc-table--dense">
          <thead>
            <tr>
              <th style={{ width: 42 }}><input type="checkbox" checked readOnly /></th>
              <th style={{ width: 220 }}>Hợp đồng</th>
              <th style={{ width: 320 }}>Khách hàng</th>
              <th style={{ width: 220 }}>Lĩnh vực</th>
              <th style={{ width: 160, textAlign: 'right' }}>Giá trị quyền</th>
              <th style={{ width: 140 }}>Trạng thái</th>
              <th style={{ width: 160 }}>GCN</th>
              <th style={{ width: 150 }}>Phụ trách</th>
              <th style={{ width: 120 }}>Hiệu lực</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} data-selected={index === 1 ? 'true' : undefined}>
                <td><input type="checkbox" checked={index < 2} readOnly /></td>
                <td>
                  <ContractNoCell contractNo={row.contractNo} />
                  <div className="vc-table__secondary">{row.note ?? 'Không có cảnh báo bổ sung'}</div>
                </td>
                <td>
                  <CustomerCell customer={row.customer} />
                  <BusinessLocationCell location={row.location} />
                </td>
                <td><UsageAreaChipGroup areas={row.areas} /></td>
                <td style={{ textAlign: 'right' }}><RoyaltyAmountCell amount={row.amount} /></td>
                <td><ContractStatusBadge status={row.status} /></td>
                <td>
                  <div className="vc-table__primary">{row.certificateNo ?? 'Chưa có số GCN'}</div>
                  <div className="vc-table__secondary">{row.certificateNo ? 'Đã liên kết' : 'Pending print'}</div>
                </td>
                <td>
                  <div className="vc-table__primary">{row.owner}</div>
                  <div className="vc-table__secondary">{index % 3 === 0 ? 'Nhắc tái ký' : 'Theo dõi định kỳ'}</div>
                </td>
                <td>
                  <div className="vc-table__secondary">{fmtDate(row.effectiveFrom)}</div>
                  <div className="vc-table__secondary">{fmtDate(row.effectiveTo)}</div>
                </td>
                <td><RowActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="vc-table-footer-summary">
          <span>Đang chọn 2 hợp đồng</span>
          <span>{rows.length} / {contractRows.length} dòng hiển thị</span>
          <span>Tổng giá trị trang này: {compactMoney(rows.reduce((sum, row) => sum + row.amount, 0))}</span>
        </div>
        <TablePagination />
      </TableShell>
      <div className="vc-grid-3">
        <EmptyTableState />
        <LoadingTableState />
        <ErrorTableState />
      </div>
    </Page>
  );
}

function DispatchesScreen() {
  return (
    <Page>
      <PageHeader title="Dispatches Workspace" description="Official-letter work queue with urgency controls, batch actions, responsible staff, and next steps." actions={<Button variant="primary">Soạn công văn</Button>} />
      <WorkspaceLayout
        primary={
          <TableShell
            title="Luồng công văn"
            description="Operational queue based on fixture-shaped dispatch records inferred from table structure."
            toolbar={<TableToolbar><div className="vc-toolbar__group"><div className="vc-pill">Ưu tiên</div><div className="vc-pill">Người ký</div><div className="vc-pill">Batch actions</div></div><div className="vc-toolbar__group"><Button variant="ghost">Xuất danh sách</Button></div></TableToolbar>}
          >
            <table className="vc-table vc-table--dense">
              <thead>
                <tr>
                  <th>Số công văn</th>
                  <th>Hợp đồng</th>
                  <th>Issue type / khách hàng</th>
                  <th>Ngày tạo/gửi</th>
                  <th>Phụ trách</th>
                  <th>Next action</th>
                  <th>Ưu tiên</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {dispatchRows.map((row, index) => (
                  <tr key={row.id}>
                    <td><div className="vc-table__primary">{row.dispatchNo}</div><div className="vc-table__secondary">Batch {String((index % 4) + 1).padStart(2, '0')}</div></td>
                    <td><ContractNoCell contractNo={row.contractNo} /></td>
                    <td><div className="vc-table__primary">{row.subject}</div><div className="vc-table__secondary">{['Công ty Hồng Phúc', 'Karaoke Thành Nguyên', 'Mega Mall Sao Việt', 'Riverside Garden'][index % 4]}</div></td>
                    <td><div className="vc-table__primary">{row.issueDate}</div><div className="vc-table__secondary">{row.status === 'Đã gửi' ? 'Đã phát hành' : 'Chờ thao tác'}</div></td>
                    <td><div className="vc-table__primary">{['Pháp chế 01', 'Điều phối 02', 'GCN 03', 'Miền Nam 04'][index % 4]}</div><div className="vc-table__secondary">{row.destination}</div></td>
                    <td><div className="vc-table__primary">{row.status === 'Chờ ký' ? 'Trình ký' : row.status === 'Đang soạn' ? 'Hoàn tất nội dung' : 'Theo dõi phản hồi'}</div><div className="vc-table__secondary">{row.note || 'Queue bình thường'}</div></td>
                    <td><Badge tone={row.priority === 'Khẩn' ? 'danger' : row.priority === 'Chuẩn' ? 'info' : 'neutral'}>{row.priority}</Badge></td>
                    <td><DispatchStatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        }
        secondary={<AlertPanel title="Dispatch intelligence" description="3 công văn khẩn cần trình ký, 4 công văn cần xác minh địa điểm, 2 batch đang chờ khóa phát hành." />}
      />
    </Page>
  );
}

function CreateContractScreen() {
  return (
    <Page>
      <PageHeader title="Contract Creation Form" description="Guided business workflow with denser sections and context tuned to real fixture lengths." actions={<Badge tone="accent">Workflow demo</Badge>} />
      <div className="vc-grid-2">
        <PageSection title="Thông tin hợp đồng" description="Compact data-entry rhythm with fixture-based examples for long identifiers and domain mixes.">
          <div className="vc-form-grid">
            <TextField label="Số hợp đồng" required hint="Ví dụ: 0645/2026/HĐQTGAN-PN/PR" />
            <SelectField label="Lĩnh vực" options={domainLabels.slice(0, 6)} />
            <TextField label="Tên khách hàng" required />
            <TextField label="Địa bàn kinh doanh" />
            <DatePicker label="Ngày hiệu lực" />
            <DatePicker label="Ngày kết thúc" />
            <MoneyInput label="Mức quyền tác giả" />
            <PercentInput label="VAT" />
          </div>
        </PageSection>
        <PageSection title="Điều khiển nghiệp vụ" description="Hints, warnings, uploads, and downstream print/export readiness.">
          <div className="vc-stack">
            <AlertPanel title="Guided workflow" description="Use structured hints, legal notes, and business warnings beside the form instead of mixing everything into the main body." />
            <FileUpload label="Tải phụ lục / chứng từ" />
            <Textarea label="Ghi chú nội bộ" hint="Only internal remarks for legal/operations review." rows={6} />
          </div>
        </PageSection>
      </div>
    </Page>
  );
}

function PrintScreen() {
  const selected = certificateRows[0];
  return (
    <Page>
      <PageHeader title="Certificate Print Control" description="Print-control station for selected queue item, safety checks, preview, and issuance history." actions={<Button variant="primary">Khóa lô in</Button>} />
      <div className="vc-grid-2 vc-grid-2--asymmetric">
        <Card>
          <div className="vc-section-header">
            <div>
              <h3>Selected print job</h3>
              <p>{selected.organizationName}</p>
            </div>
            <Badge tone={selected.certificateNo ? 'accent' : 'warning'}>{selected.certificateNo ?? 'Thiếu số GCN'}</Badge>
          </div>
          <div className="vc-print-summary">
            <div><span>Hợp đồng</span><strong>{selected.contractNo}</strong></div>
            <div><span>Hiệu lực</span><strong>{fmtDate(selected.effectiveFrom)} → {fmtDate(selected.effectiveTo)}</strong></div>
            <div><span>QR status</span><strong>Sẵn sàng kiểm tra</strong></div>
            <div><span>Tọa độ in</span><strong>An toàn · lệch dưới 0.8mm</strong></div>
          </div>
          <div className="vc-toolbar__group" style={{ marginTop: 16 }}>
            <Button variant="subtle">In thử</Button>
            <Button variant="primary">In chính thức</Button>
            <Button variant="ghost">Tải PDF</Button>
            <Button variant="ghost">Mở QR</Button>
          </div>
          <div className="vc-paper-preview">
            <div className="vc-paper-preview__sheet">
              <div className="vc-paper-preview__title">Preview giấy chứng nhận</div>
              <div className="vc-paper-preview__line">{selected.organizationName}</div>
              <div className="vc-paper-preview__line">{selected.address}</div>
              <div className="vc-paper-preview__line">{selected.scope}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="vc-section-header">
            <div>
              <h3>Print queue & warnings</h3>
              <p>Pending print state, missing certificate number, and history.</p>
            </div>
          </div>
          <div className="vc-queue-list">
            {riskyCertificateRows.slice(0, 6).map((row) => (
              <div key={row.id} className="vc-queue-item">
                <div>
                  <div className="vc-table__primary">{row.organizationName}</div>
                  <div className="vc-table__secondary">{row.contractNo} · {row.certificateNo ?? 'Chưa có số GCN'}</div>
                </div>
                <Badge tone={row.certificateNo ? 'info' : 'warning'}>{row.status}</Badge>
              </div>
            ))}
          </div>
          <Dialog title="Phát hành GCN">
            <p style={{ margin: 0, color: 'var(--vc-text-soft)' }}>Xác nhận trạng thái giấy, căn lề, watermark test print, và tình trạng thiếu số GCN trước khi in chính thức.</p>
          </Dialog>
        </Card>
      </div>
    </Page>
  );
}

function ReportsScreen() {
  return (
    <Page>
      <PageHeader title="Reports Workspace" description="Analytics-grade reporting with revenue trend, domain breakdown, status distribution, and export controls." actions={<Button variant="primary">Xuất báo cáo</Button>} />
      <div className="vc-report-toolbar">
        <div className="vc-toolbar__group">
          <div className="vc-pill">Tháng 06/2026</div>
          <div className="vc-pill">Miền Nam</div>
          <div className="vc-pill">Theo lĩnh vực</div>
        </div>
        <div className="vc-toolbar__group">
          <Button variant="ghost">Xuất Excel</Button>
          <Button variant="ghost">Xuất PDF</Button>
        </div>
      </div>
      <div className="vc-grid-2 vc-grid-2--asymmetric">
        <Card>
          <div className="vc-section-header"><div><h3>Revenue trend</h3><p>Royalty trajectory and contract portfolio health.</p></div></div>
          <div className="vc-line-visual vc-line-visual--large">▁▂▂▃▄▅▆▆▇█</div>
          <div className="vc-inline-note">Chu kỳ phát hành GCN trung bình 12,8 ngày · 1.248 hợp đồng có đối soát kỳ này.</div>
        </Card>
        <Card>
          <div className="vc-section-header"><div><h3>Contract status distribution</h3><p>Compact operational distribution.</p></div></div>
          {['Đang hiệu lực', 'Sắp hết hạn', 'Chờ tái ký', 'Bản nháp', 'Hết hạn'].map((status) => (
            <div key={status} className="vc-health-row"><span>{status}</span><strong>{contractRows.filter((row) => row.status === status).length}</strong></div>
          ))}
        </Card>
      </div>
      <div className="vc-grid-2">
        <Card>
          <div className="vc-section-header"><div><h3>Domain breakdown</h3><p>Real label mix from sampled domains.</p></div></div>
          {reportBreakdown.map((item) => (
            <div key={item.label} className="vc-bar-row"><span>{item.label}</span><div><i style={{ width: `${item.count / 4}px` }} /></div><strong>{item.count}</strong></div>
          ))}
        </Card>
        <Card>
          <div className="vc-section-header"><div><h3>Employee-style performance table</h3><p>Visual-only ops review.</p></div></div>
          <table className="vc-table vc-table--dense">
            <thead><tr><th>Nhân sự</th><th>Hợp đồng</th><th>GCN</th><th>Công văn</th><th>SLA</th></tr></thead>
            <tbody>
              {['Miền Nam 01', 'GCN 02', 'Pháp chế 03', 'Điều phối 04'].map((staff, index) => (
                <tr key={staff}><td>{staff}</td><td>{18 + index}</td><td>{6 + index}</td><td>{3 + index}</td><td>{92 - index}%</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <Card>
        <div className="vc-section-header"><div><h3>Expiring contracts</h3><p>Management review table for near-term renewal load.</p></div></div>
        <table className="vc-table vc-table--dense">
          <thead><tr><th>Hợp đồng</th><th>Khách hàng</th><th>Hiệu lực đến</th><th>Giá trị</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {expiringContractRows.slice(0, 8).map((row) => (
              <tr key={row.id}><td><ContractNoCell contractNo={row.contractNo} /></td><td><CustomerCell customer={row.customer} /></td><td>{fmtDate(row.effectiveTo)}</td><td style={{ textAlign: 'right' }}>{compactMoney(row.amount)}</td><td><ContractStatusBadge status={row.status} /></td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

function QueueCard({ title, rows }: { title: string; rows: Array<{ primary: string; secondary: string; tag: string }> }) {
  return (
    <Card>
      <div className="vc-section-header">
        <div>
          <h3>{title}</h3>
          <p>Serious work queue using fixture-shaped data.</p>
        </div>
      </div>
      <div className="vc-queue-list">
        {rows.map((row) => (
          <div key={`${title}-${row.secondary}`} className="vc-queue-item">
            <div>
              <div className="vc-table__primary">{row.primary}</div>
              <div className="vc-table__secondary">{row.secondary}</div>
            </div>
            <div className="vc-pill">{row.tag}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function EnterpriseDesignLabApp() {
  const [active, setActive] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const screen = useMemo(() => {
    switch (active) {
      case 'gallery': return <GalleryScreen />;
      case 'dashboard': return <DashboardScreen />;
      case 'contracts': return <ContractsScreen />;
      case 'dispatches': return <DispatchesScreen />;
      case 'create': return <CreateContractScreen />;
      case 'print': return <PrintScreen />;
      case 'reports': return <ReportsScreen />;
      default: return <OverviewScreen />;
    }
  }, [active]);

  return (
    <EnterpriseAppShell
      sidebar={
        <WorkspaceSidebar>
          <div className="vc-sidebar__brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="vc-brandmark">VC</div>
              <div className="vc-brandcopy">
                <h1>VCPMC Command Center</h1>
                <p>Real-data-shaped design lab on main</p>
              </div>
            </div>
            <Badge tone="accent">LIVE-SHAPED</Badge>
          </div>
          <div className="vc-stack" style={{ marginBottom: 'var(--vc-space-6)' }}>
            <DomainSwitcher items={['Contracts', 'Certificates', 'Dispatches']} />
            <div className="vc-sidebar-summary">
              <div><strong>{contractRows.length}</strong><span>contracts</span></div>
              <div><strong>{certificateRows.length}</strong><span>certificates</span></div>
              <div><strong>{dispatchRows.length}</strong><span>dispatches</span></div>
            </div>
          </div>
          <nav className="vc-nav">
            {demoNav.map((item) => (
              <button key={item.id} type="button" data-active={active === item.id} onClick={() => setActive(item.id)}>
                <div className="vc-nav__label">
                  <span>{item.label}</span>
                  {item.badge ? <span className="vc-pill vc-pill--inverse">{item.badge}</span> : null}
                </div>
                {item.caption ? <div className="vc-nav__caption">{item.caption}</div> : null}
              </button>
            ))}
          </nav>
        </WorkspaceSidebar>
      }
      topbar={
        <Topbar
          title="Magic Pattern / Contract-Creation-Form"
          description="Premium Vietnamese enterprise command center refined from sanitized real-data-shaped fixtures."
          actions={
            <>
              <Badge tone="info">main</Badge>
              <Button variant="ghost" onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}>Theme: {theme}</Button>
            </>
          }
        />
      }
    >
      {screen}
    </EnterpriseAppShell>
  );
}

export default EnterpriseDesignLabApp;
