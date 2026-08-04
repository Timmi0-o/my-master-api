import { enrichAppointmentPeerAvatars } from 'src/modules/appointments/application/helpers/enrich-appointment-peer-avatars.helper';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { applyReadEnrichments } from 'src/modules/shared/application/enrichment/apply-read-enrichments';
import type { FindManyParams } from 'src/modules/shared/domain/query';
import type { GetAppointmentsOutput } from '../../dtos/appointment/get-appointments.output';

export class GetAppointmentsUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly imageRepository: IImageRepository,
  ) {}

  async execute(
    params: FindManyParams<IAppointmentPublicEntity, IAppointmentRelations>,
  ): Promise<GetAppointmentsOutput> {
    const [items, total] = await Promise.all([
      this.appointmentRepository.findMany(params),
      this.appointmentRepository.count({ where: params.where }),
    ]);

    const enriched = await applyReadEnrichments(
      items,
      { enrich: params.enrich },
      [
        {
          when: (ctx) => Boolean(ctx.enrich?.profileAvatars),
          apply: (current) =>
            enrichAppointmentPeerAvatars(this.imageRepository, current),
        },
      ],
    );

    return { items: enriched, total };
  }
}
