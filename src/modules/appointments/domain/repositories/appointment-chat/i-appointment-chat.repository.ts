import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  IAppointmentChatEntity,
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
  ICreateAppointmentChatInput,
  IUpdateAppointmentChatInput,
} from '../../entities/appointment-chat';

export type IAppointmentChatRepository = IReadRepository<
  IAppointmentChatPublicEntity,
  string,
  IAppointmentChatRelations
> &
  ICreateRepository<IAppointmentChatEntity, ICreateAppointmentChatInput> &
  IUpdateRepository<
    IAppointmentChatEntity,
    string,
    IUpdateAppointmentChatInput
  > &
  ISoftDeleteRepository<IAppointmentChatEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IAppointmentChatEntity | null>;
    findEntityByAppointmentId(
      appointmentId: string,
      scope?: TransactionScope,
    ): Promise<IAppointmentChatEntity | null>;
  };
