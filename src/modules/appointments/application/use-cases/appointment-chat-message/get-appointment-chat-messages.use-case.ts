import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { GetAppointmentChatMessagesOutput } from '../../dtos/appointment-chat-message/get-appointment-chat-messages.output';

export class GetAppointmentChatMessagesUseCase {
  constructor(
    private readonly messageRepository: IAppointmentChatMessageRepository,
  ) {}

  async execute(
    params: FindManyParams<
      IAppointmentChatMessagePublicEntity,
      IAppointmentChatMessageRelations
    >,
  ): Promise<GetAppointmentChatMessagesOutput> {
    const [items, total] = await Promise.all([
      this.messageRepository.findMany(params),
      this.messageRepository.count({ where: params.where }),
    ]);
    return { items, total };
  }
}
