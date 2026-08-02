export interface IAppointmentChatEntity {
  id: string;
  masterProfileId: string;
  clientUserId: string;
  clientLastReadAt: Date | null;
  masterLastReadAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IAppointmentChatPublicEntity = IAppointmentChatEntity;
