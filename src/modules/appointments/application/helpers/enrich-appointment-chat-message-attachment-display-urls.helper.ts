import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageAttachmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import { ResolveFileDisplayUrlUseCase } from 'src/modules/files/application/use-cases/file/resolve-file-display-url.use-case';
import {
  IMAGE_VARIANT_QUALITIES,
  parseImageVariantsFromMetadata,
  type IImageVariantsMap,
} from 'src/modules/files/domain/entities/file';

export type IAppointmentChatMessageWithAttachments =
  IAppointmentChatMessagePublicEntity & {
    attachments?: IAppointmentChatMessageAttachmentPublicEntity[];
  };

async function resolveImageVariantsDisplayUrls(
  metadata: Record<string, unknown> | null | undefined,
  accessLevel: Parameters<ResolveFileDisplayUrlUseCase['execute']>[1],
  resolveFileDisplayUrlUseCase: ResolveFileDisplayUrlUseCase,
): Promise<IImageVariantsMap | undefined> {
  const variants = parseImageVariantsFromMetadata(metadata);
  if (!variants) {
    return undefined;
  }

  const resolvedEntries = await Promise.all(
    IMAGE_VARIANT_QUALITIES.map(async (quality) => {
      const descriptor = variants[quality];
      const displayUrl = await resolveFileDisplayUrlUseCase.execute(
        descriptor.fileUrl,
        accessLevel,
      );
      return [
        quality,
        {
          ...descriptor,
          fileUrl: displayUrl,
        },
      ] as const;
    }),
  );

  return Object.fromEntries(resolvedEntries) as IImageVariantsMap;
}

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

      const variants = await resolveImageVariantsDisplayUrls(
        attachment.file.metadata,
        attachment.file.accessLevel,
        resolveFileDisplayUrlUseCase,
      );

      return {
        ...attachment,
        file: {
          ...attachment.file,
          fileUrl: displayUrl,
          metadata: {
            ...(attachment.file.metadata ?? {}),
            ...(variants ? { variants } : {}),
          },
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
