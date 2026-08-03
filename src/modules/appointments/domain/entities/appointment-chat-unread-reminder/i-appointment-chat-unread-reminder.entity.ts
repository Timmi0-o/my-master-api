export interface IAppointmentChatUnreadReminderEntity {
  id: string;
  chatId: string;
  recipientProfileUserId: string;
  remindersCount: number;
  lastRemindedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ICreateAppointmentChatUnreadReminderInput = {
  chatId: string;
  recipientProfileUserId: string;
  remindersCount: number;
  lastRemindedAt: Date;
};
