import React, { useState } from 'react';
import {
  PlusIcon,
  DownloadIcon,
  RefreshCwIcon,
  SearchIcon,
  MoreVerticalIcon,
  ShieldIcon,
  LockIcon,
  UnlockIcon,
  Edit2Icon,
  KeyIcon,
  Trash2Icon,
  EyeIcon } from
'lucide-react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { Button } from '../components/app-ui/Button';
import { Input } from '../components/app-ui/Input';
import { Select } from '../components/app-ui/Select';
import { StatusBadge } from '../components/app-ui/StatusBadge';
import { RowActionsMenu } from '../components/app-ui/RowActionsMenu';
import { Modal } from '../components/app-ui/Modal';
import { Checkbox } from '../components/app-ui/Checkbox';
import { MOCK_USERS, ROLE_DEFS, DOMAINS, AUDIT_LOG } from '../data/authData';
export function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const filteredUsers = MOCK_USERS.filter((u) => {
    if (
    search &&
    !u.name.toLowerCase().includes(search.toLowerCase()) &&
    !u.email.toLowerCase().includes(search.toLowerCase()))

    return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (statusFilter && u.status !== statusFilter) return false;
    return true;
  });
  return (
    <Page>
      <PageHeader
        breadcrumb="/admin/users"
        title="Quản lý người dùng"
        description="Tạo tài khoản, phân quyền và quản lý phạm vi xử lý nghiệp vụ."
        actions={
        <>
            <Button
            variant="secondary"
            leftIcon={<RefreshCwIcon className="h-4 w-4" />}>
            
              Làm mới
            </Button>
            <Button
            variant="secondary"
            leftIcon={<DownloadIcon className="h-4 w-4" />}>
            
              Xuất danh sách
            </Button>
            <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setShowUserModal(true)}>
            
              Thêm người dùng
            </Button>
          </>
        } />
      

      <ContentCard padded={false} accent>
        <div className="p-4 border-b border-zinc-100 flex flex-wrap gap-3 bg-zinc-50/50">
          <div className="relative w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm tên, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            
          </div>
          <div className="w-40">
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="Tất cả Role"
              options={Object.values(ROLE_DEFS).map((r) => ({
                value: r.id,
                label: r.name
              }))} />
            
          </div>
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Tất cả trạng thái"
              options={[
              {
                value: 'active',
                label: 'Hoạt động'
              },
              {
                value: 'locked',
                label: 'Tạm khóa'
              }]
              } />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Domains
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Đăng nhập cuối
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  HĐ / GCN
                </th>
                <th className="w-10 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) =>
              <tr
                key={u.id}
                className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 font-semibold flex items-center justify-center shrink-0">
                        {u.avatarInitial}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">{u.name}</p>
                        <p className="text-xs text-zinc-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-200">
                      <ShieldIcon className="h-3 w-3 text-zinc-400" />
                      {ROLE_DEFS[u.role as keyof typeof ROLE_DEFS]?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top max-w-[200px]">
                    {u.domains.includes('__all__') ?
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Tất cả
                      </span> :

                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {u.domains.
                    map((d) => DOMAINS.find((x) => x.id === d)?.label).
                    filter(Boolean).
                    join(', ')}
                      </p>
                  }
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusBadge
                    tone={u.status === 'active' ? 'success' : 'danger'}
                    dot>
                    
                      {u.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-zinc-600 tabular-nums">
                    {u.lastLogin}
                  </td>
                  <td className="px-4 py-3 align-top text-right text-xs tabular-nums">
                    <span className="font-medium text-zinc-900">
                      {u.contractsHandled}
                    </span>
                    <span className="text-zinc-400 mx-1">/</span>
                    <span className="font-medium text-zinc-900">
                      {u.certificatesHandled}
                    </span>
                  </td>
                  <td className="pr-4 py-3 align-top text-right">
                    <RowActionsMenu
                    actions={[
                    {
                      label: 'Xem hồ sơ',
                      icon: <EyeIcon className="h-4 w-4" />,
                      onClick: () => {}
                    },
                    {
                      label: 'Chỉnh sửa',
                      icon: <Edit2Icon className="h-4 w-4" />,
                      onClick: () => setShowUserModal(true)
                    },
                    {
                      label: 'Đổi mật khẩu',
                      icon: <KeyIcon className="h-4 w-4" />,
                      onClick: () => {}
                    },
                    {
                      label:
                      u.status === 'active' ?
                      'Khóa tài khoản' :
                      'Mở khóa',
                      icon:
                      u.status === 'active' ?
                      <LockIcon className="h-4 w-4" /> :

                      <UnlockIcon className="h-4 w-4" />,

                      onClick: () => {},
                      danger: u.status === 'active'
                    },
                    {
                      label: 'Xóa',
                      icon: <Trash2Icon className="h-4 w-4" />,
                      onClick: () => {},
                      danger: true
                    }]
                    } />
                  
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ContentCard>

      {/* Audit Log Panel */}
      <div className="mt-6">
        <ContentCard title="Nhật ký hoạt động gần đây" description="Lịch sử thao tác nghiệp vụ và bảo mật hệ thống." padded={false}>
          <div className="divide-y divide-zinc-100">
            {AUDIT_LOG.map((log) =>
            <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-zinc-50/50 transition-colors">
                <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
              log.type === 'security' ? 'bg-rose-100 text-rose-600' :
              log.type === 'permission' ? 'bg-amber-100 text-amber-600' :
              log.type === 'login' ? 'bg-emerald-100 text-emerald-600' :
              'bg-indigo-100 text-indigo-600'}`
              }>
                  {log.type === 'security' ? <ShieldIcon className="h-4 w-4" /> :
                log.type === 'permission' ? <KeyIcon className="h-4 w-4" /> :
                log.type === 'login' ? <UnlockIcon className="h-4 w-4" /> :
                <Edit2Icon className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900">
                    {log.action} <span className="text-zinc-500 font-normal">bởi</span> {log.actor}
                  </p>
                  <p className="text-sm text-zinc-600 mt-0.5">{log.description}</p>
                  <p className="text-xs text-zinc-400 mt-1.5 tabular-nums">{log.timestamp}</p>
                </div>
                {log.target &&
              <div className="hidden sm:block text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600">
                      Target: {log.target}
                    </span>
                  </div>
              }
              </div>
            )}
          </div>
        </ContentCard>
      </div>

      <UserFormModal
        open={showUserModal}
        onClose={() => setShowUserModal(false)} />
      
    </Page>);

}
function UserFormModal({
  open,
  onClose



}: {open: boolean;onClose: () => void;}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thêm người dùng mới"
      maxWidth="2xl">
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Thông tin cơ bản
            </h4>
            <Input label="Họ và tên" placeholder="Nhập họ tên" required />
            <Input
              label="Email"
              type="email"
              placeholder="name@vcpmc.org"
              required />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Role
                </label>
                <Select
                  value="staff"
                  onChange={() => {}}
                  options={Object.values(ROLE_DEFS).map((r) => ({
                    value: r.id,
                    label: r.name
                  }))} />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Trạng thái
                </label>
                <Select
                  value="active"
                  onChange={() => {}}
                  options={[
                  {
                    value: 'active',
                    label: 'Hoạt động'
                  },
                  {
                    value: 'locked',
                    label: 'Tạm khóa'
                  }]
                  } />
                
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Phạm vi nghiệp vụ (Domains)
            </h4>
            <div className="h-64 overflow-y-auto border border-zinc-200 rounded-lg p-3 space-y-2 bg-zinc-50/50">
              {DOMAINS.map((d) =>
              <Checkbox
                key={d.id}
                checked={false}
                onChange={() => {}}
                label={
                <span className="text-sm text-zinc-700">{d.label}</span>
                } />

              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={onClose}>
            Lưu người dùng
          </Button>
        </div>
      </div>
    </Modal>);

}