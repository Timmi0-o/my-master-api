import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateMasterServiceReviewInput,
  IMasterServiceReviewEntity,
  IMasterServiceReviewPublicEntity,
  IMasterServiceReviewRelations,
  IUpdateMasterServiceReviewInput,
} from '../../entities/master-service-review';

export type IMasterServiceReviewRepository = IReadRepository<
  IMasterServiceReviewPublicEntity,
  string,
  IMasterServiceReviewRelations
> &
  ICreateRepository<
    IMasterServiceReviewEntity,
    ICreateMasterServiceReviewInput
  > &
  IUpdateRepository<
    IMasterServiceReviewEntity,
    string,
    IUpdateMasterServiceReviewInput
  > &
  ISoftDeleteRepository<IMasterServiceReviewEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IMasterServiceReviewEntity | null>;
    findEntityByAppointmentId(
      appointmentId: string,
      scope?: TransactionScope,
    ): Promise<IMasterServiceReviewEntity | null>;
  };
