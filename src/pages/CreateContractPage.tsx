/**
 * PHASE KVC-01: KVC Usage Locations Model/UI Refinement
 *
 * Create Contract page with new architecture:
 * - Section 1: Thông tin chung (Common contract/customer/company info - shared)
 * - Section 2: Lĩnh vực (Domain selector)
 * - Section 3: Khu vực kinh doanh (Business usage locations)
 * - Section 4: Tiền bản quyền (Multiple calculation lines)
 * - Section 5: Preflight / chưa ghi dữ liệu (Dry-run results)
 */

import React, { useMemo, useState } from 'react';
import { XIcon, CalculatorIcon, InfoIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Page, PageHeader } from '../components/app-ui/Page';
import { FormSection } from '../components/app-ui/FormSection';
import { FieldGrid } from '../components/app-ui/FieldGrid';
import { Input } from '../components/app-ui/Input';
import { Textarea } from '../components/app-ui/Textarea';
import { Select } from '../components/app-ui/Select';
import { Button } from '../components/app-ui/Button';
import { ContractNumberPreview } from '../components/app-ui/ContractNumberPreview';
import { StepIndicator } from '../components/app-ui/StepIndicator';
import {
  AREA_USAGE_KIND_OPTIONS,
  AVAILABLE_CALCULATION_MODULES,
  CALC_MODULE_NOT_IMPLEMENTED_PLACEHOLDER,
  CALCULATION_MODULE_OPTIONS,
  CREATE_CONTRACT_AREA_OPTIONS,
  CREATE_CONTRACT_ASSIGNEE_EMAILS,
  CREATE_CONTRACT_ASSIGNEE_OPTIONS,
  CREATE_CONTRACT_BACKGROUND_DOMAIN_OPTIONS,
  CREATE_CONTRACT_KARAOKE_USAGE_OPTIONS,
  CREATE_CONTRACT_PRICING_RENDER_OPTIONS,
  CREATE_CONTRACT_REGION_OPTIONS,
  CREATE_CONTRACT_RENEWAL_OPTIONS,
  CONTRACT_YEAR_OPTIONS,
  CREATE_CONTRACT_AREA_GROUP_OPTIONS,
  DOMAIN_NOT_IMPLEMENTED_PLACEHOLDER,
  DOMAIN_PLACEHOLDER_ONLY_PLACEHOLDER,
} from '../data/createContractOptions';
import { RouteKey } from '../data/routes';
import {
  composeContractNo,
  CONTRACT_CREATE_DB_TARGET_HINTS,
  createCalculationLine,
  createDefaultBusinessLocation,
  createDefaultContractDraft,
  DEFAULT_BASE_SALARY_VND,
  DEFAULT_GTGT_PERCENT,
  getAreaGroupOptions,
  getCanonicalFieldCode,
  getDomainDisplayName,
  getEffectiveDisplayMode,
  getKvcPricingModeLabel,
  getModuleDisplayName,
  getMusicUsageTypeLabel,
  isAreaBasedDomain,
  isFullyImplementedDomain,
  isKaraokeCalcDomain,
  isModuleAvailable,
  isPlaceholderOnlyDomain,
  mapDraftToContractRecordsCandidate,
  mapDraftToKaraokeCalcInput,
  mapKaraokeResponseToLineResult,
  mapKvcResponseToLineResult,
  mapKvcNd17ResponseToLineResult,
  mapLineInputToKaraokeCalc,
  removeCalculationLineById,
  toggleCalculationLineEnabled,
  updateCalculationLineById,
  addCalculationLine,
  aggregateCalculationLines,
} from '../lib/contractCreateMapper';
import type {
  BackgroundDomainCode,
  CalculationAggregation,
  CalculationModuleCode,
  CreateContractDraft,
  KaraokeCalculationResult,
  RoyaltyCalculationLine,
} from '../lib/contractCreateTypes';
import {
  getBlockingValidationErrors,
  getWarningIssues,
  validateContractDraft,
  validateKaraokeCalcInput,
} from '../lib/contractCreateValidation';
import { useAuth } from '../lib/auth';
import {
  calculateKaraokeDryRun,
  calculateKvcNd17,
  calculateKvcVcpmcTariff,
  createContractCloneOnly,
  dryRunCreateContract,
  DryRunCreateContractResponse,
  CreateContractResponse,
  exportDocxPreview,
  makeHdPreviewKaraokeOldAppDirect,
  simpleCreateContract,
  type ExportPreviewResult,
} from '../lib/contractsClient';

const TOKEN_KEY = 'vcpmc_new_app_access_token';
const ROOM_SECTION_PRESETS = [
  { value: 'TRET', label: 'Trệt', key: 'Trệt' },
  { value: 'LUNG', label: 'Lửng', key: 'Lửng' },
  ...Array.from({ length: 10 }, (_, index) => {
    const floor = index + 1;
    return { value: `LAU_${floor}`, label: `Lầu ${floor}`, key: `Lầu ${floor}` };
  }),
  { value: 'SAN_VUON', label: 'Sân vườn', key: 'Sân vườn' },
  { value: 'KHAC', label: 'Khác', key: '' },
] as const;

const ROOM_SECTION_OPTIONS = ROOM_SECTION_PRESETS.map(({ value, label }) => ({
  value,
  label,
}));

const getRoomSectionPresetValue = (key: string) =>
  ROOM_SECTION_PRESETS.find((preset) => preset.key && preset.key === key)?.value ?? 'KHAC';

const getRoomSectionKeyFromPreset = (value: string) =>
  ROOM_SECTION_PRESETS.find((preset) => preset.value === value)?.key ?? '';

const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')} đ`;
const SAFETY_NOTE = 'Preflight kiểm tra hợp lệ. Chưa ghi dữ liệu.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env as Record<string, string | undefined>;
const CLONE_ONLY_CREATE_ENABLED =
  env.VITE_CREATE_CONTRACT_CLONE_ONLY_ENABLED === 'true';

function createCloneOnlyIdempotencyKey() {
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `clone-create:${randomPart}`;
}

export function CreateContractPage({
  onNavigate,
  onOpenCreatedContract,
}: {
  onNavigate: (k: RouteKey) => void;
  onOpenCreatedContract?: (id: number) => void;
}) {
  const { currentUser } = useAuth();
  const [draft, setDraft] = useState<CreateContractDraft>(
    createDefaultContractDraft
  );
  const [isDirty, setIsDirty] = useState(false);
  const [roomSectionPresetToAdd, setRoomSectionPresetToAdd] = useState('');

  // Dry-run state
  const [isDryRunLoading, setIsDryRunLoading] = useState(false);
  const [dryRunResult, setDryRunResult] =
    useState<DryRunCreateContractResponse | null>(null);
  const [dryRunError, setDryRunError] = useState<string | null>(null);

  // Karaoke calculation state (legacy single calc - kept for backward compatibility)
  const [isCalcLoading, setIsCalcLoading] = useState(false);
  const [calcResult, setCalcResult] =
    useState<KaraokeCalculationResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // Calculation lines state
  const [isLineCalcLoading, setIsLineCalcLoading] = useState<Record<string, boolean>>({});
  const [lineCalcErrors, setLineCalcErrors] = useState<Record<string, string | null>>({});

  // Derived: calculate aggregation from lines
  const calcLinesAggregation = useMemo<CalculationAggregation>(() => {
    return aggregateCalculationLines(draft.calculationLines, 12);
  }, [draft.calculationLines]);

  // Clone-only create state
  const [isCloneCreateLoading, setIsCloneCreateLoading] = useState(false);
  const [cloneCreateResult, setCloneCreateResult] =
    useState<CreateContractResponse | null>(null);
  const [cloneCreateError, setCloneCreateError] = useState<string | null>(null);
  const [cloneCreateIdempotencyKey, setCloneCreateIdempotencyKey] =
    useState<string | null>(null);
  const [isWordPreviewLoading, setIsWordPreviewLoading] = useState(false);
  const [wordPreviewResult, setWordPreviewResult] =
    useState<ExportPreviewResult | null>(null);
  const [wordPreviewError, setWordPreviewError] = useState<string | null>(null);
  const [isMakeHdLoading, setIsMakeHdLoading] = useState(false);
  const [makeHdError, setMakeHdError] = useState<string | null>(null);

  // Derived values
  const contractNoPreview = useMemo(() => composeContractNo(draft), [draft]);
  const candidatePayload = useMemo(
    () => mapDraftToContractRecordsCandidate(draft, calcLinesAggregation),
    [draft, calcLinesAggregation]
  );
  const validationIssues = useMemo(() => validateContractDraft(draft), [draft]);
  const blockingErrors = useMemo(
    () => getBlockingValidationErrors(validationIssues),
    [validationIssues]
  );
  const warningIssues = useMemo(
    () => getWarningIssues(validationIssues),
    [validationIssues]
  );

  const isKaraokeDomain = isKaraokeCalcDomain(draft.domain.domainCode);
  const isAreaBasedDomainFlag = isAreaBasedDomain(draft.domain.domainCode);
  const isPlaceholderOnlyDomainFlag = isPlaceholderOnlyDomain(draft.domain.domainCode);
  const isImplementedDomain = isFullyImplementedDomain(draft.domain.domainCode);
  const canRunCloneOnlyCreate = !isMakeHdLoading && !isCloneCreateLoading;
  const createdContractId =
    typeof cloneCreateResult?.created?.id === 'number'
      ? cloneCreateResult.created.id
      : null;
  const canRunWordPreview = !isWordPreviewLoading;
  const canRunMakeContract = !isMakeHdLoading && !isCloneCreateLoading;

  // =========================================================================
  // UPDATE HANDLERS
  // =========================================================================

  const updateDraft = (
    updater: (current: CreateContractDraft) => CreateContractDraft
  ) => {
    setDraft((current) => updater(current));
    setIsDirty(true);
    setDryRunResult(null);
    setCloneCreateResult(null);
    setCloneCreateError(null);
    setWordPreviewResult(null);
    setWordPreviewError(null);
    setMakeHdError(null);
    setCalcResult(null);
  };

  const updateDomain = (code: BackgroundDomainCode) => {
    updateDraft((current) => ({
      ...current,
      common: {
        ...current.common,
        fieldCode: getCanonicalFieldCode(code),
      },
      domain: {
        ...current.domain,
        domainCode: code,
        domainDisplayName: getDomainDisplayName(code),
      },
      // Reset karaoke fields if not karaoke domain
      karaoke: isKaraokeCalcDomain(code) ? current.karaoke : {
        karaokeType: 'PHONG' as const,
        areaGroup: 'DEN_20' as const,
        totalRooms: 0,
        totalBoxes: 0,
        baseSalary: DEFAULT_BASE_SALARY_VND,
        annualSupportPercent: 0,
        tier1SupportPercent: 0,
        tier2SupportPercent: 0,
        tier3SupportPercent: 0,
        gtgtPercent: DEFAULT_GTGT_PERCENT,
        pricingRenderMode: 'text' as const,
        roomSections: [],
      },
    }));
  };

  const updateKaraokeRoomCount = (count: number) => {
    updateDraft((current) => {
      const normalizedCount = Math.max(0, count || 0);
      const karaokeType = current.karaoke.karaokeType;
      return {
        ...current,
        karaoke: {
          ...current.karaoke,
          totalRooms: karaokeType === 'PHONG' ? normalizedCount : current.karaoke.totalRooms,
          totalBoxes: karaokeType === 'BOX' ? normalizedCount : current.karaoke.totalBoxes,
        },
        calculationLines: current.calculationLines.map((line) => {
          if (karaokeType === 'PHONG' && line.input.module === 'KARAOKE_PHONG') {
            return {
              ...line,
              input: {
                ...line.input,
                totalRooms: normalizedCount,
                areaGroup: current.karaoke.areaGroup === 'BOX' ? 'DEN_20' : current.karaoke.areaGroup,
              },
              result: null,
              status: 'idle',
            };
          }
          if (karaokeType === 'BOX' && line.input.module === 'KARAOKE_BOX') {
            return {
              ...line,
              input: {
                ...line.input,
                totalBoxes: normalizedCount,
              },
              result: null,
              status: 'idle',
            };
          }
          return line;
        }),
      };
    });
  };

  const updateKaraokeCalculationField = (
    lineId: string,
    field:
      | 'baseSalary'
      | 'annualSupportPercent'
      | 'gtgtPercent',
    value: number
  ) => {
    updateDraft((current) => ({
      ...current,
      karaoke: {
        ...current.karaoke,
        [field]: value,
        tier1SupportPercent: 0,
        tier2SupportPercent: 0,
        tier3SupportPercent: 0,
      },
      calculationLines: current.calculationLines.map((line) =>
        line.id === lineId && (
          line.input.module === 'KARAOKE_PHONG' ||
          line.input.module === 'KARAOKE_BOX'
        )
          ? {
              ...line,
              input: {
                ...line.input,
                [field]: value,
                ...(line.input.module === 'KARAOKE_PHONG'
                  ? {
                      tier1SupportPercent: 0,
                      tier2SupportPercent: 0,
                      tier3SupportPercent: 0,
                    }
                  : {}),
              },
              result: null,
              status: 'idle',
            }
          : line
      ),
    }));
  };

  const updateRoomSection = (
    index: number,
    field: 'key' | 'roomCount' | 'roomNames',
    value: string | number
  ) => {
    updateDraft((current) => {
      const roomSections = current.karaoke.roomSections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      );
      const sectionTotal = roomSections.reduce(
        (sum, section) => sum + Math.max(0, Number(section.roomCount) || 0),
        0
      );
      const karaokeType = current.karaoke.karaokeType;

      return {
        ...current,
        karaoke: {
          ...current.karaoke,
          roomSections,
          totalRooms: karaokeType === 'PHONG' ? sectionTotal : current.karaoke.totalRooms,
          totalBoxes: karaokeType === 'BOX' ? sectionTotal : current.karaoke.totalBoxes,
        },
        calculationLines: current.calculationLines.map((line) => {
          if (karaokeType === 'PHONG' && line.input.module === 'KARAOKE_PHONG') {
            return {
              ...line,
              input: { ...line.input, totalRooms: sectionTotal },
              result: null,
              status: 'idle',
            };
          }
          if (karaokeType === 'BOX' && line.input.module === 'KARAOKE_BOX') {
            return {
              ...line,
              input: { ...line.input, totalBoxes: sectionTotal },
              result: null,
              status: 'idle',
            };
          }
          return line;
        }),
      };
    });
  };

  const addRoomSection = (presetValue: string) => {
    const key = getRoomSectionKeyFromPreset(presetValue);
    updateDraft((current) => ({
      ...current,
      karaoke: {
        ...current.karaoke,
        roomSections: [
          ...current.karaoke.roomSections,
          {
            key,
            roomCount: 0,
            roomNames: '',
          },
        ],
      },
    }));
  };

  const removeRoomSection = (index: number) => {
    updateDraft((current) => {
      const roomSections = current.karaoke.roomSections.filter((_, i) => i !== index);
      const sectionTotal = roomSections.reduce(
        (sum, section) => sum + Math.max(0, Number(section.roomCount) || 0),
        0
      );
      const karaokeType = current.karaoke.karaokeType;

      return {
        ...current,
        karaoke: {
          ...current.karaoke,
          roomSections,
          totalRooms: karaokeType === 'PHONG' ? sectionTotal : current.karaoke.totalRooms,
          totalBoxes: karaokeType === 'BOX' ? sectionTotal : current.karaoke.totalBoxes,
        },
        calculationLines: current.calculationLines.map((line) => {
          if (karaokeType === 'PHONG' && line.input.module === 'KARAOKE_PHONG') {
            return {
              ...line,
              input: { ...line.input, totalRooms: sectionTotal },
              result: null,
              status: 'idle',
            };
          }
          if (karaokeType === 'BOX' && line.input.module === 'KARAOKE_BOX') {
            return {
              ...line,
              input: { ...line.input, totalBoxes: sectionTotal },
              result: null,
              status: 'idle',
            };
          }
          return line;
        }),
      };
    });
  };

  // =========================================================================
  // CHECKLIST & STEPS
  // =========================================================================

  const checklist = useMemo(
    () => [
      {
        label: 'Số hợp đồng hợp lệ',
        completed: !!draft.common.contractNumber && !!draft.common.contractYear,
      },
      {
        label: 'Đã có đối tác',
        completed: !!draft.customer.legalName && !!draft.customer.brandName,
      },
      {
        label: 'Đã có địa điểm',
        completed: !!draft.location.usageAddress,
      },
      {
        label: 'Đã có thời hạn',
        completed: !!draft.term.effectiveFrom && !!draft.term.effectiveTo,
      },
    ],
    [draft]
  );

  const steps = [
    { label: 'Thông tin chung', completed: checklist[0].completed && checklist[1].completed },
    { label: 'Lĩnh vực', completed: !!draft.domain.domainCode },
    { label: 'Khu vực KD', completed: true },
    { label: 'Tiền bản quyền', completed: calcLinesAggregation.calculatedLineCount > 0 },
    { label: 'Preflight', completed: checklist.every((c) => c.completed) },
  ];

  // =========================================================================
  // KARAOKE CALCULATION HANDLER
  // =========================================================================

  const handleKaraokeCalc = async () => {
    const calcIssues = validateKaraokeCalcInput(draft);
    const blocking = calcIssues.filter((i) => i.severity === 'error');
    if (blocking.length > 0) {
      setCalcError('Vui lòng kiểm tra lại thông tin trước khi tính.');
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setCalcError('Bạn cần đăng nhập trước khi tính tiền bản quyền.');
      return;
    }

    setIsCalcLoading(true);
    setCalcError(null);
    try {
      const input = mapDraftToKaraokeCalcInput(draft);
      const result = await calculateKaraokeDryRun(token, input);
      setCalcResult(result);
    } catch (error: any) {
      setCalcError(String(error?.message || 'Tính tiền thất bại.'));
    } finally {
      setIsCalcLoading(false);
    }
  };

  // =========================================================================
  // CALCULATION LINES HANDLERS
  // =========================================================================

  const handleAddCalcLine = (module: CalculationModuleCode) => {
    updateDraft((current) => ({
      ...current,
      calculationLines: [...current.calculationLines, createCalculationLine(module, current.calculationLines.length)],
    }));
  };

  const handleRemoveCalcLine = (lineId: string) => {
    updateDraft((current) => ({
      ...current,
      calculationLines: current.calculationLines.filter((line) => line.id !== lineId),
    }));
  };

  const handleToggleCalcLineEnabled = (lineId: string) => {
    updateDraft((current) => ({
      ...current,
      calculationLines: current.calculationLines.map((line) =>
        line.id === lineId ? { ...line, enabled: !line.enabled } : line
      ),
    }));
  };

  const handleUpdateCalcLineLabel = (lineId: string, label: string) => {
    updateDraft((current) => ({
      ...current,
      calculationLines: current.calculationLines.map((line) =>
        line.id === lineId ? { ...line, label } : line
      ),
    }));
  };

  const handleUpdateCalcLineModule = (lineId: string, module: CalculationModuleCode) => {
    updateDraft((current) => ({
      ...current,
      calculationLines: current.calculationLines.map((line) => {
        if (line.id !== lineId) return line;
        const newLine = createCalculationLine(module, current.calculationLines.length);
        return {
          ...newLine,
          id: lineId,
          label: line.label || newLine.label,
          enabled: line.enabled,
        };
      }),
    }));
  };

  const handleUpdateLineInput = (lineId: string, input: RoyaltyCalculationLine['input']) => {
    updateDraft((current) => ({
      ...current,
      calculationLines: current.calculationLines.map((line) =>
        line.id === lineId ? { ...line, input } : line
      ),
    }));
  };

  const handleCalculateLine = async (lineId: string) => {
    const line = draft.calculationLines.find((l) => l.id === lineId);
    if (!line) return;

    if (!isModuleAvailable(line.calculationModule)) {
      setLineCalcErrors((prev) => ({ ...prev, [lineId]: 'Module này chưa triển khai.' }));
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLineCalcErrors((prev) => ({ ...prev, [lineId]: 'Bạn cần đăng nhập.' }));
      return;
    }

    setIsLineCalcLoading((prev) => ({ ...prev, [lineId]: true }));
    setLineCalcErrors((prev) => ({ ...prev, [lineId]: null }));

    try {
      if (line.calculationModule === 'KARAOKE_PHONG' || line.calculationModule === 'KARAOKE_BOX') {
        const calcInput = mapLineInputToKaraokeCalc(
          line.input.module === 'KARAOKE_PHONG'
            ? {
                ...line.input,
                areaGroup: draft.karaoke.areaGroup === 'BOX' ? 'DEN_20' : draft.karaoke.areaGroup,
                totalRooms: draft.karaoke.totalRooms,
              }
            : line.input.module === 'KARAOKE_BOX'
              ? {
                  ...line.input,
                  totalBoxes: draft.karaoke.totalBoxes,
                }
              : line.input,
          composeContractNo(draft),
          draft.term.effectiveFrom,
          draft.term.effectiveTo,
          draft.karaoke.pricingRenderMode,
          draft.karaoke.roomSections
        );

        if (!calcInput) {
          throw new Error('Không thể tạo input cho module này.');
        }

        const response = await calculateKaraokeDryRun(token, calcInput);
        const lineResult = mapKaraokeResponseToLineResult(response);

        updateDraft((current) => ({
          ...current,
          calculationLines: current.calculationLines.map((l) =>
            l.id === lineId
              ? {
                  ...l,
                  result: lineResult,
                  status: response.ok ? 'success' : 'error',
                  errors: response.errors.map((e) => ({ field: e.field, message: e.message })),
                  warnings: response.warnings.map((w) => ({ field: w.field, message: w.message })),
                }
              : l
          ),
        }));
      } else if (line.calculationModule === 'KVC_VCPMC_TARIFF') {
        // PHASE KVC-02b: Backend is source of truth
        const locations = draft.areaBased.locations
          .filter((loc) => line.appliesToLocationIds.includes(loc.id))
          .map((loc) => ({
            id: loc.id,
            name: loc.locationName || loc.businessAddress || loc.id,
            area_m2: loc.musicUsageAreaM2 || 0,
          }));

        const calcInput = {
          locations,
          gtgt_percent: (line.input as any).gtgtPercent ?? 8.0,
          support_percent: (line.input as any).supportPercent ?? 0.0,
          support_amount: (line.input as any).supportAmount ?? 0,
          support_note: (line.input as any).supportNote ?? '',
        };

        const response = await calculateKvcVcpmcTariff(token, calcInput);
        const lineResult = mapKvcResponseToLineResult(response);

        updateDraft((current) => ({
          ...current,
          calculationLines: current.calculationLines.map((l) =>
            l.id === lineId
              ? {
                  ...l,
                  result: lineResult,
                  status: response.ok ? 'success' : 'error',
                  errors: response.errors.map((e) => ({ field: e.field, message: e.message })),
                  warnings: response.warnings.map((w) => ({ field: w.field, message: w.message })),
                }
              : l
          ),
        }));
      } else if (line.calculationModule === 'KVC_ND17') {
        // PHASE KVC-05: ND17 calculation
        const locations = draft.areaBased.locations
          .filter((loc) => line.appliesToLocationIds.includes(loc.id))
          .map((loc) => ({
            id: loc.id,
            name: loc.locationName || loc.businessAddress || loc.id,
            area_m2: loc.musicUsageAreaM2 || 0,
          }));

        const calcInput = {
          locations,
          base_salary: (line.input as any).baseSalary ?? 2_340_000,
          urban_class: (line.input as any).urbanClass,
          gtgt_percent: (line.input as any).gtgtPercent ?? 8.0,
          support_percent: (line.input as any).supportPercent ?? 0.0,
          support_amount: (line.input as any).supportAmount ?? 0,
          support_note: (line.input as any).supportNote ?? '',
          include_premise_services: (line.input as any).includePremiseServices ?? false,
          premise_services_note: (line.input as any).premiseServicesNote ?? '',
        };

        const response = await calculateKvcNd17(token, calcInput);
        const lineResult = mapKvcNd17ResponseToLineResult(response);

        updateDraft((current) => ({
          ...current,
          calculationLines: current.calculationLines.map((l) =>
            l.id === lineId
              ? {
                  ...l,
                  result: lineResult,
                  status: response.ok ? 'success' : 'error',
                  errors: response.errors.map((e) => ({ field: e.field, message: e.message })),
                  warnings: response.warnings.map((w) => ({ field: w.field, message: w.message })),
                }
              : l
          ),
        }));
      } else {
        // Module not implemented yet
        setLineCalcErrors((prev) => ({ ...prev, [lineId]: CALC_MODULE_NOT_IMPLEMENTED_PLACEHOLDER }));
      }
    } catch (error: any) {
      setLineCalcErrors((prev) => ({ ...prev, [lineId]: String(error?.message || 'Tính thử thất bại.') }));
      updateDraft((current) => ({
        ...current,
        calculationLines: current.calculationLines.map((l) =>
          l.id === lineId
            ? { ...l, status: 'error' as const, result: null }
            : l
        ),
      }));
    } finally {
      setIsLineCalcLoading((prev) => ({ ...prev, [lineId]: false }));
    }
  };

  // =========================================================================
  // DRY-RUN HANDLER
  // =========================================================================

  const handleDryRun = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setDryRunError('Bạn cần đăng nhập trước khi chạy dry-run.');
      return;
    }
    setIsDryRunLoading(true);
    setDryRunError(null);
    try {
      const result = await dryRunCreateContract(token, {
        draft,
        client_preflight: candidatePayload,
      });
      setDryRunResult(result);
      if (
        result.ok &&
        result.can_create &&
        !result.duplicate_checks.contract_no_exists
      ) {
        setCloneCreateIdempotencyKey(createCloneOnlyIdempotencyKey());
      } else {
        setCloneCreateIdempotencyKey(null);
      }
      setIsDirty(false);
    } catch (error: any) {
      setDryRunError(String(error?.message || 'Dry-run thất bại.'));
    } finally {
      setIsDryRunLoading(false);
    }
  };

  // =========================================================================
  // CLONE-ONLY CREATE HANDLER
  // =========================================================================

  const handleCloneOnlyCreate = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setCloneCreateError(
        'Ban can dang nhap truoc khi tao hop dong tren DB chinh.'
      );
      return;
    }
    if (!canRunCloneOnlyCreate) {
      setCloneCreateError(
        'Cần chạy dry-run hợp lệ trước khi tạo hợp đồng trên DB clone.'
      );
      return;
    }

    setIsCloneCreateLoading(true);
    setCloneCreateError(null);
    setWordPreviewResult(null);
    setWordPreviewError(null);
    try {
      const idempotencyKey =
        cloneCreateIdempotencyKey || createCloneOnlyIdempotencyKey();
      setCloneCreateIdempotencyKey(idempotencyKey);
      const result = await createContractCloneOnly(token, {
        draft,
        client_preflight: candidatePayload,
        client_confirmation: {
          clone_only_create_confirmed: true,
          idempotency_key: idempotencyKey,
        },
      });
      setCloneCreateResult(result);
    } catch (error: any) {
      setCloneCreateError(String(error?.message || 'Clone-only create thất bại.'));
    } finally {
      setIsCloneCreateLoading(false);
    }
  };

  const handleCreateWordPreview = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setWordPreviewError('Bạn cần đăng nhập trước khi tạo Word preview.');
      return;
    }
    if (!createdContractId) {
      setWordPreviewError('Chưa có contract_id từ bước tạo hợp đồng trên DB clone.');
      return;
    }
    if (!isKaraokeDomain) {
      setWordPreviewError('Phase này chỉ bật Word preview cho Karaoke.');
      return;
    }

    setIsWordPreviewLoading(true);
    setWordPreviewError(null);
    try {
      const result = await exportDocxPreview(token, createdContractId, {
        include_blocks: true,
        dry_run_label: 'create-contract-ui-01-karaoke-preview',
      });
      setWordPreviewResult(result);
    } catch (error: any) {
      setWordPreviewError(String(error?.message || 'Tạo Word preview thất bại.'));
    } finally {
      setIsWordPreviewLoading(false);
    }
  };

  const handleMakeContract = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setMakeHdError('Ban can dang nhap truoc khi Lam HD.');
      return;
    }

    setMakeHdError(null);
    setCloneCreateError(null);
    setWordPreviewError(null);
    setCloneCreateResult(null);
    setWordPreviewResult(null);

    if (!isKaraokeDomain) {
      setMakeHdError('Phase này chỉ hỗ trợ Karaoke.');
      return;
    }

    setIsMakeHdLoading(true);
    setIsDryRunLoading(false);
    setIsCloneCreateLoading(true);
    setIsWordPreviewLoading(false);

    try {
      const direct = await makeHdPreviewKaraokeOldAppDirect(token, {
        draft,
        client_preflight: candidatePayload,
      });

      if (!direct.ok || !direct.contract_id) {
        setMakeHdError('Làm HĐ Karaoke thất bại.');
        return;
      }

      // Keep existing UI blocks by mapping single-endpoint result into old states.
      setCloneCreateResult({
        ok: true,
        mode: 'karaoke_old_app_direct_render',
        message: 'Created Karaoke contract + Word file using single endpoint.',
        write_enabled: true,
        rollback_only: false,
        clone_only_enabled: true,
        write_performed: Boolean(direct.db_write_performed),
        rollback_performed: false,
        artifacts_generated: false,
        created: {
          id: direct.contract_id,
          contract_no: direct.contract_no || '',
          contract_year: Number(draft.common.contractYear || 0),
          customer_name: draft.customer.legalName || '',
          table: 'contract_records',
          db_name: direct.db_name || null,
        },
        dry_run: { warnings: [], errors: [] },
      } as any);
      setIsCloneCreateLoading(false);

      setWordPreviewResult({
        ok: true,
        preview_path: direct.word_path || direct.preview_path,
        file_size: direct.file_size,
        domain: 'KARAOKE',
        domain_label: 'Karaoke',
        template_path: 'F:\\APPs\\templates\\Karaoke\\export_template_contract_KA.docx',
        placeholders_attempted: [],
        placeholders_in_context: direct.render_context_keys?.length || 0,
        file_write_performed: true,
        db_write_performed: false,
        docx_path_attached: Boolean(direct.docx_path_attached),
        official_export: Boolean(direct.official_export),
        pricing_blocks_inserted: false,
        kvc_blocks_attempted: false,
        kvc_usage_block_inserted: false,
        kvc_pricing_block_inserted: false,
        karaoke_blocks_attempted: false,
        karaoke_room_block_inserted: false,
        karaoke_pricing_block_inserted: false,
        block_placeholder_strategy: 'old_app_direct_real_placeholder',
        block_placeholders_injected: [],
        sentinel_anchors_used: [],
        template_raw_anchor_required: false,
        synthetic_preview: false,
        warnings: direct.warnings || [],
        message: null,
      });
      setIsWordPreviewLoading(false);
    } catch (error: any) {
      setMakeHdError(String(error?.message || 'Lam HD that bai.'));
      setIsCloneCreateLoading(false);
      setIsWordPreviewLoading(false);
    } finally {
      setIsMakeHdLoading(false);
      setIsCloneCreateLoading(false);
      setIsWordPreviewLoading(false);
    }
  };

  // =========================================================================
  // LOCAL ACTIONS
  // =========================================================================

  const handleSaveDraft = () => {
    console.log('Local create draft only:', draft);
    alert('Đã lưu nháp cục bộ. Chưa ghi dữ liệu.');
    setIsDirty(false);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (
        confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy và quay lại?')
      ) {
        onNavigate('contracts.list');
      }
    } else {
      onNavigate('contracts.list');
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <Page>
      <PageHeader
        breadcrumb="/bg/contracts/new"
        title="Tạo hợp đồng mới - Background"
        description="Chuẩn hóa form theo kiến trúc mới. Chưa ghi dữ liệu."
        actions={<StepIndicator steps={steps} />}
      />

      <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-600/15">
        {SAFETY_NOTE}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* =================================================================== */}
          {/* SECTION 1: THÔNG TIN CHUNG */}
          {/* Shared across all Background domains */}
          {/* =================================================================== */}
          <FormSection
            title="1. Thông tin chung"
            description="Thông tin hợp đồng, đối tác, địa điểm - chung cho tất cả lĩnh vực Background"
          >
            <div className="space-y-6">
              {/* 1a. Định danh hợp đồng */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                  1a. Định danh hợp đồng
                </h4>
                <div className="space-y-4">
                  <ContractNumberPreview contractNo={contractNoPreview} />
                  <FieldGrid cols={3}>
                    <Input
                      label="Số hợp đồng *"
                      value={draft.common.contractNumber}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          common: {
                            ...current.common,
                            contractNumber: e.target.value,
                          },
                        }))
                      }
                      required
                      hint="USER INPUT only - không tự động tạo"
                    />
                    <Input
                      label="Ngày lập"
                      type="date"
                      value={draft.common.signedDate}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          common: { ...current.common, signedDate: e.target.value },
                        }))
                      }
                      required
                    />
                    <Select
                      label="Năm"
                      value={draft.common.contractYear}
                      onChange={(value) =>
                        updateDraft((current) => ({
                          ...current,
                          common: { ...current.common, contractYear: value },
                        }))
                      }
                      options={CONTRACT_YEAR_OPTIONS}
                    />
                  </FieldGrid>
                  <FieldGrid cols={3}>
                    <Select
                      label="Mã vùng"
                      value={draft.common.regionCode}
                      onChange={(value) =>
                        updateDraft((current) => ({
                          ...current,
                          common: { ...current.common, regionCode: value },
                        }))
                      }
                      options={CREATE_CONTRACT_REGION_OPTIONS}
                    />
                    <Select
                      label="Khu vực"
                      value={draft.common.areaCode}
                      onChange={(value) =>
                        updateDraft((current) => ({
                          ...current,
                          common: { ...current.common, areaCode: value },
                        }))
                      }
                      options={CREATE_CONTRACT_AREA_OPTIONS}
                    />
                    <Select
                      label="Mã quyền"
                      value={draft.common.fieldCode}
                      onChange={(value) =>
                        updateDraft((current) => ({
                          ...current,
                          common: { ...current.common, fieldCode: value },
                        }))
                      }
                      options={[
                        { value: 'PR', label: 'PR (Karaoke)' },
                        { value: 'PTA', label: 'PTA (Phòng thu âm)' },
                      ]}
                    />
                  </FieldGrid>
                </div>
              </div>

              {/* 1b. Thông tin đối tác */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                  1b. Thông tin đối tác
                </h4>
                <div className="space-y-4">
                  <FieldGrid>
                    <Input
                      label="Tên đơn vị *"
                      value={draft.customer.legalName}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          customer: { ...current.customer, legalName: e.target.value },
                        }))
                      }
                      required
                    />
                    <Input
                      label="Tên bảng hiệu *"
                      value={draft.customer.brandName}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          customer: { ...current.customer, brandName: e.target.value },
                        }))
                      }
                      required
                    />
                  </FieldGrid>
                  <FieldGrid>
                    <Input
                      label="Người đại diện"
                      value={draft.customer.representativeName}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          customer: {
                            ...current.customer,
                            representativeName: e.target.value,
                          },
                        }))
                      }
                    />
                    <Input
                      label="Chức vụ"
                      value={draft.customer.representativeTitle}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          customer: {
                            ...current.customer,
                            representativeTitle: e.target.value,
                          },
                        }))
                      }
                    />
                  </FieldGrid>
                  <FieldGrid cols={3}>
                    <Input
                      label="Mã số thuế"
                      value={draft.customer.taxCode}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          customer: { ...current.customer, taxCode: e.target.value },
                        }))
                      }
                    />
                    <Input
                      label="Số CCCD"
                      value={draft.customer.cccd}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          customer: { ...current.customer, cccd: e.target.value },
                        }))
                      }
                    />
                    <Input
                      label="Điện thoại"
                      type="tel"
                      value={draft.customer.phone}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          customer: { ...current.customer, phone: e.target.value },
                        }))
                      }
                    />
                  </FieldGrid>
                  <FieldGrid>
                    <Input
                      label="Email"
                      type="email"
                      value={draft.customer.email}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          customer: { ...current.customer, email: e.target.value },
                        }))
                      }
                    />
                    <Input
                      label="Địa chỉ pháp lý *"
                      value={draft.customer.legalAddress}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          customer: {
                            ...current.customer,
                            legalAddress: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </FieldGrid>
                </div>
              </div>

              {/* 1c. Địa điểm sử dụng */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                  1c. Địa điểm sử dụng
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Địa chỉ sử dụng *"
                    value={draft.location.usageAddress}
                    onChange={(e) =>
                      updateDraft((current) => ({
                        ...current,
                        location: {
                          ...current.location,
                          usageAddress: e.target.value,
                        },
                      }))
                    }
                    required
                  />
                  <FieldGrid cols={3}>
                    <Input
                      label="Tỉnh/Thành"
                      value={draft.location.city}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          location: { ...current.location, city: e.target.value },
                        }))
                      }
                    />
                    <Input
                      label="Quận/Huyện"
                      value={draft.location.district}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          location: { ...current.location, district: e.target.value },
                        }))
                      }
                    />
                    <Input
                      label="Phường/Xã"
                      value={draft.location.ward}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          location: { ...current.location, ward: e.target.value },
                        }))
                      }
                    />
                  </FieldGrid>
                </div>
              </div>

              {/* 1d. Thời hạn hợp đồng */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                  1d. Thời hạn hợp đồng
                </h4>
                <div className="space-y-4">
                  <FieldGrid cols={2}>
                    <Input
                      label="Ngày bắt đầu"
                      type="date"
                      value={draft.term.effectiveFrom}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          term: { ...current.term, effectiveFrom: e.target.value },
                        }))
                      }
                      required
                    />
                    <Input
                      label="Ngày kết thúc"
                      type="date"
                      value={draft.term.effectiveTo}
                      onChange={(e) =>
                        updateDraft((current) => ({
                          ...current,
                          term: { ...current.term, effectiveTo: e.target.value },
                        }))
                      }
                      required
                    />
                  </FieldGrid>
                  <Select
                    label="Trạng thái tái ký"
                    value={draft.notes.internal ? 'RENEWED' : 'NEW'}
                    onChange={(value) =>
                      updateDraft((current) => ({
                        ...current,
                        notes: { ...current.notes, internal: value },
                      }))
                    }
                    options={CREATE_CONTRACT_RENEWAL_OPTIONS}
                  />
                </div>
              </div>

              {/* 1e. Người thực hiện */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                  1e. Người thực hiện
                </h4>
                <FieldGrid>
                  <Select
                    label="Người thực hiện"
                    value={draft.assignee.name}
                    onChange={(value) =>
                      updateDraft((current) => ({
                        ...current,
                        assignee: {
                          name: value,
                          email: CREATE_CONTRACT_ASSIGNEE_EMAILS[value] || '',
                        },
                      }))
                    }
                    options={CREATE_CONTRACT_ASSIGNEE_OPTIONS}
                  />
                  <Input
                    label="Email người thực hiện"
                    type="email"
                    value={draft.assignee.email}
                    onChange={(e) =>
                      updateDraft((current) => ({
                        ...current,
                        assignee: { ...current.assignee, email: e.target.value },
                      }))
                    }
                    disabled
                    hint="Tự động điền theo người thực hiện"
                  />
                </FieldGrid>
              </div>

              {/* 1f. Ghi chú */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                  1f. Ghi chú
                </h4>
                <div className="space-y-4">
                  <Textarea
                    label="Ghi chú nội bộ"
                    value={draft.notes.internal}
                    onChange={(e) =>
                      updateDraft((current) => ({
                        ...current,
                        notes: { ...current.notes, internal: e.target.value },
                      }))
                    }
                    placeholder="Ghi chú cho nội bộ VCPMC..."
                  />
                  <Textarea
                    label="Điều khoản / Ghi chú xuất hợp đồng"
                    value={draft.notes.contractTerms}
                    onChange={(e) =>
                      updateDraft((current) => ({
                        ...current,
                        notes: {
                          ...current.notes,
                          contractTerms: e.target.value,
                        },
                      }))
                    }
                    placeholder="Điều khoản sẽ xuất hiện trên hợp đồng..."
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* =================================================================== */}
          {/* SECTION 2: LĨNH VỰC */}
          {/* Domain selector - all Background domains */}
          {/* =================================================================== */}
          <FormSection
            title="2. Lĩnh vực"
            description="Chọn lĩnh vực kinh doanh Background. Media/SCTT bị khóa."
          >
            <div className="space-y-4">
              <Select
                label="Lĩnh vực *"
                value={draft.domain.domainCode}
                onChange={(value) => updateDomain(value as BackgroundDomainCode)}
                options={CREATE_CONTRACT_BACKGROUND_DOMAIN_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                }))}
              />

              {/* Domain description */}
              <div className="p-3 rounded-lg bg-indigo-50/50 ring-1 ring-indigo-600/10">
                <p className="text-xs text-indigo-700">
                  <span className="font-semibold">
                    {draft.domain.domainDisplayName}
                  </span>
                  {draft.domain.domainGroup === 'background' && ' · Background'}
                </p>
              </div>

              {/* Media/SCTT locked notice */}
              <div className="p-3 rounded-lg bg-zinc-100 ring-1 ring-zinc-300">
                <p className="text-xs text-zinc-600">
                  <span className="font-semibold">Media/SCTT/BD:</span> Đang
                  khóa. Sẽ triển khai ở phase sau.
                </p>
              </div>
            </div>
          </FormSection>

          {/* =================================================================== */}
          {/* SECTION 3: KHU VỰC KINH DOANH */}
          {/* Domain-specific fields */}
          {/* =================================================================== */}
          <FormSection
            title="3. Khu vực kinh doanh"
            description="Thông tin tùy theo lĩnh vực đã chọn"
          >
            {isKaraokeDomain ? (
              // Karaoke / Phòng thu âm fields
              <div className="space-y-6">
                {/* Loại hình */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                    Loại hình Karaoke
                  </h4>
                  <FieldGrid cols={2}>
                    <Select
                      label="Loại hình"
                      value={draft.karaoke.karaokeType}
                      onChange={(value) =>
                        updateDraft((current) => {
                          const karaokeType = value as 'PHONG' | 'BOX';
                          const areaGroup =
                            karaokeType === 'BOX'
                              ? 'BOX'
                              : current.karaoke.areaGroup === 'BOX'
                                ? 'DEN_20'
                                : current.karaoke.areaGroup;
                          return {
                            ...current,
                            karaoke: {
                              ...current.karaoke,
                              karaokeType,
                              areaGroup,
                            },
                            calculationLines: current.calculationLines.map((line, index) => {
                              if (
                                !['KARAOKE_PHONG', 'KARAOKE_BOX'].includes(line.input.module)
                              ) {
                                return line;
                              }
                              const module =
                                karaokeType === 'BOX' ? 'KARAOKE_BOX' : 'KARAOKE_PHONG';
                              const nextLine = createCalculationLine(module, index);
                              return {
                                ...line,
                                calculationModule: module,
                                input:
                                  nextLine.input.module === 'KARAOKE_PHONG'
                                    ? {
                                      ...nextLine.input,
                                      areaGroup,
                                      totalRooms: current.karaoke.totalRooms,
                                      baseSalary: current.karaoke.baseSalary,
                                      annualSupportPercent:
                                        current.karaoke.annualSupportPercent,
                                      tier1SupportPercent: 0,
                                      tier2SupportPercent: 0,
                                      tier3SupportPercent: 0,
                                      gtgtPercent: current.karaoke.gtgtPercent,
                                    }
                                    : {
                                        ...nextLine.input,
                                        totalBoxes: current.karaoke.totalBoxes,
                                        baseSalary: current.karaoke.baseSalary,
                                        gtgtPercent: current.karaoke.gtgtPercent,
                                      },
                                result: null,
                                status: 'idle',
                              };
                            }),
                          };
                        })
                      }
                      options={CREATE_CONTRACT_KARAOKE_USAGE_OPTIONS}
                    />
                    <Select
                      label="Nhóm diện tích"
                      value={draft.karaoke.areaGroup}
                      onChange={(value) =>
                        updateDraft((current) => ({
                          ...current,
                          karaoke: {
                            ...current.karaoke,
                            areaGroup: value as
                              | 'DEN_20'
                              | 'TREN_20_DEN_30'
                              | 'TREN_30'
                              | 'BOX',
                          },
                        }))
                      }
                      options={getAreaGroupOptions(draft.karaoke.karaokeType)}
                    />
                  </FieldGrid>
                </div>

                {/* Số phòng / box */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                    Số lượng
                  </h4>
                  <FieldGrid cols={2}>
                    <Input
                      label={
                        draft.karaoke.karaokeType === 'PHONG'
                          ? 'Tổng số phòng'
                          : 'Tổng số box'
                      }
                      type="number"
                      value={String(
                        draft.karaoke.karaokeType === 'PHONG'
                          ? draft.karaoke.totalRooms
                          : draft.karaoke.totalBoxes
                      )}
                      onChange={(e) => updateKaraokeRoomCount(parseInt(e.target.value, 10) || 0)}
                    />
                    <div className="p-3 rounded-lg bg-indigo-50/50 ring-1 ring-indigo-600/10">
                      <p className="text-xs text-indigo-700">
                        <span className="font-semibold">
                          {draft.karaoke.karaokeType === 'PHONG'
                            ? `Tổng: ${draft.karaoke.totalRooms} phòng`
                            : `Tổng: ${draft.karaoke.totalBoxes} box`}
                        </span>
                      </p>
                      <p className="mt-1 text-[11px] text-indigo-600">
                        Tự cộng từ các dòng khu vực bên dưới nếu có khai báo.
                      </p>
                    </div>
                  </FieldGrid>
                </div>

                <div>
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                        Khu vực / vị trí phòng
                      </h4>
                      <p className="mt-1 text-xs text-zinc-500">
                        Chỉ nhập tầng/vị trí và số phòng/box. Phần lương cơ sở, GTGT, hỗ trợ nằm ở mục tiền bản quyền.
                      </p>
                    </div>
                    <Select
                      label="Thêm khu vực"
                      value={roomSectionPresetToAdd}
                      placeholder="Chọn khu vực"
                      onChange={(value) => {
                        if (!value) return;
                        addRoomSection(value);
                        setRoomSectionPresetToAdd('');
                      }}
                      options={ROOM_SECTION_OPTIONS}
                      size="sm"
                      className="sm:w-56"
                    />
                  </div>
                  <div className="space-y-3">
                    {draft.karaoke.roomSections.length === 0 ? (
                      <div className="rounded-lg bg-zinc-50 px-3 py-3 text-sm text-zinc-500 ring-1 ring-zinc-200">
                        Chưa khai báo tầng/khu vực. Chọn dropdown "Thêm khu vực" để thêm Trệt, Lửng, Lầu 1-10, Sân vườn hoặc Khác.
                      </div>
                    ) : (
                      draft.karaoke.roomSections.map((section, index) => {
                        const presetValue = getRoomSectionPresetValue(section.key);
                        const isCustomSection = presetValue === 'KHAC';

                        return (
                          <div
                            key={index}
                            className="rounded-lg bg-zinc-50/70 p-3 ring-1 ring-zinc-200"
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <span className="text-xs font-semibold text-zinc-600">
                                Khu vực {index + 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<TrashIcon className="h-4 w-4" />}
                                onClick={() => removeRoomSection(index)}
                                className="text-zinc-400 hover:text-rose-500"
                              />
                            </div>
                            <FieldGrid cols={3}>
                              <Select
                                label="Vị trí"
                                value={presetValue}
                                onChange={(value) => updateRoomSection(index, 'key', getRoomSectionKeyFromPreset(value))}
                                options={ROOM_SECTION_OPTIONS}
                              />
                              <Input
                                label={draft.karaoke.karaokeType === 'PHONG' ? 'Số phòng' : 'Số box'}
                                type="number"
                                value={String(section.roomCount)}
                                onChange={(e) => updateRoomSection(index, 'roomCount', parseInt(e.target.value, 10) || 0)}
                              />
                              <Input
                                label="Tên/số phòng"
                                value={section.roomNames}
                                onChange={(e) => updateRoomSection(index, 'roomNames', e.target.value)}
                                placeholder="VD: 101, 102, VIP 1..."
                              />
                            </FieldGrid>
                            {isCustomSection && (
                              <div className="mt-3">
                                <Input
                                  label="Tên khu vực khác"
                                  value={section.key}
                                  onChange={(e) => updateRoomSection(index, 'key', e.target.value)}
                                  placeholder="VD: Sân thượng, khu VIP..."
                                />
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : isAreaBasedDomainFlag ? (
              // Area-based domain fields with business locations
              <div className="space-y-6">
                {/* Panel header */}
                <div className="p-3 rounded-lg bg-sky-50 ring-1 ring-sky-600/15">
                  <p className="text-xs text-sky-800">
                    Một hợp đồng có thể có một hoặc nhiều địa điểm kinh doanh.
                  </p>
                </div>

                {/* Add location button */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                    onClick={() =>
                      updateDraft((current) => ({
                        ...current,
                        areaBased: {
                          ...current.areaBased,
                          locations: [...current.areaBased.locations, createDefaultBusinessLocation(current.areaBased.locations.length)],
                        },
                      }))
                    }
                  >
                    + Thêm địa điểm
                  </Button>
                  <span className="text-xs text-zinc-500">
                    {draft.areaBased.locations.length} địa điểm
                  </span>
                </div>

                {/* Locations list */}
                <div className="space-y-4">
                  {draft.areaBased.locations.map((location, index) => (
                    <div
                      key={location.id}
                      className="rounded-lg border border-zinc-200 p-4 bg-zinc-50/50"
                    >
                      {/* Location header */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-zinc-700">
                          Địa điểm {index + 1}
                        </h4>
                        {draft.areaBased.locations.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<TrashIcon className="h-4 w-4" />}
                            onClick={() =>
                              updateDraft((current) => ({
                                ...current,
                                areaBased: {
                                  ...current.areaBased,
                                  locations: current.areaBased.locations.filter((_, i) => i !== index),
                                },
                              }))
                            }
                            className="text-zinc-400 hover:text-rose-500"
                          >
                            Xóa
                          </Button>
                        )}
                      </div>

                      {/* Location fields */}
                      <div className="space-y-4">
                        <FieldGrid cols={2}>
                          <Input
                            label="Tên địa điểm"
                            value={location.locationName}
                            onChange={(e) =>
                              updateDraft((current) => ({
                                ...current,
                                areaBased: {
                                  ...current.areaBased,
                                  locations: current.areaBased.locations.map((loc) =>
                                    loc.id === location.id
                                      ? { ...loc, locationName: e.target.value }
                                      : loc
                                  ),
                                },
                              }))
                            }
                            placeholder="VD: Chi nhánh 1, Tầng 2..."
                          />
                          <Input
                            label="Địa chỉ kinh doanh"
                            value={location.businessAddress}
                            onChange={(e) =>
                              updateDraft((current) => ({
                                ...current,
                                areaBased: {
                                  ...current.areaBased,
                                  locations: current.areaBased.locations.map((loc) =>
                                    loc.id === location.id
                                      ? { ...loc, businessAddress: e.target.value }
                                      : loc
                                  ),
                                },
                              }))
                            }
                            placeholder="VD: 123 Nguyễn Huệ, Quận 1..."
                          />
                        </FieldGrid>
                        <FieldGrid cols={2}>
                          <Input
                            label="Diện tích sử dụng âm nhạc (m²)"
                            type="number"
                            value={String(location.musicUsageAreaM2)}
                            onChange={(e) =>
                              updateDraft((current) => ({
                                ...current,
                                areaBased: {
                                  ...current.areaBased,
                                  locations: current.areaBased.locations.map((loc) =>
                                    loc.id === location.id
                                      ? { ...loc, musicUsageAreaM2: parseFloat(e.target.value) || 0 }
                                      : loc
                                  ),
                                },
                              }))
                            }
                          />
                          <Select
                            label="Hình thức sử dụng âm nhạc"
                            value={location.musicUsageType}
                            onChange={(value) =>
                              updateDraft((current) => ({
                                ...current,
                                areaBased: {
                                  ...current.areaBased,
                                  locations: current.areaBased.locations.map((loc) =>
                                    loc.id === location.id
                                      ? {
                                          ...loc,
                                          musicUsageType: value as 'NHAC_NEN' | 'LIVE_ACOUSTIC' | 'DJ' | 'KARAOKE' | 'MIXED',
                                        }
                                      : loc
                                  ),
                                },
                              }))
                            }
                            options={AREA_USAGE_KIND_OPTIONS}
                          />
                        </FieldGrid>
                        <Input
                          label="Ghi chú"
                          value={location.note}
                          onChange={(e) =>
                            updateDraft((current) => ({
                              ...current,
                              areaBased: {
                                ...current.areaBased,
                                locations: current.areaBased.locations.map((loc) =>
                                  loc.id === location.id
                                    ? { ...loc, note: e.target.value }
                                    : loc
                                ),
                              },
                            }))
                          }
                          placeholder="Ghi chú cho địa điểm này..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Display mode selector */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                    Cách hiển thị khu vực kinh doanh khi xuất hợp đồng
                  </h4>
                  <FieldGrid cols={3}>
                    <Select
                      label="Chế độ"
                      value={draft.areaBased.displayMode}
                      onChange={(value) =>
                        updateDraft((current) => ({
                          ...current,
                          areaBased: {
                            ...current.areaBased,
                            displayMode: value as 'auto' | 'text' | 'table',
                          },
                        }))
                      }
                      options={[
                        { value: 'auto', label: 'Tự động' },
                        { value: 'text', label: 'Dạng chữ' },
                        { value: 'table', label: 'Dạng bảng' },
                      ]}
                    />
                  </FieldGrid>
                  <p className="text-xs text-zinc-500 mt-1">
                    {draft.areaBased.displayMode === 'auto' && (
                      draft.areaBased.locations.length >= 2
                        ? 'Tự động → Dạng bảng (nhiều địa điểm)'
                        : 'Tự động → Dạng chữ (một địa điểm)'
                    )}
                    {draft.areaBased.displayMode === 'text' && 'Hiển thị dạng văn bản'}
                    {draft.areaBased.displayMode === 'table' && 'Hiển thị dạng bảng'}
                  </p>
                </div>

                {/* Usage preview */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                    Preview khu vực kinh doanh
                  </h4>
                  <div className="rounded-lg bg-white border border-zinc-200 p-4">
                    {draft.areaBased.displayMode === 'text' || (draft.areaBased.displayMode === 'auto' && draft.areaBased.locations.length === 1) ? (
                      // Text preview
                      <div className="text-sm text-zinc-700 space-y-2">
                        {draft.areaBased.locations.map((loc, idx) => (
                          <div key={loc.id} className={idx > 0 ? 'border-t border-zinc-100 pt-2 mt-2' : ''}>
                            {loc.locationName && <p className="font-semibold">{loc.locationName}</p>}
                            {loc.businessAddress && <p>Địa chỉ: {loc.businessAddress}</p>}
                            {loc.musicUsageAreaM2 > 0 && <p>Diện tích sử dụng âm nhạc: {loc.musicUsageAreaM2}m²</p>}
                            <p>Hình thức: {getMusicUsageTypeLabel(loc.musicUsageType)}</p>
                            {loc.note && <p className="text-zinc-500">Ghi chú: {loc.note}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Table preview
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-zinc-200">
                              <th className="text-left py-2 px-2 font-semibold text-zinc-600">Địa điểm</th>
                              <th className="text-left py-2 px-2 font-semibold text-zinc-600">Địa chỉ kinh doanh</th>
                              <th className="text-right py-2 px-2 font-semibold text-zinc-600">DT (m²)</th>
                              <th className="text-left py-2 px-2 font-semibold text-zinc-600">Hình thức</th>
                            </tr>
                          </thead>
                          <tbody>
                            {draft.areaBased.locations.map((loc) => (
                              <tr key={loc.id} className="border-b border-zinc-100">
                                <td className="py-2 px-2">{loc.locationName || '-'}</td>
                                <td className="py-2 px-2">{loc.businessAddress || '-'}</td>
                                <td className="py-2 px-2 text-right">{loc.musicUsageAreaM2 > 0 ? loc.musicUsageAreaM2 : '-'}</td>
                                <td className="py-2 px-2">{getMusicUsageTypeLabel(loc.musicUsageType)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* KVC pricing mode placeholder - only for KHU_VUI_CHOI */}
                {draft.domain.domainCode === 'KHU_VUI_CHOI' && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-3">
                      Phương án tính tiền Khu vui chơi
                    </h4>
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                      <div className="space-y-3">
                        <Select
                          label="Phương án tính tiền"
                          value={draft.areaBased.pricingMode || ''}
                          onChange={(value) =>
                            updateDraft((current) => ({
                              ...current,
                              areaBased: {
                                ...current.areaBased,
                                pricingMode: value as 'VCPMC_TARIFF' | 'ND17' | '',
                              },
                            }))
                          }
                          options={[
                            { value: 'VCPMC_TARIFF', label: 'Theo biểu giá VCPMC' },
                            { value: 'ND17', label: 'Áp dụng Nghị định 17/2023' },
                          ]}
                        />
                        <p className="text-xs text-amber-700 bg-amber-50">
                          Chưa triển khai tính tiền KVC ở phase này. Biểu giá VCPMC và ND17 sẽ làm ở phase riêng.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : isPlaceholderOnlyDomainFlag ? (
              // Placeholder for domain-specific forms not yet implemented
              <div className="p-4 rounded-lg bg-zinc-100 text-center">
                <p className="text-sm text-zinc-600">
                  {DOMAIN_PLACEHOLDER_ONLY_PLACEHOLDER}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Lĩnh vực "{draft.domain.domainDisplayName}" sẽ có form riêng ở phase sau.
                </p>
              </div>
            ) : (
              // Generic placeholder for other non-implemented domains
              <div className="p-4 rounded-lg bg-zinc-100 text-center">
                <p className="text-sm text-zinc-600">
                  {DOMAIN_NOT_IMPLEMENTED_PLACEHOLDER}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Lĩnh vực "{draft.domain.domainDisplayName}" sẽ có form khu vực/tính phí riêng ở phase sau.
                </p>
              </div>
            )}
          </FormSection>

          {/* =================================================================== */}
          {/* SECTION 4: TIỀN BẢN QUYỀN */}
          {/* Multiple calculation lines - new architecture */}
          {/* =================================================================== */}
          <FormSection
            title="4. Tiền bản quyền"
            description="Thêm các khoản tính bản quyền (Karaoke, KVC, ...)"
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-800 ring-1 ring-sky-600/15">
                <InfoIcon className="inline w-4 h-4 mr-1" />
                Mỗi hợp đồng có thể có nhiều khoản tính. Gọi API dry-run để tính. Không ghi DB.
              </div>

              {/* Add line button */}
              <div className="rounded-xl bg-zinc-50/80 p-3 ring-1 ring-zinc-200">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                    Thêm khoản tính
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Karaoke lấy số phòng/box từ mục 3
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                {AVAILABLE_CALCULATION_MODULES.map((mod) => (
                  <Button
                    key={mod.value}
                    variant="secondary"
                    size="sm"
                    leftIcon={<PlusIcon className="h-3 w-3" />}
                    onClick={() => handleAddCalcLine(mod.value)}
                    disabled={!isKaraokeDomain && mod.value.startsWith('KARAOKE')}
                    title={mod.description}
                    className="rounded-full"
                  >
                    {mod.label}
                  </Button>
                ))}
                </div>
              </div>

              {/* Calculation lines list */}
              {draft.calculationLines.length === 0 ? (
                <div className="p-4 rounded-lg bg-zinc-50 text-center">
                  <p className="text-sm text-zinc-500">
                    Chưa có khoản tính nào. Nhấn "Thêm khoản tính" ở trên.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {draft.calculationLines.map((line) => (
                    <div
                      key={line.id}
                      className={`rounded-lg border p-4 ${
                        line.enabled
                          ? 'bg-white border-zinc-200'
                          : 'bg-zinc-50 border-zinc-200 opacity-60'
                      }`}
                    >
                      {/* Line header */}
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={line.enabled}
                          onChange={() => handleToggleCalcLineEnabled(line.id)}
                          className="mt-1 rounded border-zinc-300"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              label="Tên khoản tính"
                              value={String(line.label)}
                              onChange={(e) => handleUpdateCalcLineLabel(line.id, e.target.value)}
                              className="flex-1"
                            />
                            <Select
                              label="Module"
                              value={line.calculationModule}
                              onChange={(value) => handleUpdateCalcLineModule(line.id, value as CalculationModuleCode)}
                              options={CALCULATION_MODULE_OPTIONS.map((m) => ({
                                value: m.value,
                                label: `${m.label} ${m.status === 'planned' ? '(sắp)' : ''}`,
                                disabled: m.status !== 'implemented',
                              }))}
                              size="sm"
                              className="w-48"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<TrashIcon className="h-4 w-4" />}
                          onClick={() => handleRemoveCalcLine(line.id)}
                          className="text-zinc-400 hover:text-rose-500"
                        />
                      </div>

                      {/* Module status badge */}
                      <div className="mb-3 ml-7">
                        {line.calculationModule === 'KARAOKE_PHONG' && (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/15">
                            Đã triển khai
                          </span>
                        )}
                        {line.calculationModule === 'KARAOKE_BOX' && (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/15">
                            Đã triển khai
                          </span>
                        )}
                        {line.calculationModule === 'KVC_VCPMC_TARIFF' && (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/15">
                            Đã triển khai
                          </span>
                        )}
                        {line.calculationModule === 'KVC_ND17' && (
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/15">
                            Đã triển khai
                          </span>
                        )}
                        {['CAFE', 'NHA_HANG', 'KHACH_SAN'].includes(line.calculationModule) && (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/15">
                            Sắp triển khai
                          </span>
                        )}
                      </div>

                      {/* Module inputs */}
                      {line.enabled && (
                        <div className="ml-7 space-y-3">
                          {/* Karaoke Phong inputs */}
                          {line.input.module === 'KARAOKE_PHONG' && (
                            <div className="space-y-3">
                              <div className="rounded-lg bg-indigo-50/50 px-3 py-2 text-xs text-indigo-700 ring-1 ring-indigo-600/10">
                                Lấy từ mục 3: {draft.karaoke.totalRooms} phòng · nhóm diện tích {draft.karaoke.areaGroup}
                              </div>
                              <FieldGrid cols={3}>
                                <Input
                                  label="Mức lương cơ sở (VND)"
                                  type="number"
                                  value={String((line.input as any).baseSalary)}
                                  onChange={(e) =>
                                    updateKaraokeCalculationField(line.id, 'baseSalary', parseInt(e.target.value, 10) || 0)
                                  }
                                />
                                <Input
                                  label="GTGT (%)"
                                  type="number"
                                  value={String((line.input as any).gtgtPercent)}
                                  onChange={(e) =>
                                    updateKaraokeCalculationField(line.id, 'gtgtPercent', parseInt(e.target.value, 10) || 0)
                                  }
                                />
                                <Select
                                  label="Chế độ hiển thị"
                                  value={draft.karaoke.pricingRenderMode}
                                  onChange={(value) =>
                                    updateDraft((current) => ({
                                      ...current,
                                      karaoke: {
                                        ...current.karaoke,
                                        pricingRenderMode: value as 'text' | 'table',
                                      },
                                    }))
                                  }
                                  options={CREATE_CONTRACT_PRICING_RENDER_OPTIONS}
                                />
                              </FieldGrid>
                              <FieldGrid cols={1}>
                                <Input
                                  label="Hỗ trợ tổng (%)"
                                  type="number"
                                  value={String((line.input as any).annualSupportPercent)}
                                  onChange={(e) =>
                                    updateKaraokeCalculationField(line.id, 'annualSupportPercent', parseFloat(e.target.value) || 0)
                                  }
                                />
                              </FieldGrid>
                            </div>
                          )}

                          {/* Karaoke Box inputs */}
                          {line.input.module === 'KARAOKE_BOX' && (
                            <div className="space-y-3">
                              <div className="rounded-lg bg-indigo-50/50 px-3 py-2 text-xs text-indigo-700 ring-1 ring-indigo-600/10">
                                Lấy từ mục 3: {draft.karaoke.totalBoxes} box
                              </div>
                              <FieldGrid cols={3}>
                                <Input
                                  label="Mức lương cơ sở (VND)"
                                  type="number"
                                  value={String((line.input as any).baseSalary)}
                                  onChange={(e) =>
                                    updateKaraokeCalculationField(line.id, 'baseSalary', parseInt(e.target.value, 10) || 0)
                                  }
                                />
                                <Input
                                  label="GTGT (%)"
                                  type="number"
                                  value={String((line.input as any).gtgtPercent)}
                                  onChange={(e) =>
                                    updateKaraokeCalculationField(line.id, 'gtgtPercent', parseInt(e.target.value, 10) || 0)
                                  }
                                />
                                <Select
                                  label="Chế độ hiển thị"
                                  value={draft.karaoke.pricingRenderMode}
                                  onChange={(value) =>
                                    updateDraft((current) => ({
                                      ...current,
                                      karaoke: {
                                        ...current.karaoke,
                                        pricingRenderMode: value as 'text' | 'table',
                                      },
                                    }))
                                  }
                                  options={CREATE_CONTRACT_PRICING_RENDER_OPTIONS}
                                />
                              </FieldGrid>
                            </div>
                          )}

                          {/* Planned modules - placeholder */}
                          {['CAFE', 'NHA_HANG', 'KHACH_SAN'].includes(line.input.module) && (
                            <div className="p-3 rounded-lg bg-amber-50 text-sm text-amber-700">
                              {CALC_MODULE_NOT_IMPLEMENTED_PLACEHOLDER}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Calculate button and result */}
                      {line.enabled && (
                        <div className="ml-7 mt-3 space-y-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<CalculatorIcon className="h-4 w-4" />}
                            onClick={() => handleCalculateLine(line.id)}
                            disabled={
                              isLineCalcLoading[line.id] ||
                              ['CAFE', 'NHA_HANG', 'KHACH_SAN'].includes(line.input.module)
                            }
                          >
                            {isLineCalcLoading[line.id] ? 'Đang tính...' : 'Tính thử'}
                          </Button>

                          {/* Error */}
                          {lineCalcErrors[line.id] && (
                            <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-600/15">
                              {lineCalcErrors[line.id]}
                            </div>
                          )}

                          {/* Result */}
                          {line.result && (
                            <div className="rounded-xl bg-emerald-50/60 p-3 space-y-3 ring-1 ring-emerald-600/10">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`rounded-md px-2 py-1 text-xs font-semibold ${
                                      line.result.errors.length === 0
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-rose-100 text-rose-700'
                                    }`}
                                  >
                                    {line.result.errors.length === 0 ? 'OK' : 'Có lỗi'}
                                  </span>
                                  <span className="text-xs font-medium text-zinc-700">
                                    Preview {getModuleDisplayName(line.calculationModule)}
                                  </span>
                                </div>
                                <span className="text-xs text-zinc-500">
                                  {line.result.termMonths > 0 ? `${line.result.termMonths} tháng` : 'Theo kỳ hợp đồng'}
                                </span>
                              </div>

                              <div className="overflow-hidden rounded-lg bg-white ring-1 ring-emerald-600/15">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-emerald-50 text-[11px] uppercase tracking-wide text-emerald-800">
                                    <tr>
                                      <th className="px-3 py-2 font-semibold">Hạng mục</th>
                                      <th className="px-3 py-2 font-semibold">Diễn giải</th>
                                      <th className="px-3 py-2 text-right font-semibold">Thành tiền</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                                    {line.result.detailRows.length > 0 ? (
                                      line.result.detailRows.map((row, index) => (
                                        <tr key={index}>
                                          <td className="px-3 py-2 font-medium">{row.label}</td>
                                          <td className="px-3 py-2 text-zinc-500">{row.formula || '-'}</td>
                                          <td className="px-3 py-2 text-right font-mono font-medium">
                                            {formatVnd(row.value)}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td className="px-3 py-2 font-medium">{line.label}</td>
                                        <td className="px-3 py-2 text-zinc-500">Kết quả từ API dry-run</td>
                                        <td className="px-3 py-2 text-right font-mono font-medium">
                                          {formatVnd(line.result.subtotalBeforeGtgt)}
                                        </td>
                                      </tr>
                                    )}
                                    <tr className="bg-zinc-50/70">
                                      <td className="px-3 py-2 font-medium">Tiền chưa GTGT</td>
                                      <td className="px-3 py-2 text-zinc-500">
                                        {(line.input as any).annualSupportPercent > 0
                                          ? `Đã áp dụng hỗ trợ tổng ${(line.input as any).annualSupportPercent}%`
                                          : 'Chưa áp dụng hỗ trợ'}
                                      </td>
                                      <td className="px-3 py-2 text-right font-mono font-semibold">
                                        {formatVnd(line.result.subtotalBeforeGtgt)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-3 py-2 font-medium">GTGT</td>
                                      <td className="px-3 py-2 text-zinc-500">
                                        {(line.input as any).gtgtPercent ?? draft.karaoke.gtgtPercent}%
                                      </td>
                                      <td className="px-3 py-2 text-right font-mono">
                                        {formatVnd(line.result.gtgtAmount)}
                                      </td>
                                    </tr>
                                    <tr className="bg-emerald-50 text-emerald-900">
                                      <td className="px-3 py-2 font-bold">Tổng cộng</td>
                                      <td className="px-3 py-2 text-emerald-700">
                                        {line.result.termMonths === 6 ? 'Hiển thị thêm số tiền hiệu lực 6 tháng bên dưới' : 'Đủ kỳ'}
                                      </td>
                                      <td className="px-3 py-2 text-right font-mono font-bold">
                                        {formatVnd(line.result.totalAmount)}
                                      </td>
                                    </tr>
                                    {line.result.termMonths === 6 && (
                                      <tr className="bg-emerald-50/60 text-emerald-900">
                                        <td className="px-3 py-2 font-bold">Hiệu lực 6 tháng</td>
                                        <td className="px-3 py-2 text-emerald-700">Số tiền áp dụng cho thời hạn hợp đồng</td>
                                        <td className="px-3 py-2 text-right font-mono font-bold">
                                          {formatVnd(line.result.effectiveTotalAmount)}
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              <div className="rounded-lg bg-white/70 px-3 py-2 text-[11px] text-zinc-600 ring-1 ring-emerald-600/10">
                                Hỗ trợ chỉ áp dụng theo tổng phần trăm. Không chia hỗ trợ theo bậc phòng để đúng ND 17.
                              </div>

                              {/* Warnings */}
                              {line.result.warnings.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {line.result.warnings.map((w, i) => (
                                    <div key={i} className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                                      {w.message}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Aggregation summary */}
                  {draft.calculationLines.length > 0 && (
                    <div className="rounded-lg bg-indigo-50 p-4">
                      <h4 className="text-sm font-semibold text-indigo-900 mb-2">
                        Tổng hợp ({draft.calculationLines.length} khoản tính)
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-indigo-700">Đã tính</span>
                          <span className="font-semibold">
                            {calcLinesAggregation.calculatedLineCount}/{calcLinesAggregation.enabledLineCount} khoản
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-700">Tổng tiền chưa GTGT</span>
                          <span className="font-mono font-semibold">
                            {calcLinesAggregation.subtotalBeforeGtgt.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-700">Tổng GTGT</span>
                          <span className="font-mono">
                            {calcLinesAggregation.gtgtAmount.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-indigo-600/10 pt-2">
                          <span className="font-semibold text-indigo-900">Tổng cộng</span>
                          <span className="font-mono font-bold text-indigo-900">
                            {calcLinesAggregation.totalAmount.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>
                      {calcLinesAggregation.warnings.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {calcLinesAggregation.warnings.map((w, i) => (
                            <div key={i} className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                              {w.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormSection>

          {/* =================================================================== */}
          {/* SECTION 5: PREFLIGHT / CHƯA GHI DỮ LIỆU */}
          {/* Validation & dry-run results */}
          {/* =================================================================== */}
          <FormSection
            title="5. Preflight / Chưa ghi dữ liệu"
            description="Kiểm tra hợp lệ và dry-run endpoint"
          >
            <div className="space-y-4">
              {/* Validation issues */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-2">
                  Kiểm tra form
                </h4>
                {validationIssues.length === 0 ? (
                  <p className="text-sm text-emerald-700">
                    Form hiện không có lỗi bắt buộc.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {validationIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg px-3 py-2 text-xs ring-1 ${
                          issue.severity === 'error'
                            ? 'bg-rose-50 text-rose-700 ring-rose-600/15'
                            : 'bg-amber-50 text-amber-700 ring-amber-600/15'
                        }`}
                      >
                        <span className="font-semibold">{issue.field}</span> ·{' '}
                        {issue.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dry-run button */}
              <Button
                variant="secondary"
                onClick={handleDryRun}
                disabled={blockingErrors.length > 0 || isDryRunLoading}
              >
                {isDryRunLoading ? 'Đang kiểm tra...' : 'Chạy dry-run'}
              </Button>

              {dryRunError && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-600/15">
                  {dryRunError}
                </div>
              )}

              {makeHdError && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-600/15">
                  {makeHdError}
                </div>
              )}

              {/* Dry-run result */}
              {dryRunResult && (
                <div className="space-y-3 rounded-lg bg-white p-3 ring-1 ring-zinc-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        dryRunResult.ok
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15'
                          : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/15'
                      }`}
                    >
                      {dryRunResult.ok ? 'Dry-run OK' : 'Dry-run có lỗi'}
                    </span>
                    <span className="rounded-md bg-zinc-50 px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-200">
                      can_create:{' '}
                      {dryRunResult.can_create ? 'true' : 'false'}
                    </span>
                    <span className="rounded-md bg-zinc-50 px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-200">
                      write_performed:{' '}
                      {dryRunResult.write_performed ? 'true' : 'false'}
                    </span>
                  </div>

                  {/* Errors */}
                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-2">
                      Errors
                    </h5>
                    {dryRunResult.errors.length === 0 ? (
                      <p className="text-xs text-emerald-700">
                        Không có lỗi backend.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {dryRunResult.errors.map((err, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 ring-1 ring-rose-600/15"
                          >
                            <span className="font-semibold">{err.field}</span> ·{' '}
                            {err.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Warnings */}
                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500 mb-2">
                      Warnings
                    </h5>
                    {dryRunResult.warnings.length === 0 ? (
                      <p className="text-xs text-emerald-700">
                        Không có cảnh báo backend.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {dryRunResult.warnings.map((warn, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 ring-1 ring-amber-600/15"
                          >
                            <span className="font-semibold">{warn.field}</span> ·{' '}
                            {warn.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Duplicate */}
                  <div className="rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-zinc-200">
                    <h5 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
                      Duplicate check
                    </h5>
                    <p className="mt-1 text-xs text-zinc-700">
                      contract_no_exists:{' '}
                      {dryRunResult.duplicate_checks.contract_no_exists
                        ? 'true'
                        : 'false'}
                    </p>
                  </div>

                  {/* Normalized payload */}
                  <details className="rounded-lg bg-zinc-50 ring-1 ring-zinc-200">
                    <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-zinc-700">
                      Xem normalized payload
                    </summary>
                    <pre className="max-h-72 overflow-auto border-t border-zinc-200 p-3 text-xs leading-relaxed text-zinc-700">
                      {JSON.stringify(dryRunResult.normalized, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {/* Make contract: create clone row and export Word */}
              <div className="space-y-3 rounded-xl bg-zinc-950 px-4 py-4 text-sm text-white shadow-sm shadow-zinc-950/10">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">Làm HĐ</p>
                    <p className="mt-1 text-xs text-zinc-300">
                      Tạo HĐ trên DB clone rồi xuất file Word. Không cần dry-run.
                    </p>
                  </div>
                  <Button
                    variant="glassPrimary"
                    size="lg"
                    onClick={handleMakeContract}
                    disabled={!canRunMakeContract}
                    title="Tao HD tren DB clone va xuat Word preview"
                  >
                    {isMakeHdLoading ? 'Đang Làm HĐ...' : 'Làm HĐ'}
                  </Button>
                </div>
              </div>

              {(cloneCreateResult?.created || wordPreviewResult) && (
                <div className="space-y-4 rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-950 ring-1 ring-emerald-600/15">
                  <div>
                    <p className="font-semibold">Hợp đồng đã tạo trên DB clone</p>
                    <p className="mt-1 text-xs text-emerald-800">
                      Đã tạo hợp đồng và xuất file Word Karaoke.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                        Số hợp đồng
                      </p>
                      <p className="font-mono font-semibold">
                        {cloneCreateResult?.created?.contract_no || '(chưa có)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                        Contract ID
                      </p>
                      <p className="font-mono font-semibold">
                        {cloneCreateResult?.created?.id ?? '(chưa có)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                        Status
                      </p>
                      <p className="font-semibold">
                        {cloneCreateResult?.mode || '(chưa có)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                        DB
                      </p>
                      <p className="font-mono font-semibold">
                        {cloneCreateResult?.created?.db_name || 'vcpmc_contract (DB chinh)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                        write_performed
                      </p>
                      <p className="font-mono font-semibold">
                        {cloneCreateResult?.write_performed ? 'true' : 'false'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                        File size
                      </p>
                      <p className="font-mono font-semibold">
                        {wordPreviewResult?.file_size
                          ? `${(wordPreviewResult.file_size / 1024).toFixed(1)} KB`
                          : '(chưa có)'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                      Word path
                    </p>
                    <p className="mt-1 break-all rounded-lg bg-white px-3 py-2 font-mono text-xs text-emerald-950 ring-1 ring-emerald-600/15">
                      {wordPreviewResult?.preview_path || '(chưa có file Word)'}
                    </p>
                  </div>

                  <p className="text-xs">
                    official_export:{' '}
                    <span className="font-mono font-semibold">
                      {wordPreviewResult?.official_export ? 'true' : 'false'}
                    </span>{' '}
                    · db_write_performed render:{' '}
                    <span className="font-mono font-semibold">
                      {wordPreviewResult?.db_write_performed ? 'true' : 'false'}
                    </span>{' '}
                    · docx_path_attached:{' '}
                    <span className="font-mono font-semibold">
                      {wordPreviewResult?.docx_path_attached ? 'true' : 'false'}
                    </span>
                  </p>

                  {cloneCreateResult?.dry_run?.warnings?.length ? (
                    <div className="space-y-1">
                      {cloneCreateResult.dry_run.warnings.map((warn, index) => (
                        <p
                          key={index}
                          className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-800 ring-1 ring-amber-600/15"
                        >
                          <span className="font-semibold">{warn.field}</span> ·{' '}
                          {warn.message}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {wordPreviewResult?.warnings.length ? (
                    <div className="space-y-1">
                      {wordPreviewResult.warnings.map((warning, index) => (
                        <p
                          key={index}
                          className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-800 ring-1 ring-amber-600/15"
                        >
                          {warning}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Clone-only create and Word preview */}
              {CLONE_ONLY_CREATE_ENABLED && (
                <div className="space-y-3 rounded-xl bg-amber-50 px-3 py-3 text-sm text-amber-900 ring-1 ring-amber-600/15">
                  <div>
                    <p className="font-semibold">Tạo hợp đồng trên DB clone</p>
                    <p className="mt-1 text-xs">
                      Chỉ ghi DB clone, chưa xuất chính thức, chưa tạo GCN.
                      Phase này chỉ bật luồng Karaoke.
                    </p>
                  </div>

                  {cloneCreateIdempotencyKey && (
                    <p className="text-xs text-amber-700">
                      Idempotency key đã sẵn sàng.
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleCloneOnlyCreate}
                      disabled={!canRunCloneOnlyCreate || isCloneCreateLoading}
                    >
                      {isCloneCreateLoading
                        ? 'Đang tạo...'
                        : 'Tạo hợp đồng trên DB clone'}
                    </Button>
                    <span className="text-xs text-amber-700">
                      Bắt buộc dry-run OK trước khi nút này mở.
                      {!isKaraokeDomain && ' Chỉ hỗ trợ Karaoke ở phase này.'}
                    </span>
                  </div>

                  {cloneCreateError && (
                    <p className="rounded-md bg-rose-50 px-2 py-1 text-xs text-rose-700 ring-1 ring-rose-600/15">
                      {cloneCreateError}
                    </p>
                  )}

                  {cloneCreateResult?.created && (
                    <div className="space-y-3 rounded-lg bg-emerald-50 px-3 py-3 text-xs text-emerald-900 ring-1 ring-emerald-600/15">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                            contract_id
                          </p>
                          <p className="font-mono font-semibold">
                            {cloneCreateResult.created?.id ?? '(chưa có)'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                            contract_no
                          </p>
                          <p className="font-mono font-semibold">
                            {cloneCreateResult.created?.contract_no ?? '(chưa có)'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                            status
                          </p>
                          <p className="font-semibold">{cloneCreateResult.mode}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-700">
                            database
                          </p>
                          <p className="font-mono font-semibold">
                            {cloneCreateResult.created.db_name || 'Backend chưa trả về'}
                          </p>
                        </div>
                      </div>
                      <p>
                        write_performed:{' '}
                        <span className="font-mono font-semibold">
                          {cloneCreateResult.write_performed ? 'true' : 'false'}
                        </span>{' '}
                        · official_export:{' '}
                        <span className="font-mono font-semibold">false</span> ·
                        GCN:{' '}
                        <span className="font-mono font-semibold">false</span>
                      </p>
                      {cloneCreateResult?.dry_run?.warnings?.length > 0 && (
                        <div className="space-y-1">
                          {cloneCreateResult.dry_run.warnings.map((warn, index) => (
                            <p
                              key={index}
                              className="rounded bg-amber-50 px-2 py-1 text-amber-800 ring-1 ring-amber-600/15"
                            >
                              <span className="font-semibold">{warn.field}</span> ·{' '}
                              {warn.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {cloneCreateResult?.created && (
                    <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-amber-600/15">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="primary"
                          onClick={handleCreateWordPreview}
                          disabled={!canRunWordPreview}
                        >
                          {isWordPreviewLoading
                            ? 'Đang tạo preview...'
                            : 'Tạo Word preview'}
                        </Button>
                        <span className="text-xs text-zinc-600">
                          File preview để kiểm tra layout, chưa ghi DB, chưa xuất chính thức.
                        </span>
                      </div>

                      {wordPreviewError && (
                        <p className="mt-2 rounded-md bg-rose-50 px-2 py-1 text-xs text-rose-700 ring-1 ring-rose-600/15">
                          {wordPreviewError}
                        </p>
                      )}

                      {wordPreviewResult && (
                        <div className="mt-3 space-y-2 rounded-lg bg-zinc-50 px-3 py-3 text-xs text-zinc-700 ring-1 ring-zinc-200">
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">
                                word_path
                              </p>
                              <p className="break-all font-mono">
                                {wordPreviewResult.preview_path || '(không có)'}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">
                                file_size
                              </p>
                              <p className="font-mono font-semibold">
                                {wordPreviewResult.file_size
                                  ? `${(wordPreviewResult.file_size / 1024).toFixed(1)} KB`
                                  : '0 KB'}
                              </p>
                            </div>
                          </div>
                          <p>
                            official_export:{' '}
                            <span className="font-mono font-semibold">
                              {wordPreviewResult.official_export ? 'true' : 'false'}
                            </span>{' '}
                            · db_write_performed:{' '}
                            <span className="font-mono font-semibold">
                              {wordPreviewResult.db_write_performed ? 'true' : 'false'}
                            </span>{' '}
                            · docx_path_attached:{' '}
                            <span className="font-mono font-semibold">
                              {wordPreviewResult.docx_path_attached ? 'true' : 'false'}
                            </span>
                          </p>
                          {wordPreviewResult.warnings.length > 0 && (
                            <div className="space-y-1">
                              {wordPreviewResult.warnings.map((warning, index) => (
                                <p
                                  key={index}
                                  className="rounded bg-amber-50 px-2 py-1 text-amber-800 ring-1 ring-amber-600/15"
                                >
                                  {warning}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* DB target hints */}
              <details className="rounded-lg bg-zinc-50 ring-1 ring-zinc-200">
                <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-zinc-700">
                  Gợi ý cột DB (tham khảo)
                </summary>
                <div className="border-t border-zinc-200 p-3 space-y-2">
                  {CONTRACT_CREATE_DB_TARGET_HINTS.map((hint, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-white px-3 py-2 ring-1 ring-zinc-200"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-zinc-900">
                          {hint.field}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.08em] text-zinc-500">
                          {hint.risk}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-600">
                        {hint.dbTable}.{hint.dbColumn} · {hint.note}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </FormSection>

          {/* =================================================================== */}
          {/* FOOTER ACTIONS */}
          {/* =================================================================== */}
          <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-zinc-50/95 backdrop-blur-sm border-t border-zinc-200 flex items-center gap-3">
            <Button
              variant="ghost"
              leftIcon={<XIcon className="h-4 w-4" />}
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <div className="flex-1" />
            <span className="hidden md:inline text-xs text-amber-700">
              {SAFETY_NOTE}
            </span>
            <Button
              variant="primary"
              size="lg"
              onClick={handleMakeContract}
              disabled={!canRunMakeContract}
              title="Tao HD tren DB clone va xuat Word preview"
            >
              {isMakeHdLoading ? 'Đang Làm HĐ...' : 'Làm HĐ'}
            </Button>
            <Button variant="secondary" onClick={handleSaveDraft}>
              Lưu nháp cục bộ
            </Button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SIDEBAR: SUMMARY */}
        {/* =================================================================== */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Contract summary */}
            <div className="rounded-xl bg-white p-4 ring-1 ring-zinc-200">
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">
                Tóm tắt hợp đồng
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Số HĐ</span>
                  <span className="font-mono font-semibold">
                    {contractNoPreview || '(chưa có)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Đối tác</span>
                  <span className="truncate max-w-[150px]">
                    {draft.customer.legalName || '(chưa có)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Bảng hiệu</span>
                  <span className="truncate max-w-[150px]">
                    {draft.customer.brandName || '(chưa có)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Lĩnh vực</span>
                  <span>{draft.domain.domainDisplayName || '(chưa chọn)'}</span>
                </div>
                {isKaraokeDomain && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Phòng/Box</span>
                    <span>
                      {draft.karaoke.karaokeType === 'PHONG'
                        ? `${draft.karaoke.totalRooms} phòng`
                        : `${draft.karaoke.totalBoxes} box`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-600">Thời hạn</span>
                  <span>
                    {draft.term.effectiveFrom
                      ? `${draft.term.effectiveFrom} → ${draft.term.effectiveTo}`
                      : '(chưa có)'}
                  </span>
                </div>
                {calcLinesAggregation.calculatedLineCount > 0 && (
                  <div className="pt-2 border-t border-zinc-200 flex justify-between">
                    <span className="font-semibold text-zinc-900">
                      Tổng tiền ({calcLinesAggregation.calculatedLineCount} khoản)
                    </span>
                    <span className="font-mono font-bold text-emerald-700">
                      {calcLinesAggregation.effectiveTotalAmount > 0
                        ? calcLinesAggregation.effectiveTotalAmount.toLocaleString('vi-VN')
                        : calcLinesAggregation.totalAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="rounded-xl bg-white p-4 ring-1 ring-zinc-200">
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">
                Checklist
              </h3>
              <div className="space-y-2">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        item.completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-zinc-200 text-zinc-500'
                      }`}
                    >
                      {item.completed ? '✓' : '·'}
                    </span>
                    <span
                      className={`text-xs ${
                        item.completed ? 'text-emerald-700' : 'text-zinc-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety note */}
            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-amber-600/15">
              <p className="font-semibold">Lưu ý:</p>
              <ul className="mt-1 space-y-1">
                <li>• Chưa ghi dữ liệu</li>
                <li>• Số HĐ là USER INPUT</li>
                <li>• Không tạo GCN/DOCX</li>
                <li>• Media/SCTT đang khóa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}


