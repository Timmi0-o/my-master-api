import type { ITransactionManager } from '@shared/domain/transactions';
import type { ICreateAppointmentInput } from 'src/modules/appointments/domain/entities/appointment';
import { AppointmentNotAvailableError } from 'src/modules/appointments/domain/entities/appointment';
import type { ICreateAppointmentChatInput } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { ICreateAppointmentChatMessageInput } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import { ensureMasterProfileIsDifferent } from 'src/modules/appointments/domain/entities/appointment/policies/ensure-master-profile-is-different.policy';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import { MasterServiceNotFoundError } from 'src/modules/masters/domain/entities/master-service';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { ICreateAppointmentApplicationInput } from '../../dtos/appointment/create-appointment.input';
import type { ICreateAppointmentApplicationOutput } from '../../dtos/appointment/create-appointment.output';

export class CreateAppointmentUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly appointmentChatMessageRepository: IAppointmentChatMessageRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    input: ICreateAppointmentApplicationInput,
  ): Promise<ICreateAppointmentApplicationOutput> {
    const clientUserId =
      input.actor.isStaffUser && input.clientUserId
        ? input.clientUserId
        : input.actor.userId;

    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );

    ensureMasterProfileExists(profile, input.masterProfileId);

    ensureMasterProfileIsDifferent(profile, input.actor);

    const service = await this.masterServiceRepository.findEntityById(
      input.masterServiceId,
    );

    if (!service || service.masterProfileId !== input.masterProfileId) {
      throw new MasterServiceNotFoundError(input.masterServiceId);
    }

    const isAvailableSlot =
      (
        await this.appointmentRepository.findMany({
          where: {
            masterProfileId: input.masterProfileId,
            masterServiceId: input.masterServiceId,
            startsAt: input.startsAt,
          },
        })
      )?.length === 0;

    if (!isAvailableSlot) {
      throw new AppointmentNotAvailableError(input.startsAt);
    }

    const createInput: ICreateAppointmentInput = {
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
    };

    return this.transactionManager.runInTransaction(async (scope) => {
      const appointment = await this.appointmentRepository.create(
        createInput,
        scope,
      );

      const chatInput: ICreateAppointmentChatInput = {
        appointmentId: appointment.id,
      };
      const chat = await this.appointmentChatRepository.create(
        chatInput,
        scope,
      );

      if (input.initialMessage) {
        const messageInput: ICreateAppointmentChatMessageInput = {
          chatId: chat.id,
          senderUserId: input.actor.userId,
          body: input.initialMessage.body,
        };
        await this.appointmentChatMessageRepository.create(messageInput, scope);
      }

      return appointment;
    });
  }
}
