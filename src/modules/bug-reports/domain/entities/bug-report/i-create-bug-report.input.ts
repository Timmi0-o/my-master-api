import type { IBugReportDeviceInfo } from './i-bug-report-device-info';
import type { BugReportDeviceType } from './bug-report.enums';

export interface ICreateBugReportInput {
  reporterUserId?: string | null;
  replyEmail?: string | null;
  title: string;
  description: string;
  deviceType: BugReportDeviceType;
  pageUrl: string;
  appVersion: string;
  locale?: string | null;
  deviceInfo: IBugReportDeviceInfo;
}
