import {
  VerificationResult,
  VerificationHistoryItem,
  DashboardStats,
  DemoScenarioInfo,
  ModelMetrics,
  Notification,
  VerificationSettings,
  PipelineStep,
  ReferenceRecord,
  TravelerProfile,
  DocumentComparisonPair,
} from '@/types';

// ─── Demo Scenarios ─────────────────────────────────────────────────────────

export const demoScenarios: DemoScenarioInfo[] = [
  {
    id: 'genuine',
    name: 'Genuine Passport (Cleared)',
    description: 'A valid, authentic passport with matching selfie, 0 tampering, and verified reference record.',
    icon: '🛡️',
    riskLevel: 'low',
  },
  {
    id: 'tampered',
    name: 'Tampered National ID',
    description: 'A digitally altered ID card with font injection, inpainting around name, and DOB modification.',
    icon: '🔴',
    riskLevel: 'high',
  },
  {
    id: 'face_mismatch',
    name: 'Biometric Face Mismatch',
    description: 'Authentic driving licence presented with an imposter selfie that fails biometric cosine threshold.',
    icon: '⚠️',
    riskLevel: 'review',
  },
  {
    id: 'expired',
    name: 'Expired Travel Credential',
    description: 'An authentic Australian passport that expired 2+ years ago with expired registry record.',
    icon: '📅',
    riskLevel: 'review',
  },
  {
    id: 'high_risk',
    name: 'Full Synthetic Forgery',
    description: 'Completely fabricated Spanish DNI card with fake security holograms and invalid registry ID.',
    icon: '🚨',
    riskLevel: 'high',
  },
];

// ─── Mock Verification Results with Rich Forensic Data ──────────────────────

export const mockVerificationResults: Record<string, VerificationResult> = {
  'vrf-001': {
    id: 'vrf-001',
    status: 'completed',
    createdAt: '2026-08-31T10:30:00Z',
    completedAt: '2026-08-31T10:30:45Z',
    document: {
      id: 'doc-001',
      type: 'passport',
      fileName: 'us_passport_sarah_johnson.jpg',
      fileSize: 2_400_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T10:30:00Z',
    },
    selfie: {
      id: 'self-001',
      type: 'other',
      fileName: 'selfie_sarah_johnson.jpg',
      fileSize: 1_800_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T10:30:05Z',
    },
    ocr: {
      fields: [
        { fieldName: 'Full Name', value: 'SARAH JOHNSON', confidence: 0.99, boundingBox: { x: 38, y: 32, width: 32, height: 6 }, category: 'identity' },
        { fieldName: 'Date of Birth', value: '1990-05-14', confidence: 0.98, boundingBox: { x: 38, y: 41, width: 20, height: 5 }, category: 'dates' },
        { fieldName: 'Document Number', value: 'P12345678', confidence: 0.99, boundingBox: { x: 70, y: 16, width: 22, height: 6 }, category: 'document' },
        { fieldName: 'Nationality', value: 'UNITED STATES', confidence: 0.98, boundingBox: { x: 38, y: 50, width: 24, height: 5 }, category: 'identity' },
        { fieldName: 'Expiry Date', value: '2030-05-13', confidence: 0.99, boundingBox: { x: 38, y: 59, width: 20, height: 5 }, category: 'dates' },
        { fieldName: 'Issue Date', value: '2020-05-14', confidence: 0.97, boundingBox: { x: 38, y: 68, width: 20, height: 5 }, category: 'dates' },
        { fieldName: 'Sex', value: 'F', confidence: 0.99, boundingBox: { x: 70, y: 41, width: 8, height: 5 }, category: 'identity' },
        { fieldName: 'Place of Birth', value: 'NEW YORK', confidence: 0.96, boundingBox: { x: 70, y: 50, width: 18, height: 5 }, category: 'identity' },
      ],
      rawText: 'PASSPORT\nUNITED STATES OF AMERICA\nP<USAJOHNSON<<SARAH<<<<<<<<<<<<<<<<<<<<<<<<<<<\nP123456780USA9005142F3005138<<<<<<<<<<<<<<<06',
      overallConfidence: 0.985,
      processingTimeMs: 1100,
    },
    validation: {
      checks: [
        { id: 'vc-1', name: 'ICAO Doc 9303 Compliance', description: 'Standard machine-readable travel document structure', status: 'pass', confidence: 0.99 },
        { id: 'vc-2', name: 'MRZ Checksum Validation', description: 'Lines 1 & 2 cross-digit parity verification', status: 'pass', confidence: 1.0 },
        { id: 'vc-3', name: 'Expiry Integrity', description: 'Valid for 3+ years beyond mandatory 6-month border rule', status: 'pass', confidence: 1.0 },
        { id: 'vc-4', name: 'Font & Microprint Consistency', description: 'Uniform typography with OCR-B standard compliance', status: 'pass', confidence: 0.97 },
        { id: 'vc-5', name: 'Security Features & Hologram', description: 'UV thread and guilloche pattern clarity', status: 'pass', confidence: 0.94 },
      ],
      overallStatus: 'pass',
      score: 98,
    },
    tampering: {
      isTampered: false,
      confidence: 0.97,
      score: 96,
      regions: [],
      techniques: [],
      explanation: 'No digital manipulation, copy-move artifacts, or font splice anomalies detected. Noise spectrum is uniform across the credential surface.',
    },
    faceVerification: {
      isMatch: true,
      similarity: 0.96,
      threshold: 0.80,
      score: 96,
      livenessScore: 0.98,
      faceLandmarksDetected: true,
      explanation: 'Biometric face cosine match is exceptionally high (0.96 vs 0.80 threshold). Passive liveness confirmed natural depth and gaze.',
    },
    reference: {
      isVerified: true,
      matchScore: 0.99,
      score: 99,
      referenceRecord: {
        id: 'ref-001',
        fullName: 'SARAH JOHNSON',
        documentNumber: 'P12345678',
        dateOfBirth: '1990-05-14',
        issuingAuthority: 'US Department of State',
        issueDate: '2020-05-14',
        expiryDate: '2030-05-13',
        status: 'active',
        nationality: 'USA',
      },
      discrepancies: [],
      explanation: 'Full concordance with Department of State registry. Passport is confirmed active with zero alert notices.',
    },
    risk: {
      overallScore: 8,
      riskLevel: 'low',
      primaryRiskFactor: 'None — All authentication vectors within clean tolerances.',
      signals: [
        { name: 'Tampering Detection', score: 96, weight: 0.30, status: 'low', contributorPercent: 2, explanation: 'Pixel integrity intact' },
        { name: 'Face Verification', score: 96, weight: 0.25, status: 'low', contributorPercent: 1, explanation: 'High biometric alignment' },
        { name: 'Document Validation', score: 98, weight: 0.20, status: 'low', contributorPercent: 1, explanation: 'MRZ checksum confirmed' },
        { name: 'Authority Registry', score: 99, weight: 0.15, status: 'low', contributorPercent: 1, explanation: 'Active passport record' },
        { name: 'Metadata & EXIF', score: 95, weight: 0.10, status: 'low', contributorPercent: 3, explanation: 'Camera capture metadata clean' },
      ],
      recommendation: 'CLEAR — Document exhibits authentic institutional characteristics. Immediate automated border clearance recommended.',
      aiExplanation: 'The document passed all 8 inspection layers with high confidence scores. Physical structure adheres to ICAO Doc 9303 standards, MRZ checksums are mathematically valid, and biometric facial vectors align seamlessly with the live capture.',
    },
    flags: [],
    timeline: [
      { id: 'tm-1', stage: 'Upload & Ingestion', title: 'File Received & Hash Generated', timestamp: '10:30:00.120', durationMs: 120, status: 'passed', details: 'SHA-256: 8f9b...a1c; 300 DPI Color RGB verified.', engineVersion: 'v2.8' },
      { id: 'tm-2', stage: 'Preprocessing', title: 'Perspective Deskew & Shadow Removal', timestamp: '10:30:00.310', durationMs: 190, status: 'passed', details: 'Geometry normalized; contrast ratio adjusted for neural OCR.', engineVersion: 'v3.1' },
      { id: 'tm-3', stage: 'Multi-Modal OCR', title: 'Neural OCR & MRZ Parsing', timestamp: '10:30:01.450', durationMs: 1140, status: 'passed', details: '8/8 fields extracted with average 98.5% neural confidence.', engineVersion: 'v4.0.2' },
      { id: 'tm-4', stage: 'Format & MRZ Validation', title: 'ICAO Checksum & Expiry Checks', timestamp: '10:30:02.100', durationMs: 650, status: 'passed', details: 'All 3 check digits validated; expiry 2030 confirmed active.', engineVersion: 'v1.9' },
      { id: 'tm-5', stage: 'Tamper & ELA Scan', title: 'High-Frequency Noise & Splice Scan', timestamp: '10:30:03.250', durationMs: 1150, status: 'passed', details: 'No inpainting, copy-move, or font alterations found.', engineVersion: 'v2.3.1' },
      { id: 'tm-6', stage: 'Biometric 1:1 Match', title: 'Facial Landmark Cosine Alignment', timestamp: '10:30:04.400', durationMs: 1150, status: 'passed', details: 'Similarity: 0.96 vs 0.80 baseline; liveness score: 0.98.', engineVersion: 'v3.1.0' },
      { id: 'tm-7', stage: 'Authority Cross-Check', title: 'Department of State Registry Query', timestamp: '10:30:05.100', durationMs: 700, status: 'passed', details: 'Passport confirmed active and valid with zero Interpol flags.', engineVersion: 'v2.0' },
      { id: 'tm-8', stage: 'Risk Fusion', title: 'Multi-Signal Fusion Synthesis', timestamp: '10:30:05.520', durationMs: 420, status: 'passed', details: 'Overall Risk Score computed: 8/100 (CLEAR).', engineVersion: 'v1.8.0' },
    ],
    officerDecision: {
      verdict: 'approve',
      officerId: 'OFFICER-7741',
      officerName: 'Inspector David Vance',
      notes: 'Automated clearance verified. Biometrics and passport records fully matched.',
      decidedAt: '2026-08-31T10:31:00Z',
      aiRecommendation: 'CLEAR',
    },
    travelerProfileId: 'TRV-88210',
  },

  'vrf-002': {
    id: 'vrf-002',
    status: 'completed',
    createdAt: '2026-08-31T11:15:00Z',
    completedAt: '2026-08-31T11:15:38Z',
    document: {
      id: 'doc-002',
      type: 'gov_id',
      fileName: 'uk_national_id_tampered.jpg',
      fileSize: 1_900_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T11:15:00Z',
    },
    selfie: {
      id: 'self-002',
      type: 'other',
      fileName: 'selfie_john_smith.jpg',
      fileSize: 1_600_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T11:15:03Z',
    },
    ocr: {
      fields: [
        { fieldName: 'Full Name', value: 'JOHN SMITH', confidence: 0.85, boundingBox: { x: 32, y: 28, width: 36, height: 8 }, category: 'identity', isSuspicious: true },
        { fieldName: 'Date of Birth', value: '1985-11-22', confidence: 0.74, boundingBox: { x: 32, y: 40, width: 26, height: 7 }, category: 'dates', isSuspicious: true },
        { fieldName: 'Document Number', value: 'ID-7891011', confidence: 0.93, boundingBox: { x: 68, y: 18, width: 24, height: 6 }, category: 'document' },
        { fieldName: 'Nationality', value: 'UNITED KINGDOM', confidence: 0.94, boundingBox: { x: 32, y: 52, width: 28, height: 6 }, category: 'identity' },
        { fieldName: 'Expiry Date', value: '2028-11-21', confidence: 0.89, boundingBox: { x: 32, y: 62, width: 22, height: 6 }, category: 'dates' },
      ],
      rawText: 'NATIONAL IDENTITY CARD\nUNITED KINGDOM\nJOHN SMITH\n1985-11-22\nID-7891011',
      overallConfidence: 0.87,
      processingTimeMs: 1450,
    },
    validation: {
      checks: [
        { id: 'vc-1', name: 'Template Layout Integrity', description: 'Standard UK National ID template geometry', status: 'warning', confidence: 0.74, details: 'Minor misalignment in card header banner' },
        { id: 'vc-2', name: 'Barcode Integrity', description: 'Embedded 2D PDF417 barcode decoding', status: 'pass', confidence: 0.92 },
        { id: 'vc-3', name: 'Expiry Date Status', description: 'Document validity window', status: 'pass', confidence: 1.0 },
        { id: 'vc-4', name: 'Font Consistency & Kerning', description: 'Micro-typography across text baseline', status: 'fail', confidence: 0.89, details: 'Inconsistent kerning and anti-aliasing in Name and DOB rows' },
        { id: 'vc-5', name: 'Watermark & Guilloche Grid', description: 'Sub-surface security background lines', status: 'warning', confidence: 0.61, details: 'Disrupted background wave pattern beneath holder name' },
      ],
      overallStatus: 'fail',
      score: 46,
    },
    tampering: {
      isTampered: true,
      confidence: 0.93,
      score: 18,
      regions: [
        { id: 'reg-1', x: 32, y: 28, width: 36, height: 8, type: 'Text Inpainting / Modification', confidence: 0.94, category: 'text_manipulation', description: 'Original text "JANE SMITH" wiped via clone-stamp and replaced with "JOHN SMITH". Compression noise discontinuity detected.', severity: 'high' },
        { id: 'reg-2', x: 32, y: 40, width: 26, height: 7, type: 'Date Modification', confidence: 0.88, category: 'text_manipulation', description: 'Date of birth altered from 1985-03-15 to 1985-11-22 with mismatched font weights.', severity: 'high' },
        { id: 'reg-3', x: 8, y: 25, width: 22, height: 35, type: 'Photo Boundary Splice', confidence: 0.82, category: 'photo_boundary', description: 'Microscopic edge feathering along photograph boundary suggests photo replacement.', severity: 'medium' },
      ],
      techniques: ['Error Level Analysis (ELA) anomaly', 'Copy-Move text injection', 'Guilloche disruption'],
      explanation: 'High-confidence digital tampering detected. Error Level Analysis (ELA) reveals severe compression artifact disruption over the primary name and DOB fields. The document appears to have been digitally forged.',
    },
    faceVerification: {
      isMatch: true,
      similarity: 0.87,
      threshold: 0.80,
      score: 87,
      livenessScore: 0.91,
      explanation: 'Selfie matches the document photograph, but the document photo itself exhibits splice boundaries, indicating identity spoofing.',
    },
    reference: {
      isVerified: false,
      matchScore: 0.40,
      score: 40,
      referenceRecord: {
        id: 'ref-002',
        fullName: 'JANE SMITH',
        documentNumber: 'ID-7891011',
        dateOfBirth: '1985-03-15',
        issuingAuthority: 'UK Home Office',
        issueDate: '2018-11-22',
        expiryDate: '2028-11-21',
        status: 'active',
        nationality: 'GBR',
      },
      discrepancies: [
        'Name mismatch: Credential shows "JOHN SMITH" but Home Office registry records "JANE SMITH"',
        'DOB mismatch: Credential shows 1985-11-22 but registry records 1985-03-15',
      ],
      explanation: 'Severe registry discordance. The authentic record for ID-7891011 belongs to JANE SMITH (Female, Born Mar 15, 1985).',
    },
    risk: {
      overallScore: 89,
      riskLevel: 'high',
      primaryRiskFactor: 'High-confidence text alteration and direct Home Office registry discrepancy.',
      signals: [
        { name: 'Tampering Detection', score: 18, weight: 0.30, status: 'high', contributorPercent: 88, explanation: 'Copy-move & inpainting artifacts in Name/DOB' },
        { name: 'Authority Registry', score: 40, weight: 0.20, status: 'high', contributorPercent: 92, explanation: 'Name mismatch with official UK database' },
        { name: 'Document Validation', score: 46, weight: 0.20, status: 'high', contributorPercent: 78, explanation: 'Font mismatch & guilloche disruption' },
        { name: 'Metadata & EXIF', score: 32, weight: 0.15, status: 'high', contributorPercent: 72, explanation: 'Adobe Photoshop CS6 rendering tag detected' },
        { name: 'Face Verification', score: 87, weight: 0.15, status: 'low', contributorPercent: 12, explanation: 'Selfie matches spliced photo' },
      ],
      recommendation: 'HIGH RISK — Document fraud detected. Intercept traveler, escalate to secondary border inspection, and file formal investigation incident.',
      aiExplanation: 'Multiple critical anomalies confirm document fraud: (1) ELA highlights strong noise inconsistencies across the name and DOB fields. (2) Cross-referencing UK Home Office records reveals the document was originally issued to Jane Smith. (3) Photo border shows digital splicing.',
    },
    flags: [
      { id: 'flg-1', severity: 'critical', category: 'tampering', title: 'Text Modification (Name Field)', description: 'Holder name altered from original record', confidence: 0.94, evidence: 'ELA noise disruption and kerning misalignment in name zone', boundingBox: { x: 32, y: 28, width: 36, height: 8 } },
      { id: 'flg-2', severity: 'critical', category: 'tampering', title: 'DOB Field Tampering', description: 'Birth date modified by 8 months', confidence: 0.88, evidence: 'Pixel variance around date numbers exceeds normal threshold', boundingBox: { x: 32, y: 40, width: 26, height: 7 } },
      { id: 'flg-3', severity: 'critical', category: 'reference', title: 'Identity Mismatch with Authority DB', description: 'Database records female subject Jane Smith', confidence: 0.99, evidence: 'UK Home Office registry ID-7891011 mismatch' },
    ],
    timeline: [
      { id: 'tm-1', stage: 'Upload & Ingestion', title: 'File Ingested', timestamp: '11:15:00.080', durationMs: 140, status: 'passed', details: 'Scan resolution: 300 DPI.', engineVersion: 'v2.8' },
      { id: 'tm-2', stage: 'Preprocessing', title: 'Contrast & Spectral Preprocessing', timestamp: '11:15:00.290', durationMs: 210, status: 'passed', details: 'Surface lighting normalized.', engineVersion: 'v3.1' },
      { id: 'tm-3', stage: 'Multi-Modal OCR', title: 'Neural Field Extraction', timestamp: '11:15:01.400', durationMs: 1110, status: 'warning', details: 'Name & DOB extracted with confidence drops (74%-85%).', engineVersion: 'v4.0.2' },
      { id: 'tm-4', stage: 'Format & Typography', title: 'Font Consistency Analysis', timestamp: '11:15:02.100', durationMs: 700, status: 'flagged', details: 'CRITICAL: Non-standard typeface & kerning in name row.', engineVersion: 'v1.9' },
      { id: 'tm-5', stage: 'Forensic Tamper Scan', title: 'Error Level & Compression Analysis', timestamp: '11:15:03.450', durationMs: 1350, status: 'flagged', details: 'CRITICAL: Inpainting & copy-move artifacts in 2 localized zones.', engineVersion: 'v2.3.1' },
      { id: 'tm-6', stage: 'Biometric 1:1 Match', title: 'Face Comparison', timestamp: '11:15:04.500', durationMs: 1050, status: 'passed', details: 'Match: 0.87 (Selfie matches presented spliced photo).', engineVersion: 'v3.1.0' },
      { id: 'tm-7', stage: 'Registry Cross-Check', title: 'Home Office Database Match', timestamp: '11:15:05.150', durationMs: 650, status: 'flagged', details: 'CRITICAL: Name mismatch (Document: JOHN SMITH, DB: JANE SMITH).', engineVersion: 'v2.0' },
      { id: 'tm-8', stage: 'Risk Fusion', title: 'Risk Score Computation', timestamp: '11:15:05.580', durationMs: 430, status: 'flagged', details: 'Risk Score computed: 89/100 (HIGH RISK).', engineVersion: 'v1.8.0' },
    ],
    officerDecision: {
      verdict: 'escalate',
      officerId: 'OFFICER-4912',
      officerName: 'Senior Inspector Maya Lin',
      notes: 'Traveler detained at Terminal 2 inspection gate. Case forwarded to Special Investigations Unit.',
      decidedAt: '2026-08-31T11:20:00Z',
      aiRecommendation: 'HIGH RISK',
      secondaryDepartment: 'Immigration Enforcement & Fraud Unit',
    },
    travelerProfileId: 'TRV-44109',
  },

  'vrf-003': {
    id: 'vrf-003',
    status: 'completed',
    createdAt: '2026-08-31T12:00:00Z',
    completedAt: '2026-08-31T12:00:42Z',
    document: {
      id: 'doc-003',
      type: 'driving_license',
      fileName: 'ontario_drivers_license.png',
      fileSize: 2_100_000,
      mimeType: 'image/png',
      uploadedAt: '2026-08-31T12:00:00Z',
    },
    selfie: {
      id: 'self-003',
      type: 'other',
      fileName: 'selfie_imposter.jpg',
      fileSize: 1_500_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T12:00:04Z',
    },
    ocr: {
      fields: [
        { fieldName: 'Full Name', value: 'MICHAEL CHEN', confidence: 0.98, boundingBox: { x: 30, y: 30, width: 34, height: 7 }, category: 'identity' },
        { fieldName: 'Date of Birth', value: '1992-08-03', confidence: 0.97, boundingBox: { x: 30, y: 40, width: 22, height: 6 }, category: 'dates' },
        { fieldName: 'Document Number', value: 'DL-55667788', confidence: 0.99, boundingBox: { x: 30, y: 50, width: 28, height: 6 }, category: 'document' },
        { fieldName: 'Address', value: '142 MAPLE STREET, TORONTO', confidence: 0.94, boundingBox: { x: 30, y: 60, width: 44, height: 6 }, category: 'document' },
        { fieldName: 'Expiry Date', value: '2029-08-02', confidence: 0.98, boundingBox: { x: 30, y: 70, width: 22, height: 6 }, category: 'dates' },
      ],
      rawText: "DRIVER'S LICENCE\nONTARIO CANADA\nMICHAEL CHEN\nDL-55667788\nCLASS G",
      overallConfidence: 0.972,
      processingTimeMs: 1100,
    },
    validation: {
      checks: [
        { id: 'vc-1', name: 'Canadian AAMVA Standard', description: 'Card layout and PDF417 2D barcode format', status: 'pass', confidence: 0.98 },
        { id: 'vc-2', name: 'Document Validity & Expiry', description: 'Active validity window until 2029', status: 'pass', confidence: 1.0 },
        { id: 'vc-3', name: 'Security Ghost Photo', description: 'Laser-engraved secondary portrait presence', status: 'pass', confidence: 0.93 },
      ],
      overallStatus: 'pass',
      score: 96,
    },
    tampering: {
      isTampered: false,
      confidence: 0.96,
      score: 95,
      regions: [],
      techniques: [],
      explanation: 'Physical driving license is genuine with zero pixel tampering or font anomalies.',
    },
    faceVerification: {
      isMatch: false,
      similarity: 0.32,
      threshold: 0.80,
      score: 32,
      livenessScore: 0.94,
      faceLandmarksDetected: true,
      explanation: 'CRITICAL BIOMETRIC FAILURE: Facial similarity score is 0.32 (well below 0.80 threshold). Craniofacial geometry, interpupillary distance, and nose bridge contours differ completely.',
    },
    reference: {
      isVerified: true,
      matchScore: 0.98,
      score: 98,
      referenceRecord: {
        id: 'ref-003',
        fullName: 'MICHAEL CHEN',
        documentNumber: 'DL-55667788',
        dateOfBirth: '1992-08-03',
        issuingAuthority: 'Ontario Ministry of Transportation',
        issueDate: '2019-08-03',
        expiryDate: '2029-08-02',
        status: 'active',
        nationality: 'CAN',
      },
      discrepancies: [],
      explanation: 'Driving licence is authentic and active in Ontario Ministry of Transportation records.',
    },
    risk: {
      overallScore: 62,
      riskLevel: 'review',
      primaryRiskFactor: 'Biometric Imposter Risk: Document is authentic but presenter does not match photo.',
      signals: [
        { name: 'Face Verification', score: 32, weight: 0.35, status: 'high', contributorPercent: 86, explanation: 'Presenter similarity 0.32 vs 0.80 threshold' },
        { name: 'Tampering Detection', score: 95, weight: 0.25, status: 'low', contributorPercent: 4, explanation: 'Document substrate authentic' },
        { name: 'Document Validation', score: 96, weight: 0.20, status: 'low', contributorPercent: 2, explanation: 'Standard AAMVA barcode matches' },
        { name: 'Authority Registry', score: 98, weight: 0.20, status: 'low', contributorPercent: 1, explanation: 'Licence active in registry' },
      ],
      recommendation: 'REVIEW REQUIRED — Lookalike / Imposter Alert. The document is genuine, but the individual presenting it is not the legitimate holder.',
      aiExplanation: 'Classic stolen credential / lookalike attempt. While the Ontario driving licence is 100% authentic, facial recognition confirms the presenter is not Michael Chen.',
    },
    flags: [
      { id: 'flg-4', severity: 'high', category: 'face_verification', title: 'Biometric Face Mismatch', description: 'Live selfie does not match credential photo', confidence: 0.96, evidence: 'Cosine similarity 0.32 is far below 0.80 threshold' },
    ],
    timeline: [
      { id: 'tm-1', stage: 'Upload & Ingestion', title: 'File Received', timestamp: '12:00:00.100', durationMs: 100, status: 'passed', details: 'Valid image format.', engineVersion: 'v2.8' },
      { id: 'tm-2', stage: 'Multi-Modal OCR', title: 'Field Parsing', timestamp: '12:00:01.200', durationMs: 1100, status: 'passed', details: 'Extracted Michael Chen, DL-55667788.', engineVersion: 'v4.0.2' },
      { id: 'tm-3', stage: 'Tamper Scan', title: 'Substrate Integrity', timestamp: '12:00:02.400', durationMs: 1200, status: 'passed', details: 'Zero physical or digital alterations.', engineVersion: 'v2.3.1' },
      { id: 'tm-4', stage: 'Biometric 1:1 Match', title: 'Biometric Cosine Match', timestamp: '12:00:03.600', durationMs: 1200, status: 'flagged', details: 'FAILED: Similarity 0.32 (Imposter indicator).', engineVersion: 'v3.1.0' },
      { id: 'tm-5', stage: 'Risk Fusion', title: 'Evidence Synthesis', timestamp: '12:00:04.100', durationMs: 500, status: 'warning', details: 'Risk Score: 62/100 (REVIEW REQUIRED).', engineVersion: 'v1.8.0' },
    ],
    officerDecision: {
      verdict: 'secondary_review',
      officerId: 'OFFICER-1108',
      officerName: 'Inspector Kenneth Clarke',
      notes: 'Presenter requested to provide secondary photo ID and fingerprints at secondary desk.',
      decidedAt: '2026-08-31T12:05:00Z',
      aiRecommendation: 'REVIEW REQUIRED',
    },
    travelerProfileId: 'TRV-19924',
  },
};

// ─── Multi-Document Traveler Profiles (Standout Feature 2) ──────────────────

export const mockTravelerProfiles: Record<string, TravelerProfile> = {
  'TRV-88210': {
    travelerId: 'TRV-88210',
    primaryName: 'HARSHIV DESAI',
    dob: '1992-06-18',
    nationality: 'INDIA',
    consistencyScore: 98,
    faceConsistency: 97,
    riskSummary: 'High identity integrity across 4 official credentials with consistent biometric embeddings.',
    documents: [
      {
        id: 'doc-t1',
        type: 'passport',
        title: 'Republic of India Passport',
        documentNumber: 'Z8942011',
        issueCountry: 'India',
        expiryDate: '2032-06-17',
        status: 'valid',
        extractedFields: { fullName: 'HARSHIV DESAI', dob: '1992-06-18', nationality: 'INDIAN', gender: 'M' },
      },
      {
        id: 'doc-t2',
        type: 'visa',
        title: 'US B1/B2 Visitor Visa',
        documentNumber: 'V-9901428',
        issueCountry: 'United States',
        expiryDate: '2030-10-12',
        status: 'valid',
        extractedFields: { fullName: 'HARSHIV DESAI', dob: '1992-06-18', nationality: 'INDIAN', gender: 'M' },
      },
      {
        id: 'doc-t3',
        type: 'gov_id',
        title: 'National Identity Aadhaar Card',
        documentNumber: 'XXXX-XXXX-9412',
        issueCountry: 'India',
        expiryDate: 'Permanent',
        status: 'valid',
        extractedFields: { fullName: 'HARSHIV DESAI', dob: '1992-06-18', nationality: 'INDIAN', gender: 'M' },
      },
      {
        id: 'doc-t4',
        type: 'driving_license',
        title: 'State Driving Licence (Gujarat)',
        documentNumber: 'GJ-01-2015-8821',
        issueCountry: 'India',
        expiryDate: '2042-06-17',
        status: 'valid',
        extractedFields: { fullName: 'HARSHIV DESAI', dob: '1992-06-18', nationality: 'INDIAN', gender: 'M' },
      },
    ],
    conflicts: [],
  },

  'TRV-44109': {
    travelerId: 'TRV-44109',
    primaryName: 'JOHN SMITH / JANE SMITH (CONFLICT)',
    dob: '1985-11-22 vs 1985-03-15',
    nationality: 'UNITED KINGDOM',
    consistencyScore: 42,
    faceConsistency: 68,
    riskSummary: 'CRITICAL CONFLICT: Severe mismatch between Passport identity and presented National ID card.',
    documents: [
      {
        id: 'doc-c1',
        type: 'passport',
        title: 'British Citizen Passport',
        documentNumber: 'UKP-449120',
        issueCountry: 'United Kingdom',
        expiryDate: '2028-04-10',
        status: 'valid',
        extractedFields: { fullName: 'JANE SMITH', dob: '1985-03-15', nationality: 'BRITISH', gender: 'F' },
      },
      {
        id: 'doc-c2',
        type: 'gov_id',
        title: 'Presented National ID Card',
        documentNumber: 'ID-7891011',
        issueCountry: 'United Kingdom',
        expiryDate: '2028-11-21',
        status: 'suspicious',
        extractedFields: { fullName: 'JOHN SMITH', dob: '1985-11-22', nationality: 'BRITISH', gender: 'M' },
      },
    ],
    conflicts: [
      {
        field: 'Full Name',
        docA: { title: 'Passport (UKP-449120)', value: 'JANE SMITH' },
        docB: { title: 'National ID (ID-7891011)', value: 'JOHN SMITH' },
        severity: 'high',
        message: 'Name mismatch detected between Passport and National ID.',
      },
      {
        field: 'Date of Birth',
        docA: { title: 'Passport (UKP-449120)', value: '1985-03-15' },
        docB: { title: 'National ID (ID-7891011)', value: '1985-11-22' },
        severity: 'high',
        message: 'DOB mismatch detected: 8 months discrepancy.',
      },
      {
        field: 'Gender Marker',
        docA: { title: 'Passport (UKP-449120)', value: 'FEMALE (F)' },
        docB: { title: 'National ID (ID-7891011)', value: 'MALE (M)' },
        severity: 'high',
        message: 'Gender inconsistency between primary credentials.',
      },
    ],
  },
};

// ─── Document Comparison Pairs (Standout Feature 6) ─────────────────────────

export const mockComparisonPairs: Record<string, DocumentComparisonPair> = {
  'cmp-001': {
    id: 'cmp-001',
    titleA: 'Primary Passport (India)',
    docTypeA: 'passport',
    imageA: '/sample_passport.jpg',
    titleB: 'Consular Visa (USA B1/B2)',
    docTypeB: 'visa',
    imageB: '/sample_visa.jpg',
    visualDifferencePercent: 4.2,
    summary: 'High biometric & alphanumeric concordance across Passport and Travel Visa.',
    matches: [
      { field: 'Full Name', valA: 'HARSHIV DESAI', valB: 'HARSHIV DESAI', status: 'match' },
      { field: 'Date of Birth', valA: '1992-06-18', valB: '1992-06-18', status: 'match' },
      { field: 'Nationality', valA: 'IND', valB: 'IND', status: 'match' },
      { field: 'Passport Ref Number', valA: 'Z8942011', valB: 'Z8942011', status: 'match' },
      { field: 'Sex', valA: 'M', valB: 'M', status: 'match' },
    ],
  },
  'cmp-002': {
    id: 'cmp-002',
    titleA: 'Authoritative Home Office Registry',
    docTypeA: 'gov_id',
    imageA: '/official_template.jpg',
    titleB: 'Presented Physical Document',
    docTypeB: 'gov_id',
    imageB: '/tampered_doc.jpg',
    visualDifferencePercent: 38.6,
    summary: 'Substantial tampering & typographic mismatch detected between registry template and presented card.',
    matches: [
      { field: 'Full Name', valA: 'JANE SMITH', valB: 'JOHN SMITH', status: 'mismatch' },
      { field: 'Date of Birth', valA: '1985-03-15', valB: '1985-11-22', status: 'mismatch' },
      { field: 'Document Number', valA: 'ID-7891011', valB: 'ID-7891011', status: 'match' },
      { field: 'Issuing Authority', valA: 'UK Home Office', valB: 'UK Home Office', status: 'match' },
    ],
  },
};

// ─── Mock History Items ─────────────────────────────────────────────────────

export const mockHistoryItems: VerificationHistoryItem[] = [
  { id: 'vrf-001', documentType: 'passport', documentName: 'us_passport_sarah_johnson.jpg', submittedAt: '2026-08-31T10:30:00Z', completedAt: '2026-08-31T10:30:45Z', status: 'completed', riskLevel: 'low', riskScore: 8, holderName: 'Sarah Johnson', officerDecision: 'approve' },
  { id: 'vrf-002', documentType: 'gov_id', documentName: 'uk_national_id_tampered.jpg', submittedAt: '2026-08-31T11:15:00Z', completedAt: '2026-08-31T11:15:38Z', status: 'completed', riskLevel: 'high', riskScore: 89, holderName: 'John Smith', officerDecision: 'escalate' },
  { id: 'vrf-003', documentType: 'driving_license', documentName: 'ontario_drivers_license.png', submittedAt: '2026-08-31T12:00:00Z', completedAt: '2026-08-31T12:00:42Z', status: 'completed', riskLevel: 'review', riskScore: 62, holderName: 'Michael Chen', officerDecision: 'secondary_review' },
  { id: 'vrf-004', documentType: 'passport', documentName: 'expired_aus_passport.jpg', submittedAt: '2026-08-31T13:45:00Z', completedAt: '2026-08-31T13:45:35Z', status: 'completed', riskLevel: 'review', riskScore: 45, holderName: 'Emma Williams', officerDecision: 'pending' },
  { id: 'vrf-005', documentType: 'gov_id', documentName: 'synthetic_spanish_dni.jpg', submittedAt: '2026-08-31T14:30:00Z', completedAt: '2026-08-31T14:30:52Z', status: 'completed', riskLevel: 'high', riskScore: 94, holderName: 'Alex Rodriguez', officerDecision: 'reject' },
  { id: 'vrf-006', documentType: 'passport', documentName: 'uk_passport_david_brown.jpg', submittedAt: '2026-08-30T09:20:00Z', completedAt: '2026-08-30T09:20:40Z', status: 'completed', riskLevel: 'low', riskScore: 6, holderName: 'David Brown', officerDecision: 'approve' },
  { id: 'vrf-007', documentType: 'driving_license', documentName: 'california_license_maria.jpg', submittedAt: '2026-08-30T11:45:00Z', completedAt: '2026-08-30T11:45:38Z', status: 'completed', riskLevel: 'low', riskScore: 11, holderName: 'Maria Garcia', officerDecision: 'approve' },
  { id: 'vrf-008', documentType: 'gov_id', documentName: 'german_id_hans_mueller.jpg', submittedAt: '2026-08-29T16:30:00Z', completedAt: '2026-08-29T16:30:42Z', status: 'completed', riskLevel: 'review', riskScore: 52, holderName: 'Hans Mueller', officerDecision: 'pending' },
  { id: 'vrf-009', documentType: 'passport', documentName: 'japan_passport_yuki_tanaka.jpg', submittedAt: '2026-08-29T08:10:00Z', completedAt: '2026-08-29T08:10:35Z', status: 'completed', riskLevel: 'low', riskScore: 4, holderName: 'Yuki Tanaka', officerDecision: 'approve' },
  { id: 'vrf-010', documentType: 'gov_id', documentName: 'india_aadhaar_raj_patel.jpg', submittedAt: '2026-08-28T14:55:00Z', completedAt: '2026-08-28T14:55:48Z', status: 'completed', riskLevel: 'high', riskScore: 82, holderName: 'Raj Patel', officerDecision: 'reject' },
];

// ─── Mock Dashboard Stats ───────────────────────────────────────────────────

export const mockDashboardStats: DashboardStats = {
  totalVerifications: 1482,
  highRiskCount: 94,
  authenticCount: 1228,
  reviewCount: 160,
  recentVerifications: mockHistoryItems.slice(0, 5),
  activityData: [
    { date: '2026-08-25', count: 48, highRisk: 3 },
    { date: '2026-08-26', count: 52, highRisk: 4 },
    { date: '2026-08-27', count: 68, highRisk: 5 },
    { date: '2026-08-28', count: 74, highRisk: 6 },
    { date: '2026-08-29', count: 59, highRisk: 3 },
    { date: '2026-08-30', count: 65, highRisk: 4 },
    { date: '2026-08-31', count: 44, highRisk: 2 },
  ],
  riskDistribution: [
    { name: 'Low Risk (Clear)', value: 1228, color: '#059669' },
    { name: 'Officer Review', value: 160, color: '#D97706' },
    { name: 'High Risk (Fraud)', value: 94, color: '#DC2626' },
  ],
};

// ─── Mock Model Metrics ─────────────────────────────────────────────────────

export const mockModelMetrics: ModelMetrics[] = [
  {
    modelName: 'Tampering Detection',
    version: 'v2.4.0 (Edge-ELA)',
    accuracy: 0.958,
    precision: 0.945,
    recall: 0.969,
    f1Score: 0.957,
    totalSamples: 14200,
    confusionMatrix: { truePositive: 5420, falsePositive: 280, trueNegative: 8200, falseNegative: 300 },
    lastUpdated: '2026-08-28',
  },
  {
    modelName: 'Face Verification',
    version: 'v3.2.0 (ArcFace-Deep)',
    accuracy: 0.982,
    precision: 0.978,
    recall: 0.985,
    f1Score: 0.981,
    totalSamples: 21500,
    confusionMatrix: { truePositive: 10400, falsePositive: 220, trueNegative: 10720, falseNegative: 160 },
    lastUpdated: '2026-08-29',
  },
  {
    modelName: 'OCR Engine',
    version: 'v4.1.0 (Vision Transformer)',
    accuracy: 0.992,
    precision: 0.994,
    recall: 0.991,
    f1Score: 0.992,
    totalSamples: 32000,
    confusionMatrix: { truePositive: 15850, falsePositive: 80, trueNegative: 15980, falseNegative: 90 },
    lastUpdated: '2026-08-30',
  },
  {
    modelName: 'Risk Fusion',
    version: 'v2.0.0 (Bayesian Graph)',
    accuracy: 0.941,
    precision: 0.935,
    recall: 0.948,
    f1Score: 0.941,
    totalSamples: 10200,
    confusionMatrix: { truePositive: 4850, falsePositive: 290, trueNegative: 4800, falseNegative: 260 },
    lastUpdated: '2026-08-28',
  },
];

// ─── Mock Notifications ─────────────────────────────────────────────────────

export const mockNotifications: Notification[] = [
  { id: 'ntf-1', type: 'alert', title: 'High Risk Tampering Alert', message: 'Verification vrf-002 flagged as HIGH RISK: 2 manipulated zones detected on UK National ID.', timestamp: '2026-08-31T11:16:00Z', read: false, verificationId: 'vrf-002' },
  { id: 'ntf-2', type: 'warning', title: 'Biometric Imposter Flag', message: 'Verification vrf-003: Selfie does not match driving licence photograph.', timestamp: '2026-08-31T12:01:00Z', read: false, verificationId: 'vrf-003' },
  { id: 'ntf-3', type: 'success', title: 'Automated Clearance Approved', message: 'Verification vrf-001 (Sarah Johnson) cleared with Risk Score 8/100.', timestamp: '2026-08-31T10:31:00Z', read: true, verificationId: 'vrf-001' },
  { id: 'ntf-4', type: 'info', title: 'Forensic Model v2.4.0 Live', message: 'Tampering detection engine upgraded with improved microprint and ELA sensitivity.', timestamp: '2026-08-31T08:00:00Z', read: true },
];

// ─── Mock Reference Records ────────────────────────────────────────────────

export const mockReferenceRecords: ReferenceRecord[] = [
  { id: 'ref-001', fullName: 'SARAH JOHNSON', documentNumber: 'P12345678', dateOfBirth: '1990-05-14', issuingAuthority: 'US Department of State', issueDate: '2020-05-14', expiryDate: '2030-05-13', status: 'active', nationality: 'USA' },
  { id: 'ref-002', fullName: 'JANE SMITH', documentNumber: 'ID-7891011', dateOfBirth: '1985-03-15', issuingAuthority: 'UK Home Office', issueDate: '2018-11-22', expiryDate: '2028-11-21', status: 'active', nationality: 'GBR' },
  { id: 'ref-003', fullName: 'MICHAEL CHEN', documentNumber: 'DL-55667788', dateOfBirth: '1992-08-03', issuingAuthority: 'Ontario Ministry of Transportation', issueDate: '2019-08-03', expiryDate: '2029-08-02', status: 'active', nationality: 'CAN' },
  { id: 'ref-004', fullName: 'EMMA WILLIAMS', documentNumber: 'P98765432', dateOfBirth: '1988-02-28', issuingAuthority: 'Australian Passport Office', issueDate: '2014-02-28', expiryDate: '2024-02-27', status: 'expired', nationality: 'AUS' },
];

// ─── Mock Pipeline Steps ────────────────────────────────────────────────────

export const mockPipelineSteps: PipelineStep[] = [
  { id: 'step-1', name: 'Document Ingestion & Hash', description: 'Computing SHA-256 and validating raw color spectrum', status: 'waiting', progress: 0 },
  { id: 'step-2', name: 'Perspective & Lighting Normalization', description: 'Deskewing geometry and normalizing shadows', status: 'waiting', progress: 0 },
  { id: 'step-3', name: 'Multi-Modal Vision OCR', description: 'Extracting alphanumeric fields & MRZ parity codes', status: 'waiting', progress: 0 },
  { id: 'step-4', name: 'Format & Typography Verification', description: 'Auditing ICAO standard fonts, kerning, and microprint', status: 'waiting', progress: 0 },
  { id: 'step-5', name: 'Tampering & Splice Scan', description: 'Running Error Level Analysis (ELA) and noise mapping', status: 'waiting', progress: 0 },
  { id: 'step-6', name: 'Biometric 1:1 Face Match', description: 'Deep craniofacial landmark matching & passive liveness', status: 'waiting', progress: 0 },
  { id: 'step-7', name: 'Authority Registry Cross-Check', description: 'Querying national databases for revoked/stolen records', status: 'waiting', progress: 0 },
  { id: 'step-8', name: 'Forensic Risk Fusion', description: 'Computing unified multi-signal risk index and dossier', status: 'waiting', progress: 0 },
];

// ─── Default Settings ───────────────────────────────────────────────────────

export const defaultSettings: VerificationSettings = {
  riskThresholds: { low: 25, review: 55, high: 75 },
  faceMatchThreshold: 0.80,
  enableReferenceVerification: true,
  autoAnalyze: true,
  retentionDays: 90,
  privacyMode: false,
};
