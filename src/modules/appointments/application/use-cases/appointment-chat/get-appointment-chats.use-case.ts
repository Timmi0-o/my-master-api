import { enrichAppointmentChatPeerAvatars } from 'src/modules/appointments/application/helpers/enrich-appointment-peer-avatars.helper';
import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { GetAppointmentChatsOutput } from '../../dtos/appointment-chat/get-appointment-chats.output';

export class GetAppointmentChatsUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(
    params: FindManyParams<
      IAppointmentChatPublicEntity,
      IAppointmentChatRelations
    >,
  ): Promise<GetAppointmentChatsOutput> {
    const [items, total] = await Promise.all([
      this.appointmentChatRepository.findMany(params),
      this.appointmentChatRepository.count({ where: params.where }),
    ]);

    const enriched = await applyReadEnrichments(
      items,
      { enrich: params.enrich },
      [
        {
          when: (ctx) => Boolean(ctx.enrich?.profileAvatars),
          apply: (current) =>
            enrichAppointmentChatPeerAvatars(this.imageRepository, current),
        },
      ],
    );

    return { items: enriched, total };
  }
}
