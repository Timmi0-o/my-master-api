import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { GetAppointmentChatsOutput } from '../../dtos/appointment-chat/get-appointment-chats.output';

export class GetAppointmentChatsUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
  ) {}

  async execute(
    params: FindManyParams<IAppointmentChatPublicEntity, IAppointmentChatRelations>,
  ): Promise<GetAppointmentChatsOutput> {
    const [items, total] = await Promise.all([
      this.appointmentChatRepository.findMany(params),
      this.appointmentChatRepository.count({ where: params.where }),
    ]);
    return { items, total };
  }
}
