import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IAppointmentPublicEntity,
  IAppointmentRelations,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { GetAppointmentsOutput } from '../../dtos/appointment/get-appointments.output';

export class GetAppointmentsUseCase {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async execute(
    params: FindManyParams<IAppointmentPublicEntity, IAppointmentRelations>,
  ): Promise<GetAppointmentsOutput> {
    const [items, total] = await Promise.all([
      this.appointmentRepository.findMany(params),
      this.appointmentRepository.count({ where: params.where }),
    ]);
    return { items, total };
  }
}
