import type { IBugReportDeviceInfo } from './i-bug-report-device-info';
import type { BugReportDeviceType, BugReportStatus } from './bug-report.enums';

export interface IBugReportEntity {
  id: string;
  reporterUserId: string | null;
  replyEmail: string | null;
  title: string;
  description: string;
  deviceType: BugReportDeviceType;
  pageUrl: string;
  appVersion: string;
  locale: string | null;
  deviceInfo: IBugReportDeviceInfo;
  status: BugReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type IBugReportPublicEntity = IBugReportEntity;
