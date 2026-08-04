import { enrichAppointmentPeerAvatars } from 'src/modules/appointments/application/helpers/enrich-appointment-peer-avatars.helper';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import { enrichPersonalNotesWithAppointmentPeers } from 'src/modules/users/application/helpers/enrich-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IGetMyClientsInProgressAppointmentApplicationInput } from '../../dtos/appointment/get-my-clients-in-progress-appointment.input';
import type { IGetInProgressAppointmentApplicationOutput } from '../../dtos/appointment/get-in-progress-appointment.output';

export class GetMyClientsInProgressAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(
    input: IGetMyClientsInProgressAppointmentApplicationInput,
  ): Promise<IGetInProgressAppointmentApplicationOutput> {
    const item = await this.appointmentRepository.findInProgressForMaster(
      input.actor.userId,
      new Date(),
      input.params,
    );

    if (!item) {
      return item;
    }

    const [enriched] = await applyReadEnrichments(
      [item],
      {
        enrich: input.params.enrich,
        actorUserId: input.actor.userId,
      },
      [
        {
          when: (ctx) => Boolean(ctx.enrich?.profileAvatars),
          apply: (current) =>
            enrichAppointmentPeerAvatars(this.imageRepository, current),
        },
        {
          when: (ctx) => Boolean(ctx.enrich?.personalNotes),
          apply: (current, ctx) =>
            enrichPersonalNotesWithAppointmentPeers(
              this.userPersonalNoteRepository,
              ctx.actorUserId,
              current,
            ),
        },
      ],
    );

    return enriched;
  }
}
