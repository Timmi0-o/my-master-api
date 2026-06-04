import type { IReadRepository } from 'src/modules/shared/domain/repositories';
import type {
  IAppointmentChatMessageEntity,
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
  ICreateAppointmentChatMessageInput,
  IUpdateAppointmentChatMessageInput,
} from '../../entities/appointment-chat-message';

export type IAppointmentChatMessageRepository = IReadRepository<
  IAppointmentChatMessagePublicEntity,
  string,
  IAppointmentChatMessageRelations
> & {
  findEntityById(id: string): Promise<IAppointmentChatMessageEntity | null>;
  create(input: ICreateAppointmentChatMessageInput): Promise<IAppointmentChatMessageEntity>;
  update(
    id: string,
    input: IUpdateAppointmentChatMessageInput,
  ): Promise<IAppointmentChatMessageEntity>;
  softDeleteById(id: string): Promise<boolean>;
};
