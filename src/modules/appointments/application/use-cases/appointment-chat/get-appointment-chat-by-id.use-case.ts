import { enrichAppointmentChatPeerAvatars } from 'src/modules/appointments/application/helpers/enrich-appointment-peer-avatars.helper';
import { enrichAppointmentChatWithUnreadCount } from 'src/modules/appointments/application/helpers/appointment-chat-unread.helper';
import {
  AppointmentChatNotFoundError,
  ensureAppointmentChatAccessible,
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import { enrichPersonalNotesWithAppointmentChatPeers } from 'src/modules/users/application/helpers/enrich-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IGetAppointmentChatByIdApplicationInput } from '../../dtos/appointment-chat/get-appointment-chat-by-id.input';
import type { IGetAppointmentChatByIdApplicationOutput } from '../../dtos/appointment-chat/get-appointment-chat-by-id.output';

export class GetAppointmentChatByIdUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(
    input: IGetAppointmentChatByIdApplicationInput,
  ): Promise<IGetAppointmentChatByIdApplicationOutput> {
    const existing = await this.appointmentChatRepository.findEntityById(
      input.id,
    );
    ensureAppointmentChatExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentChatAccessible(existing, input.actor, profile.userId);

    const item = await this.appointmentChatRepository.findOne(
      input.id,
      input.params,
    );
    if (!item) {
      throw new AppointmentChatNotFoundError(input.id);
    }

    const [enriched] = await applyReadEnrichments(
      [item],
      {
        enrich: input.params.enrich,
        actorUserId: input.actor.userId,
      },
      [
        {
          when: (ctx) => Boolean(ctx.enrich?.profileAvatars),
          apply: (current) =>
            enrichAppointmentChatPeerAvatars(this.imageRepository, current),
        },
        {
          when: (ctx) => Boolean(ctx.enrich?.personalNotes),
          apply: async (current, ctx) => {
            const withNotes = await Promise.all(
              current.map((chat) =>
                enrichPersonalNotesWithAppointmentChatPeers(
                  this.userPersonalNoteRepository,
                  ctx.actorUserId,
                  chat,
                ),
              ),
            );
            return withNotes;
          },
        },
        {
          when: () => true,
          apply: async (current, ctx) =>
            Promise.all(
              current.map((chat) =>
                enrichAppointmentChatWithUnreadCount(
                  this.appointmentChatMessageRepository,
                  ctx.actorUserId,
                  chat,
                ),
              ),
            ),
        },
      ],
    );

    return enriched;
  }
}
