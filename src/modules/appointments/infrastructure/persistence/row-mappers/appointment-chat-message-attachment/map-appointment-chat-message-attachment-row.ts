import type {
  EAppointmentChatMessageAttachmentKind,
  IAppointmentChatMessageAttachmentPublicEntity,
} from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import {
  mapFileRow,
  type FileRow,
} from 'src/modules/files/infrastructure/persistence/row-mappers/file/file.row-mapper';

export type AppointmentChatMessageAttachmentRow = {
  id: string;
  messageId: string;
  fileId: string;
  kind: EAppointmentChatMessageAttachmentKind;
  sortOrder: number;
  durationMs: number | null;
  createdAt: Date;
  updatedAt: Date;
  file?: FileRow | null;
};

export function mapAppointmentChatMessageAttachmentRow(
  row: AppointmentChatMessageAttachmentRow,
): IAppointmentChatMessageAttachmentPublicEntity {
  const entity: IAppointmentChatMessageAttachmentPublicEntity = {
    id: row.id,
    messageId: row.messageId,
    fileId: row.fileId,
    kind: row.kind,
    sortOrder: row.sortOrder,
    durationMs: row.durationMs ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };

  if (row.file != null) {
    entity.file = mapFileRow(row.file);
  }

  return entity;
}
