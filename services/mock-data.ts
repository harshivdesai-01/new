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
} from '@/types';

// ─── Demo Scenarios ─────────────────────────────────────────────────────────

export const demoScenarios: DemoScenarioInfo[] = [
  {
    id: 'genuine',
    name: 'Genuine Document',
    description: 'A valid, authentic passport with matching selfie and clean reference check.',
    icon: '✅',
    riskLevel: 'low',
  },
  {
    id: 'tampered',
    name: 'Tampered Document',
    description: 'A digitally altered ID card with modified name and date of birth fields.',
    icon: '🔴',
    riskLevel: 'high',
  },
  {
    id: 'face_mismatch',
    name: 'Face Mismatch',
    description: 'A legitimate document but the selfie does not match the document photo.',
    icon: '⚠️',
    riskLevel: 'review',
  },
  {
    id: 'expired',
    name: 'Expired Document',
    description: 'A valid document that has expired, with expired reference record.',
    icon: '📅',
    riskLevel: 'review',
  },
  {
    id: 'high_risk',
    name: 'High Risk Document',
    description: 'Multiple red flags: tampering traces, poor face match, and reference discrepancies.',
    icon: '🚨',
    riskLevel: 'high',
  },
];

// ─── Mock Verification Results ──────────────────────────────────────────────

export const mockVerificationResults: Record<string, VerificationResult> = {
  'vrf-001': {
    id: 'vrf-001',
    status: 'completed',
    createdAt: '2026-08-31T10:30:00Z',
    completedAt: '2026-08-31T10:30:45Z',
    document: {
      id: 'doc-001',
      type: 'passport',
      fileName: 'passport_scan.jpg',
      fileSize: 2_400_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T10:30:00Z',
    },
    selfie: {
      id: 'self-001',
      type: 'other',
      fileName: 'selfie.jpg',
      fileSize: 1_800_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T10:30:05Z',
    },
    ocr: {
      fields: [
        { fieldName: 'Full Name', value: 'SARAH JOHNSON', confidence: 0.98 },
        { fieldName: 'Date of Birth', value: '1990-05-14', confidence: 0.97 },
        { fieldName: 'Document Number', value: 'P12345678', confidence: 0.99 },
        { fieldName: 'Nationality', value: 'UNITED STATES', confidence: 0.96 },
        { fieldName: 'Expiry Date', value: '2030-05-13', confidence: 0.98 },
        { fieldName: 'Issue Date', value: '2020-05-14', confidence: 0.95 },
        { fieldName: 'Sex', value: 'F', confidence: 0.99 },
        { fieldName: 'Place of Birth', value: 'NEW YORK', confidence: 0.93 },
      ],
      rawText: 'PASSPORT\nUNITED STATES OF AMERICA\nSARAH JOHNSON\n...',
      overallConfidence: 0.969,
      processingTimeMs: 1200,
    },
    validation: {
      checks: [
        { id: 'vc-1', name: 'Document Format', description: 'Standard passport format verification', status: 'pass', confidence: 0.98 },
        { id: 'vc-2', name: 'MRZ Validation', description: 'Machine Readable Zone checksum verification', status: 'pass', confidence: 0.99 },
        { id: 'vc-3', name: 'Expiry Check', description: 'Document has not expired', status: 'pass', confidence: 1.0 },
        { id: 'vc-4', name: 'Font Consistency', description: 'Typeface uniformity across document', status: 'pass', confidence: 0.95 },
        { id: 'vc-5', name: 'Security Features', description: 'Hologram and watermark detection', status: 'pass', confidence: 0.88, details: 'Watermark detected with moderate confidence' },
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
      explanation: 'No signs of digital manipulation detected. Image noise patterns are consistent throughout the document.',
    },
    faceVerification: {
      isMatch: true,
      similarity: 0.94,
      threshold: 0.80,
      score: 94,
      explanation: 'Strong facial feature match between document photo and selfie. Key landmarks align within expected tolerance.',
    },
    reference: {
      isVerified: true,
      matchScore: 0.98,
      score: 98,
      referenceRecord: {
        id: 'ref-001',
        fullName: 'SARAH JOHNSON',
        documentNumber: 'P12345678',
        dateOfBirth: '1990-05-14',
        issuingAuthority: 'US Department of State',
        issueDate: '2020-05-14',
        expiryDate: '2030-05-13',
        status: 'active',
      },
      discrepancies: [],
      explanation: 'All document details match the reference database record. Document is confirmed active.',
    },
    risk: {
      overallScore: 12,
      riskLevel: 'low',
      signals: [
        { name: 'Tampering Detection', score: 95, weight: 0.30, status: 'low', explanation: 'No tampering detected' },
        { name: 'Face Verification', score: 94, weight: 0.25, status: 'low', explanation: 'Strong face match' },
        { name: 'Document Validation', score: 96, weight: 0.20, status: 'low', explanation: 'All validation checks passed' },
        { name: 'Reference Verification', score: 98, weight: 0.15, status: 'low', explanation: 'Reference confirmed' },
        { name: 'Metadata Anomaly', score: 92, weight: 0.10, status: 'low', explanation: 'No metadata anomalies detected' },
      ],
      recommendation: 'This document appears to be authentic. All verification checks have passed successfully.',
      aiExplanation: 'The document has been verified across all five verification dimensions and shows strong indicators of authenticity. The passport format, MRZ codes, and security features are consistent with a genuine US passport. Facial biometrics confirm a strong match between the document photo and the provided selfie. The reference database confirms this as an active, valid document.',
    },
    flags: [],
  },

  'vrf-002': {
    id: 'vrf-002',
    status: 'completed',
    createdAt: '2026-08-31T11:15:00Z',
    completedAt: '2026-08-31T11:15:38Z',
    document: {
      id: 'doc-002',
      type: 'gov_id',
      fileName: 'national_id.jpg',
      fileSize: 1_900_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T11:15:00Z',
    },
    selfie: {
      id: 'self-002',
      type: 'other',
      fileName: 'selfie_tampered.jpg',
      fileSize: 1_600_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T11:15:03Z',
    },
    ocr: {
      fields: [
        { fieldName: 'Full Name', value: 'JOHN SMITH', confidence: 0.85 },
        { fieldName: 'Date of Birth', value: '1985-11-22', confidence: 0.72 },
        { fieldName: 'Document Number', value: 'ID-7891011', confidence: 0.91 },
        { fieldName: 'Nationality', value: 'UNITED KINGDOM', confidence: 0.94 },
        { fieldName: 'Expiry Date', value: '2028-11-21', confidence: 0.88 },
      ],
      rawText: 'NATIONAL IDENTITY CARD\nUNITED KINGDOM\nJOHN SMITH\n...',
      overallConfidence: 0.86,
      processingTimeMs: 1450,
    },
    validation: {
      checks: [
        { id: 'vc-1', name: 'Document Format', description: 'Standard ID format verification', status: 'warning', confidence: 0.75, details: 'Minor format inconsistencies detected in the header region' },
        { id: 'vc-2', name: 'Barcode Validation', description: 'Document barcode integrity', status: 'pass', confidence: 0.92 },
        { id: 'vc-3', name: 'Expiry Check', description: 'Document has not expired', status: 'pass', confidence: 1.0 },
        { id: 'vc-4', name: 'Font Consistency', description: 'Typeface uniformity across document', status: 'fail', confidence: 0.88, details: 'Font mismatch detected near the name field, suggesting potential modification' },
        { id: 'vc-5', name: 'Security Features', description: 'Hologram and watermark detection', status: 'warning', confidence: 0.60, details: 'Watermark appears degraded or overlaid' },
      ],
      overallStatus: 'fail',
      score: 48,
    },
    tampering: {
      isTampered: true,
      confidence: 0.91,
      score: 22,
      regions: [
        { x: 120, y: 85, width: 200, height: 30, type: 'text_modification', confidence: 0.93 },
        { x: 120, y: 130, width: 150, height: 25, type: 'text_modification', confidence: 0.87 },
      ],
      techniques: ['copy-move', 'inpainting'],
      explanation: 'Digital manipulation detected in the name and date of birth fields. Error Level Analysis reveals inconsistent compression artifacts around modified text regions, suggesting the original text was removed and replaced.',
    },
    faceVerification: {
      isMatch: true,
      similarity: 0.86,
      threshold: 0.80,
      score: 86,
      explanation: 'Face match is acceptable though the document photo quality is lower than expected for this document type.',
    },
    reference: {
      isVerified: false,
      matchScore: 0.45,
      score: 45,
      referenceRecord: {
        id: 'ref-002',
        fullName: 'JANE SMITH',
        documentNumber: 'ID-7891011',
        dateOfBirth: '1985-03-15',
        issuingAuthority: 'UK Home Office',
        issueDate: '2018-11-22',
        expiryDate: '2028-11-21',
        status: 'active',
      },
      discrepancies: [
        'Name mismatch: document shows "JOHN SMITH" but reference shows "JANE SMITH"',
        'Date of birth mismatch: document shows 1985-11-22 but reference shows 1985-03-15',
      ],
      explanation: 'Significant discrepancies found between the document and reference database. The name and date of birth do not match the original record for this document number.',
    },
    risk: {
      overallScore: 87,
      riskLevel: 'high',
      signals: [
        { name: 'Tampering Detection', score: 22, weight: 0.30, status: 'high', explanation: 'Digital tampering detected in name and DOB fields' },
        { name: 'Face Verification', score: 86, weight: 0.25, status: 'low', explanation: 'Face match acceptable' },
        { name: 'Document Validation', score: 48, weight: 0.20, status: 'high', explanation: 'Font inconsistency and format issues' },
        { name: 'Reference Verification', score: 45, weight: 0.15, status: 'high', explanation: 'Name and DOB mismatch with reference' },
        { name: 'Metadata Anomaly', score: 35, weight: 0.10, status: 'high', explanation: 'Metadata shows recent editing software signatures' },
      ],
      recommendation: 'This document shows strong indicators of tampering and should be rejected. Recommend manual investigation and reporting to the relevant authority.',
      aiExplanation: 'Multiple critical issues were identified during analysis. The document appears to have been digitally altered — the name field has been changed from "JANE SMITH" to "JOHN SMITH" and the date of birth has been modified. Forensic analysis reveals copy-move and inpainting artifacts around these fields. The reference database confirms the original document belongs to a different person. While the face verification passed (suggesting the tampered document may have been created to match the presenter), the combined evidence strongly indicates document fraud.',
    },
    flags: [
      { id: 'flg-1', severity: 'critical', category: 'tampering', title: 'Text Field Tampering', description: 'Name field has been digitally altered', confidence: 0.93, evidence: 'Error Level Analysis shows compression inconsistencies in the name region' },
      { id: 'flg-2', severity: 'critical', category: 'tampering', title: 'DOB Field Tampering', description: 'Date of birth field has been modified', confidence: 0.87, evidence: 'Noise pattern disruption detected around date text' },
      { id: 'flg-3', severity: 'high', category: 'reference', title: 'Identity Mismatch', description: 'Document details do not match the reference record', confidence: 0.98, evidence: 'Name and DOB discrepancy with authoritative database' },
    ],
  },

  'vrf-003': {
    id: 'vrf-003',
    status: 'completed',
    createdAt: '2026-08-31T12:00:00Z',
    completedAt: '2026-08-31T12:00:42Z',
    document: {
      id: 'doc-003',
      type: 'driving_license',
      fileName: 'drivers_license.png',
      fileSize: 2_100_000,
      mimeType: 'image/png',
      uploadedAt: '2026-08-31T12:00:00Z',
    },
    selfie: {
      id: 'self-003',
      type: 'other',
      fileName: 'selfie_wrong.jpg',
      fileSize: 1_500_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T12:00:04Z',
    },
    ocr: {
      fields: [
        { fieldName: 'Full Name', value: 'MICHAEL CHEN', confidence: 0.96 },
        { fieldName: 'Date of Birth', value: '1992-08-03', confidence: 0.97 },
        { fieldName: 'Document Number', value: 'DL-55667788', confidence: 0.99 },
        { fieldName: 'Address', value: '142 MAPLE STREET, TORONTO', confidence: 0.91 },
        { fieldName: 'Expiry Date', value: '2029-08-02', confidence: 0.98 },
        { fieldName: 'Class', value: 'G', confidence: 0.99 },
      ],
      rawText: 'DRIVER\'S LICENCE\nONTARIO\nMICHAEL CHEN\n...',
      overallConfidence: 0.967,
      processingTimeMs: 1100,
    },
    validation: {
      checks: [
        { id: 'vc-1', name: 'Document Format', description: 'Standard driving licence format', status: 'pass', confidence: 0.97 },
        { id: 'vc-2', name: 'Barcode Validation', description: 'PDF417 barcode integrity', status: 'pass', confidence: 0.99 },
        { id: 'vc-3', name: 'Expiry Check', description: 'Document has not expired', status: 'pass', confidence: 1.0 },
        { id: 'vc-4', name: 'Font Consistency', description: 'Typeface uniformity', status: 'pass', confidence: 0.96 },
        { id: 'vc-5', name: 'Security Features', description: 'UV features and microprint', status: 'pass', confidence: 0.90 },
      ],
      overallStatus: 'pass',
      score: 96,
    },
    tampering: {
      isTampered: false,
      confidence: 0.97,
      score: 97,
      regions: [],
      techniques: [],
      explanation: 'No signs of tampering detected. The document appears to be an authentic, unmodified driving licence.',
    },
    faceVerification: {
      isMatch: false,
      similarity: 0.32,
      threshold: 0.80,
      score: 32,
      explanation: 'The selfie does not match the face on the document. Significant differences in facial geometry, particularly in bone structure and facial proportions. This may indicate the selfie belongs to a different person.',
    },
    reference: {
      isVerified: true,
      matchScore: 0.97,
      score: 97,
      referenceRecord: {
        id: 'ref-003',
        fullName: 'MICHAEL CHEN',
        documentNumber: 'DL-55667788',
        dateOfBirth: '1992-08-03',
        issuingAuthority: 'Ontario Ministry of Transportation',
        issueDate: '2019-08-03',
        expiryDate: '2029-08-02',
        status: 'active',
      },
      discrepancies: [],
      explanation: 'Document details fully match the reference database. The driving licence is confirmed as active and valid.',
    },
    risk: {
      overallScore: 58,
      riskLevel: 'review',
      signals: [
        { name: 'Tampering Detection', score: 97, weight: 0.30, status: 'low', explanation: 'No tampering detected' },
        { name: 'Face Verification', score: 32, weight: 0.25, status: 'high', explanation: 'Selfie does not match document photo' },
        { name: 'Document Validation', score: 96, weight: 0.20, status: 'low', explanation: 'All checks passed' },
        { name: 'Reference Verification', score: 97, weight: 0.15, status: 'low', explanation: 'Reference confirmed' },
        { name: 'Metadata Anomaly', score: 90, weight: 0.10, status: 'low', explanation: 'No anomalies' },
      ],
      recommendation: 'The document itself appears authentic, but the selfie provided does not match the person on the document. Manual review is recommended to verify the identity of the presenter.',
      aiExplanation: 'While the driving licence passes all document authenticity checks — no tampering, valid format, confirmed in reference database — the face verification component has failed. The selfie similarity score of 0.32 is well below the 0.80 threshold. This pattern is consistent with someone presenting another person\'s legitimate document. The document is genuine, but the person presenting it may not be the rightful holder.',
    },
    flags: [
      { id: 'flg-4', severity: 'high', category: 'face_verification', title: 'Face Mismatch', description: 'The selfie does not match the document photo', confidence: 0.95, evidence: 'Facial similarity score 0.32 is well below the 0.80 threshold' },
    ],
  },

  'vrf-004': {
    id: 'vrf-004',
    status: 'completed',
    createdAt: '2026-08-31T13:45:00Z',
    completedAt: '2026-08-31T13:45:35Z',
    document: {
      id: 'doc-004',
      type: 'passport',
      fileName: 'expired_passport.jpg',
      fileSize: 2_300_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T13:45:00Z',
    },
    selfie: {
      id: 'self-004',
      type: 'other',
      fileName: 'selfie_match.jpg',
      fileSize: 1_700_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T13:45:04Z',
    },
    ocr: {
      fields: [
        { fieldName: 'Full Name', value: 'EMMA WILLIAMS', confidence: 0.97 },
        { fieldName: 'Date of Birth', value: '1988-02-28', confidence: 0.98 },
        { fieldName: 'Document Number', value: 'P98765432', confidence: 0.99 },
        { fieldName: 'Nationality', value: 'AUSTRALIA', confidence: 0.96 },
        { fieldName: 'Expiry Date', value: '2024-02-27', confidence: 0.99 },
        { fieldName: 'Issue Date', value: '2014-02-28', confidence: 0.97 },
      ],
      rawText: 'PASSPORT\nAUSTRALIA\nEMMA WILLIAMS\n...',
      overallConfidence: 0.977,
      processingTimeMs: 1050,
    },
    validation: {
      checks: [
        { id: 'vc-1', name: 'Document Format', description: 'Standard passport format', status: 'pass', confidence: 0.97 },
        { id: 'vc-2', name: 'MRZ Validation', description: 'Machine Readable Zone checksum', status: 'pass', confidence: 0.99 },
        { id: 'vc-3', name: 'Expiry Check', description: 'Document has not expired', status: 'fail', confidence: 1.0, details: 'Document expired on 2024-02-27 (expired 2+ years ago)' },
        { id: 'vc-4', name: 'Font Consistency', description: 'Typeface uniformity', status: 'pass', confidence: 0.96 },
        { id: 'vc-5', name: 'Security Features', description: 'Hologram and watermark', status: 'pass', confidence: 0.91 },
      ],
      overallStatus: 'warning',
      score: 72,
    },
    tampering: {
      isTampered: false,
      confidence: 0.95,
      score: 95,
      regions: [],
      techniques: [],
      explanation: 'No tampering detected. The document appears genuine but has expired.',
    },
    faceVerification: {
      isMatch: true,
      similarity: 0.91,
      threshold: 0.80,
      score: 91,
      explanation: 'Good face match. Note: the document photo appears to be several years old, but facial features still match the selfie within acceptable tolerance.',
    },
    reference: {
      isVerified: true,
      matchScore: 0.96,
      score: 72,
      referenceRecord: {
        id: 'ref-004',
        fullName: 'EMMA WILLIAMS',
        documentNumber: 'P98765432',
        dateOfBirth: '1988-02-28',
        issuingAuthority: 'Australian Passport Office',
        issueDate: '2014-02-28',
        expiryDate: '2024-02-27',
        status: 'expired',
      },
      discrepancies: ['Document status is expired in the reference database'],
      explanation: 'Document details match the reference, but the document and its reference record are both expired.',
    },
    risk: {
      overallScore: 45,
      riskLevel: 'review',
      signals: [
        { name: 'Tampering Detection', score: 95, weight: 0.30, status: 'low', explanation: 'No tampering detected' },
        { name: 'Face Verification', score: 91, weight: 0.25, status: 'low', explanation: 'Face match confirmed' },
        { name: 'Document Validation', score: 72, weight: 0.20, status: 'review', explanation: 'Document has expired' },
        { name: 'Reference Verification', score: 72, weight: 0.15, status: 'review', explanation: 'Reference confirms expired status' },
        { name: 'Metadata Anomaly', score: 88, weight: 0.10, status: 'low', explanation: 'No anomalies' },
      ],
      recommendation: 'The document is authentic and the identity is confirmed, but the passport has expired. If the use case requires a valid (non-expired) document, this should be rejected. Otherwise, the identity is verified.',
      aiExplanation: 'This is a genuine Australian passport belonging to Emma Williams. The document passes all authenticity checks — no tampering, valid format, face match, and confirmed in the reference database. However, the passport expired on February 27, 2024. Both the document itself and the reference database confirm the expired status. The holder\'s identity is verified, but the document is no longer valid for purposes requiring current documentation.',
    },
    flags: [
      { id: 'flg-5', severity: 'medium', category: 'validation', title: 'Expired Document', description: 'This document expired on 2024-02-27', confidence: 1.0, evidence: 'Expiry date parsed from OCR and confirmed by reference database' },
    ],
  },

  'vrf-005': {
    id: 'vrf-005',
    status: 'completed',
    createdAt: '2026-08-31T14:30:00Z',
    completedAt: '2026-08-31T14:30:52Z',
    document: {
      id: 'doc-005',
      type: 'gov_id',
      fileName: 'suspicious_id.jpg',
      fileSize: 1_800_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T14:30:00Z',
    },
    selfie: {
      id: 'self-005',
      type: 'other',
      fileName: 'selfie_poor.jpg',
      fileSize: 1_200_000,
      mimeType: 'image/jpeg',
      uploadedAt: '2026-08-31T14:30:05Z',
    },
    ocr: {
      fields: [
        { fieldName: 'Full Name', value: 'ALEX RODRIGUEZ', confidence: 0.78 },
        { fieldName: 'Date of Birth', value: '1995-07-19', confidence: 0.71 },
        { fieldName: 'Document Number', value: 'GID-1122334', confidence: 0.83 },
        { fieldName: 'Nationality', value: 'SPAIN', confidence: 0.89 },
        { fieldName: 'Expiry Date', value: '2027-07-18', confidence: 0.80 },
      ],
      rawText: 'DOCUMENTO NACIONAL DE IDENTIDAD\nESPAÑA\nALEX RODRIGUEZ\n...',
      overallConfidence: 0.802,
      processingTimeMs: 1800,
    },
    validation: {
      checks: [
        { id: 'vc-1', name: 'Document Format', description: 'Standard ID format', status: 'fail', confidence: 0.82, details: 'Layout does not match known Spanish DNI templates' },
        { id: 'vc-2', name: 'Barcode Validation', description: 'Barcode integrity', status: 'fail', confidence: 0.90, details: 'Barcode data does not match printed fields' },
        { id: 'vc-3', name: 'Expiry Check', description: 'Document expiry', status: 'pass', confidence: 1.0 },
        { id: 'vc-4', name: 'Font Consistency', description: 'Typeface uniformity', status: 'fail', confidence: 0.85, details: 'Multiple font families detected, inconsistent with authentic document' },
        { id: 'vc-5', name: 'Security Features', description: 'Hologram and security elements', status: 'fail', confidence: 0.75, details: 'Expected security elements not detected' },
      ],
      overallStatus: 'fail',
      score: 28,
    },
    tampering: {
      isTampered: true,
      confidence: 0.94,
      score: 15,
      regions: [
        { x: 50, y: 40, width: 300, height: 200, type: 'synthetic_document', confidence: 0.94 },
      ],
      techniques: ['full_synthesis', 'font_injection'],
      explanation: 'This document appears to be entirely fabricated rather than a modification of a genuine document. The layout, fonts, and security elements are inconsistent with known authentic Spanish identity documents.',
    },
    faceVerification: {
      isMatch: false,
      similarity: 0.58,
      threshold: 0.80,
      score: 58,
      explanation: 'Partial face match. The similarity score falls below the threshold. Image quality of both the document photo and selfie is suboptimal, which may contribute to the low score.',
    },
    reference: {
      isVerified: false,
      matchScore: 0.0,
      score: 0,
      discrepancies: ['Document number not found in the reference database'],
      explanation: 'The document number GID-1122334 does not exist in any connected reference database. This is a strong indicator that the document is not genuine.',
    },
    risk: {
      overallScore: 94,
      riskLevel: 'high',
      signals: [
        { name: 'Tampering Detection', score: 15, weight: 0.30, status: 'high', explanation: 'Document appears fully fabricated' },
        { name: 'Face Verification', score: 58, weight: 0.25, status: 'review', explanation: 'Partial match, below threshold' },
        { name: 'Document Validation', score: 28, weight: 0.20, status: 'high', explanation: 'Multiple validation failures' },
        { name: 'Reference Verification', score: 0, weight: 0.15, status: 'high', explanation: 'Document not found in any database' },
        { name: 'Metadata Anomaly', score: 20, weight: 0.10, status: 'high', explanation: 'File metadata indicates creation with image editing software' },
      ],
      recommendation: 'This document should be immediately rejected and flagged for investigation. Multiple indicators suggest this is a completely fabricated document, not a modification of a genuine one.',
      aiExplanation: 'This submission presents overwhelming evidence of fraud across all verification dimensions. The document appears to be entirely synthetic — created from scratch rather than modified from a genuine document. Key indicators: (1) The document layout does not match any known authentic Spanish DNI template. (2) The barcode data is inconsistent with the printed information. (3) Multiple font families were detected, which is never the case in authentic documents. (4) No security features (holograms, watermarks, UV elements) were detected. (5) The document number does not exist in reference databases. (6) File metadata reveals creation with image editing software. (7) The face verification is inconclusive with a sub-threshold match. This is a high-confidence fraudulent document.',
    },
    flags: [
      { id: 'flg-6', severity: 'critical', category: 'tampering', title: 'Fully Fabricated Document', description: 'Document appears to be entirely synthetic', confidence: 0.94, evidence: 'Layout, fonts, and security features inconsistent with authentic documents' },
      { id: 'flg-7', severity: 'critical', category: 'reference', title: 'Unknown Document Number', description: 'Document number not found in any reference database', confidence: 1.0, evidence: 'No records match document number GID-1122334' },
      { id: 'flg-8', severity: 'high', category: 'validation', title: 'Barcode Mismatch', description: 'Barcode data conflicts with printed fields', confidence: 0.90, evidence: 'Decoded barcode data does not match OCR-extracted fields' },
      { id: 'flg-9', severity: 'high', category: 'metadata', title: 'Editing Software Detected', description: 'File created with image editing software', confidence: 0.88, evidence: 'EXIF data shows Adobe Photoshop as the creation tool' },
    ],
  },
};

// ─── Mock History Items ─────────────────────────────────────────────────────

export const mockHistoryItems: VerificationHistoryItem[] = [
  { id: 'vrf-001', documentType: 'passport', documentName: 'passport_scan.jpg', submittedAt: '2026-08-31T10:30:00Z', completedAt: '2026-08-31T10:30:45Z', status: 'completed', riskLevel: 'low', riskScore: 12, holderName: 'Sarah Johnson' },
  { id: 'vrf-002', documentType: 'gov_id', documentName: 'national_id.jpg', submittedAt: '2026-08-31T11:15:00Z', completedAt: '2026-08-31T11:15:38Z', status: 'completed', riskLevel: 'high', riskScore: 87, holderName: 'John Smith' },
  { id: 'vrf-003', documentType: 'driving_license', documentName: 'drivers_license.png', submittedAt: '2026-08-31T12:00:00Z', completedAt: '2026-08-31T12:00:42Z', status: 'completed', riskLevel: 'review', riskScore: 58, holderName: 'Michael Chen' },
  { id: 'vrf-004', documentType: 'passport', documentName: 'expired_passport.jpg', submittedAt: '2026-08-31T13:45:00Z', completedAt: '2026-08-31T13:45:35Z', status: 'completed', riskLevel: 'review', riskScore: 45, holderName: 'Emma Williams' },
  { id: 'vrf-005', documentType: 'gov_id', documentName: 'suspicious_id.jpg', submittedAt: '2026-08-31T14:30:00Z', completedAt: '2026-08-31T14:30:52Z', status: 'completed', riskLevel: 'high', riskScore: 94, holderName: 'Alex Rodriguez' },
  { id: 'vrf-006', documentType: 'passport', documentName: 'passport_uk.jpg', submittedAt: '2026-08-30T09:20:00Z', completedAt: '2026-08-30T09:20:40Z', status: 'completed', riskLevel: 'low', riskScore: 8, holderName: 'David Brown' },
  { id: 'vrf-007', documentType: 'driving_license', documentName: 'license_ca.jpg', submittedAt: '2026-08-30T11:45:00Z', completedAt: '2026-08-30T11:45:38Z', status: 'completed', riskLevel: 'low', riskScore: 15, holderName: 'Maria Garcia' },
  { id: 'vrf-008', documentType: 'gov_id', documentName: 'id_de.jpg', submittedAt: '2026-08-29T16:30:00Z', completedAt: '2026-08-29T16:30:42Z', status: 'completed', riskLevel: 'review', riskScore: 52, holderName: 'Hans Mueller' },
  { id: 'vrf-009', documentType: 'passport', documentName: 'passport_jp.jpg', submittedAt: '2026-08-29T08:10:00Z', completedAt: '2026-08-29T08:10:35Z', status: 'completed', riskLevel: 'low', riskScore: 5, holderName: 'Yuki Tanaka' },
  { id: 'vrf-010', documentType: 'gov_id', documentName: 'id_in.jpg', submittedAt: '2026-08-28T14:55:00Z', completedAt: '2026-08-28T14:55:48Z', status: 'completed', riskLevel: 'high', riskScore: 78, holderName: 'Raj Patel' },
];

// ─── Mock Dashboard Stats ───────────────────────────────────────────────────

export const mockDashboardStats: DashboardStats = {
  totalVerifications: 1247,
  highRiskCount: 89,
  authenticCount: 1012,
  reviewCount: 146,
  recentVerifications: mockHistoryItems.slice(0, 5),
  activityData: [
    { date: '2026-08-25', count: 42, highRisk: 3 },
    { date: '2026-08-26', count: 38, highRisk: 5 },
    { date: '2026-08-27', count: 55, highRisk: 4 },
    { date: '2026-08-28', count: 61, highRisk: 7 },
    { date: '2026-08-29', count: 47, highRisk: 2 },
    { date: '2026-08-30', count: 53, highRisk: 6 },
    { date: '2026-08-31', count: 35, highRisk: 3 },
  ],
  riskDistribution: [
    { name: 'Low Risk', value: 1012, color: '#10b981' },
    { name: 'Review', value: 146, color: '#f59e0b' },
    { name: 'High Risk', value: 89, color: '#ef4444' },
  ],
};

// ─── Mock Model Metrics ─────────────────────────────────────────────────────

export const mockModelMetrics: ModelMetrics[] = [
  {
    modelName: 'Tampering Detection',
    version: 'v2.3.1',
    accuracy: 0.946,
    precision: 0.932,
    recall: 0.958,
    f1Score: 0.945,
    totalSamples: 12500,
    confusionMatrix: { truePositive: 4780, falsePositive: 345, trueNegative: 6035, falseNegative: 200 },
    lastUpdated: '2026-08-15',
  },
  {
    modelName: 'Face Verification',
    version: 'v3.1.0',
    accuracy: 0.971,
    precision: 0.965,
    recall: 0.978,
    f1Score: 0.971,
    totalSamples: 18200,
    confusionMatrix: { truePositive: 8900, falsePositive: 318, trueNegative: 8780, falseNegative: 202 },
    lastUpdated: '2026-08-20',
  },
  {
    modelName: 'OCR Engine',
    version: 'v4.0.2',
    accuracy: 0.989,
    precision: 0.991,
    recall: 0.987,
    f1Score: 0.989,
    totalSamples: 25000,
    confusionMatrix: { truePositive: 12350, falsePositive: 112, trueNegative: 12375, falseNegative: 163 },
    lastUpdated: '2026-08-22',
  },
  {
    modelName: 'Risk Fusion',
    version: 'v1.8.0',
    accuracy: 0.923,
    precision: 0.918,
    recall: 0.928,
    f1Score: 0.923,
    totalSamples: 8500,
    confusionMatrix: { truePositive: 3920, falsePositive: 350, trueNegative: 3920, falseNegative: 310 },
    lastUpdated: '2026-08-18',
  },
];

// ─── Mock Notifications ─────────────────────────────────────────────────────

export const mockNotifications: Notification[] = [
  { id: 'ntf-1', type: 'alert', title: 'High Risk Document Detected', message: 'Verification vrf-005 flagged as HIGH RISK — fully fabricated document detected.', timestamp: '2026-08-31T14:31:00Z', read: false, verificationId: 'vrf-005' },
  { id: 'ntf-2', type: 'alert', title: 'Tampering Detected', message: 'Verification vrf-002 detected digital tampering in name and DOB fields.', timestamp: '2026-08-31T11:16:00Z', read: false, verificationId: 'vrf-002' },
  { id: 'ntf-3', type: 'warning', title: 'Face Mismatch Alert', message: 'Verification vrf-003 has a face mismatch — selfie does not match document.', timestamp: '2026-08-31T12:01:00Z', read: true, verificationId: 'vrf-003' },
  { id: 'ntf-4', type: 'success', title: 'Verification Complete', message: 'Verification vrf-001 completed successfully — document is authentic.', timestamp: '2026-08-31T10:31:00Z', read: true, verificationId: 'vrf-001' },
  { id: 'ntf-5', type: 'info', title: 'Model Update Available', message: 'Tampering Detection model v2.4.0 is available. Accuracy improvement: +1.2%.', timestamp: '2026-08-31T08:00:00Z', read: true },
];

// ─── Mock Reference Records ────────────────────────────────────────────────

export const mockReferenceRecords: ReferenceRecord[] = [
  { id: 'ref-001', fullName: 'SARAH JOHNSON', documentNumber: 'P12345678', dateOfBirth: '1990-05-14', issuingAuthority: 'US Department of State', issueDate: '2020-05-14', expiryDate: '2030-05-13', status: 'active' },
  { id: 'ref-002', fullName: 'JANE SMITH', documentNumber: 'ID-7891011', dateOfBirth: '1985-03-15', issuingAuthority: 'UK Home Office', issueDate: '2018-11-22', expiryDate: '2028-11-21', status: 'active' },
  { id: 'ref-003', fullName: 'MICHAEL CHEN', documentNumber: 'DL-55667788', dateOfBirth: '1992-08-03', issuingAuthority: 'Ontario Ministry of Transportation', issueDate: '2019-08-03', expiryDate: '2029-08-02', status: 'active' },
  { id: 'ref-004', fullName: 'EMMA WILLIAMS', documentNumber: 'P98765432', dateOfBirth: '1988-02-28', issuingAuthority: 'Australian Passport Office', issueDate: '2014-02-28', expiryDate: '2024-02-27', status: 'expired' },
];

// ─── Mock Pipeline Steps ────────────────────────────────────────────────────

export const mockPipelineSteps: PipelineStep[] = [
  { id: 'step-1', name: 'Document Upload', description: 'Receiving and validating uploaded files', status: 'waiting', progress: 0 },
  { id: 'step-2', name: 'Image Preprocessing', description: 'Enhancing image quality and orientation', status: 'waiting', progress: 0 },
  { id: 'step-3', name: 'OCR Extraction', description: 'Extracting text fields from the document', status: 'waiting', progress: 0 },
  { id: 'step-4', name: 'Document Validation', description: 'Checking format, expiry, and security features', status: 'waiting', progress: 0 },
  { id: 'step-5', name: 'Tampering Detection', description: 'Running forensic analysis for manipulation', status: 'waiting', progress: 0 },
  { id: 'step-6', name: 'Face Verification', description: 'Comparing document photo with selfie', status: 'waiting', progress: 0 },
  { id: 'step-7', name: 'Reference Check', description: 'Cross-referencing with authority databases', status: 'waiting', progress: 0 },
  { id: 'step-8', name: 'Risk Fusion', description: 'Computing overall risk assessment', status: 'waiting', progress: 0 },
];

// ─── Default Settings ───────────────────────────────────────────────────────

export const defaultSettings: VerificationSettings = {
  riskThresholds: { low: 30, review: 60, high: 80 },
  faceMatchThreshold: 0.80,
  enableReferenceVerification: true,
  autoAnalyze: false,
  retentionDays: 90,
  privacyMode: false,
};
