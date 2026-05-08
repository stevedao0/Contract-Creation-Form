import React, { useMemo, useState } from 'react';
import {
  SearchIcon,
  FileTextIcon,
  AwardIcon,
  PaperclipIcon,
  MailIcon } from
'lucide-react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { EmptyState } from '../components/app-ui/EmptyState';
import { StatusBadge } from '../components/app-ui/StatusBadge';
import { MOCK_CONTRACTS } from '../data/mockContracts';
import { MOCK_CERTIFICATES } from '../data/mockContracts';
import { formatDate } from '../lib/format';
type Scope = 'all' | 'contracts' | 'gcn' | 'appendices' | 'dispatch';
const SCOPES: {
  key: Scope;
  label: string;
  icon: React.ReactNode;
}[] = [
{
  key: 'all',
  label: 'Tất cả',
  icon: <SearchIcon className="h-3.5 w-3.5" />
},
{
  key: 'contracts',
  label: 'Hợp đồng',
  icon: <FileTextIcon className="h-3.5 w-3.5" />
},
{
  key: 'gcn',
  label: 'GCN',
  icon: <AwardIcon className="h-3.5 w-3.5" />
},
{
  key: 'appendices',
  label: 'Phụ lục',
  icon: <PaperclipIcon className="h-3.5 w-3.5" />
},
{
  key: 'dispatch',
  label: 'Công văn',
  icon: <MailIcon className="h-3.5 w-3.5" />
}];

const MOCK_APPENDICES = [
{
  id: 'p1',
  no: 'PL-01/123/2026',
  title: 'Bổ sung danh sách tác phẩm',
  contract: '123/2026/HĐQTGAN-PN/MR',
  date: '2026-02-10'
},
{
  id: 'p2',
  no: 'PL-02/124/2026',
  title: 'Điều chỉnh giá trị hợp đồng',
  contract: '124/2026/HĐQTG-HCM/PR',
  date: '2026-02-22'
}];

const MOCK_DISPATCHES = [
{
  id: 'd1',
  no: 'CV-2026-018',
  title: 'Yêu cầu thanh toán quý I',
  target: 'Saigon Plaza',
  date: '2026-04-02'
},
{
  id: 'd2',
  no: 'CV-2026-019',
  title: 'Thông báo gia hạn hợp đồng',
  target: 'Hương Sen',
  date: '2026-04-05'
}];

export function SearchPage() {
  const [q, setQ] = useState('');
  const [scope, setScope] = useState<Scope>('all');
  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return null;
    const contracts = MOCK_CONTRACTS.filter((c) =>
    `${c.contractNo} ${c.partner} ${c.field}`.toLowerCase().includes(kw)
    );
    const gcn = MOCK_CERTIFICATES.filter((g) =>
    `${g.gcnNo} ${g.contractNo} ${g.partner}`.toLowerCase().includes(kw)
    );
    const appendices = MOCK_APPENDICES.filter((a) =>
    `${a.no} ${a.title} ${a.contract}`.toLowerCase().includes(kw)
    );
    const dispatches = MOCK_DISPATCHES.filter((d) =>
    `${d.no} ${d.title} ${d.target}`.toLowerCase().includes(kw)
    );
    return {
      contracts,
      gcn,
      appendices,
      dispatches
    };
  }, [q]);
  const showContracts = scope === 'all' || scope === 'contracts';
  const showGcn = scope === 'all' || scope === 'gcn';
  const showAppendices = scope === 'all' || scope === 'appendices';
  const showDispatch = scope === 'all' || scope === 'dispatch';
  return (
    <Page>
      <PageHeader
        title="Tìm kiếm toàn cục"
        description="Truy vấn nhanh trên hợp đồng, GCN, phụ lục và công văn." />
      

      <div className="bg-white border border-slate-200 rounded-md p-5 flex flex-col gap-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nhập số hợp đồng, GCN, đối tác, từ khóa..."
            className="w-full h-12 pl-12 pr-4 text-base rounded-md border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
            autoFocus />
          
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SCOPES.map((s) =>
          <button
            key={s.key}
            type="button"
            onClick={() => setScope(s.key)}
            className={`h-8 px-3 inline-flex items-center gap-1.5 rounded-full text-xs font-medium border transition-colors ${scope === s.key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
            
              {s.icon}
              {s.label}
            </button>
          )}
        </div>
      </div>

      {!results &&
      <ContentCard>
          <EmptyState
          title="Bắt đầu tìm kiếm"
          description="Nhập từ khóa để tìm trên toàn bộ hệ thống. Bạn có thể giới hạn phạm vi tìm kiếm bằng các tab trên."
          icon={<SearchIcon className="h-5 w-5" />} />
        
        </ContentCard>
      }

      {results &&
      <div className="flex flex-col gap-5">
          {showContracts &&
        <ContentCard
          title={`Hợp đồng (${results.contracts.length})`}
          padded={false}>
          
              {results.contracts.length === 0 ?
          <div className="px-5 py-6 text-sm text-slate-500">
                  Không có kết quả.
                </div> :

          <ul className="divide-y divide-slate-100">
                  {results.contracts.slice(0, 5).map((c) =>
            <li
              key={c.id}
              className="px-5 py-3 flex items-center gap-3">
              
                      <FileTextIcon className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {c.partner}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          {c.contractNo} · {c.field}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDate(c.signedDate)}
                      </span>
                      {c.status === 'active' &&
              <StatusBadge tone="success">Hiệu lực</StatusBadge>
              }
                      {c.status === 'expiring' &&
              <StatusBadge tone="warning">Sắp hết hạn</StatusBadge>
              }
                      {c.status === 'expired' &&
              <StatusBadge tone="danger">Hết hạn</StatusBadge>
              }
                      {c.status === 'draft' &&
              <StatusBadge tone="neutral">Nháp</StatusBadge>
              }
                    </li>
            )}
                </ul>
          }
            </ContentCard>
        }

          {showGcn &&
        <ContentCard title={`GCN (${results.gcn.length})`} padded={false}>
              {results.gcn.length === 0 ?
          <div className="px-5 py-6 text-sm text-slate-500">
                  Không có kết quả.
                </div> :

          <ul className="divide-y divide-slate-100">
                  {results.gcn.slice(0, 5).map((g) =>
            <li
              key={g.id}
              className="px-5 py-3 flex items-center gap-3">
              
                      <AwardIcon className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {g.partner}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          {g.gcnNo} · {g.contractNo}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDate(g.startDate)}
                      </span>
                    </li>
            )}
                </ul>
          }
            </ContentCard>
        }

          {showAppendices &&
        <ContentCard
          title={`Phụ lục (${results.appendices.length})`}
          padded={false}>
          
              {results.appendices.length === 0 ?
          <div className="px-5 py-6 text-sm text-slate-500">
                  Không có kết quả.
                </div> :

          <ul className="divide-y divide-slate-100">
                  {results.appendices.map((a) =>
            <li
              key={a.id}
              className="px-5 py-3 flex items-center gap-3">
              
                      <PaperclipIcon className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {a.title}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          {a.no} · HĐ {a.contract}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDate(a.date)}
                      </span>
                    </li>
            )}
                </ul>
          }
            </ContentCard>
        }

          {showDispatch &&
        <ContentCard
          title={`Công văn (${results.dispatches.length})`}
          padded={false}>
          
              {results.dispatches.length === 0 ?
          <div className="px-5 py-6 text-sm text-slate-500">
                  Không có kết quả.
                </div> :

          <ul className="divide-y divide-slate-100">
                  {results.dispatches.map((d) =>
            <li
              key={d.id}
              className="px-5 py-3 flex items-center gap-3">
              
                      <MailIcon className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {d.title}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          {d.no} · {d.target}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDate(d.date)}
                      </span>
                    </li>
            )}
                </ul>
          }
            </ContentCard>
        }
        </div>
      }
    </Page>);

}