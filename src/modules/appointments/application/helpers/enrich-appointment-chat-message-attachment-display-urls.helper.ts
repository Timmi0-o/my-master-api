import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageAttachmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import { ResolveFileDisplayUrlUseCase } from 'src/modules/files/application/use-cases/file/resolve-file-display-url.use-case';

export type IAppointmentChatMessageWithAttachments =
  IAppointmentChatMessagePublicEntity & {
    attachments?: IAppointmentChatMessageAttachmentPublicEntity[];
  };

export async function enrichAppointmentChatMessageAttachmentDisplayUrls(
  message: IAppointmentChatMessageWithAttachments,
  resolveFileDisplayUrlUseCase: ResolveFileDisplayUrlUseCase,
): Promise<IAppointmentChatMessageWithAttachments> {
  const attachments = message.attachments;
  if (!attachments || attachments.length === 0) {
    return message;
  }

  const nextAttachments = await Promise.all(
    attachments.map(async (attachment) => {
      if (!attachment.file) {
        return attachment;
      }

      const displayUrl = await resolveFileDisplayUrlUseCase.execute(
        attachment.file.fileUrl,
        attachment.file.accessLevel,
      );

      return {
        ...attachment,
        file: {
          ...attachment.file,
          fileUrl: displayUrl,
        },
      };
    }),
  );

  return {
    ...message,
    attachments: nextAttachments,
  };
}

export async function enrichAppointmentChatMessagesAttachmentDisplayUrls(
  messages: readonly IAppointmentChatMessageWithAttachments[],
  resolveFileDisplayUrlUseCase: ResolveFileDisplayUrlUseCase,
): Promise<IAppointmentChatMessageWithAttachments[]> {
  return Promise.all(
    messages.map((message) =>
      enrichAppointmentChatMessageAttachmentDisplayUrls(
        message,
        resolveFileDisplayUrlUseCase,
      ),
    ),
  );
}
