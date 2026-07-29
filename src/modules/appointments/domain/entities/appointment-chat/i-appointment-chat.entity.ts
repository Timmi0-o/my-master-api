export interface IAppointmentChatEntity {
  id: string;
  masterProfileId: string;
  clientUserId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IAppointmentChatPublicEntity = IAppointmentChatEntity;
