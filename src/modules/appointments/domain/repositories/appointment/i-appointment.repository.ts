import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  IAppointmentEntity,
  IAppointmentPublicEntity,
  IAppointmentRelations,
  ICreateAppointmentInput,
  IUpdateAppointmentInput,
} from '../../entities/appointment';

export type IAppointmentRepository = IReadRepository<
  IAppointmentPublicEntity,
  string,
  IAppointmentRelations
> &
  ICreateRepository<IAppointmentEntity, ICreateAppointmentInput> &
  IUpdateRepository<IAppointmentEntity, string, IUpdateAppointmentInput> &
  ISoftDeleteRepository<IAppointmentEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IAppointmentEntity | null>;
  };
