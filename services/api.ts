import {
  VerificationResult,
  VerificationHistoryItem,
  DashboardStats,
  ModelMetrics,
  Notification,
  Feedback,
  VerificationSettings,
  ReferenceRecord,
  DemoScenario,
  TravelerProfile,
  DocumentComparisonPair,
  OfficerDecision,
} from '@/types';

// ─── API Interface ──────────────────────────────────────────────────────────

export interface VeridocAPI {
  // Analysis
  analyzeDocument(formData: FormData): Promise<{ verificationId: string }>;
  getVerification(id: string): Promise<VerificationResult>;

  // History
  getHistory(filters?: { riskLevel?: string; search?: string }): Promise<VerificationHistoryItem[]>;

  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;

  // Reference
  searchReference(query: { documentNumber?: string; name?: string }): Promise<ReferenceRecord | null>;

  // Reports
  getReport(id: string): Promise<VerificationResult>;
  generatePDFReport(id: string): Promise<Blob>;

  // Model Metrics
  getModelMetrics(): Promise<ModelMetrics[]>;

  // Notifications
  getNotifications(): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;

  // Feedback & Officer Actions
  submitFeedback(feedback: Feedback): Promise<void>;
  submitOfficerDecision(verificationId: string, decision: OfficerDecision): Promise<VerificationResult>;

  // Multi-Document Traveler Profiles
  getTravelerProfile(id: string): Promise<TravelerProfile>;
  getAllTravelerProfiles(): Promise<TravelerProfile[]>;

  // Document Comparison Pairs
  getDocumentComparison(id: string): Promise<DocumentComparisonPair>;

  // Settings
  getSettings(): Promise<VerificationSettings>;
  updateSettings(settings: Partial<VerificationSettings>): Promise<VerificationSettings>;

  // Demo
  loadDemoScenario(scenario: DemoScenario): Promise<VerificationResult>;
}

// Re-export the mock implementation as the active API
export { mockAPI as api } from './mock-api';
