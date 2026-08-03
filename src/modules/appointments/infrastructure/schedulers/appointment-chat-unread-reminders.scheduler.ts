import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronProcessAppointmentChatUnreadRemindersUseCase } from '../../application/use-cases/appointment-chat/cron-process-appointment-chat-unread-reminders.use-case';

@Injectable()
export class AppointmentChatUnreadRemindersScheduler {
  constructor(
    private readonly cronProcessAppointmentChatUnreadRemindersUseCase: CronProcessAppointmentChatUnreadRemindersUseCase,
  ) {}

  @Cron(CronExpression.EVERY_3_HOURS)
  async handleCron(): Promise<void> {
    await this.cronProcessAppointmentChatUnreadRemindersUseCase.execute();
  }
}
