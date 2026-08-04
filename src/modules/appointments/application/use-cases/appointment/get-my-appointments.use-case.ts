import { enrichAppointmentPeerAvatars } from 'src/modules/appointments/application/helpers/enrich-appointment-peer-avatars.helper';
import { enrichAppointmentChatsWithInboxFields } from 'src/modules/appointments/application/helpers/appointment-chat-unread.helper';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import { mergeWhereFilters } from 'src/modules/shared/application/presets/common/query-filter.helper';
import { enrichPersonalNotesWithAppointmentPeers } from 'src/modules/users/application/helpers/enrich-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { GetAppointmentsOutput } from '../../dtos/appointment/get-appointments.output';
import type { IGetMyAppointmentsApplicationInput } from '../../dtos/appointment/get-my-appointments.input';

export class GetMyAppointmentsUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(
    input: IGetMyAppointmentsApplicationInput,
  ): Promise<GetAppointmentsOutput> {
    const params = {
      ...input.params,
      where: mergeWhereFilters(input.params.where, {
        clientUserId: { eq: input.actor.userId },
      }),
    };
    const [items, total] = await Promise.all([
      this.appointmentRepository.findMany(params),
      this.appointmentRepository.count({ where: params.where }),
    ]);

    const enriched = await applyReadEnrichments(
      items,
      {
        enrich: params.enrich,
        actorUserId: input.actor.userId,
      },
      [
        {
          when: (ctx) => Boolean(ctx.enrich?.profileAvatars),
          apply: (current) =>
            enrichAppointmentPeerAvatars(this.imageRepository, current),
        },
        {
          when: (ctx) => Boolean(ctx.enrich?.personalNotes),
          apply: (current, ctx) =>
            enrichPersonalNotesWithAppointmentPeers(
              this.userPersonalNoteRepository,
              ctx.actorUserId,
              current,
            ),
        },
        {
          when: () => true,
          apply: (current, ctx) =>
            enrichAppointmentChatsWithInboxFields(
              this.appointmentChatMessageRepository,
              ctx.actorUserId,
              current,
              { includeLastMessage: true },
            ),
        },
      ],
    );

    return { items: enriched, total };
  }
}
