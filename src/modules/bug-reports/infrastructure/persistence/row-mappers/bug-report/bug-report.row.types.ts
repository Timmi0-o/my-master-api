import type {
  BugReportDeviceType,
  BugReportStatus,
  IBugReportDeviceInfo,
} from 'src/modules/bug-reports/domain/entities/bug-report';

export type BugReportRow = {
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
};
