import type { ICreateBugReportApplicationInput } from 'src/modules/bug-reports/application/dtos/bug-report/create-bug-report.input';
import type { ISessionUser } from '@shared/domain/i-session-user';
import type { ICreateBugReportPayload } from '../../validation/schemas/create-bug-report-payload.types';

export function requestBodyToCreateBugReportUseCaseInput(
  payload: ICreateBugReportPayload,
  sessionUser: ISessionUser | null,
): ICreateBugReportApplicationInput {
  const replyEmail = payload.replyEmail?.trim() || null;
  const locale = payload.locale?.trim() || null;

  return {
    reporterUserId: sessionUser?.id ?? null,
    replyEmail,
    title: payload.title.trim(),
    description: payload.description.trim(),
    deviceType: payload.deviceType,
    pageUrl: payload.pageUrl.trim(),
    appVersion: payload.appVersion.trim(),
    locale,
    deviceInfo: payload.deviceInfo,
  };
}
