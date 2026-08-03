import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronProcessDueAppointmentAutoCompletionsUseCase } from '../../application/use-cases/appointment/cron-process-due-appointment-auto-completions.use-case';

@Injectable()
export class AppointmentAutoCompleteScheduler {
  constructor(
    private readonly cronProcessDueAppointmentAutoCompletionsUseCase: CronProcessDueAppointmentAutoCompletionsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron(): Promise<void> {
    await this.cronProcessDueAppointmentAutoCompletionsUseCase.execute();
  }
}
