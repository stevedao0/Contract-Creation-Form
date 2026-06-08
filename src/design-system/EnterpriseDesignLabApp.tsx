import React, { useMemo, useState } from 'react';
import './foundation/enterprise.css';
import { demoActivities, demoNav, metricCards, contractRows, dispatchRows } from './demo/mockData';
import { Badge, Button, Card, Chip, Dialog, EmptyState, IconButton, Panel, ScrollArea, Separator, Skeleton, Tabs, Tooltip } from './primitives';
import { EnterpriseAppShell, WorkspaceSidebar, Topbar, Page, PageHeader, PageSection, WorkspaceLayout, DomainSwitcher } from './layout';
import { TextField, Textarea, SelectField, NumberInput, MoneyInput, PercentInput, DatePicker, FileUpload, FormField } from './forms';
import { ActivityList, AlertPanel, BulkActionsBar, ContractNoCell, ContractStatusBadge, CustomerCell, BusinessLocationCell, UsageAreaChipGroup, RoyaltyAmountCell, DispatchStatusBadge, EmptyTableState, ErrorTableState, LoadingTableState, RecentList, RowActions, TableDensityToggle, TablePagination, TableShell, TableToolbar } from './data-display';
import { ChartCard, SummaryStrip } from './dashboard';

function OverviewScreen() {
  const swatches = [
    { name: 'Emerald core', value: '#0f8f72', bg: 'linear-gradient(135deg,#0f8f72,#7ccbb6)' },
    { name: 'Warm neutral', value: '#f4f6f3', bg: 'linear-gradient(135deg,#f4f6f3,#e9eeea)' },
    { name: 'Sidebar ink', value: '#10211d', bg: 'linear-gradient(135deg,#10211d,#18322c)' },
    { name: 'Signal copper', value: '#c4883b', bg: 'linear-gradient(135deg,#c4883b,#e6b777)' },
  ];

  return (
    <Page>
      <PageHeader
        title="VCPMC Enterprise OS"
        description="A premium enterprise design language for dense operational products, tuned for contracts, certificates, dispatches, and reporting workflows."
        actions={<Badge tone="accent">Light / dark ready</Badge>}
      />
      <div className="vc-hero">
        <div className="vc-hero__headline">
          <div className="vc-eyebrow">Enterprise foundation</div>
          <h1>Sharp data workspaces, warm neutral surfaces, and teal signal colors for operational clarity.</h1>
          <p>
            The system is designed to feel more custom than generic component libraries, with stronger typography,
            denser data ergonomics, and more deliberate visual hierarchy for VCPMC business workflows.
          </p>
          <div className="vc-toolbar__group">
            <Button variant="primary">Review foundations</Button>
            <Button variant="ghost">Open component gallery</Button>
          </div>
        </div>
        <Panel>
          <div className="vc-section-header">
            <div>
              <h3>Foundation map</h3>
              <p>Token groups and system behaviors required for future porting into the real app.</p>
            </div>
          </div>
          <div className="vc-stack">
            {['Colors', 'Typography', 'Spacing', 'Radius', 'Borders', 'Elevation', 'Focus ring', 'Motion', 'Dark mode'].map((item) => (
              <div key={item} className="vc-pill">{item}</div>
            ))}
          </div>
        </Panel>
      </div>
      <PageSection title="Color tokens" description="Emerald/teal accents with warm neutral surfaces and strong operational contrast.">
        <div className="vc-swatch-grid">
          {swatches.map((swatch) => (
            <div key={swatch.name} className="vc-swatch">
              <div className="vc-swatch__tone" style={{ background: swatch.bg }} />
              <div className="vc-swatch__meta">
                <strong>{swatch.name}</strong>
                <span>{swatch.value}</span>
              </div>
            </div>
          ))}
        </div>
      </PageSection>
      <PageSection title="System rules" description="Visual and interaction constraints for future implementation consistency.">
        <div className="vc-doc-grid">
          <Card>
            <h3>Density & readability</h3>
            <p>Use compact headers, clear numeric alignment, and stronger section grouping than the current baseline.</p>
          </Card>
          <Card>
            <h3>Motion & feedback</h3>
            <p>Subtle transitions only, using focus and elevation to guide actions without decorative noise.</p>
          </Card>
          <Card>
            <h3>Surface model</h3>
            <p>Three surface steps: app canvas, workspace panels, and floating overlays with sharper borders.</p>
          </Card>
          <Card>
            <h3>Business context</h3>
            <p>Tables, print controls, and multi-step forms are treated as first-class workflow canvases.</p>
          </Card>
        </div>
      </PageSection>
    </Page>
  );
}

function GalleryScreen() {
  return (
    <Page>
      <PageHeader title="Component Gallery" description="The visual language exposed as reusable primitives, layout blocks, and workflow patterns." actions={<Badge tone="teal">Design lab</Badge>} />
      <div className="vc-gallery-grid">
        <Card>
          <h3>Buttons & badges</h3>
          <div className="vc-toolbar__group">
            <Button variant="primary">Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <IconButton icon={<span>+</span>} />
          </div>
          <div className="vc-toolbar__group" style={{ marginTop: 12 }}>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
          </div>
        </Card>
        <Card>
          <h3>Chips, tabs, separators</h3>
          <div className="vc-chip-group">
            <Chip tone="teal">Karaoke</Chip>
            <Chip tone="violet">Biểu diễn</Chip>
            <Chip tone="neutral">Khách sạn</Chip>
          </div>
          <div style={{ marginTop: 14 }}>
            <Tabs items={["Overview", "Tokens", "Examples"]} active="Overview" />
          </div>
          <div style={{ marginTop: 14 }}>
            <Separator />
          </div>
        </Card>
        <Card>
          <h3>Tooltip, dialog, dropdown</h3>
          <div className="vc-toolbar__group">
            <Tooltip label="Tooltip visual" />
            <Badge tone="info">Dropdown</Badge>
          </div>
          <div style={{ marginTop: 14 }}>
            <Dialog title="Approve renewal batch">
              <p style={{ margin: 0, color: 'var(--vc-text-soft)' }}>Dialogs are elevated, compact, and optimized for approval flows.</p>
            </Dialog>
          </div>
        </Card>
      </div>
      <div className="vc-grid-3">
        <EmptyState title="Empty state" description="Use helpful next actions and strong hierarchy instead of generic placeholders." />
        <Skeleton />
        <ScrollArea>
          <RecentList items={["Export definitions", "Toolbar patterns", "Row action density", "Print controls", "Table states"]} />
        </ScrollArea>
      </div>
    </Page>
  );
}

function DashboardScreen() {
  return (
    <Page>
      <PageHeader title="Enterprise Dashboard" description="Operating cockpit for contracts, certificates, dispatches, and renewal load." actions={<Button variant="primary">Xuất snapshot</Button>} />
      <div className="vc-hero">
        <div className="vc-hero__headline">
          <div className="vc-eyebrow">Morning operations</div>
          <h1>12.486 hợp đồng đang được theo dõi, 184 GCN chờ phát hành, 29 công văn cần điều phối.</h1>
          <p>Dashboard direction favors high-signal summaries, operational load visibility, and quick navigation into dense workspaces.</p>
        </div>
        <Panel>
          <div className="vc-section-header">
            <div>
              <h3>Attention radar</h3>
              <p>Priority stack for operations leads.</p>
            </div>
          </div>
          <ActivityList items={demoActivities} />
        </Panel>
      </div>
      <SummaryStrip items={metricCards} />
      <div className="vc-grid-2">
        <ChartCard />
        <Card>
          <div className="vc-section-header">
            <div>
              <h3>Action feed</h3>
              <p>Recent movements across contracts and print operations.</p>
            </div>
          </div>
          <ActivityList items={demoActivities} />
        </Card>
      </div>
    </Page>
  );
}

function ContractsScreen() {
  return (
    <Page>
      <PageHeader title="Contracts Workspace" description="Premium dense data workspace for contract operations, not a generic admin table." actions={<Button variant="primary">Tạo hợp đồng</Button>} />
      <BulkActionsBar />
      <TableShell
        title="Danh sách hợp đồng"
        description="Table shell with stronger hierarchy, cell patterns, bulk actions, and professional workspace controls."
        toolbar={
          <TableToolbar>
            <div className="vc-toolbar__group">
              <input className="vc-input" placeholder="Tìm theo số hợp đồng, khách hàng, địa bàn…" style={{ minWidth: 300 }} />
              <div className="vc-pill">Trạng thái</div>
              <div className="vc-pill">Địa bàn</div>
              <div className="vc-pill">Lĩnh vực</div>
            </div>
            <div className="vc-toolbar__group">
              <TableDensityToggle />
              <Button variant="ghost">Lưu view</Button>
            </div>
          </TableToolbar>
        }
      >
        <table className="vc-table">
          <thead>
            <tr>
              <th>Hợp đồng</th>
              <th>Khách hàng</th>
              <th>Khu vực khai thác</th>
              <th>Giá trị quyền</th>
              <th>Trạng thái</th>
              <th>Phụ trách</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contractRows.map((row) => (
              <tr key={row.id}>
                <td><ContractNoCell contractNo={row.contractNo} /></td>
                <td><CustomerCell customer={row.customer} /><BusinessLocationCell location={row.location} /></td>
                <td><UsageAreaChipGroup areas={row.areas} /></td>
                <td><RoyaltyAmountCell amount={row.amount} /></td>
                <td><ContractStatusBadge status={row.status} /></td>
                <td>{row.owner}</td>
                <td><RowActions /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination />
      </TableShell>
    </Page>
  );
}

function DispatchesScreen() {
  return (
    <Page>
      <PageHeader title="Dispatches Workspace" description="Công văn workspace with enterprise review flow, command focus, and operational flags." actions={<Button variant="primary">Soạn công văn</Button>} />
      <WorkspaceLayout
        primary={
          <TableShell
            title="Luồng công văn"
            description="Dispatch control desk with status, priority, and actions designed for admin workflows."
            toolbar={<TableToolbar><div className="vc-toolbar__group"><div className="vc-pill">Bộ lọc ưu tiên</div><div className="vc-pill">Người ký</div></div><div className="vc-toolbar__group"><Button variant="ghost">Xuất danh sách</Button></div></TableToolbar>}
          >
            <table className="vc-table">
              <thead>
                <tr>
                  <th>Số công văn</th>
                  <th>Chủ đề</th>
                  <th>Nơi nhận</th>
                  <th>Ưu tiên</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {dispatchRows.map((row) => (
                  <tr key={row.id}>
                    <td><div className="vc-table__primary">{row.dispatchNo}</div></td>
                    <td><div className="vc-table__primary">{row.subject}</div></td>
                    <td><div className="vc-table__secondary">{row.destination}</div></td>
                    <td><Badge tone={row.priority === 'Khẩn' ? 'danger' : row.priority === 'Chuẩn' ? 'info' : 'neutral'}>{row.priority}</Badge></td>
                    <td><DispatchStatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        }
        secondary={<AlertPanel title="Review lane" description="A future lane for signer queues, branch comments, and escalation routing." />}
      />
    </Page>
  );
}

function CreateContractScreen() {
  return (
    <Page>
      <PageHeader title="Contract Creation Form" description="Guided business workflow with clearer sections, denser form rhythm, and stronger contextual support." actions={<Badge tone="accent">Workflow demo</Badge>} />
      <div className="vc-grid-2">
        <PageSection title="Thông tin hợp đồng" description="Section rhythm for enterprise data-entry with hints and grouped controls.">
          <div className="vc-form-grid">
            <TextField label="Số hợp đồng" required hint="Định dạng VCPMC theo domain và khu vực." />
            <SelectField label="Lĩnh vực" options={["Karaoke", "Khách sạn", "Biểu diễn"]} />
            <TextField label="Tên khách hàng" required />
            <TextField label="Địa bàn kinh doanh" />
            <DatePicker label="Ngày hiệu lực" />
            <DatePicker label="Ngày kết thúc" />
            <MoneyInput label="Mức quyền tác giả" />
            <PercentInput label="VAT" />
          </div>
        </PageSection>
        <PageSection title="Điều khiển nghiệp vụ" description="Support rail for hints, warnings, uploads, and downstream print/export readiness.">
          <div className="vc-stack">
            <AlertPanel title="Guided workflow" description="Use structured hints, legal notes, and business warnings beside the form instead of mixing everything into the main body." />
            <FileUpload label="Tải phụ lục / chứng từ" />
            <Textarea label="Ghi chú nội bộ" hint="Only internal remarks for legal/operations review." rows={6} />
          </div>
        </PageSection>
      </div>
      <PageSection title="Karaoke room editor" description="Example of a custom business pattern component rather than a generic repeated input block.">
        <div className="vc-doc-grid">
          <Card>
            <h3>KaraokeRoomEditor</h3>
            <p>Editor pattern for room type, quantity, pricing band, and operating remarks.</p>
            <div className="vc-chip-group">
              <Chip tone="teal">Phòng thường · 08</Chip>
              <Chip tone="accent">VIP · 03</Chip>
              <Chip tone="warning">Outdoor deck · 01</Chip>
            </div>
          </Card>
          <Card>
            <h3>MoneyInWordsBlock</h3>
            <p>Một trăm hai mươi sáu triệu năm trăm nghìn đồng chẵn.</p>
          </Card>
        </div>
      </PageSection>
    </Page>
  );
}

function PrintScreen() {
  return (
    <Page>
      <PageHeader title="Certificate Print Control" description="Print toolbar and certificate release control center for final issuance workflows." actions={<Button variant="primary">Khóa lô in</Button>} />
      <div className="vc-grid-2">
        <Card>
          <div className="vc-section-header">
            <div>
              <h3>CertificatePrintToolbar</h3>
              <p>Focused controls for print mode, test/final issue, and export confidence.</p>
            </div>
          </div>
          <div className="vc-toolbar__group">
            <Button variant="subtle">In thử</Button>
            <Button variant="primary">In chính thức</Button>
            <Button variant="ghost">Tải PDF</Button>
            <Button variant="ghost">Mở QR</Button>
          </div>
          <div style={{ marginTop: 20 }}>
            <Dialog title="Phát hành GCN">
              <p style={{ margin: 0, color: 'var(--vc-text-soft)' }}>Final print controls should feel explicit, auditable, and high-confidence.</p>
            </Dialog>
          </div>
        </Card>
        <Card>
          <div className="vc-section-header">
            <div>
              <h3>Print readiness</h3>
              <p>Operational summary before issuing certificates.</p>
            </div>
          </div>
          <RecentList items={["Tên đơn vị đã xác thực", "Mã hợp đồng khớp mẫu in", "Watermark test print enabled", "Sổ phát hành tháng 06 đã mở"]} />
        </Card>
      </div>
    </Page>
  );
}

function ReportsScreen() {
  return (
    <Page>
      <PageHeader title="Reports Workspace" description="A denser insight surface for reporting, reconciliation, exports, and management review." actions={<Button variant="primary">Xuất báo cáo</Button>} />
      <div className="vc-report-strip">
        <div className="vc-report-kpi"><strong>84,2%</strong><span>Tỷ lệ tái ký đúng hạn</span></div>
        <div className="vc-report-kpi"><strong>12,8 ngày</strong><span>Chu kỳ phát hành GCN trung bình</span></div>
        <div className="vc-report-kpi"><strong>1.248</strong><span>Hợp đồng có đối soát kỳ này</span></div>
        <div className="vc-report-kpi"><strong>18</strong><span>Điểm nghẽn cần can thiệp</span></div>
      </div>
      <div className="vc-grid-2">
        <ChartCard />
        <Card>
          <div className="vc-section-header">
            <div>
              <h3>Insight lanes</h3>
              <p>Reporting cards can become richer widgets for managers later.</p>
            </div>
          </div>
          <ActivityList items={demoActivities} />
        </Card>
      </div>
      <div className="vc-grid-3">
        <EmptyTableState />
        <LoadingTableState />
        <ErrorTableState />
      </div>
    </Page>
  );
}

export function EnterpriseDesignLabApp() {
  const [active, setActive] = useState('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const screen = useMemo(() => {
    switch (active) {
      case 'gallery':
        return <GalleryScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'contracts':
        return <ContractsScreen />;
      case 'dispatches':
        return <DispatchesScreen />;
      case 'create':
        return <CreateContractScreen />;
      case 'print':
        return <PrintScreen />;
      case 'reports':
        return <ReportsScreen />;
      default:
        return <OverviewScreen />;
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
                <h1>VCPMC Enterprise OS</h1>
                <p>Design lab on Magic Pattern main</p>
              </div>
            </div>
            <Badge tone="accent">LAB</Badge>
          </div>
          <div className="vc-stack" style={{ marginBottom: 'var(--vc-space-6)' }}>
            <DomainSwitcher items={['Contracts', 'Certificates', 'Dispatches']} />
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
          description="Premium enterprise UI direction with mock-only demo screens and reusable design-system structure."
          actions={
            <>
              <Button variant="ghost" className="vc-pill">Mock data only</Button>
              <Button variant="subtle" onClick={undefined}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</Button>
              <button className="vc-button vc-button--subtle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'light' ? 'Switch dark' : 'Switch light'}
              </button>
            </>
          }
        />
      }
    >
      {screen}
    </EnterpriseAppShell>
  );
}
