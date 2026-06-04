import type { ICreateAppointmentApplicationInput } from '../../dtos/appointment/create-appointment.input';
import type {
  IAppointmentEntity,
  ICreateAppointmentWithChatInput,
} from 'src/modules/appointments/domain/entities/appointment';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { MasterServiceNotFoundError } from 'src/modules/masters/domain/errors/master-service-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    input: ICreateAppointmentApplicationInput,
  ): Promise<IAppointmentEntity> {
    const clientUserId =
      input.actor.isStaffUser && input.clientUserId
        ? input.clientUserId
        : input.actor.userId;

    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(input.masterProfileId);
    }

    const service = await this.masterServiceRepository.findEntityById(
      input.masterServiceId,
    );
    if (!service || service.masterProfileId !== input.masterProfileId) {
      throw new MasterServiceNotFoundError(input.masterServiceId);
    }

    const createInput: ICreateAppointmentWithChatInput = {
      masterProfileId: input.masterProfileId,
      masterServiceId: input.masterServiceId,
      clientUserId,
      startsAt: input.startsAt,
      durationMinutes: service.durationMinutes,
      status: input.status ?? EAppointmentStatus.PENDING,
      totalPrice: service.price,
      serviceName: service.name,
      cancelledAt: null,
      cancelledBy: null,
      cancelReason: null,
      ...(input.initialMessage
        ? {
            initialMessage: {
              body: input.initialMessage.body,
              senderUserId: input.actor.userId,
            },
          }
        : {}),
    };

    return this.appointmentRepository.createWithChat(createInput);
  }
}
