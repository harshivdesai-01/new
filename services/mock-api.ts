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
} from '@/types';

import {
  mockVerificationResults,
  mockHistoryItems,
  mockDashboardStats,
  mockModelMetrics,
  mockNotifications,
  mockReferenceRecords,
  defaultSettings,
} from './mock-data';

// ─── Helpers ────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const randomDelay = (min = 200, max = 800) => delay(min + Math.random() * (max - min));

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

export const mockAPI: VeridocAPI = {
  async analyzeDocument(_formData: FormData): Promise<{ verificationId: string }> {
    await randomDelay(300, 600);
    // In mock mode, randomly assign one of the verification results
    const ids = Object.keys(mockVerificationResults);
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    return { verificationId: randomId };
  },

  async getVerification(id: string): Promise<VerificationResult> {
    await randomDelay();
    const result = mockVerificationResults[id];
    if (!result) {
      throw new Error(`Verification ${id} not found`);
    }
    return { ...result };
  },

  async getHistory(filters?: { riskLevel?: string; search?: string }): Promise<VerificationHistoryItem[]> {
    await randomDelay();
    let items = [...mockHistoryItems];

    if (filters?.riskLevel && filters.riskLevel !== 'all') {
      items = items.filter(item => item.riskLevel === filters.riskLevel);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      items = items.filter(item =>
        item.holderName?.toLowerCase().includes(search) ||
        item.documentName.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search)
      );
    }

    return items;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await randomDelay();
    return { ...mockDashboardStats };
  },

  async searchReference(query: { documentNumber?: string; name?: string }): Promise<ReferenceRecord | null> {
    await randomDelay(500, 1200);
    const record = mockReferenceRecords.find(r => {
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
    await randomDelay(800, 1500);
    // Return a mock Blob (in production, this would be a real PDF)
    return new Blob(['Mock PDF Report'], { type: 'application/pdf' });
  },

  async getModelMetrics(): Promise<ModelMetrics[]> {
    await randomDelay();
    return [...mockModelMetrics];
  },

  async getNotifications(): Promise<Notification[]> {
    await randomDelay(100, 300);
    return [...notifications];
  },

  async markNotificationRead(id: string): Promise<void> {
    await randomDelay(100, 200);
    notifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
  },

  async submitFeedback(_feedback: Feedback): Promise<void> {
    await randomDelay(300, 600);
    // In production, this would POST to the backend
  },

  async getSettings(): Promise<VerificationSettings> {
    await randomDelay(100, 300);
    return { ...currentSettings };
  },

  async updateSettings(settings: Partial<VerificationSettings>): Promise<VerificationSettings> {
    await randomDelay(200, 500);
    currentSettings = { ...currentSettings, ...settings };
    return { ...currentSettings };
  },

  async loadDemoScenario(scenario: DemoScenario): Promise<VerificationResult> {
    await randomDelay(200, 400);
    const id = scenarioMap[scenario];
    return this.getVerification(id);
  },
};
