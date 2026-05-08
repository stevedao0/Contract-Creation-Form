import React, { useMemo, useState } from 'react';
import { FileTextIcon } from 'lucide-react';
import { FormSection } from '../components/app-ui/FormSection';
import { FieldGrid } from '../components/app-ui/FieldGrid';
import { FormField } from '../components/app-ui/FormField';
import { SelectField } from '../components/app-ui/SelectField';
import { DateField } from '../components/app-ui/DateField';
import { ReadonlyField } from '../components/app-ui/ReadonlyField';
import { PreviewField } from '../components/app-ui/PreviewField';
// --- Option sources (would come from app constants in real repo) ---
const YEAR_OPTIONS = ['2024', '2025', '2026', '2027'].map((y) => ({
  value: y,
  label: y
}));
const REGION_CODE_OPTIONS = [
{
  value: 'HĐQTGAN',
  label: 'HĐQTGAN'
},
{
  value: 'HĐQTG',
  label: 'HĐQTG'
},
{
  value: 'HĐNT',
  label: 'HĐNT'
},
{
  value: 'HĐDV',
  label: 'HĐDV'
}];

const KHU_VUC_OPTIONS = [
{
  value: 'PN',
  label: 'PN — Phía Nam'
},
{
  value: 'HCM',
  label: 'HCM — Hồ Chí Minh'
},
{
  value: 'HN',
  label: 'HN — Hà Nội'
},
{
  value: 'DN',
  label: 'DN — Đà Nẵng'
},
{
  value: 'CT',
  label: 'CT — Cần Thơ'
}];

const MANG_OPTIONS = [
{
  value: 'PR',
  label: 'PR'
},
{
  value: 'MR',
  label: 'MR'
},
{
  value: 'PR/MR',
  label: 'PR/MR'
}];

const LINH_VUC_OPTIONS = [
'Karaoke',
'Cà phê',
'Nhà hàng',
'Khách sạn',
'Khu vui chơi',
'Trung tâm thương mại',
'Bar',
'Văn phòng',
'Cửa hàng',
'Rạp phim',
'Phòng trà',
'Chăm sóc sức khỏe'].
map((v) => ({
  value: v,
  label: v
}));
const NHOM_HD_OPTIONS = [
{
  value: 'Background',
  label: 'Background'
},
{
  value: 'Media',
  label: 'Media'
},
{
  value: 'Event',
  label: 'Event'
},
{
  value: 'Other',
  label: 'Other'
}];

const NGUOI_THUC_HIEN: Record<string, string> = {
  Tuấn: 'tuan@vcpmc.org',
  Admin: 'admin@vcpmc.org',
  'Nhân viên 1': 'user1@vcpmc.org'
};
const NGUOI_OPTIONS = Object.keys(NGUOI_THUC_HIEN).map((v) => ({
  value: v,
  label: v
}));
// --- Compose helper (mirrors composeContractNo signature) ---
function composeContractNo(parts: {
  so_hd: string;
  nam: string;
  ma_vung: string;
  khu_vuc: string;
  mang: string;
}) {
  const { so_hd, nam, ma_vung, khu_vuc, mang } = parts;
  if (!so_hd || !nam || !ma_vung || !khu_vuc || !mang) return '';
  return `${so_hd}/${nam}/${ma_vung}-${khu_vuc}/${mang}`;
}
export function ContractInfoForm() {
  // Định danh
  const [soHd, setSoHd] = useState('');
  const [ngayLap, setNgayLap] = useState('');
  const [nam, setNam] = useState('2026');
  const [maVung, setMaVung] = useState('HĐQTGAN');
  const [khuVuc, setKhuVuc] = useState('PN');
  const [mang, setMang] = useState('MR');
  // Phân loại
  const [linhVuc, setLinhVuc] = useState('');
  const [nhomHd, setNhomHd] = useState('');
  // Người thực hiện
  const [nguoi, setNguoi] = useState('');
  const email = nguoi ? NGUOI_THUC_HIEN[nguoi] ?? '' : '';
  const fullContractNo = useMemo(
    () =>
    composeContractNo({
      so_hd: soHd,
      nam,
      ma_vung: maVung,
      khu_vuc: khuVuc,
      mang
    }),
    [soHd, nam, maVung, khuVuc, mang]
  );
  return (
    <div className="min-h-screen w-full bg-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-6 flex items-start gap-3">
          <div className="h-9 w-9 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0">
            <FileTextIcon className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Tạo hợp đồng
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhập thông tin định danh và phân loại hợp đồng. Số hợp đồng sẽ
              được tổng hợp tự động.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {/* 1. Định danh hợp đồng */}
          <FormSection
            title="Định danh hợp đồng"
            description="Các trường tạo nên số hợp đồng đầy đủ.">
            
            <FieldGrid cols={3}>
              <FormField
                id="so_hd"
                label="Số hợp đồng"
                value={soHd}
                onChange={setSoHd}
                placeholder="VD: 123"
                required
                helper="Số thứ tự trong năm." />
              
              <DateField
                id="ngay_lap"
                label="Ngày lập hợp đồng"
                value={ngayLap}
                onChange={setNgayLap}
                required />
              
              <SelectField
                id="contract_year"
                label="Năm"
                value={nam}
                onChange={setNam}
                options={YEAR_OPTIONS}
                required />
              
              <SelectField
                id="region_code"
                label="Mã vùng"
                value={maVung}
                onChange={setMaVung}
                options={REGION_CODE_OPTIONS}
                required />
              
              <SelectField
                id="khu_vuc"
                label="Khu vực"
                value={khuVuc}
                onChange={setKhuVuc}
                options={KHU_VUC_OPTIONS}
                required />
              
              <SelectField
                id="mang"
                label="Mảng"
                value={mang}
                onChange={setMang}
                options={MANG_OPTIONS}
                required />
              
            </FieldGrid>

            <div className="mt-5">
              <PreviewField
                label="Số hợp đồng đầy đủ"
                value={fullContractNo}
                hint="Định dạng: {so_hd}/{nam}/{ma_vung}-{khu_vuc}/{mang}" />
              
            </div>
          </FormSection>

          {/* 2. Phân loại nghiệp vụ */}
          <FormSection
            title="Phân loại nghiệp vụ"
            description="Phục vụ thống kê và phân quyền nghiệp vụ.">
            
            <FieldGrid cols={2}>
              <SelectField
                id="linh_vuc"
                label="Lĩnh vực"
                value={linhVuc}
                onChange={setLinhVuc}
                options={LINH_VUC_OPTIONS}
                required
                helper="Loại hình kinh doanh của khách hàng." />
              
              <SelectField
                id="nhom_hop_dong"
                label="Nhóm hợp đồng"
                value={nhomHd}
                onChange={setNhomHd}
                options={NHOM_HD_OPTIONS}
                helper="Phân nhóm theo loại nội dung sử dụng." />
              
            </FieldGrid>
          </FormSection>

          {/* 3. Người thực hiện */}
          <FormSection
            title="Người thực hiện"
            description="Cán bộ phụ trách hợp đồng này.">
            
            <FieldGrid cols={2}>
              <SelectField
                id="nguoi_thuc_hien"
                label="Người thực hiện"
                value={nguoi}
                onChange={setNguoi}
                options={NGUOI_OPTIONS}
                required />
              
              <ReadonlyField
                label="Email người thực hiện"
                value={email}
                placeholder="Tự động theo người thực hiện"
                helper="Tự điền sau khi chọn người thực hiện." />
              
            </FieldGrid>
          </FormSection>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              className="h-9 px-4 text-sm font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
              
              Hủy
            </button>
            <button
              type="button"
              className="h-9 px-4 text-sm font-medium rounded-md bg-slate-900 text-white hover:bg-slate-800">
              
              Lưu hợp đồng
            </button>
          </div>
        </div>
      </div>
    </div>);

}