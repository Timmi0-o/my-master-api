import type { TransactionScope } from '@shared/domain/transactions';
import type {
  IBugReportEntity,
  ICreateBugReportInput,
} from '../../entities/bug-report';

export interface IBugReportRepository {
  findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IBugReportEntity | null>;
  create(
    input: ICreateBugReportInput,
    scope: TransactionScope,
  ): Promise<IBugReportEntity>;
}
