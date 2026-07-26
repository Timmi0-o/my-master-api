import type {
  BugReportDeviceType,
  IBugReportDeviceInfo,
} from 'src/modules/bug-reports/domain/entities/bug-report';

export interface ICreateBugReportPayload {
  title: string;
  description: string;
  replyEmail?: string | null;
  deviceType: BugReportDeviceType;
  pageUrl: string;
  appVersion: string;
  locale?: string | null;
  deviceInfo: IBugReportDeviceInfo;
}
