import { BugReportNotFoundError } from '../errors';
import type { IBugReportEntity } from '../i-bug-report.entity';

export function ensureBugReportExists(
  entity: IBugReportEntity | null | undefined,
  id: string,
): asserts entity is IBugReportEntity {
  if (!entity) {
    throw new BugReportNotFoundError(id);
  }
}
