import React from 'react';
import './foundation/enterprise.css';
import { loadDemoData, sanitizedDemoData, type DemoDataSet } from './demo/dataSource';
import { Badge, Button, Card, Dialog, EmptyState, Tooltip, Separator } from './primitives';
import { EnterpriseAppShell, WorkspaceSidebar, Topbar, Page, PageHeader, PageSection, WorkspaceLayout, DomainSwitcher } from './layout';
import { TextField, Textarea, SelectField, MoneyInput, PercentInput, DatePicker, FileUpload } from './forms';
import { ActivityList, AlertPanel, BulkActionsBar, ContractNoCell, ContractStatusBadge, CustomerCell, BusinessLocationCell, UsageAreaChipGroup, RoyaltyAmountCell, DispatchStatusBadge, EmptyTableState, ErrorTableState, LoadingTableState, RowActions, TableDensityToggle, TablePagination, TableShell, TableToolbar } from './data-display';

const fmtDate = (value: string | null) => value ?? '—';
const compactMoney = (value: number) => `${(value / 1000000).toLocaleString('vi-VN')} triệu`;
const metricTrend = ['▁▂▃▄▅▆▇', '▇▆▅▄▃▂▁', '▁▃▅▃▆▅▇', '▂▂▃▄▅▅▆', '▁▂▂▃▅▆▇', '▃▄▃▅▄▆▇'];

function DataModeBadge({ dataMode }: { dataMode: DemoDataSet['dataMode'] }) {
  return <Badge tone={dataMode === 'local-real' ? 'warning' : 'info'}>{dataMode === 'local-real' ? 'Local real data preview' : 'Sanitized fixture data'}</Badge>;
}

function OverviewScreen({ data }: { data: DemoDataSet }) {
  return (
    <Page>
      <PageHeader
        title="VCPMC Enterprise OS"
        description="Real-data-shaped command center language for contracts, certificates, dispatches, and reporting workflows."
        actions={<DataModeBadge dataMode={data.dataMode} />}
      />
      <div className="vc-hero vc-hero--dense">
        <div className="vc-hero__headline">
          <div className="vc-eyebrow">Data shape first</div>
          <h1>Designed around long Vietnamese contract identifiers, dense customer records, realistic royalty ranges, and print-control edge cases.</h1>
          <p>The command center now supports sanitized fixtures by default and a local-only exact-data preview when the preview file exists.</p>
          <div className="vc-toolbar__group">
            <div className="vc-pill vc-pill--accent">{data.contractRows.length} hợp đồng hiển thị</div>
            <div className="vc-pill">{data.certificateRows.length} GCN hiển thị</div>
            <div className="vc-pill">{data.dispatchRows.length} công văn hiển thị</div>
          </div>
        </div>
        <Card>
          <div className="vc-section-header">
            <div>
              <h3>Current preview mode</h3>
              <p>{data.dataMode === 'local-real' ? 'Exact local real data is active for visual review only.' : 'Git-safe sanitized fixture mode is active.'}</p>
            </div>
          </div>
          <div className="vc-inline-note">No backend runtime calls. No raw path exposed. Missing local preview file falls back automatically.</div>
        </Card>
      </div>
    </Page>
  );
}

function GalleryScreen({ data }: { data: DemoDataSet }) {
  const stressContract = data.contractRows[Math.min(9, data.contractRows.length - 1)] ?? data.contractRows[0];
  const pendingCert = data.riskyCertificateRows[0] ?? data.certificateRows[0];
  const urgentDispatch = data.priorityDispatchRows[0] ?? data.dispatchRows[0];

  return (
    <Page>
      <PageHeader title="Component Gallery" description="Stress examples proving the system handles realistic field lengths, states, and dense workflows." actions={<DataModeBadge dataMode={data.dataMode} />} />
      {stressContract && pendingCert && urgentDispatch ? (
        <>
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
        </>
      ) : <EmptyState title="Thiếu dữ liệu demo" description="Không có dữ liệu để dựng gallery." />}
    </Page>
  );
}

function DashboardScreen({ data }: { data: DemoDataSet }) {
  return (
    <Page>
      <PageHeader title="Enterprise Dashboard" description="Premium operational cockpit using fixture or local-real contract, certificate, and dispatch data." actions={<DataModeBadge dataMode={data.dataMode} />} />
      <div className="vc-command-strip">
        {data.metricCards.slice(0, 6).map((item, index) => (
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
              <p>{data.dashboard.heroTitle}</p>
            </div>
            <Badge tone="accent">SLA 92/100</Badge>
          </div>
          <div className="vc-cockpit-grid">
            <div className="vc-chart-panel">
              <div className="vc-chart-title">Doanh thu theo chu kỳ</div>
              <div className="vc-line-visual">▁▂▃▄▅▆▇▆▅▆▇</div>
              <div className="vc-inline-note">Doanh thu và khối lượng hợp đồng phản ánh theo nguồn dữ liệu hiện tại.</div>
            </div>
            <div className="vc-chart-panel">
              <div className="vc-chart-title">Phân bổ theo lĩnh vực</div>
              {data.reportBreakdown.map((item) => (
                <div key={item.label} className="vc-bar-row"><span>{item.label}</span><div><i style={{ width: `${Math.max(12, item.count / 4)}px` }} /></div><strong>{item.count}</strong></div>
              ))}
            </div>
            <div className="vc-chart-panel">
              <div className="vc-chart-title">Contract health</div>
              {['Đang hiệu lực', 'Sắp hết hạn', 'Chờ tái ký', 'Bản nháp', 'Hết hạn'].map((status) => (
                <div key={status} className="vc-health-row"><span>{status}</span><strong>{data.contractRows.filter((row) => row.status === status).length}</strong></div>
              ))}
            </div>
            <div className="vc-chart-panel">
              <div className="vc-chart-title">Risk summary</div>
              <div className="vc-risk-score">74</div>
              <div className="vc-inline-note">{data.riskyCertificateRows.length} GCN draft/thiếu số · {data.priorityDispatchRows.length} dispatch cần theo dõi.</div>
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
          <ActivityList items={data.demoActivities} />
          <div className="vc-stack-sm" style={{ marginTop: 16 }}>
            <div className="vc-pill">{data.riskyCertificateRows.length} print warnings</div>
            <div className="vc-pill">{data.priorityDispatchRows.length} dispatch follow-ups</div>
            <div className="vc-pill">{data.expiringContractRows.length} hợp đồng cần chú ý</div>
          </div>
        </Card>
      </div>
      <div className="vc-grid-3">
        <QueueCard title="Expiring contracts queue" rows={data.expiringContractRows.slice(0, 5).map((row, index) => ({ primary: row.customer, secondary: `${row.contractNo} · hết hiệu lực ${fmtDate(row.effectiveTo)}`, tag: index < 2 ? 'Ưu tiên' : row.status }))} />
        <QueueCard title="Certificate print queue" rows={data.riskyCertificateRows.slice(0, 5).map((row) => ({ primary: row.organizationName, secondary: `${row.contractNo} · ${row.certificateNo ?? 'Chưa có số GCN'}`, tag: row.status }))} />
        <QueueCard title="Dispatch follow-up queue" rows={data.priorityDispatchRows.slice(0, 5).map((row) => ({ primary: row.subject, secondary: `${row.dispatchNo} · ${row.contractNo}`, tag: row.priority }))} />
      </div>
    </Page>
  );
}

function ContractsScreen({ data }: { data: DemoDataSet }) {
  const rows = data.contractRows.slice(0, 18);
  return (
    <Page>
      <PageHeader title="Contracts Workspace" description="Dense contract command desk designed around real field lengths, status distributions, and renewal pressure." actions={<DataModeBadge dataMode={data.dataMode} />} />
      <div className="vc-workspace-tabs"><div className="vc-toolbar__group"><Button variant="subtle">Tất cả</Button><Button variant="ghost">Sắp hết hạn</Button><Button variant="ghost">Chờ tái ký</Button><Button variant="ghost">Thiếu GCN</Button><Button variant="ghost">Key accounts</Button></div></div>
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
          <span>{rows.length} / {data.contractRows.length} dòng hiển thị</span>
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

function DispatchesScreen({ data }: { data: DemoDataSet }) {
  return (
    <Page>
      <PageHeader title="Dispatches Workspace" description="Official-letter work queue with urgency controls, batch actions, responsible staff, and next steps." actions={<DataModeBadge dataMode={data.dataMode} />} />
      <WorkspaceLayout
        primary={
          <TableShell
            title="Luồng công văn"
            description="Operational queue based on current data source."
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
                {data.dispatchRows.map((row, index) => (
                  <tr key={row.id}>
                    <td><div className="vc-table__primary">{row.dispatchNo}</div><div className="vc-table__secondary">Batch {String((index % 4) + 1).padStart(2, '0')}</div></td>
                    <td><ContractNoCell contractNo={row.contractNo} /></td>
                    <td><div className="vc-table__primary">{row.subject}</div><div className="vc-table__secondary">{data.contractRows[index % Math.max(1, data.contractRows.length)]?.customer ?? 'Không rõ khách hàng'}</div></td>
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
        secondary={<AlertPanel title="Dispatch intelligence" description={`${data.priorityDispatchRows.length} công văn cần ưu tiên theo nguồn dữ liệu hiện tại.`} />}
      />
    </Page>
  );
}

function CreateContractScreen({ data }: { data: DemoDataSet }) {
  return (
    <Page>
      <PageHeader title="Contract Creation Form" description="Guided business workflow with denser sections and context tuned to current preview mode." actions={<DataModeBadge dataMode={data.dataMode} />} />
      <div className="vc-grid-2">
        <PageSection title="Thông tin hợp đồng" description="Compact data-entry rhythm with examples for long identifiers and domain mixes.">
          <div className="vc-form-grid">
            <TextField label="Số hợp đồng" required hint={data.contractRows[0] ? `Ví dụ: ${data.contractRows[0].contractNo}` : 'Ví dụ hợp đồng'} />
            <SelectField label="Lĩnh vực" options={data.domainLabels.slice(0, 6)} />
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

function PrintScreen({ data }: { data: DemoDataSet }) {
  const selected = data.certificateRows[0];
  if (!selected) return <Page><EmptyState title="Không có GCN" description="Nguồn dữ liệu hiện tại không có bản ghi GCN." /></Page>;
  return (
    <Page>
      <PageHeader title="Certificate Print Control" description="Print-control station for selected queue item, safety checks, preview, and issuance history." actions={<DataModeBadge dataMode={data.dataMode} />} />
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
            <div><span>QR status</span><strong>{selected.qrStatus === 'available' ? 'Sẵn sàng kiểm tra' : 'Thiếu QR payload'}</strong></div>
            <div><span>Tọa độ in</span><strong>{selected.offsetXmm != null || selected.offsetYmm != null ? `X ${selected.offsetXmm ?? 0} · Y ${selected.offsetYmm ?? 0}` : 'An toàn · chưa có offset'}</strong></div>
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
            {data.riskyCertificateRows.slice(0, 6).map((row) => (
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

function ReportsScreen({ data }: { data: DemoDataSet }) {
  return (
    <Page>
      <PageHeader title="Reports Workspace" description="Analytics-grade reporting with revenue trend, domain breakdown, status distribution, and export controls." actions={<DataModeBadge dataMode={data.dataMode} />} />
      <div className="vc-report-toolbar">
        <div className="vc-toolbar__group">
          <div className="vc-pill">Chu kỳ hiện tại</div>
          <div className="vc-pill">Theo nguồn dữ liệu đang mở</div>
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
          <div className="vc-inline-note">Chu kỳ phát hành GCN trung bình {data.reports.avgCertificateCycleDays} ngày · {data.reports.activeReconciliationContracts.toLocaleString('vi-VN')} hợp đồng active.</div>
        </Card>
        <Card>
          <div className="vc-section-header"><div><h3>Contract status distribution</h3><p>Compact operational distribution.</p></div></div>
          {['Đang hiệu lực', 'Sắp hết hạn', 'Chờ tái ký', 'Bản nháp', 'Hết hạn'].map((status) => (
            <div key={status} className="vc-health-row"><span>{status}</span><strong>{data.contractRows.filter((row) => row.status === status).length}</strong></div>
          ))}
        </Card>
      </div>
      <div className="vc-grid-2">
        <Card>
          <div className="vc-section-header"><div><h3>Domain breakdown</h3><p>Current label mix from active data source.</p></div></div>
          {data.reportBreakdown.map((item) => (
            <div key={item.label} className="vc-bar-row"><span>{item.label}</span><div><i style={{ width: `${Math.max(12, item.count / 4)}px` }} /></div><strong>{item.count}</strong></div>
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
            {data.expiringContractRows.slice(0, 8).map((row) => (
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
          <p>Serious work queue using current data source.</p>
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
  const [active, setActive] = React.useState('dashboard');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [data, setData] = React.useState<DemoDataSet>(sanitizedDemoData);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    let alive = true;
    loadDemoData().then((next) => {
      if (alive) setData(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  const screen = React.useMemo(() => {
    switch (active) {
      case 'gallery': return <GalleryScreen data={data} />;
      case 'dashboard': return <DashboardScreen data={data} />;
      case 'contracts': return <ContractsScreen data={data} />;
      case 'dispatches': return <DispatchesScreen data={data} />;
      case 'create': return <CreateContractScreen data={data} />;
      case 'print': return <PrintScreen data={data} />;
      case 'reports': return <ReportsScreen data={data} />;
      default: return <OverviewScreen data={data} />;
    }
  }, [active, data]);

  return (
    <EnterpriseAppShell
      sidebar={
        <WorkspaceSidebar>
          <div className="vc-sidebar__brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="vc-brandmark">VC</div>
              <div className="vc-brandcopy">
                <h1>VCPMC Command Center</h1>
                <p>Safe default + local real preview mode</p>
              </div>
            </div>
            <DataModeBadge dataMode={data.dataMode} />
          </div>
          <div className="vc-stack" style={{ marginBottom: 'var(--vc-space-6)' }}>
            <DomainSwitcher items={['Contracts', 'Certificates', 'Dispatches']} />
            <div className="vc-sidebar-summary">
              <div><strong>{data.contractRows.length}</strong><span>contracts</span></div>
              <div><strong>{data.certificateRows.length}</strong><span>certificates</span></div>
              <div><strong>{data.dispatchRows.length}</strong><span>dispatches</span></div>
            </div>
          </div>
          <nav className="vc-nav">
            {data.demoNav.map((item) => (
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
          description="Premium Vietnamese enterprise command center with safe local-only real data preview fallback."
          actions={
            <>
              <DataModeBadge dataMode={data.dataMode} />
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
