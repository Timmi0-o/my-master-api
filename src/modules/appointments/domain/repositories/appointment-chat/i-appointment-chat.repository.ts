import type { IReadRepository } from 'src/modules/shared/domain/repositories';
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
> & {
  findEntityById(id: string): Promise<IAppointmentChatEntity | null>;
  findEntityByAppointmentId(
    appointmentId: string,
  ): Promise<IAppointmentChatEntity | null>;
  create(input: ICreateAppointmentChatInput): Promise<IAppointmentChatEntity>;
  update(
    id: string,
    input: IUpdateAppointmentChatInput,
  ): Promise<IAppointmentChatEntity>;
  softDeleteById(id: string): Promise<boolean>;
};
