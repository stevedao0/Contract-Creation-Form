import React, { useMemo, useState } from 'react';
import {
  EyeIcon,
  PencilIcon,
  FileDownIcon,
  AwardIcon,
  FilePlusIcon } from
'lucide-react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { MetricStrip } from '../components/app-ui/MetricCard';
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
import {
  YEAR_OPTIONS,
  LINH_VUC_OPTIONS,
  CONTRACT_STATUS_OPTIONS } from
'../data/options';
import { MOCK_CONTRACTS, Contract } from '../data/mockContracts';
import { formatCurrency, formatDate } from '../lib/format';
export function ContractsListPage({
  onNavigate


}: {onNavigate: (k: any) => void;}) {
  const [keyword, setKeyword] = useState('');
  const [year, setYear] = useState('');
  const [field, setField] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const filtered = useMemo(() => {
    return MOCK_CONTRACTS.filter((c) => {
      if (
      keyword &&
      !`${c.contractNo} ${c.partner}`.
      toLowerCase().
      includes(keyword.toLowerCase()))

      return false;
      if (year && !c.signedDate.startsWith(year)) return false;
      if (field && c.field !== field) return false;
      if (status && c.status !== status) return false;
      return true;
    });
  }, [keyword, year, field, status]);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const hasActive = !!(keyword || year || field || status);
  const total = MOCK_CONTRACTS.length;
  const active = MOCK_CONTRACTS.filter((c) => c.status === 'active').length;
  const expiring = MOCK_CONTRACTS.filter((c) => c.status === 'expiring').length;
  const draft = MOCK_CONTRACTS.filter((c) => c.status === 'draft').length;
  const columns: Column<Contract>[] = [
  {
    key: 'no',
    header: 'Số hợp đồng',
    render: (r) => <span className="font-mono text-xs">{r.contractNo}</span>
  },
  {
    key: 'partner',
    header: 'Đối tác',
    render: (r) =>
    <span className="font-medium text-slate-900">{r.partner}</span>

  },
  {
    key: 'field',
    header: 'Lĩnh vực',
    render: (r) => r.field
  },
  {
    key: 'signed',
    header: 'Ngày ký',
    render: (r) => formatDate(r.signedDate)
  },
  {
    key: 'effective',
    header: 'Hiệu lực đến',
    render: (r) => formatDate(r.effectiveTo)
  },
  {
    key: 'value',
    header: 'Giá trị',
    align: 'right',
    render: (r) =>
    <span className="tabular-nums">{formatCurrency(r.value)}</span>

  },
  {
    key: 'status',
    header: 'Trạng thái',
    render: (r) => {
      if (r.status === 'active')
      return <StatusBadge tone="success">Đang hiệu lực</StatusBadge>;
      if (r.status === 'expiring')
      return <StatusBadge tone="warning">Sắp hết hạn</StatusBadge>;
      if (r.status === 'expired')
      return <StatusBadge tone="danger">Hết hạn</StatusBadge>;
      return <StatusBadge tone="neutral">Bản nháp</StatusBadge>;
    }
  },
  {
    key: 'actions',
    header: '',
    width: '48px',
    align: 'right',
    render: () =>
    <RowActionsMenu
      actions={[
      {
        label: 'Xem chi tiết',
        icon: <EyeIcon className="h-4 w-4" />
      },
      {
        label: 'Sửa',
        icon: <PencilIcon className="h-4 w-4" />
      },
      {
        label: 'Xuất Word',
        icon: <FileDownIcon className="h-4 w-4" />
      },
      {
        label: 'Tạo GCN',
        icon: <AwardIcon className="h-4 w-4" />
      }]
      } />


  }];

  return (
    <Page>
      <PageHeader
        title="Trung tâm hợp đồng"
        description="Quản lý toàn bộ hợp đồng đã ký kết và bản nháp."
        actions={
        <button
          type="button"
          onClick={() => onNavigate('contracts.create')}
          className="h-9 px-4 inline-flex items-center gap-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium">
          
            <FilePlusIcon className="h-4 w-4" /> Tạo hợp đồng
          </button>
        } />
      

      <MetricStrip
        items={[
        {
          label: 'Tổng',
          value: String(total)
        },
        {
          label: 'Đang hiệu lực',
          value: String(active)
        },
        {
          label: 'Sắp hết hạn',
          value: String(expiring)
        },
        {
          label: 'Bản nháp',
          value: String(draft)
        }]
        } />
      

      <FilterBar
        hasActive={hasActive}
        onClear={() => {
          setKeyword('');
          setYear('');
          setField('');
          setStatus('');
        }}>
        
        <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
          <label className="text-[11px] font-medium text-slate-600">
            Từ khóa
          </label>
          <SearchBox
            value={keyword}
            onChange={setKeyword}
            placeholder="Số hợp đồng, đối tác..." />
          
        </div>
        <FilterSelect
          label="Năm"
          value={year}
          onChange={setYear}
          options={YEAR_OPTIONS}
          width="w-32" />
        
        <FilterSelect
          label="Lĩnh vực"
          value={field}
          onChange={setField}
          options={LINH_VUC_OPTIONS}
          width="w-48" />
        
        <FilterSelect
          label="Trạng thái"
          value={status}
          onChange={setStatus}
          options={CONTRACT_STATUS_OPTIONS}
          width="w-44" />
        
      </FilterBar>

      <ContentCard padded={false}>
        <DataTable
          columns={columns}
          rows={paged}
          empty={
          <EmptyState
            title="Không tìm thấy hợp đồng"
            description="Thử điều chỉnh bộ lọc hoặc xóa từ khóa tìm kiếm." />

          } />
        
        <DataTablePagination
          page={page}
          total={filtered.length}
          pageSize={pageSize}
          onPageChange={setPage} />
        
      </ContentCard>
    </Page>);

}