import { DomainError } from '@shared/domain/errors';

export class BugReportNotFoundError extends DomainError {
  constructor(bugReportId: string) {
    super('BUG_REPORT_NOT_FOUND', 'Bug report not found', { bugReportId });
  }
}
