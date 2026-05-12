import { apiRequest } from "./apiClient";
import type {
  ContractRecordsCandidate,
  CreateContractDraft,
  KaraokeCalculationInput,
  KaraokeCalculationResult,
} from "./contractCreateTypes";

// =============================================================================
// KVC VCPMC TARIFF TYPES (frontend uses backend as source of truth)
// =============================================================================

export type KvcLocationInput = {
  id: string;
  name: string;
  area_m2: number;
};

export type KvcVcpmcTariffInput = {
  locations: KvcLocationInput[];
  gtgt_percent: number;
  support_percent?: number;
  support_amount?: number;
  support_note?: string;
  usage_display_mode?: 'auto' | 'text' | 'table';
};

export type KvcCalculationResult = {
  ok: boolean;
  mode: string;
  write_performed: boolean;
  contract_created: boolean;
  docx_generated: boolean;
  xlsx_generated: boolean;
  gcn_created: boolean;
  nd17_calculated: boolean;
  errors: { field: string; message: string }[];
  warnings: { field: string; message: string; severity: string }[];
  input_echo: {
    location_count: number;
    gtgt_percent: number;
    support_percent: number;
    support_amount: number;
    support_note: string;
    usage_display_mode: string;
  };
  calculation: {
    location_results: {
      location_id: string;
      location_name: string;
      area_m2: number;
      base_included_area_m2: number;
      excess_area_m2: number;
      raw_increment_blocks: number;
      increment_blocks: number;
      base_fee: number;
      increment_fee_per_block: number;
      increment_amount: number;
      location_subtotal: number;
    }[];
    detail_rows: {
      location_id: string;
      location_name: string;
      area_m2: number;
      base_fee: number;
      increment_blocks: number;
      increment_amount: number;
      location_subtotal: number;
    }[];
    subtotal_before_support: number;
    support_percent: number;
    support_amount: number;
    amount_after_support: number;
    gtgt_percent: number;
    gtgt_amount: number;
    total_amount: number;
    total_amount_words: string;
  };
  docx_context_preview: {
    locations_table_text: string;
    pricing_detail_text: string;
    pricing_total_text: string;
    pricing_mode: string;
  };
  docx_context_preview_v2?: KvcDocxContextPreviewV2 | null;
};

export type KvcUsageLocationBlock = {
  mode: string;
  text: string;
  rows: string[][];
  headers: string[];
};

export type KvcVcpmcPricingBlock = {
  mode: string;
  headers: string[];
  rows: string[][];
};

export type KvcBackgroundPricingBlock = {
  pricing_mode: string;
  rows: string[][];
  summary_rows: string[][];
};

export type KvcDocxContextPreviewV2 = {
  pricing_mode: string;
  usage_display_mode: string;
  background_usage_locations_block: KvcUsageLocationBlock;
  kvc_vcpmc_pricing_block: KvcVcpmcPricingBlock;
  background_pricing_block: KvcBackgroundPricingBlock;
  pricing_total_text: string;
  amount_in_words: string;
};

export type ApiContractItem = {
  id: number | string;
  contract_no: string;
  customer_name: string;
  domain: string;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  contract_year?: number | null;
  field_code?: string | null;
  region_code?: string | null;
  ten_bang_hieu?: string | null;
  dia_chi_su_dung?: string | null;
  so_tien_value?: number | null;
  renewal_status?: string | null;
  is_renewable?: boolean | null;
  loai_hinh_karaoke?: string | null;
  tong_so_phong?: number | null;
  tong_so_box?: number | null;
};

export type ContractsListResponse = {
  items: ApiContractItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type ApiContractDetail = {
  id: number;
  contract_no: string;
  contract_year?: number | null;
  customer: {
    name: string;
    signage?: string | null;
    address?: string | null;
    legal_address?: string | null;
    usage_address?: string | null;
  };
  domain: {
    display: string;
    field_code?: string | null;
    domain_group?: string | null;
  };
  dates: {
    signed_date?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  };
  financial: {
    amount?: number | null;
    total_amount?: number | null;
    currency?: string;
    amount_before_gtgt?: number | null;
    gtgt_percent?: number | null;
    gtgt_amount?: number | null;
  };
  karaoke: {
    type?: string | null;
    room_count?: number | null;
    box_count?: number | null;
  };
  status: string;
  raw: Record<string, unknown>;
};

export type DryRunIssue = {
  field: string;
  message: string;
  severity: "error" | "warning" | string;
};

export type DryRunDbMappingItem = {
  table: string;
  column: string;
  value_preview?: string | number | boolean | null;
  status: "ok" | "missing" | "required" | "warning" | string;
};

export type DryRunCreateContractResponse = {
  ok: boolean;
  mode: "dry_run" | string;
  can_create: boolean;
  errors: DryRunIssue[];
  warnings: DryRunIssue[];
  normalized: Record<string, unknown>;
  db_mapping: DryRunDbMappingItem[];
  duplicate_checks: {
    contract_no_exists: boolean;
    matches: {
      source: string;
      id: number;
      contract_no: string;
      contract_year?: number | null;
      customer_name?: string | null;
    }[];
  };
  permission: {
    allowed: boolean;
    reason: string;
  };
  write_performed: boolean;
};

export type CreateContractResponse = {
  ok: boolean;
  mode: string;
  message: string;
  write_enabled: boolean;
  rollback_only: boolean;
  clone_only_enabled: boolean;
  write_performed: boolean;
  rollback_performed: boolean;
  artifacts_generated: boolean;
  idempotency_key?: string | null;
  idempotent_replay?: boolean;
  created?: {
    id?: number | null;
    contract_no?: string | null;
    contract_year?: number | null;
    customer_name?: string | null;
    table?: string | null;
    db_name?: string | null;
  } | null;
  created_preview?: Record<string, unknown> | null;
  dry_run: DryRunCreateContractResponse;
};

export type ContractsQuery = {
  page?: number;
  page_size?: number;
  q?: string;
  domain?: string;
  status?: string;
  year?: string;
};

export function getContracts(token: string, query: ContractsQuery): Promise<ContractsListResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.page_size) params.set("page_size", String(query.page_size));
  if (query.q) params.set("q", query.q);
  if (query.domain) params.set("domain", query.domain);
  if (query.status) params.set("status", query.status);
  if (query.year) params.set("year", query.year);
  const suffix = params.toString();
  return apiRequest<ContractsListResponse>(`/contracts${suffix ? `?${suffix}` : ""}`, { token });
}

export function getContractDetail(token: string, id: number): Promise<ApiContractDetail> {
  return apiRequest<ApiContractDetail>(`/contracts/${id}`, { token });
}

export function dryRunCreateContract(
  token: string,
  payload: {
    draft: CreateContractDraft;
    client_preflight: ContractRecordsCandidate;
  }
): Promise<DryRunCreateContractResponse> {
  return apiRequest<DryRunCreateContractResponse>("/contracts/dry-run-create", {
    method: "POST",
    token,
    body: payload
  });
}

export function createContractCloneOnly(
  token: string,
  payload: {
    draft: CreateContractDraft;
    client_preflight: ContractRecordsCandidate;
    client_confirmation: {
      clone_only_create_confirmed: true;
      idempotency_key: string;
    };
  }
): Promise<CreateContractResponse> {
  return apiRequest<CreateContractResponse>("/contracts", {
    method: "POST",
    token,
    body: payload
  });
}

export type SimpleCreateContractResponse = {
  ok: boolean;
  mode: string;
  message: string;
  contract_id: number | null;
  contract_no: string | null;
  contract_year: number | null;
  customer_name: string | null;
  db_name: string | null;
  write_performed: boolean;
  errors: string[];
};

export function simpleCreateContract(
  token: string,
  payload: {
    draft: CreateContractDraft;
    client_preflight: ContractRecordsCandidate;
  }
): Promise<SimpleCreateContractResponse> {
  return apiRequest<SimpleCreateContractResponse>("/contracts/simple-create", {
    method: "POST",
    token,
    body: payload
  });
}

export type KaraokeMakeHdPreviewResponse = {
  ok: boolean;
  contract_id: number | null;
  contract_no: string | null;
  word_path: string | null;
  preview_path: string | null;
  file_size: number | null;
  db_name: string | null;
  render_context_keys: string[];
  missing_placeholders: string[];
  unresolved_placeholders: string[];
  db_write_performed: boolean;
  docx_path_attached: boolean;
  official_export: boolean;
  gcn_created: boolean;
  warnings: string[];
};

export function makeHdPreviewKaraokeOldAppDirect(
  token: string,
  payload: {
    draft: CreateContractDraft;
    client_preflight: ContractRecordsCandidate;
  }
): Promise<KaraokeMakeHdPreviewResponse> {
  return apiRequest<KaraokeMakeHdPreviewResponse>("/contracts/karaoke/make-hd", {
    method: "POST",
    token,
    body: payload,
  });
}

// =============================================================================
// KARAOKE CALCULATION API
// =============================================================================

/**
 * Call karaoke calculation dry-run API.
 * POST /api/background/karaoke/calculate-dry-run
 *
 * This is a READ-ONLY endpoint - no DB write, no contract creation.
 */
export function calculateKaraokeDryRun(
  token: string,
  input: KaraokeCalculationInput
): Promise<KaraokeCalculationResult> {
  return apiRequest<KaraokeCalculationResult>("/background/karaoke/calculate-dry-run", {
    method: "POST",
    token,
    body: {
      contract_no: input.contractNo,
      karaoke_type: input.karaokeType,
      area_group: input.areaGroup,
      tong_so_phong: input.totalRooms,
      tong_so_box: input.totalBoxes,
      muc_luong_co_so: input.baseSalary,
      ty_le_ho_tro: input.annualSupportPercent,
      ty_le_ho_tro_bac_1: input.tier1SupportPercent,
      ty_le_ho_tro_bac_2: input.tier2SupportPercent,
      ty_le_ho_tro_bac_3: input.tier3SupportPercent,
      gtgt_percent: input.gtgtPercent,
      start_date: input.startDate,
      end_date: input.endDate,
      room_sections: input.roomSections || [],
      pricing_render_mode: input.pricingRenderMode,
    }
  });
}

// =============================================================================
// KVC VCPMC TARIFF CALCULATION API (PHASE KVC-02b)
// =============================================================================

/**
 * Call KVC VCPMC tariff calculation dry-run API.
 * POST /api/background/kvc/vcpmc-tariff/calculate-dry-run
 *
 * This is a READ-ONLY endpoint - no DB write, no contract creation.
 * Backend is source of truth for KVC money calculations.
 */
export function calculateKvcVcpmcTariff(
  token: string,
  input: KvcVcpmcTariffInput
): Promise<KvcCalculationResult> {
  return apiRequest<KvcCalculationResult>("/background/kvc/vcpmc-tariff/calculate-dry-run", {
    method: "POST",
    token,
    body: input,
  });
}

// =============================================================================
// KVC ND17 CALCULATION API (PHASE KVC-05)
// =============================================================================

export type KvcNd17LocationInput = {
  id: string;
  name: string;
  area_m2: number;
};

export type KvcNd17Input = {
  locations: KvcNd17LocationInput[];
  base_salary?: number;
  urban_class?: string;
  urban_rate?: number;
  gtgt_percent?: number;
  support_percent?: number;
  support_amount?: number;
  support_note?: string;
  include_premise_services?: boolean;
  premise_services_note?: string;
  usage_display_mode?: 'auto' | 'text' | 'table';
};

export type KvcNd17Result = {
  ok: boolean;
  mode: string;
  write_performed: boolean;
  contract_created: boolean;
  docx_generated: boolean;
  xlsx_generated: boolean;
  gcn_created: boolean;
  nd17_calculated: boolean;
  vcpmc_tariff_calculated: boolean;
  errors: { field: string; message: string }[];
  warnings: { field: string; message: string; severity: string }[];
  input_echo: {
    location_count: number;
    base_salary: number;
    urban_class?: string;
    urban_rate: number;
    gtgt_percent: number;
    support_percent: number;
    support_amount: number;
    support_note: string;
    include_premise_services: boolean;
    premise_services_note: string;
    usage_display_mode: string;
  };
  calculation?: {
    location_results: {
      location_id: string;
      location_name: string;
      area_m2: number;
      coefficient: number;
      coefficient_formula: string;
      base_salary: number;
      raw_amount: number;
      cap_amount: number;
      cap_applied: boolean;
      capped_amount: number;
      urban_rate: number;
      urban_adjusted_amount: number;
    }[];
    detail_rows: {
      location_id: string;
      location_name: string;
      area_m2: number;
      coefficient: number;
      coefficient_formula: string;
      raw_amount: number;
      cap_applied: boolean;
      capped_amount: number;
      urban_rate: number;
      urban_adjusted_amount: number;
    }[];
    cap_was_applied: boolean;
    subtotal_after_urban: number;
    support_percent: number;
    support_amount: number;
    amount_after_support: number;
    gtgt_percent: number;
    gtgt_amount: number;
    total_amount: number;
    total_amount_words: string;
  } | null;
  docx_context_preview_v2?: {
    pricing_mode: string;
    legal_basis: string;
    usage_display_mode: string;
    background_usage_locations_block: KvcUsageLocationBlock;
    nd17_coefficient_block: {
      mode: string;
      headers: string[];
      rows: string[][];
    };
    background_pricing_block: KvcBackgroundPricingBlock;
    pricing_total_text: string;
    amount_in_words: string;
  } | null;
};

/**
 * Call KVC ND17 calculation dry-run API.
 * POST /api/background/kvc/nd17/calculate-dry-run
 *
 * This is a READ-ONLY endpoint - no DB write, no contract creation.
 * Legal Basis: Nghị định 17/2023/NĐ-CP, Phụ lục II, Mục 8
 */
export function calculateKvcNd17(
  token: string,
  input: KvcNd17Input
): Promise<KvcNd17Result> {
  return apiRequest<KvcNd17Result>("/background/kvc/nd17/calculate-dry-run", {
    method: "POST",
    token,
    body: input,
  });
}

// =============================================================================
// EXPORT DOCX TEXT DRY-RUN API (PHASE EXPORT-02)
// =============================================================================

export type ExportDryRunResult = {
  ok: boolean;
  contract_id: number;
  domain: string;
  domain_label: string;
  template_path: string;
  temp_output_path: string | null;
  file_size: number | null;
  placeholders_attempted: string[];
  placeholders_in_context: number;
  render_enabled: boolean;
  db_attach_enabled: boolean;
  file_write_performed: boolean;
  db_write_performed: boolean;
  docx_path_attached: boolean;
  pricing_blocks_inserted: boolean;
  warnings: string[];
  message: string | null;
};

/**
 * Call export DOCX text dry-run API.
 * POST /api/contracts/{contract_id}/export-docx-text-dry-run
 *
 * This is a DRY-RUN ONLY endpoint:
 * - Renders text placeholders to a temporary file
 * - Does NOT write to permanent storage
 * - Does NOT update DB
 * - Does NOT insert pricing/usage blocks
 *
 * Only KVC and Karaoke domains are supported in this phase.
 */
export function exportDocxTextDryRun(
  token: string,
  contractId: number
): Promise<ExportDryRunResult> {
  return apiRequest<ExportDryRunResult>(`/contracts/${contractId}/export-docx-text-dry-run`, {
    method: "POST",
    token,
  });
}

// =============================================================================
// EXPORT DOCX PREVIEW API (PHASE EXPORT-05)
// =============================================================================

export type ExportPreviewResult = {
  ok: boolean;
  preview_path: string | null;
  file_size: number | null;
  domain: string | null;
  domain_label: string | null;
  template_path: string | null;
  placeholders_attempted: string[];
  placeholders_in_context: number;
  file_write_performed: boolean;
  db_write_performed: boolean;
  docx_path_attached: boolean;
  official_export: boolean;
  pricing_blocks_inserted: boolean;
  kvc_blocks_attempted: boolean;
  kvc_usage_block_inserted: boolean;
  kvc_pricing_block_inserted: boolean;
  karaoke_blocks_attempted: boolean;
  karaoke_room_block_inserted: boolean;
  karaoke_pricing_block_inserted: boolean;
  block_placeholder_strategy: string | null;
  block_placeholders_injected: string[];
  sentinel_anchors_used: string[];
  template_raw_anchor_required: boolean;
  synthetic_preview: boolean;
  warnings: string[];
  message: string | null;
};

export type ExportPreviewRequest = {
  include_blocks?: boolean;
  pricing_context?: Record<string, unknown>;
  synthetic_preview?: boolean;
  dry_run_label?: string;
};

/**
 * Call export DOCX preview API for a contract.
 * POST /api/contracts/{contract_id}/export-docx-preview
 *
 * This generates a preview DOCX file for manual inspection:
 * - Writes preview to F:\APPs\storage\preview\
 * - Does NOT write to DB
 * - Does NOT attach docx_path
 * - Does NOT create official export
 *
 * Only KVC and Karaoke domains are supported.
 */
export function exportDocxPreview(
  token: string,
  contractId: number,
  request?: ExportPreviewRequest
): Promise<ExportPreviewResult> {
  return apiRequest<ExportPreviewResult>(`/contracts/${contractId}/export-docx-preview`, {
    method: "POST",
    token,
    body: request,
  });
}

/**
 * Call synthetic KVC preview API.
 * POST /api/contracts/export/preview/kvc-synthetic
 *
 * This generates a preview using sample CityGames data:
 * - 855m2 => 7,400,000
 * - 701m2 => 6,200,000
 * - 920m2 => 7,800,000
 * - subtotal = 21,400,000
 * - GTGT 8% = 1,712,000
 * - total = 23,112,000
 *
 * Does NOT:
 * - Create a contract row
 * - Write to DB
 * - Create official export
 *
 * The preview is marked as synthetic/sample.
 */
export function exportKvcSyntheticPreview(
  token: string,
  request?: ExportPreviewRequest
): Promise<ExportPreviewResult> {
  return apiRequest<ExportPreviewResult>("/contracts/export/preview/kvc-synthetic", {
    method: "POST",
    token,
    body: request,
  });
}

/**
 * Call synthetic Karaoke ND17 preview API.
 * POST /api/contracts/export/preview/karaoke-synthetic
 *
 * This generates a preview using sample Karaoke ND17 data:
 * - 4 phòng đầu: 2,340,000 x 1.6 = 14,976,000
 * - 6 phòng sau: 2,340,000 x 1.28 = 17,971,200
 * - 16 phòng sau: 2,340,000 x 1.12 = 41,932,800
 * - Subtotal: 74,880,000
 * - GTGT 8%: 5,990,400
 * - Total: 80,870,400
 *
 * Does NOT:
 * - Create a contract row
 * - Write to DB
 * - Create official export
 *
 * The preview is marked as synthetic/sample.
 */
export function exportKaraokeSyntheticPreview(
  token: string,
  request?: ExportPreviewRequest
): Promise<ExportPreviewResult> {
  return apiRequest<ExportPreviewResult>("/contracts/export/preview/karaoke-synthetic", {
    method: "POST",
    token,
    body: request,
  });
}

// =============================================================================
// CONTRACT UPDATE API (PHASE CONTRACTS-ACTIONS-EDIT-01)
// =============================================================================

export type UpdateContractResponse = {
  ok: boolean;
  mode: string;
  message: string;
  update_enabled: boolean;
  clone_only_enabled: boolean;
  write_performed: boolean;
  contract_id: number | null;
  contract_no: string | null;
  updated_fields: string[];
  errors: string[];
  warnings: string[];
};

export type UpdateContractPayload = {
  don_vi_ten?: string | null;
  ten_bang_hieu?: string | null;
  don_vi_dia_chi?: string | null;
  dia_chi_su_dung?: string | null;
  don_vi_dien_thoai?: string | null;
  don_vi_email?: string | null;
  don_vi_nguoi_dai_dien?: string | null;
  don_vi_chuc_vu?: string | null;
  don_vi_mst?: string | null;
  ngay_bat_dau?: string | null;
  ngay_ket_thuc?: string | null;
  so_tien_chua_gtgt_value?: number | null;
  thue_percent?: number | null;
  renewal_status?: string | null;
  loai_hinh_karaoke?: string | null;
  tong_so_phong?: number | null;
  tong_so_box?: number | null;
  contract_note?: string | null;
};

export function updateContract(
  token: string,
  contractId: number,
  payload: UpdateContractPayload
): Promise<UpdateContractResponse> {
  return apiRequest<UpdateContractResponse>("/contracts/" + contractId, {
    method: "PATCH",
    token,
    body: payload,
  });
}

// =============================================================================
// CERTIFICATE CONTEXT DRY-RUN API
// =============================================================================

export type CertificateContextResult = {
  ok: boolean;
  mode: string;
  context: {
    mode: string;
    certificate_id: number | null;
    contract_id: number | null;
    certificate_no: string | null;
    certificate_issue_date: string | null;
    contract_no: string;
    organization_name: string;
    business_registration_no: string;
    address: string;
    business_sign_name: string;
    business_location: string;
    gcn_scope_col_1_text: string;
    gcn_scope_col_2_text: string;
    gcn_scope_col_3_text: string;
    effective_from: string | null;
    effective_to: string | null;
    warnings: string[];
  };
  locked_layout: Record<string, unknown>;
  write_performed: boolean;
  print_enabled: boolean;
  qr_generation_enabled: boolean;
  artifacts_generated: boolean;
};

export function getCertificateContextDryRun(
  token: string,
  contractId: number
): Promise<CertificateContextResult> {
  return apiRequest<CertificateContextResult>(
    `/contracts/${contractId}/certificate-context-dry-run`,
    { token }
  );
}

// =============================================================================
// CERTIFICATE DRAFT CREATE API (PHASE GCN-CREATE-DRAFT-01)
// =============================================================================

export type CertificateDraftCreateResult = {
  ok: boolean;
  mode: string;
  message: string;
  write_performed: boolean;
  certificate_created: boolean;
  certificate_no_allocated: boolean;
  qr_generation_enabled: boolean;
  print_enabled: boolean;
  artifacts_generated: boolean;
  errors: { field: string; message: string; severity: string }[];
  warnings: { field: string; message: string; severity: string }[];
  created: {
    certificate_id: number;
    contract_id: number;
    contract_no: string;
    certificate_no: string | null;
    status: string;
  } | null;
};

export function createCertificateDraft(
  token: string,
  contractId: number,
  payload?: { client_confirmation?: { clone_only_certificate_draft_confirmed?: boolean } }
): Promise<CertificateDraftCreateResult> {
  return apiRequest<CertificateDraftCreateResult>(
    `/contracts/${contractId}/certificates/draft`,
    {
      method: "POST",
      token,
      body: payload || {},
    }
  );
}

// =============================================================================
// CONTRACT SAFE CLONE-ONLY DELETE API (PHASE GCN-CREATE-DRAFT-01)
// =============================================================================

export type DeleteContractCloneOnlyResult = {
  ok: boolean;
  mode: string;
  message: string;
  write_performed: boolean;
  contract_id: number | null;
  contract_no: string | null;
  deleted_contract_records: number;
  deleted_certificate_records: number;
  deleted_related_rows: number;
  old_db_touched: boolean;
  blocked_final_certificates: number;
  admin_delete_any_enabled: boolean;
  permission_used: string | null;
  warnings: string[];
  errors: { field: string; message: string }[];
};

export function deleteContractCloneOnly(
  token: string,
  contractId: number
): Promise<DeleteContractCloneOnlyResult> {
  return apiRequest<DeleteContractCloneOnlyResult>(
    "/contracts/" + contractId,
    {
      method: "DELETE",
      token,
    }
  );
}

