export interface IPresignAppointmentChatAttachmentApplicationOutputItem {
  fileId: string;
  name: string;
  path: string;
  url: string;
  kind: string;
}

export type IPresignAppointmentChatAttachmentsApplicationOutput =
  IPresignAppointmentChatAttachmentApplicationOutputItem[];
