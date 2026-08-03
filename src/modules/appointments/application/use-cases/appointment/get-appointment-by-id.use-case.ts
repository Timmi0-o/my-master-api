import {
  AppointmentNotFoundError,
  ensureAppointmentAccessible,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { attachPersonalNotesToAppointmentPeers } from 'src/modules/users/application/helpers/attach-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IGetAppointmentByIdApplicationInput } from '../../dtos/appointment/get-appointment-by-id.input';
import type { IGetAppointmentByIdApplicationOutput } from '../../dtos/appointment/get-appointment-by-id.output';

export class GetAppointmentByIdUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
  ) {}

  async execute(
    input: IGetAppointmentByIdApplicationInput,
  ): Promise<IGetAppointmentByIdApplicationOutput> {
    const existing = await this.appointmentRepository.findEntityById(input.id);
    if (!existing || (!input.actor.isStaffUser && existing.deletedAt != null)) {
      throw new AppointmentNotFoundError(input.id);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      existing.masterProfileId,
    );
    ensureMasterProfileExists(profile, existing.masterProfileId);
    ensureAppointmentAccessible(existing, input.actor, profile.userId);

    const item = await this.appointmentRepository.findOne(
      input.id,
      input.params,
    );
    if (!item) {
      throw new AppointmentNotFoundError(input.id);
    }

    if (!input.params.enrich?.personalNotes) {
      return item;
    }

    const [itemWithNotes] = await attachPersonalNotesToAppointmentPeers(
      this.userPersonalNoteRepository,
      input.actor.userId,
      [item],
    );

    return itemWithNotes;
  }
}
