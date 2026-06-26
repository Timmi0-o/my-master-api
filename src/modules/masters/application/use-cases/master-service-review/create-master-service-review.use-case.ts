import { ensureAppointmentExists } from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { ICreateMasterServiceReviewInput } from 'src/modules/masters/domain/entities/master-service-review';
import {
  ensureAppointmentReviewable,
  ensureValidReviewRating,
} from 'src/modules/masters/domain/entities/master-service-review';
import type { IMasterServiceReviewRepository } from 'src/modules/masters/domain/repositories/master-service-review/i-master-service-review.repository';
import type { ITransactionManager } from '@shared/domain/transactions';
import type { ICreateMasterServiceReviewApplicationInput } from '../../dtos/master-service-review/create-master-service-review.input';
import type { ICreateMasterServiceReviewApplicationOutput } from '../../dtos/master-service-review/create-master-service-review.output';

export class CreateMasterServiceReviewUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly masterServiceReviewRepository: IMasterServiceReviewRepository,
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(
    input: ICreateMasterServiceReviewApplicationInput,
  ): Promise<ICreateMasterServiceReviewApplicationOutput> {
    ensureValidReviewRating(input.rating);

    const appointment = await this.appointmentRepository.findEntityById(
      input.appointmentId,
    );
    ensureAppointmentExists(appointment, input.appointmentId);

    const existingReview =
      await this.masterServiceReviewRepository.findEntityByAppointmentId(
        input.appointmentId,
      );
    ensureAppointmentReviewable(appointment, input.actor, existingReview);

    const createInput: ICreateMasterServiceReviewInput = {
      clientUserId: appointment.clientUserId,
      masterServiceId: appointment.masterServiceId,
      appointmentId: appointment.id,
      rating: input.rating,
      text: input.text,
    };

    return this.transactionManager.runInTransaction((scope) =>
      this.masterServiceReviewRepository.create(createInput, scope),
    );
  }
}
