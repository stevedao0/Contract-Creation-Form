import React, { useMemo, useState } from 'react';
import { EyeIcon, PrinterIcon, EditIcon, FileCheckIcon } from 'lucide-react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { FilterBar, FilterSelect } from '../components/app-ui/FilterBar';
import { SearchBox } from '../components/app-ui/SearchBox';
import {
  DataTable,
  DataTablePagination,
  Column } from
'../components/app-ui/DataTable';
import { StatusBadge } from '../components/app-ui/StatusBadge';
import { RowActionsMenu } from '../components/app-ui/RowActionsMenu';
import { EmptyState } from '../components/app-ui/EmptyState';
import { YEAR_OPTIONS, GCN_STATUS_OPTIONS } from '../data/options';
import { MOCK_CERTIFICATES, Certificate } from '../data/mockContracts';
import { formatDate } from '../lib/format';
export function CertificatesPage() {
  const [gcnNo, setGcnNo] = useState('');
  const [contractNo, setContractNo] = useState('');
  const [partner, setPartner] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const filtered = useMemo(() => {
    return MOCK_CERTIFICATES.filter((g) => {
      if (gcnNo && !g.gcnNo.toLowerCase().includes(gcnNo.toLowerCase()))
      return false;
      if (
      contractNo &&
      !g.contractNo.toLowerCase().includes(contractNo.toLowerCase()))

      return false;
      if (partner && !g.partner.toLowerCase().includes(partner.toLowerCase()))
      return false;
      if (year && !g.startDate.startsWith(year)) return false;
      if (status && g.status !== status) return false;
      return true;
    });
  }, [gcnNo, contractNo, partner, year, status]);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const hasActive = !!(gcnNo || contractNo || partner || year || status);
  const columns: Column<Certificate>[] = [
  {
    key: 'gcn',
    header: 'Số GCN',
    render: (r) =>
    <span className="font-mono text-xs font-medium text-slate-900">
          {r.gcnNo}
        </span>

  },
  {
    key: 'contract',
    header: 'Số hợp đồng',
    render: (r) => <span className="font-mono text-xs">{r.contractNo}</span>
  },
  {
    key: 'partner',
    header: 'Khách hàng / đơn vị',
    render: (r) =>
    <span className="font-medium text-slate-900">{r.partner}</span>

  },
  {
    key: 'start',
    header: 'Ngày bắt đầu',
    render: (r) => formatDate(r.startDate)
  },
  {
    key: 'end',
    header: 'Ngày kết thúc',
    render: (r) => formatDate(r.endDate)
  },
  {
    key: 'status',
    header: 'Trạng thái',
    render: (r) => {
      if (r.status === 'pending')
      return <StatusBadge tone="warning">Chờ in</StatusBadge>;
      if (r.status === 'printed_test')
      return <StatusBadge tone="info">Đã in test</StatusBadge>;
      return <StatusBadge tone="success">Đã in chính thức</StatusBadge>;
    }
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    width: '48px',
    render: () =>
    <RowActionsMenu
      actions={[
      {
        label: 'Xem',
        icon: <EyeIcon className="h-4 w-4" />
      },
      {
        label: 'In test',
        icon: <PrinterIcon className="h-4 w-4" />
      },
      {
        label: 'In chính thức',
        icon: <FileCheckIcon className="h-4 w-4" />
      },
      {
        label: 'Cập nhật số GCN',
        icon: <EditIcon className="h-4 w-4" />
      }]
      } />


  }];

  return (
    <Page>
      <PageHeader
        title="Quản lý giấy chứng nhận"
        description="Theo dõi, in và phát hành GCN cho các hợp đồng đã ký." />
      

      <FilterBar
        hasActive={hasActive}
        onClear={() => {
          setGcnNo('');
          setContractNo('');
          setPartner('');
          setYear('');
          setStatus('');
        }}>
        
        <div className="flex flex-col gap-1 w-44">
          <label className="text-[11px] font-medium text-slate-600">
            Số GCN
          </label>
          <SearchBox value={gcnNo} onChange={setGcnNo} placeholder="GCN-..." />
        </div>
        <div className="flex flex-col gap-1 w-52">
          <label className="text-[11px] font-medium text-slate-600">
            Số hợp đồng
          </label>
          <SearchBox
            value={contractNo}
            onChange={setContractNo}
            placeholder="VD: 123/2026/..." />
          
        </div>
        <div className="flex flex-col gap-1 w-56">
          <label className="text-[11px] font-medium text-slate-600">
            Đơn vị
          </label>
          <SearchBox
            value={partner}
            onChange={setPartner}
            placeholder="Tên đơn vị" />
          
        </div>
        <FilterSelect
          label="Năm"
          value={year}
          onChange={setYear}
          options={YEAR_OPTIONS}
          width="w-32" />
        
        <FilterSelect
          label="Trạng thái in"
          value={status}
          onChange={setStatus}
          options={GCN_STATUS_OPTIONS}
          width="w-44" />
        
      </FilterBar>

      <ContentCard padded={false}>
        <DataTable
          columns={columns}
          rows={paged}
          empty={
          <EmptyState
            title="Chưa có GCN"
            description="Tạo GCN từ hợp đồng đã ký để hiển thị tại đây." />

          } />
        
        <DataTablePagination
          page={page}
          total={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage} />
        
      </ContentCard>
    </Page>);

}