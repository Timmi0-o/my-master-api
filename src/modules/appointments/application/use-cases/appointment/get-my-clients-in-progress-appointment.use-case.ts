import { attachPersonalNotesToAppointmentPeers } from 'src/modules/users/application/helpers/attach-personal-notes.helper';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IGetMyClientsInProgressAppointmentApplicationInput } from '../../dtos/appointment/get-my-clients-in-progress-appointment.input';
import type { IGetInProgressAppointmentApplicationOutput } from '../../dtos/appointment/get-in-progress-appointment.output';

export class GetMyClientsInProgressAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
  ) {}

  async execute(
    input: IGetMyClientsInProgressAppointmentApplicationInput,
  ): Promise<IGetInProgressAppointmentApplicationOutput> {
    const item = await this.appointmentRepository.findInProgressForMaster(
      input.actor.userId,
      new Date(),
      input.params,
    );

    if (!item || !input.params.enrich?.personalNotes) {
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
