# Real-data-shaped fixture report

## Access path
1. GET endpoints used:
   - `GET /api/health`
   - `GET /api/reports/summary`
2. GET endpoints auth-blocked:
   - `GET /api/contracts?limit=200&page=1`
   - `GET /api/certificates`
   - `GET /api/certificates/pending-contracts`
3. DB SELECT fallback used:
   - YES
   - Read-only sampling only against `vcpmc_contract`

## Tables sampled
- `contract_records`
- `certificate_records`
- `domains`
- `business_locations`
- `contract_levels`
- `bg_congvan`
- `bg_congvan_batches`

## Tables empty
- `bg_congvan`
- `bg_congvan_batches`

## Fields used
### Contract fields
- `contract_no`
- `don_vi_ten`
- `don_vi_dia_chi`
- `field_code`
- `linh_vuc`
- `so_tien_value`
- `ngay_lap_hop_dong`
- `ngay_hieu_luc_tu`
- `ngay_hieu_luc_den`
- `contract_note`

### Certificate fields
- `certificate_no`
- `contract_no`
- `organization_name`
- `address`
- `business_location`
- `status`
- `print_count`
- `effective_from`
- `effective_to`
- `gcn_scope_col_1_text`
- `gcn_scope_col_2_text`
- `gcn_scope_col_3_text`

### Dispatch fields inferred/generated
- `cong_van_no`
- `issue_date`
- `contract_no`
- `recipient_unit`
- `status`
- `dispatch_type`
- `note`

## Observed sizing and ranges
- Longest contract number length: 24
- Longest sanitized customer name length: 73
- Longest sanitized address/location length: 76
- Statuses found:
  - Contracts: `Đang hiệu lực`, `Sắp hết hạn`, `Chờ tái ký`, `Bản nháp`, `Hết hạn`
  - Certificates: `draft`, `test_printed`, `final_printed`
  - Dispatches: `Đã gửi`, `Chờ ký`, `Đang soạn`
- Domain labels found:
  - Khách Sạn
  - Siêu Thị
  - Biểu Diễn
  - Trung tâm thương mại
  - Karaoke
  - Cà Phê
  - Nhà Hàng / Nhà Hàng Tiệc Cưới
  - Bar
  - Văn Phòng
  - Cửa Hàng
  - Rạp Phim
  - Phòng Trà
  - Khu Vui Chơi
  - Chăm Sóc Sức Khoẻ
- Amount min/max:
  - min: ~85.000.000
  - max: ~1.180.000.000
- Date range:
  - contracts: 2025-01-01 to 2027-05-28
  - certificates: 2026-01-01 to 2027-05-28
- Null/missing cases:
  - missing certificate number
  - empty note
  - null effective dates tolerated by shape
  - draft certificate rows with zero print count

## Recommended column widths
- Contract number: 220px
- Customer: 320px
- Location/address: 320px
- Usage/domain: 220px
- Amount: 160px right-aligned
- Contract status: 140px
- Certificate number: 180px
- Print scope: 260px
- Dispatch subject: 320px
- Dispatch destination: 240px

## UI stress cases
- Very long customer name
- Long address and mixed city/district strings
- Large royalty amount in enterprise rows
- Expired contract
- Pending certificate without certificate number
- Urgent dispatch
- Dense karaoke room scope text inferred from `contract_levels`

## Sanitization notes
- Real names, exact addresses, tax codes, phones, emails, and personal names were not committed.
- Raw snapshots remain local-only under `_local-real-data/` and are gitignored.
- Dispatch fixtures are inferred because sampled dispatch tables were empty.
