import React, { useEffect, useState } from 'react';
import {
  ShieldCheckIcon,
  SaveIcon,
  RotateCcwIcon,
  AlertCircleIcon } from
'lucide-react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { ContentCard } from '../components/app-ui/ContentCard';
import { Button } from '../components/app-ui/Button';
import { Checkbox } from '../components/app-ui/Checkbox';
import { ROLE_DEFS } from '../data/authData';
import { PERMISSION_GROUPS } from '../lib/permissions';
import { useAuth } from '../lib/auth';
export function PermissionsPage() {
  const { rolePermissions, updateRolePermissions } = useAuth();
  const [selectedRole, setSelectedRole] = useState('manager');
  const [localPerms, setLocalPerms] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    setLocalPerms(rolePermissions[selectedRole] || []);
    setIsDirty(false);
  }, [selectedRole, rolePermissions]);
  const handleToggle = (permKey: string) => {
    if (selectedRole === 'super_admin') return; // Read-only
    setLocalPerms((prev) => {
      const next = prev.includes(permKey) ?
      prev.filter((p) => p !== permKey) :
      [...prev, permKey];
      setIsDirty(true);
      return next;
    });
  };
  const handleSave = () => {
    updateRolePermissions(selectedRole, localPerms);
    setIsDirty(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  const handleReset = () => {
    setLocalPerms(rolePermissions[selectedRole] || []);
    setIsDirty(false);
  };
  const isSuperAdmin = selectedRole === 'super_admin';
  return (
    <Page>
      <PageHeader
        breadcrumb="/admin/permissions"
        title="Phân quyền hệ thống"
        description="Quản lý role, quyền truy cập module và hành động nghiệp vụ."
        actions={
        <>
            {isDirty &&
          <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg mr-2 animate-pulse">
                Chưa lưu thay đổi
              </span>
          }
            <Button
            variant="ghost"
            leftIcon={<RotateCcwIcon className="h-4 w-4" />}
            onClick={handleReset}
            disabled={!isDirty}>
            
              Hủy
            </Button>
            <Button
            variant="primary"
            leftIcon={<SaveIcon className="h-4 w-4" />}
            onClick={handleSave}
            disabled={!isDirty || isSuperAdmin}>
            
              Lưu thay đổi
            </Button>
          </>
        } />
      

      {showToast &&
      <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-[fadein_0.2s_ease-out] z-50">
          <ShieldCheckIcon className="h-5 w-5" />
          <span className="text-sm font-medium">
            Đã cập nhật quyền thành công
          </span>
        </div>
      }

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Role List */}
        <div className="lg:col-span-1 space-y-2">
          {Object.values(ROLE_DEFS).map((role) =>
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${selectedRole === role.id ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-500/20' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}`}>
            
              <div className="flex items-center justify-between mb-1">
                <span
                className={`font-semibold ${selectedRole === role.id ? 'text-indigo-900' : 'text-zinc-900'}`}>
                
                  {role.name}
                </span>
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                  {(rolePermissions[role.id] || []).length} quyền
                </span>
              </div>
              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {role.description}
              </p>
            </button>
          )}
        </div>

        {/* Right: Permission Matrix */}
        <div className="lg:col-span-3">
          <ContentCard padded={false} accent>
            <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  Quyền của{' '}
                  {ROLE_DEFS[selectedRole as keyof typeof ROLE_DEFS]?.name}
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
                  {isSuperAdmin ?
                  'Super Admin có toàn quyền hệ thống và không thể chỉnh sửa.' :
                  'Chọn các quyền cho phép role này thực hiện.'}
                </p>
              </div>
              {isSuperAdmin &&
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-medium">
                  <AlertCircleIcon className="h-4 w-4" /> Read-only
                </div>
              }
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {PERMISSION_GROUPS.map((group) => {
                const allChecked = group.permissions.every((p) =>
                localPerms.includes(p.key)
                );
                const someChecked =
                group.permissions.some((p) => localPerms.includes(p.key)) &&
                !allChecked;
                return (
                  <div key={group.key} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                      <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                        {group.label}
                      </h4>
                      {!isSuperAdmin &&
                      <button
                        onClick={() => {
                          if (allChecked) {
                            setLocalPerms((prev) =>
                            prev.filter(
                              (p) =>
                              !group.permissions.find(
                                (gp) => gp.key === p
                              )
                            )
                            );
                          } else {
                            setLocalPerms((prev) => {
                              const next = new Set(prev);
                              group.permissions.forEach((p) =>
                              next.add(p.key)
                              );
                              return Array.from(next);
                            });
                          }
                          setIsDirty(true);
                        }}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                        
                          {allChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>
                      }
                    </div>
                    <div className="space-y-2.5 pl-1">
                      {group.permissions.map((perm) =>
                      <div key={perm.key} className="flex items-start">
                          <Checkbox
                          checked={localPerms.includes(perm.key)}
                          onChange={() => handleToggle(perm.key)}
                          disabled={isSuperAdmin}
                          label={
                          <div className="ml-1">
                                <span className="text-sm font-medium text-zinc-800 block">
                                  {perm.label}
                                </span>
                                <span className="text-[11px] font-mono text-zinc-400">
                                  {perm.key}
                                </span>
                              </div>
                          } />
                        
                        </div>
                      )}
                    </div>
                  </div>);

              })}
            </div>
          </ContentCard>
        </div>
      </div>
    </Page>);

}