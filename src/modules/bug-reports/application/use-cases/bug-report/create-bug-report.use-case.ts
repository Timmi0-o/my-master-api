import type { ITransactionManager } from '@shared/domain/transactions';
import type { IBugReportRepository } from 'src/modules/bug-reports/domain/repositories/bug-report';
import type { ICreateBugReportApplicationInput } from '../../dtos/bug-report/create-bug-report.input';
import type { ICreateBugReportApplicationOutput } from '../../dtos/bug-report/create-bug-report.output';

export class CreateBugReportUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly bugReportRepository: IBugReportRepository,
  ) {}

  async execute(
    input: ICreateBugReportApplicationInput,
  ): Promise<ICreateBugReportApplicationOutput> {
    return this.transactionManager.runInTransaction((scope) =>
      this.bugReportRepository.create(
        {
          reporterUserId: input.reporterUserId ?? null,
          replyEmail: input.replyEmail ?? null,
          title: input.title,
          description: input.description,
          deviceType: input.deviceType,
          pageUrl: input.pageUrl,
          appVersion: input.appVersion,
          locale: input.locale ?? null,
          deviceInfo: input.deviceInfo,
        },
        scope,
      ),
    );
  }
}
