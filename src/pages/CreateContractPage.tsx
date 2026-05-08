import React, { useMemo, useState } from 'react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { FormSection } from '../components/app-ui/FormSection';
import { FieldGrid } from '../components/app-ui/FieldGrid';
import { FormField } from '../components/app-ui/FormField';
import { SelectField } from '../components/app-ui/SelectField';
import { DateField } from '../components/app-ui/DateField';
import { ReadonlyField } from '../components/app-ui/ReadonlyField';
import { PreviewField } from '../components/app-ui/PreviewField';
import { FormActions } from '../components/app-ui/FormActions';
import {
  YEAR_OPTIONS,
  REGION_CODE_OPTIONS,
  KHU_VUC_OPTIONS,
  MANG_OPTIONS,
  LINH_VUC_OPTIONS,
  NHOM_HD_OPTIONS,
  NGUOI_OPTIONS,
  NGUOI_THUC_HIEN_MAP,
  PROVINCE_OPTIONS } from
'../data/options';
function composeContractNo(p: {
  so_hd: string;
  nam: string;
  ma_vung: string;
  khu_vuc: string;
  mang: string;
}) {
  if (!p.so_hd || !p.nam || !p.ma_vung || !p.khu_vuc || !p.mang) return '';
  return `${p.so_hd}/${p.nam}/${p.ma_vung}-${p.khu_vuc}/${p.mang}`;
}
const BIZ_TYPE_OPTIONS = [
'Karaoke',
'Cà phê',
'Nhà hàng',
'Khách sạn',
'Khu vui chơi',
'Bar'].
map((v) => ({
  value: v,
  label: v
}));
export function CreateContractPage({
  onNavigate


}: {onNavigate: (k: any) => void;}) {
  // A. Định danh
  const [soHd, setSoHd] = useState('');
  const [ngayLap, setNgayLap] = useState('');
  const [nam, setNam] = useState('2026');
  const [maVung, setMaVung] = useState('HĐQTGAN');
  const [khuVuc, setKhuVuc] = useState('PN');
  const [mang, setMang] = useState('MR');
  // A. Phân loại
  const [linhVuc, setLinhVuc] = useState('');
  const [nhomHd, setNhomHd] = useState('');
  // A. Người thực hiện
  const [nguoi, setNguoi] = useState('');
  const email = nguoi ? NGUOI_THUC_HIEN_MAP[nguoi] ?? '' : '';
  // B. Đối tác
  const [partnerName, setPartnerName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [rep, setRep] = useState('');
  const [repTitle, setRepTitle] = useState('');
  const [partnerAddr, setPartnerAddr] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  // C. Địa điểm KD
  const [signage, setSignage] = useState('');
  const [bizType, setBizType] = useState('');
  const [bizAddr, setBizAddr] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [scale, setScale] = useState('');
  // D. Thời hạn & tài chính
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [vat, setVat] = useState('10');
  const [note, setNote] = useState('');
  const total = useMemo(() => {
    const v = Number(contractValue) || 0;
    const t = Number(vat) || 0;
    if (!v) return '';
    return Math.round(v * (1 + t / 100)).toLocaleString('vi-VN');
  }, [contractValue, vat]);
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
    <Page>
      <PageHeader
        breadcrumb="Hợp đồng / Tạo hợp đồng"
        title="Tạo hợp đồng mới"
        description="Điền đầy đủ thông tin theo các bước bên dưới. Số hợp đồng được tạo tự động từ định danh." />
      

      {/* A. Thông tin hợp đồng */}
      <FormSection
        title="A. Thông tin hợp đồng"
        description="Định danh, phân loại nghiệp vụ và người phụ trách.">
        
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              1. Định danh hợp đồng
            </p>
            <FieldGrid cols={3}>
              <FormField
                id="so_hd"
                label="Số hợp đồng"
                value={soHd}
                onChange={setSoHd}
                placeholder="VD: 123"
                required />
              
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
            <div className="mt-4">
              <PreviewField
                label="Số hợp đồng đầy đủ"
                value={fullContractNo}
                hint="Định dạng: {so_hd}/{nam}/{ma_vung}-{khu_vuc}/{mang}" />
              
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              2. Phân loại nghiệp vụ
            </p>
            <FieldGrid cols={2}>
              <SelectField
                id="linh_vuc"
                label="Lĩnh vực"
                value={linhVuc}
                onChange={setLinhVuc}
                options={LINH_VUC_OPTIONS}
                required />
              
              <SelectField
                id="nhom_hop_dong"
                label="Nhóm hợp đồng"
                value={nhomHd}
                onChange={setNhomHd}
                options={NHOM_HD_OPTIONS} />
              
            </FieldGrid>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              3. Người thực hiện
            </p>
            <FieldGrid cols={2}>
              <SelectField
                id="nguoi"
                label="Người thực hiện"
                value={nguoi}
                onChange={setNguoi}
                options={NGUOI_OPTIONS}
                required />
              
              <ReadonlyField
                label="Email người thực hiện"
                value={email}
                placeholder="Tự động theo người thực hiện" />
              
            </FieldGrid>
          </div>
        </div>
      </FormSection>

      {/* B. Đối tác */}
      <FormSection title="B. Thông tin đối tác">
        <FieldGrid cols={3}>
          <FormField
            label="Tên đơn vị"
            value={partnerName}
            onChange={setPartnerName}
            required />
          
          <FormField
            label="Mã số thuế"
            value={taxCode}
            onChange={setTaxCode}
            placeholder="0123456789" />
          
          <FormField label="Người đại diện" value={rep} onChange={setRep} />
          <FormField label="Chức vụ" value={repTitle} onChange={setRepTitle} />
          <FormField
            label="Điện thoại"
            value={partnerPhone}
            onChange={setPartnerPhone} />
          
          <FormField
            label="Email"
            type="email"
            value={partnerEmail}
            onChange={setPartnerEmail} />
          
        </FieldGrid>
        <div className="mt-4">
          <FieldGrid cols={1}>
            <FormField
              label="Địa chỉ"
              value={partnerAddr}
              onChange={setPartnerAddr} />
            
          </FieldGrid>
        </div>
      </FormSection>

      {/* C. Địa điểm KD */}
      <FormSection title="C. Địa điểm kinh doanh">
        <FieldGrid cols={3}>
          <FormField label="Bảng hiệu" value={signage} onChange={setSignage} />
          <SelectField
            label="Loại hình"
            value={bizType}
            onChange={setBizType}
            options={BIZ_TYPE_OPTIONS} />
          
          <FormField
            label="Quy mô / số phòng / diện tích"
            value={scale}
            onChange={setScale}
            placeholder="VD: 20 phòng" />
          
          <SelectField
            label="Tỉnh/thành"
            value={province}
            onChange={setProvince}
            options={PROVINCE_OPTIONS} />
          
          <FormField
            label="Quận/huyện"
            value={district}
            onChange={setDistrict} />
          
          <FormField
            label="Địa chỉ kinh doanh"
            value={bizAddr}
            onChange={setBizAddr} />
          
        </FieldGrid>
      </FormSection>

      {/* D. Thời hạn & tài chính */}
      <FormSection title="D. Thời hạn và tài chính">
        <FieldGrid cols={3}>
          <DateField
            label="Ngày hiệu lực"
            value={from}
            onChange={setFrom}
            required />
          
          <DateField
            label="Ngày hết hạn"
            value={to}
            onChange={setTo}
            required />
          
          <FormField
            label="Giá trị hợp đồng (VND)"
            value={contractValue}
            onChange={setContractValue}
            placeholder="0" />
          
          <FormField label="VAT (%)" value={vat} onChange={setVat} />
          <ReadonlyField
            label="Tổng thanh toán (VND)"
            value={total}
            placeholder="Tự động tính"
            mono />
          
        </FieldGrid>
        <div className="mt-4">
          <FieldGrid cols={1}>
            <FormField
              label="Ghi chú"
              value={note}
              onChange={setNote}
              placeholder="Ghi chú nội bộ" />
            
          </FieldGrid>
        </div>
      </FormSection>

      <FormActions
        tertiary={{
          label: 'Hủy',
          onClick: () => onNavigate('contracts.list')
        }}
        secondary={{
          label: 'Lưu nháp'
        }}
        primary={{
          label: 'Tạo hợp đồng'
        }} />
      
    </Page>);

}