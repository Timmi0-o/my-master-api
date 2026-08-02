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

/** Viewer-specific: число непрочитанных входящих USER-сообщений. */
export type IAppointmentChatPublicEntity = IAppointmentChatEntity & {
  unreadCount?: number;
};
