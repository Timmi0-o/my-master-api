import type { IBugReportEntity } from 'src/modules/bug-reports/domain/entities/bug-report';
import type { BugReportRow } from './bug-report.row.types';

export function mapBugReportRow(row: BugReportRow): IBugReportEntity {
  return {
    id: row.id,
    reporterUserId: row.reporterUserId,
    replyEmail: row.replyEmail,
    title: row.title,
    description: row.description,
    deviceType: row.deviceType,
    pageUrl: row.pageUrl,
    appVersion: row.appVersion,
    locale: row.locale,
    deviceInfo: row.deviceInfo,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
