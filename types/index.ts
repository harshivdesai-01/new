// ─── Document Types ─────────────────────────────────────────────────────────

export type DocumentType = 'passport' | 'gov_id' | 'driving_license' | 'visa' | 'permit' | 'other';

export interface DocumentInfo {
  id: string;
  type: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  imageUrl?: string;
}

// ─── OCR Types ──────────────────────────────────────────────────────────────

export interface OCRField {
  fieldName: string;
  value: string;
  confidence: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
  category?: 'identity' | 'dates' | 'document' | 'biometric';
  isSuspicious?: boolean;
}

export interface OCRResult {
  fields: OCRField[];
  rawText: string;
  overallConfidence: number;
  processingTimeMs: number;
}

// ─── Validation Types ───────────────────────────────────────────────────────

export type CheckStatus = 'pass' | 'warning' | 'fail' | 'skipped';

export interface ValidationCheck {
  id: string;
  name: string;
  description: string;
  status: CheckStatus;
  confidence: number;
  details?: string;
  regionId?: string;
}

export interface ValidationResult {
  checks: ValidationCheck[];
  overallStatus: CheckStatus;
  score: number;
}

// ─── Tampering & Forensic Detection ─────────────────────────────────────────

export interface TamperingRegion {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  confidence: number;
  category?: 'text_manipulation' | 'stamp_anomaly' | 'photo_boundary' | 'font_injection' | 'splice';
  description?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface TamperingResult {
  isTampered: boolean;
  confidence: number;
  score: number;
  regions: TamperingRegion[];
  techniques: string[];
  explanation: string;
}

// ─── Face Verification ─────────────────────────────────────────────────────

export interface FaceVerificationResult {
  isMatch: boolean;
  similarity: number;
  threshold: number;
  score: number;
  documentFaceUrl?: string;
  selfieFaceUrl?: string;
  explanation: string;
  livenessScore?: number;
  faceLandmarksDetected?: boolean;
}

// ─── Reference Verification ────────────────────────────────────────────────

export interface ReferenceRecord {
  id: string;
  fullName: string;
  documentNumber: string;
  dateOfBirth: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked' | 'not_found';
  nationality?: string;
}

export interface ReferenceResult {
  isVerified: boolean;
  matchScore: number;
  score: number;
  referenceRecord?: ReferenceRecord;
  discrepancies: string[];
  explanation: string;
}

// ─── Risk Assessment & Fusion ──────────────────────────────────────────────

export type RiskLevel = 'low' | 'review' | 'high';

export interface RiskSignal {
  name: string;
  score: number;
  weight: number;
  status: RiskLevel;
  explanation: string;
  contributorPercent?: number;
}

export interface RiskAssessment {
  overallScore: number;
  riskLevel: RiskLevel;
  signals: RiskSignal[];
  recommendation: string;
  aiExplanation: string;
  primaryRiskFactor?: string;
}

// ─── Flag / Evidence ────────────────────────────────────────────────────────

export interface Flag {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  confidence: number;
  evidence: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

// ─── Timeline Audit Event ───────────────────────────────────────────────────

export interface TimelineEvent {
  id: string;
  stage: string;
  title: string;
  timestamp: string;
  durationMs: number;
  status: 'passed' | 'warning' | 'flagged' | 'info';
  details: string;
  engineVersion: string;
  meta?: Record<string, string | number>;
}

// ─── Officer Decision Center ────────────────────────────────────────────────

export type OfficerVerdict = 'approve' | 'reject' | 'escalate' | 'secondary_review' | 'pending';

export interface OfficerDecision {
  verdict: OfficerVerdict;
  officerId: string;
  officerName: string;
  notes: string;
  decidedAt: string;
  aiRecommendation: 'CLEAR' | 'REVIEW REQUIRED' | 'HIGH RISK';
  secondaryDepartment?: string;
}

// ─── Multi-Document Traveler Profile ────────────────────────────────────────

export interface TravelerDocument {
  id: string;
  type: DocumentType;
  title: string;
  documentNumber: string;
  issueCountry: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'suspicious';
  imageUrl?: string;
  extractedFields: {
    fullName: string;
    dob: string;
    nationality: string;
    gender: string;
  };
}

export interface IdentityConsistencyConflict {
  field: string;
  docA: { title: string; value: string };
  docB: { title: string; value: string };
  severity: 'high' | 'medium';
  message: string;
}

export interface TravelerProfile {
  travelerId: string;
  primaryName: string;
  dob: string;
  nationality: string;
  consistencyScore: number; // e.g. 98%
  faceConsistency: number; // e.g. 96%
  documents: TravelerDocument[];
  conflicts: IdentityConsistencyConflict[];
  riskSummary: string;
}

// ─── Document Comparison Mode ───────────────────────────────────────────────

export interface DocumentComparisonPair {
  id: string;
  titleA: string;
  docTypeA: DocumentType;
  imageA: string;
  titleB: string;
  docTypeB: DocumentType;
  imageB: string;
  matches: { field: string; valA: string; valB: string; status: 'match' | 'mismatch' | 'unverifiable' }[];
  visualDifferencePercent: number;
  summary: string;
}

// ─── Complete Verification Result ──────────────────────────────────────────

export type VerificationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface VerificationResult {
  id: string;
  status: VerificationStatus;
  createdAt: string;
  completedAt?: string;
  document: DocumentInfo;
  selfie?: DocumentInfo;
  ocr?: OCRResult;
  validation?: ValidationResult;
  tampering?: TamperingResult;
  faceVerification?: FaceVerificationResult;
  reference?: ReferenceResult;
  risk: RiskAssessment;
  flags: Flag[];
  timeline?: TimelineEvent[];
  officerDecision?: OfficerDecision;
  travelerProfileId?: string;
}

// ─── Verification History ──────────────────────────────────────────────────

export interface VerificationHistoryItem {
  id: string;
  documentType: DocumentType;
  documentName: string;
  submittedAt: string;
  completedAt?: string;
  status: VerificationStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  holderName?: string;
  officerDecision?: OfficerVerdict;
}

// ─── Analysis Pipeline ────────────────────────────────────────────────────

export type PipelineStepStatus = 'waiting' | 'processing' | 'completed' | 'warning' | 'failed';

export interface PipelineStep {
  id: string;
  name: string;
  description: string;
  status: PipelineStepStatus;
  progress: number;
  duration?: number;
  result?: string;
}

// ─── Model Metrics ─────────────────────────────────────────────────────────

export interface ModelMetrics {
  modelName: string;
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  totalSamples: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  lastUpdated: string;
}

// ─── Notifications ─────────────────────────────────────────────────────────

export type NotificationType = 'alert' | 'info' | 'success' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  verificationId?: string;
}

// ─── Feedback ──────────────────────────────────────────────────────────────

export type FeedbackCategory =
  | 'correct'
  | 'incorrect_risk'
  | 'incorrect_ocr'
  | 'incorrect_tampering'
  | 'incorrect_face'
  | 'other';

export interface Feedback {
  verificationId: string;
  isCorrect: boolean;
  category?: FeedbackCategory;
  comment?: string;
  submittedAt: string;
}

// ─── Settings ──────────────────────────────────────────────────────────────

export interface VerificationSettings {
  riskThresholds: {
    low: number;
    review: number;
    high: number;
  };
  faceMatchThreshold: number;
  enableReferenceVerification: boolean;
  autoAnalyze: boolean;
  retentionDays: number;
  privacyMode: boolean;
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────

export interface DashboardStats {
  totalVerifications: number;
  highRiskCount: number;
  authenticCount: number;
  reviewCount: number;
  recentVerifications: VerificationHistoryItem[];
  activityData: { date: string; count: number; highRisk: number }[];
  riskDistribution: { name: string; value: number; color: string }[];
}

// ─── Demo Scenario ─────────────────────────────────────────────────────────

export type DemoScenario = 'genuine' | 'tampered' | 'face_mismatch' | 'expired' | 'high_risk';

export interface DemoScenarioInfo {
  id: DemoScenario;
  name: string;
  description: string;
  icon: string;
  riskLevel: RiskLevel;
}
