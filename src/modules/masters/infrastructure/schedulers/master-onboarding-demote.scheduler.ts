import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronProcessIncompleteAcceptingMastersUseCase } from '../../application/use-cases/master-profile/cron-process-incomplete-accepting-masters.use-case';

@Injectable()
export class MasterOnboardingDemoteScheduler {
  constructor(
    private readonly cronProcessIncompleteAcceptingMastersUseCase: CronProcessIncompleteAcceptingMastersUseCase,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron(): Promise<void> {
    await this.cronProcessIncompleteAcceptingMastersUseCase.execute();
  }
}
