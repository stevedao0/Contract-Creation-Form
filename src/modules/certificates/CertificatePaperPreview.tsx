import {
  GCN_BOTTOM_ANCHOR_LAYOUTS,
  GCN_LOCKED_OFFSET,
  GCN_MID_BLOCK_LAYOUTS,
  GCN_QR_LAYOUT,
  GCN_TOP_BLOCK_LAYOUTS,
} from './certificateLayoutLocked';
import type { CertificateAlign, CertificateFieldLayout, CertificatePreviewData, CertificatePrintMode } from './certificateTypes';
import './certificatePrint.css';

const textByKey = (certificate: CertificatePreviewData, key: keyof CertificatePreviewData) => {
  return String(certificate[key] || '');
};

const formatDate = (raw: string) => {
  const value = String(raw || '').trim();
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  return value;
};

const issueDateParts = (certificate: CertificatePreviewData) => {
  const direct = {
    day: String(certificate.certificate_issue_day || '').trim(),
    month: String(certificate.certificate_issue_month || '').trim(),
    year: String(certificate.certificate_issue_year || '').trim(),
  };
  if (direct.day && direct.month && direct.year) {
    return {
      day: direct.day.padStart(2, '0'),
      month: direct.month.padStart(2, '0'),
      year: direct.year,
    };
  }
  const raw = String(certificate.certificate_issue_date || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [year, month, day] = raw.split('-');
    return { day, month, year };
  }
  return { day: '', month: '', year: '' };
};

const textAlignClass = (align: CertificateAlign) => {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
};

type CertificatePaperPreviewProps = {
  certificate: CertificatePreviewData;
  showSafeArea?: boolean;
  showCoordinates?: boolean;
  mode?: CertificatePrintMode;
};

export function CertificatePaperPreview({
  certificate,
  showSafeArea = false,
  showCoordinates = false,
  mode = 'screen',
}: CertificatePaperPreviewProps) {
  const offsetX = mode === 'print' ? 0 : Number(certificate.offset_x_mm ?? GCN_LOCKED_OFFSET.defaultXmm);
  const offsetY = mode === 'print' ? 0 : Number(certificate.offset_y_mm ?? GCN_LOCKED_OFFSET.defaultYmm);
  const contractNo = String(certificate.contract_no || '').trim();
  const contractNoFontSize = contractNo.length > 36 ? 11.5 : 12.5;
  const issueParts = issueDateParts(certificate);
  const anchorTextByKey: Record<string, string> = {
    contract_no: contractNo,
    effective_from: formatDate(certificate.effective_from || ''),
    effective_to: formatDate(certificate.effective_to || ''),
    certificate_issue_day: issueParts.day,
    certificate_issue_month: issueParts.month,
    certificate_issue_year: issueParts.year,
    certificate_no: String(certificate.certificate_no || '').trim(),
  };

  const boxStyle = (x: number, y: number, width: number, height: number) => ({
    left: `${x + offsetX}mm`,
    top: `${y + offsetY}mm`,
    width: `${width}mm`,
    minHeight: `${height}mm`,
  });

  const renderField = (field: CertificateFieldLayout) => {
    const isScope = field.key.startsWith('gcn_scope_col_');
    const isScope1 = field.key === 'gcn_scope_col_1_text';
    return (
      <div
        key={field.key}
        className={`gcn-locked-field ${textAlignClass(field.align)} ${showSafeArea ? 'outline outline-1 outline-sky-300/70' : ''}`}
        style={{
          ...boxStyle(field.x, field.y, field.width, field.height),
          fontSize: `${field.fontSize}pt`,
          lineHeight: isScope1 ? '1.15' : isScope ? '1.1' : '1.15',
          fontWeight: field.bold ? 700 : 400,
        }}
      >
        {textByKey(certificate, field.key)}
        {showCoordinates ? <span className="gcn-locked-coordinate-tag">{field.x},{field.y}</span> : null}
      </div>
    );
  };

  const qrImageData = String(certificate.qr_image_data || '').trim();

  return (
    <div className={`gcn-locked-paper-preview ${mode === 'print' ? 'gcn-locked-paper-preview--print' : 'gcn-locked-paper-preview--screen'}`}>
      <div className={mode === 'print' ? 'gcn-locked-paper-shell--print' : 'gcn-locked-paper-shell--screen'}>
        <div className={`gcn-locked-paper ${mode === 'print' ? 'gcn-locked-paper--print' : 'gcn-locked-paper--screen'}`}>
          {[...GCN_TOP_BLOCK_LAYOUTS, ...GCN_MID_BLOCK_LAYOUTS].map(renderField)}

          {GCN_BOTTOM_ANCHOR_LAYOUTS.map((field) => (
            <div
              key={field.key}
              className={`gcn-locked-bottom-anchor ${textAlignClass(field.align)} ${showSafeArea ? 'outline outline-1 outline-sky-300/70' : ''}`}
              style={{
                ...boxStyle(field.x, field.y, field.width, field.height),
                fontSize: `${field.key === 'contract_no' ? contractNoFontSize : field.fontSize}pt`,
                fontWeight: field.bold ? 700 : 400,
              }}
            >
              <span>{anchorTextByKey[field.key] || ''}</span>
              {showCoordinates ? <span className="gcn-locked-coordinate-tag">{field.x},{field.y}</span> : null}
            </div>
          ))}

          <div
            className={`gcn-locked-qr-field ${showSafeArea ? 'outline outline-1 outline-sky-300/70' : ''}`}
            style={boxStyle(GCN_QR_LAYOUT.x, GCN_QR_LAYOUT.y, GCN_QR_LAYOUT.width, GCN_QR_LAYOUT.height)}
          >
            {qrImageData ? (
              <img src={qrImageData} alt="QR code" className="gcn-locked-qr-image" />
            ) : (
              <div className="gcn-locked-qr-placeholder">QR</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

