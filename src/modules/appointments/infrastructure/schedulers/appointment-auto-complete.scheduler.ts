import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProcessDueAppointmentAutoCompletionsUseCase } from '../../application/use-cases/appointment/process-due-appointment-auto-completions.use-case';

@Injectable()
export class AppointmentAutoCompleteScheduler {
  constructor(
    private readonly processDueAppointmentAutoCompletionsUseCase: ProcessDueAppointmentAutoCompletionsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron(): Promise<void> {
    await this.processDueAppointmentAutoCompletionsUseCase.execute();
  }
}
