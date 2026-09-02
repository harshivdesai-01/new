// ─── Document Types ─────────────────────────────────────────────────────────

export type DocumentType = 'passport' | 'gov_id' | 'driving_license' | 'other';

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
}

export interface ValidationResult {
  checks: ValidationCheck[];
  overallStatus: CheckStatus;
  score: number;
}

// ─── Tampering Detection ────────────────────────────────────────────────────

export interface TamperingRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  confidence: number;
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
}

export interface RiskAssessment {
  overallScore: number;
  riskLevel: RiskLevel;
  signals: RiskSignal[];
  recommendation: string;
  aiExplanation: string;
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

export type FeedbackCategory = 'correct' | 'incorrect_risk' | 'incorrect_ocr' | 'incorrect_tampering' | 'incorrect_face' | 'other';

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
