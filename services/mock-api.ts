import type { VeridocAPI } from './api';
import type {
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

import {
  mockVerificationResults,
  mockHistoryItems,
  mockDashboardStats,
  mockModelMetrics,
  mockNotifications,
  mockReferenceRecords,
  mockTravelerProfiles,
  mockComparisonPairs,
  defaultSettings,
} from './mock-data';

// ─── Helpers ────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomDelay = (min = 150, max = 400) =>
  delay(min + Math.random() * (max - min));

// ─── Scenario → Verification ID Mapping ────────────────────────────────────

const scenarioMap: Record<DemoScenario, string> = {
  genuine: 'vrf-001',
  tampered: 'vrf-002',
  face_mismatch: 'vrf-003',
  expired: 'vrf-004',
  high_risk: 'vrf-005',
};

// ─── Mock API Implementation ───────────────────────────────────────────────

let currentSettings: VerificationSettings = { ...defaultSettings };
let notifications = [...mockNotifications];
const dynamicResults = { ...mockVerificationResults };

export const mockAPI: VeridocAPI = {
  async analyzeDocument(_formData: FormData): Promise<{ verificationId: string }> {
    await randomDelay(200, 400);
    const ids = Object.keys(dynamicResults);
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    return { verificationId: randomId };
  },

  async getVerification(id: string): Promise<VerificationResult> {
    await randomDelay(100, 250);
    const result = dynamicResults[id] || dynamicResults['vrf-001'];
    return { ...result };
  },

  async getHistory(filters?: { riskLevel?: string; search?: string }): Promise<VerificationHistoryItem[]> {
    await randomDelay(100, 250);
    let items = [...mockHistoryItems];

    if (filters?.riskLevel && filters.riskLevel !== 'all') {
      items = items.filter((item) => item.riskLevel === filters.riskLevel);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.holderName?.toLowerCase().includes(search) ||
          item.documentName.toLowerCase().includes(search) ||
          item.id.toLowerCase().includes(search)
      );
    }

    return items;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await randomDelay(100, 200);
    return { ...mockDashboardStats };
  },

  async searchReference(query: { documentNumber?: string; name?: string }): Promise<ReferenceRecord | null> {
    await randomDelay(250, 600);
    const record = mockReferenceRecords.find((r) => {
      if (query.documentNumber && r.documentNumber.toLowerCase() === query.documentNumber.toLowerCase()) return true;
      if (query.name && r.fullName.toLowerCase().includes(query.name.toLowerCase())) return true;
      return false;
    });
    return record || null;
  },

  async getReport(id: string): Promise<VerificationResult> {
    return this.getVerification(id);
  },

  async generatePDFReport(_id: string): Promise<Blob> {
    await randomDelay(400, 800);
    return new Blob(['Mock PDF Report'], { type: 'application/pdf' });
  },

  async getModelMetrics(): Promise<ModelMetrics[]> {
    await randomDelay(100, 200);
    return [...mockModelMetrics];
  },

  async getNotifications(): Promise<Notification[]> {
    await randomDelay(50, 150);
    return [...notifications];
  },

  async markNotificationRead(id: string): Promise<void> {
    await randomDelay(50, 100);
    notifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
  },

  async submitFeedback(_feedback: Feedback): Promise<void> {
    await randomDelay(150, 300);
  },

  async submitOfficerDecision(verificationId: string, decision: OfficerDecision): Promise<VerificationResult> {
    await randomDelay(200, 400);
    const existing = dynamicResults[verificationId] || dynamicResults['vrf-001'];
    const updated: VerificationResult = {
      ...existing,
      officerDecision: decision,
    };
    dynamicResults[verificationId] = updated;
    return { ...updated };
  },

  async getTravelerProfile(id: string): Promise<TravelerProfile> {
    await randomDelay(100, 250);
    const profile = mockTravelerProfiles[id] || mockTravelerProfiles['TRV-88210'];
    return { ...profile };
  },

  async getAllTravelerProfiles(): Promise<TravelerProfile[]> {
    await randomDelay(100, 250);
    return Object.values(mockTravelerProfiles);
  },

  async getDocumentComparison(id: string): Promise<DocumentComparisonPair> {
    await randomDelay(100, 250);
    const pair = mockComparisonPairs[id] || mockComparisonPairs['cmp-001'];
    return { ...pair };
  },

  async getSettings(): Promise<VerificationSettings> {
    await randomDelay(50, 150);
    return { ...currentSettings };
  },

  async updateSettings(settings: Partial<VerificationSettings>): Promise<VerificationSettings> {
    await randomDelay(100, 250);
    currentSettings = { ...currentSettings, ...settings };
    return { ...currentSettings };
  },

  async loadDemoScenario(scenario: DemoScenario): Promise<VerificationResult> {
    await randomDelay(100, 200);
    const id = scenarioMap[scenario];
    return this.getVerification(id);
  },
};
