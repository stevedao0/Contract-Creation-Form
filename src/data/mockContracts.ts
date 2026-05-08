export type Contract = {
  id: string;
  contractNo: string;
  partner: string;
  field: string;
  signedDate: string;
  effectiveTo: string;
  value: number;
  status: 'active' | 'expiring' | 'expired' | 'draft';
};

export const MOCK_CONTRACTS: Contract[] = [
{
  id: 'c1',
  contractNo: '123/2026/HĐQTGAN-PN/MR',
  partner: 'CTCP Giải trí Sao Việt',
  field: 'Karaoke',
  signedDate: '2026-01-12',
  effectiveTo: '2027-01-11',
  value: 48_000_000,
  status: 'active'
},
{
  id: 'c2',
  contractNo: '124/2026/HĐQTG-HCM/PR',
  partner: 'Công ty TNHH Cà phê Lá',
  field: 'Cà phê',
  signedDate: '2026-01-15',
  effectiveTo: '2026-07-14',
  value: 12_000_000,
  status: 'expiring'
},
{
  id: 'c3',
  contractNo: '098/2025/HĐNT-HN/MR',
  partner: 'Khách sạn Hương Sen',
  field: 'Khách sạn',
  signedDate: '2025-03-04',
  effectiveTo: '2026-03-03',
  value: 96_000_000,
  status: 'expiring'
},
{
  id: 'c4',
  contractNo: '076/2024/HĐQTGAN-DN/PR',
  partner: 'Nhà hàng Hải Đăng',
  field: 'Nhà hàng',
  signedDate: '2024-08-20',
  effectiveTo: '2025-08-19',
  value: 18_000_000,
  status: 'expired'
},
{
  id: 'c5',
  contractNo: '125/2026/HĐDV-HCM/PR/MR',
  partner: 'Trung tâm Thương mại Saigon Plaza',
  field: 'Trung tâm thương mại',
  signedDate: '2026-02-01',
  effectiveTo: '2027-01-31',
  value: 220_000_000,
  status: 'active'
},
{
  id: 'c6',
  contractNo: '126/2026/HĐQTG-CT/MR',
  partner: 'Khu vui chơi Sunny Land',
  field: 'Khu vui chơi',
  signedDate: '2026-02-14',
  effectiveTo: '2027-02-13',
  value: 64_000_000,
  status: 'active'
},
{
  id: 'c7',
  contractNo: '099/2025/HĐQTGAN-PN/MR',
  partner: 'Bar Skyline',
  field: 'Bar',
  signedDate: '2025-09-10',
  effectiveTo: '2026-03-09',
  value: 32_000_000,
  status: 'expiring'
},
{
  id: 'c8',
  contractNo: '127/2026/HĐNT-HN/PR',
  partner: 'Rạp phim Cine Star',
  field: 'Rạp phim',
  signedDate: '2026-03-01',
  effectiveTo: '2027-02-28',
  value: 150_000_000,
  status: 'active'
},
{
  id: 'c9',
  contractNo: 'D-2026-04',
  partner: 'Phòng trà Đêm Trắng',
  field: 'Phòng trà',
  signedDate: '2026-04-02',
  effectiveTo: '—',
  value: 0,
  status: 'draft'
},
{
  id: 'c10',
  contractNo: '128/2026/HĐDV-DN/MR',
  partner: 'Văn phòng Sky Tower',
  field: 'Văn phòng',
  signedDate: '2026-03-22',
  effectiveTo: '2027-03-21',
  value: 28_000_000,
  status: 'active'
}];


export type Certificate = {
  id: string;
  gcnNo: string;
  contractNo: string;
  partner: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'printed_test' | 'printed_official';
};

export const MOCK_CERTIFICATES: Certificate[] = [
{
  id: 'g1',
  gcnNo: 'GCN-2026-0001',
  contractNo: '123/2026/HĐQTGAN-PN/MR',
  partner: 'CTCP Giải trí Sao Việt',
  startDate: '2026-01-12',
  endDate: '2027-01-11',
  status: 'printed_official'
},
{
  id: 'g2',
  gcnNo: 'GCN-2026-0002',
  contractNo: '124/2026/HĐQTG-HCM/PR',
  partner: 'Công ty TNHH Cà phê Lá',
  startDate: '2026-01-15',
  endDate: '2026-07-14',
  status: 'printed_test'
},
{
  id: 'g3',
  gcnNo: 'GCN-2026-0003',
  contractNo: '125/2026/HĐDV-HCM/PR/MR',
  partner: 'Trung tâm Thương mại Saigon Plaza',
  startDate: '2026-02-01',
  endDate: '2027-01-31',
  status: 'pending'
},
{
  id: 'g4',
  gcnNo: 'GCN-2026-0004',
  contractNo: '126/2026/HĐQTG-CT/MR',
  partner: 'Khu vui chơi Sunny Land',
  startDate: '2026-02-14',
  endDate: '2027-02-13',
  status: 'printed_official'
},
{
  id: 'g5',
  gcnNo: 'GCN-2026-0005',
  contractNo: '127/2026/HĐNT-HN/PR',
  partner: 'Rạp phim Cine Star',
  startDate: '2026-03-01',
  endDate: '2027-02-28',
  status: 'pending'
}];