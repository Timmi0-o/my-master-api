import type { IGetMyAppointmentsApplicationInput } from '../../dtos/appointment/get-my-appointments.input';
import type { GetAppointmentsOutput } from '../../dtos/appointment/get-appointments.output';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import { mergeWhereFilters } from 'src/modules/shared/application/presets/common/query-filter.helper';

export class GetMyAppointmentsUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    input: IGetMyAppointmentsApplicationInput,
  ): Promise<GetAppointmentsOutput> {
    const params = {
      ...input.params,
      where: mergeWhereFilters(input.params.where, {
        clientUserId: { eq: input.actor.userId },
      }),
    };
    const [items, total] = await Promise.all([
      this.appointmentRepository.findMany(params),
      this.appointmentRepository.count({ where: params.where }),
    ]);
    return { items, total };
  }
}
