import React, { useState } from 'react';
import {
  FilePlusIcon,
  SearchIcon,
  FileTextIcon,
  CheckCircle2Icon,
  PaperclipIcon,
  Music2Icon,
  WalletIcon,
  ClockIcon } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { MetricStrip } from '../components/app-ui/MetricCard';
import { StatusBadge } from '../components/app-ui/StatusBadge';
import { FilterSelect } from '../components/app-ui/FilterBar';
import { YEAR_OPTIONS } from '../data/options';
import {
  MOCK_REVENUE,
  MOCK_STATUS_BREAKDOWN,
  MOCK_ACTIVITIES } from
'../data/mockDashboard';
import { MOCK_CONTRACTS } from '../data/mockContracts';
import { formatCurrency, formatDate, formatNumber } from '../lib/format';
export function DashboardPage({
  userEmail,
  onNavigate



}: {userEmail: string;onNavigate: (k: any) => void;}) {
  const [year, setYear] = useState('2026');
  const totalStatus = MOCK_STATUS_BREAKDOWN.reduce((s, x) => s + x.value, 0);
  const expiring = MOCK_CONTRACTS.filter((c) => c.status === 'expiring').slice(
    0,
    4
  );
  const recent = [...MOCK_CONTRACTS].
  filter((c) => c.status !== 'draft').
  sort((a, b) => b.signedDate.localeCompare(a.signedDate)).
  slice(0, 5);
  return (
    <Page>
      <PageHeader
        title={`Xin chào, ${userEmail}`}
        description="Tổng quan vận hành hôm nay."
        actions={
        <FilterSelect
          label="Năm"
          value={year}
          onChange={setYear}
          options={YEAR_OPTIONS}
          width="w-32" />

        } />
      

      {/* Hero */}
      <div className="rounded-md border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-indigo-300 font-semibold">
            Tổng quan vận hành hôm nay
          </p>
          <h2 className="text-lg sm:text-xl font-semibold mt-1">
            286 hợp đồng đang quản lý · 12 hành động cần xử lý
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Có 36 hợp đồng sắp hết hạn trong 30 ngày tới. 5 GCN đang chờ in.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('contracts.create')}
            className="h-9 px-4 inline-flex items-center gap-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium">
            
            <FilePlusIcon className="h-4 w-4" /> Tạo hợp đồng mới
          </button>
          <button
            type="button"
            onClick={() => onNavigate('search')}
            className="h-9 px-4 inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/15 text-white text-sm font-medium">
            
            <SearchIcon className="h-4 w-4" /> Tìm kiếm
          </button>
        </div>
      </div>

      {/* KPIs */}
      <MetricStrip
        items={[
        {
          label: 'Tổng hợp đồng',
          value: '286',
          hint: 'Tất cả thời kỳ',
          icon: <FileTextIcon className="h-4 w-4" />,
          delta: {
            value: '+12',
            tone: 'up'
          }
        },
        {
          label: 'Đang hiệu lực',
          value: '184',
          hint: '64% tổng số',
          icon: <CheckCircle2Icon className="h-4 w-4" />,
          delta: {
            value: '+5',
            tone: 'up'
          }
        },
        {
          label: 'Phụ lục',
          value: '47',
          hint: 'Đã ký năm 2026',
          icon: <PaperclipIcon className="h-4 w-4" />
        },
        {
          label: 'Tác phẩm',
          value: '12.480',
          hint: 'Đang quản lý',
          icon: <Music2Icon className="h-4 w-4" />
        },
        {
          label: 'Doanh thu',
          value: '30,01 tỷ',
          hint: 'Lũy kế năm',
          icon: <WalletIcon className="h-4 w-4" />,
          delta: {
            value: '+8.4%',
            tone: 'up'
          }
        }]
        } />
      

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ContentCard
          title="Doanh thu theo tháng"
          description={`Năm ${year} · đơn vị: triệu VND`}
          className="lg:col-span-2">
          
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart
                data={MOCK_REVENUE}
                margin={{
                  top: 8,
                  right: 8,
                  left: -10,
                  bottom: 0
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false} />
                
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false} />
                
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false} />
                
                <Tooltip
                  cursor={{
                    fill: '#f1f5f9'
                  }}
                  contentStyle={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    fontSize: 12
                  }} />
                
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ContentCard>

        <ContentCard title="Tỷ lệ trạng thái hợp đồng">
          <ul className="flex flex-col gap-3">
            {MOCK_STATUS_BREAKDOWN.map((s) => {
              const pct = Math.round(s.value / totalStatus * 100);
              const colorBar =
              s.tone === 'success' ?
              'bg-emerald-500' :
              s.tone === 'warning' ?
              'bg-amber-500' :
              s.tone === 'danger' ?
              'bg-rose-500' :
              'bg-slate-400';
              return (
                <li key={s.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-700">{s.name}</span>
                    <span className="text-slate-500 text-xs tabular-nums">
                      {formatNumber(s.value)} · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${colorBar}`}
                      style={{
                        width: `${pct}%`
                      }} />
                    
                  </div>
                </li>);

            })}
          </ul>
        </ContentCard>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ContentCard
          title="Hợp đồng sắp hết hạn"
          description="Trong 30 ngày tới"
          className="lg:col-span-2"
          actions={
          <button
            type="button"
            onClick={() => onNavigate('contracts.list')}
            className="text-xs font-medium text-indigo-600 hover:underline">
            
              Xem tất cả
            </button>
          }
          padded={false}>
          
          <ul className="divide-y divide-slate-100">
            {expiring.map((c) =>
            <li key={c.id} className="px-5 py-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ClockIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {c.partner}
                  </p>
                  <p className="text-xs text-slate-500 truncate font-mono">
                    {c.contractNo}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>Hết hạn</p>
                  <p className="text-slate-900 font-medium">
                    {formatDate(c.effectiveTo)}
                  </p>
                </div>
              </li>
            )}
          </ul>
        </ContentCard>

        <ContentCard title="Hoạt động gần đây" padded={false}>
          <ul className="divide-y divide-slate-100">
            {MOCK_ACTIVITIES.map((a) =>
            <li key={a.id} className="px-5 py-3">
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">{a.actor}</span>{' '}
                  {a.action}{' '}
                  <span className="font-mono text-xs text-indigo-600">
                    {a.target}
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
              </li>
            )}
          </ul>
        </ContentCard>
      </div>

      <ContentCard title="Hợp đồng gần đây" padded={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-left">
                Số hợp đồng
              </th>
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-left">
                Đối tác
              </th>
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-left">
                Lĩnh vực
              </th>
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-left">
                Ngày ký
              </th>
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-right">
                Giá trị
              </th>
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-left">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {recent.map((c) =>
            <tr
              key={c.id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
              
                <td className="px-5 py-3 font-mono text-xs text-slate-700">
                  {c.contractNo}
                </td>
                <td className="px-5 py-3 text-slate-900">{c.partner}</td>
                <td className="px-5 py-3 text-slate-700">{c.field}</td>
                <td className="px-5 py-3 text-slate-700">
                  {formatDate(c.signedDate)}
                </td>
                <td className="px-5 py-3 text-slate-900 text-right tabular-nums">
                  {formatCurrency(c.value)}
                </td>
                <td className="px-5 py-3">
                  {c.status === 'active' &&
                <StatusBadge tone="success">Đang hiệu lực</StatusBadge>
                }
                  {c.status === 'expiring' &&
                <StatusBadge tone="warning">Sắp hết hạn</StatusBadge>
                }
                  {c.status === 'expired' &&
                <StatusBadge tone="danger">Hết hạn</StatusBadge>
                }
                  {c.status === 'draft' &&
                <StatusBadge tone="neutral">Bản nháp</StatusBadge>
                }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ContentCard>
    </Page>);

}