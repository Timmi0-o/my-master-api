import type { IAppointmentChatPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat';

export interface GetAppointmentChatsOutput {
  items: IAppointmentChatPublicEntity[];
  total: number;
}
