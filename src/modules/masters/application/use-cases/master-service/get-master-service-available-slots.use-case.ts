import { formatInTimeZone } from 'date-fns-tz';
import type { IAppointmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment';
import { EAppointmentStatus } from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { IMasterScheduleExceptionPublicEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { IMasterWeeklySchedulePublicEntity } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import { MasterServiceNotFoundError } from 'src/modules/masters/domain/errors/master-service-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';
import type { IGetMasterServiceAvailableSlotsInput } from '../../dtos/master-service/get-master-service-available-slots.input';
import type { IGetMasterServiceAvailableSlotsOutput } from '../../dtos/master-service/get-master-service-available-slots.output';
import {
  calculateMasterAvailableSlots,
  getLocalDayBoundsUtc,
} from '../../services/calculate-master-available-slots';

export class GetMasterServiceAvailableSlotsUseCase {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
    private readonly masterScheduleExceptionRepository: IMasterScheduleExceptionRepository,
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(
    input: IGetMasterServiceAvailableSlotsInput,
  ): Promise<IGetMasterServiceAvailableSlotsOutput> {
    const service = await this.masterServiceRepository.findEntityById(
      input.masterServiceId,
    );
    if (!service) {
      throw new MasterServiceNotFoundError(input.masterServiceId);
    }

    const profile = await this.masterProfileRepository.findEntityById(
      service.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(service.masterProfileId);
    }

    const timezone = profile.timezone || 'Europe/Moscow';
    const now = new Date();
    const date = input.date ?? formatInTimeZone(now, timezone, 'yyyy-MM-dd');

    const { dayStart, dayEnd } = getLocalDayBoundsUtc(date, timezone);

    const [weeklySchedules, exceptions, appointments] = await Promise.all([
      this.masterWeeklyScheduleRepository.findMany({
        where: {
          and: [
            { masterProfileId: { eq: profile.id } },
            { deletedAt: { isNull: true } },
          ],
        },
      }),
      this.masterScheduleExceptionRepository.findMany({
        where: {
          and: [
            { masterProfileId: { eq: profile.id } },
            { startsAt: { lt: dayEnd } },
            { endsAt: { gt: dayStart } },
            { deletedAt: { isNull: true } },
          ],
        },
      }),
      this.appointmentRepository.findMany({
        where: {
          and: [
            { masterProfileId: { eq: profile.id } },
            { startsAt: { gte: dayStart, lt: dayEnd } },
            { status: { notIn: [EAppointmentStatus.CANCELLED] } },
            { deletedAt: { isNull: true } },
          ],
        },
      }),
    ]);

    const slots = calculateMasterAvailableSlots({
      profile,
      service,
      date,
      weeklySchedules: weeklySchedules as IMasterWeeklySchedulePublicEntity[],
      exceptions: exceptions as IMasterScheduleExceptionPublicEntity[],
      appointments: appointments as IAppointmentPublicEntity[],
      now,
    });

    return { date, timezone, slots };
  }
}
