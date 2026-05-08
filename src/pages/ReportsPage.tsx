import React, { useState } from 'react';
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  WalletIcon,
  TrendingUpIcon,
  FileCheck2Icon } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart } from
'recharts';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { MetricStrip } from '../components/app-ui/MetricCard';
import { FilterBar, FilterSelect } from '../components/app-ui/FilterBar';
import { YEAR_OPTIONS, LINH_VUC_OPTIONS } from '../data/options';
import { MOCK_REVENUE } from '../data/mockDashboard';
import { formatCurrency, formatNumber } from '../lib/format';
const SUMMARY = [
{
  field: 'Karaoke',
  contracts: 64,
  revenue: 7800000000
},
{
  field: 'Cà phê',
  contracts: 38,
  revenue: 2400000000
},
{
  field: 'Nhà hàng',
  contracts: 42,
  revenue: 4100000000
},
{
  field: 'Khách sạn',
  contracts: 28,
  revenue: 6900000000
},
{
  field: 'Trung tâm thương mại',
  contracts: 12,
  revenue: 5200000000
},
{
  field: 'Khu vui chơi',
  contracts: 18,
  revenue: 1800000000
},
{
  field: 'Bar',
  contracts: 22,
  revenue: 1500000000
},
{
  field: 'Khác',
  contracts: 62,
  revenue: 320000000
}];

export function ReportsPage() {
  const [year, setYear] = useState('2026');
  const [field, setField] = useState('');
  const totalRevenue = SUMMARY.reduce((s, x) => s + x.revenue, 0);
  const totalContracts = SUMMARY.reduce((s, x) => s + x.contracts, 0);
  return (
    <Page>
      <PageHeader
        title="Báo cáo"
        description="Doanh thu, sản lượng và tỷ trọng theo lĩnh vực."
        actions={
        <div className="flex items-center gap-2">
            <button className="h-9 px-3 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50">
              <FileSpreadsheetIcon className="h-4 w-4" /> Xuất Excel
            </button>
            <button className="h-9 px-3 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50">
              <DownloadIcon className="h-4 w-4" /> Xuất PDF
            </button>
          </div>
        } />
      

      <FilterBar
        hasActive={!!(year || field)}
        onClear={() => {
          setYear('2026');
          setField('');
        }}>
        
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
        
      </FilterBar>

      <MetricStrip
        items={[
        {
          label: 'Doanh thu',
          value: formatCurrency(totalRevenue),
          icon: <WalletIcon className="h-4 w-4" />,
          delta: {
            value: '+12.4%',
            tone: 'up'
          },
          hint: `Năm ${year}`
        },
        {
          label: 'Hợp đồng',
          value: formatNumber(totalContracts),
          icon: <FileTextIcon className="h-4 w-4" />,
          delta: {
            value: '+18',
            tone: 'up'
          }
        },
        {
          label: 'Bình quân/HĐ',
          value: formatCurrency(Math.round(totalRevenue / totalContracts)),
          icon: <TrendingUpIcon className="h-4 w-4" />
        },
        {
          label: 'GCN phát hành',
          value: '142',
          icon: <FileCheck2Icon className="h-4 w-4" />,
          delta: {
            value: '+9',
            tone: 'up'
          }
        }]
        } />
      

      <ContentCard
        title="Doanh thu theo tháng"
        description={`Năm ${year} · đơn vị: triệu VND`}>
        
        <div className="h-72">
          <ResponsiveContainer>
            <ComposedChart
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
                contentStyle={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 12
                }} />
              
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0f172a"
                strokeWidth={2}
                dot={false} />
              
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ContentCard>

      <ContentCard title="Tổng hợp theo lĩnh vực" padded={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-left">
                Lĩnh vực
              </th>
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-right">
                Số hợp đồng
              </th>
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-right">
                Doanh thu
              </th>
              <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 text-right">
                Tỷ trọng
              </th>
            </tr>
          </thead>
          <tbody>
            {SUMMARY.map((s) => {
              const pct = s.revenue / totalRevenue * 100;
              return (
                <tr
                  key={s.field}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                  
                  <td className="px-5 py-3 text-slate-900 font-medium">
                    {s.field}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-700">
                    {formatNumber(s.contracts)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-900">
                    {formatCurrency(s.revenue)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <span className="tabular-nums text-slate-700 text-xs w-12">
                        {pct.toFixed(1)}%
                      </span>
                      <span className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                        <span
                          className="block h-full bg-indigo-500"
                          style={{
                            width: `${pct}%`
                          }} />
                        
                      </span>
                    </div>
                  </td>
                </tr>);

            })}
            <tr className="bg-slate-50 font-medium">
              <td className="px-5 py-3 text-slate-900">Tổng</td>
              <td className="px-5 py-3 text-right tabular-nums text-slate-900">
                {formatNumber(totalContracts)}
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-slate-900">
                {formatCurrency(totalRevenue)}
              </td>
              <td className="px-5 py-3 text-right text-slate-900">100%</td>
            </tr>
          </tbody>
        </table>
      </ContentCard>
    </Page>);

}