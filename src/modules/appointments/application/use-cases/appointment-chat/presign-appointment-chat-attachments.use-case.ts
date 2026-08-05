import { ensureChatHasActiveAppointment } from '@modules/appointments/domain/entities/appointment/policies/ensure-chat-has-active-appointment.policy';
import {
  ensureAppointmentChatAccessible,
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { AppointmentChatMessageForbiddenError } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import {
  APPOINTMENT_CHAT_ATTACHMENT_FILE_DEFAULTS,
  APPOINTMENT_CHAT_ATTACHMENT_KIND_TO_FILE_TYPE,
  ensureAttachmentCountWithinLimit,
  ensureAttachmentFileSizeAllowed,
  ensureAttachmentMimeAllowed,
} from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { PresignedUploadUseCase } from 'src/modules/files/application/use-cases/file/presigned-upload.use-case';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { ensureUsersNotBlocked } from 'src/modules/users/domain/entities/user-block';
import type { IUserBlockRepository } from 'src/modules/users/domain/repositories/user-block/i-user-block.repository';
import type { IPresignAppointmentChatAttachmentsApplicationInput } from '../../dtos/appointment-chat/presign-appointment-chat-attachments.input';
import type { IPresignAppointmentChatAttachmentsApplicationOutput } from '../../dtos/appointment-chat/presign-appointment-chat-attachments.output';

export class PresignAppointmentChatAttachmentsUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userBlockRepository: IUserBlockRepository,
    private readonly presignedUploadUseCase: PresignedUploadUseCase,
  ) {}

  async execute(
    input: IPresignAppointmentChatAttachmentsApplicationInput,
  ): Promise<IPresignAppointmentChatAttachmentsApplicationOutput> {
    if (input.files.length === 0) {
      return [];
    }

    ensureAttachmentCountWithinLimit(input.files.length);

    for (const file of input.files) {
      ensureAttachmentMimeAllowed(file.kind, file.mimeType);
      ensureAttachmentFileSizeAllowed(file.kind, file.sizeBytes);
    }

    const chat = await this.appointmentChatRepository.findEntityById(
      input.chatId,
    );
    ensureAppointmentChatExists(chat, input.chatId);

    const profile = await this.masterProfileRepository.findEntityById(
      chat.masterProfileId,
    );
    ensureMasterProfileExists(profile, chat.masterProfileId);
    ensureAppointmentChatAccessible(chat, input.actor, profile.userId);

    const isClient = chat.clientUserId === input.actor.userId;
    const isMaster = profile.userId === input.actor.userId;
    if (!input.actor.isStaffUser && !isClient && !isMaster) {
      throw new AppointmentChatMessageForbiddenError(input.chatId);
    }

    const appointments = await this.appointmentRepository.findMany({
      where: { chatId: chat.id },
    });
    ensureChatHasActiveAppointment(appointments, chat.id);

    await ensureUsersNotBlocked(
      this.userBlockRepository,
      chat.clientUserId,
      profile.userId,
    );

    const defaults = APPOINTMENT_CHAT_ATTACHMENT_FILE_DEFAULTS;

    const presigned = await this.presignedUploadUseCase.execute({
      actor: {
        userId: input.actor.userId,
        isStaffUser: input.actor.isStaffUser,
      },
      userId: input.actor.userId,
      files: input.files.map((file) => ({
        name: file.name,
        sha256sum: file.sha256sum,
        ownerId: chat.id,
        uploadedBy: input.actor.userId,
        ownerKind: defaults.ownerKind,
        ownerType: defaults.ownerType,
        accessLevel: defaults.accessLevel,
        purpose: defaults.purpose,
        fileType: APPOINTMENT_CHAT_ATTACHMENT_KIND_TO_FILE_TYPE[file.kind],
      })),
    });

    return presigned.map((item, index) => ({
      fileId: item.fileId,
      name: item.name,
      path: item.path,
      url: item.url,
      kind: input.files[index].kind,
    }));
  }
}
