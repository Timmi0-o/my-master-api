export interface IAppointmentChatEntity {
  id: string;
  appointmentId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IAppointmentChatPublicEntity = IAppointmentChatEntity;

export type ICreateAppointmentChatInput = Omit<
  IAppointmentChatEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IUpdateAppointmentChatInput = Partial<
  Omit<ICreateAppointmentChatInput, 'appointmentId'>
>;
