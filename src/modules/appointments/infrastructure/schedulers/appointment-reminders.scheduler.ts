import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProcessDueAppointmentRemindersUseCase } from '../../application/use-cases/appointment/process-due-appointment-reminders.use-case';

@Injectable()
export class AppointmentRemindersScheduler {
  constructor(
    private readonly processDueAppointmentRemindersUseCase: ProcessDueAppointmentRemindersUseCase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron(): Promise<void> {
    await this.processDueAppointmentRemindersUseCase.execute();
  }
}
