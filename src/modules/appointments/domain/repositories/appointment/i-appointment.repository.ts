import type { FindOneParams, ReadResult } from '@shared/domain/query';
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
    existsByClientUserIdAndMasterServiceId(
      clientUserId: string,
      masterServiceId: string,
      scope?: TransactionScope,
    ): Promise<boolean>;
    findInProgressForClient(
      clientUserId: string,
      now: Date,
      params?: FindOneParams<IAppointmentPublicEntity, IAppointmentRelations>,
      scope?: TransactionScope,
    ): Promise<ReadResult<
      IAppointmentPublicEntity,
      IAppointmentRelations
    > | null>;
    findInProgressForMaster(
      masterUserId: string,
      now: Date,
      params?: FindOneParams<IAppointmentPublicEntity, IAppointmentRelations>,
      scope?: TransactionScope,
    ): Promise<ReadResult<
      IAppointmentPublicEntity,
      IAppointmentRelations
    > | null>;
    findConfirmedDueForAutoComplete(
      now: Date,
      limit?: number,
      scope?: TransactionScope,
    ): Promise<IAppointmentEntity[]>;
  };
