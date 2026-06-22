export interface IAppointmentChatEntity {
  id: string;
  appointmentId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IAppointmentChatPublicEntity = IAppointmentChatEntity;
