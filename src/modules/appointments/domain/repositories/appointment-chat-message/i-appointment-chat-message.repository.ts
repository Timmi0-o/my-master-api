import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
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
> &
  ICreateRepository<
    IAppointmentChatMessageEntity,
    ICreateAppointmentChatMessageInput
  > &
  IUpdateRepository<
    IAppointmentChatMessageEntity,
    string,
    IUpdateAppointmentChatMessageInput
  > &
  ISoftDeleteRepository<IAppointmentChatMessageEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IAppointmentChatMessageEntity | null>;
  };
