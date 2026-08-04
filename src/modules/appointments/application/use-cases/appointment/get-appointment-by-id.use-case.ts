import { enrichAppointmentPeerAvatars } from 'src/modules/appointments/application/helpers/enrich-appointment-peer-avatars.helper';
import {
  AppointmentNotFoundError,
  ensureAppointmentAccessible,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { ensureMasterProfileExists } from 'src/modules/masters/domain/entities/master-profile';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import { enrichPersonalNotesWithAppointmentPeers } from 'src/modules/users/application/helpers/enrich-personal-notes.helper';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IGetAppointmentByIdApplicationInput } from '../../dtos/appointment/get-appointment-by-id.input';
import type { IGetAppointmentByIdApplicationOutput } from '../../dtos/appointment/get-appointment-by-id.output';

export class GetAppointmentByIdUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
    private readonly imageRepository: IImageRepository,
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
