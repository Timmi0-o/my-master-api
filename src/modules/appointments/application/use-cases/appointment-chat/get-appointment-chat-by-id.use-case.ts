import {
  AppointmentChatNotFoundError,
  ensureAppointmentChatAccessible,
  ensureAppointmentChatExists,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { wantsPersonalNotesEnrich } from 'src/modules/shared/domain/query';
import { attachPersonalNotesToAppointmentChatPeers } from 'src/modules/users/application/helpers/attach-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IGetAppointmentChatByIdApplicationInput } from '../../dtos/appointment-chat/get-appointment-chat-by-id.input';
import type { IGetAppointmentChatByIdApplicationOutput } from '../../dtos/appointment-chat/get-appointment-chat-by-id.output';

export class GetAppointmentChatByIdUseCase {
  constructor(
    private readonly appointmentChatRepository: IAppointmentChatRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
  ) {}

  async execute(
    input: IGetAppointmentChatByIdApplicationInput,
  ): Promise<IGetAppointmentChatByIdApplicationOutput> {
    const existing = await this.appointmentChatRepository.findEntityById(
      input.id,
    );
    ensureAppointmentChatExists(existing, input.id);

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentChatAccessible(existing, input.actor, profile.userId);

    const item = await this.appointmentChatRepository.findOne(
      input.id,
      input.params,
    );
    if (!item) {
      throw new AppointmentChatNotFoundError(input.id);
    }

    if (!wantsPersonalNotesEnrich(input.params.enrich)) {
      return item;
    }

    return attachPersonalNotesToAppointmentChatPeers(
      this.userPersonalNoteRepository,
      input.actor.userId,
      item,
    );
  }
}
