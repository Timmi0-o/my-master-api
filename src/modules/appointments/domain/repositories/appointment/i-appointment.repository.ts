import type { IReadRepository } from 'src/modules/shared/domain/repositories';
import type {
  IAppointmentEntity,
  IAppointmentPublicEntity,
  IAppointmentRelations,
  ICreateAppointmentInput,
  ICreateAppointmentWithChatInput,
  IUpdateAppointmentInput,
} from '../../entities/appointment';

export type IAppointmentRepository = IReadRepository<
  IAppointmentPublicEntity,
  string,
  IAppointmentRelations
> & {
  findEntityById(id: string): Promise<IAppointmentEntity | null>;
  create(input: ICreateAppointmentInput): Promise<IAppointmentEntity>;
  createWithChat(
    input: ICreateAppointmentWithChatInput,
  ): Promise<IAppointmentEntity>;
  update(
    id: string,
    input: IUpdateAppointmentInput,
  ): Promise<IAppointmentEntity>;
  softDeleteById(id: string): Promise<boolean>;
};
