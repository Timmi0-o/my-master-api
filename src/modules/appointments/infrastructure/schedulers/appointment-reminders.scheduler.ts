import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronProcessDueAppointmentRemindersUseCase } from '../../application/use-cases/appointment/cron-process-due-appointment-reminders.use-case';

@Injectable()
export class AppointmentRemindersScheduler {
  constructor(
    private readonly cronProcessDueAppointmentRemindersUseCase: CronProcessDueAppointmentRemindersUseCase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron(): Promise<void> {
    await this.cronProcessDueAppointmentRemindersUseCase.execute();
  }
}
