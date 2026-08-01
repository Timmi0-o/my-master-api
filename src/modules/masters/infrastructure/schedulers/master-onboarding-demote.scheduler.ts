import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProcessIncompleteAcceptingMastersUseCase } from '../../application/use-cases/master-profile/process-incomplete-accepting-masters.use-case';

@Injectable()
export class MasterOnboardingDemoteScheduler {
  constructor(
    private readonly processIncompleteAcceptingMastersUseCase: ProcessIncompleteAcceptingMastersUseCase,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron(): Promise<void> {
    await this.processIncompleteAcceptingMastersUseCase.execute();
  }
}
