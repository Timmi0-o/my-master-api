import type { IResolveCallParticipantsApplicationInput } from '../../../application/dtos/call/resolve-call-participants.input';
import type { IResolveCallParticipantsApplicationResult } from '../../../application/dtos/call/resolve-call-participants.result';
import {
  ensureAppointmentChatAccessible,
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { BadRequestException } from '@nestjs/common';

export class ResolveCallParticipantsUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: IResolveCallParticipantsApplicationInput,
  ): Promise<IResolveCallParticipantsApplicationResult> {
    const chat = await this.appointmentChatRepository.findEntityById(
      input.chatId,
    );
    ensureAppointmentChatExists(chat, input.chatId);

    const profile = await this.masterProfileRepository.findEntityById(
      chat.masterProfileId,
    );
    ensureMasterProfileExists(profile, chat.masterProfileId);
    ensureAppointmentChatAccessible(chat, input.actor, profile.userId);

    const clientUserId = chat.clientUserId;
    const masterUserId = profile.userId;
    const actorUserId = input.actor.userId;

    const isClient = clientUserId === actorUserId;
    const isMaster = masterUserId === actorUserId;

    if (!isClient && !isMaster) {
      throw new BadRequestException(
        'Только участники чата могут совершать звонки',
      );
    }

    const calleeUserId = isClient ? masterUserId : clientUserId;

    if (calleeUserId === actorUserId) {
      throw new BadRequestException('Нельзя позвонить самому себе');
    }

    return {
      chatId: chat.id,
      callerUserId: actorUserId,
      calleeUserId,
    };
  }
}
