import { EAddressEntityType } from 'src/modules/geo/domain/entities/address';
import type { IAddressRepository } from 'src/modules/geo/domain/repositories/address';
import {
  buildMasterOnboardingSnapshot,
  isMasterOnboardingFulfilled,
  type EMasterBookingStatus,
  type IMasterOnboardingSnapshot,
} from 'src/modules/masters/domain/entities/master-profile';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service/i-master-service.repository';
import type { IMasterWeeklyScheduleRepository } from 'src/modules/masters/domain/repositories/master-weekly-schedule/i-master-weekly-schedule.repository';

export class MasterOnboardingService {
  constructor(
    private readonly masterServiceRepository: IMasterServiceRepository,
    private readonly masterWeeklyScheduleRepository: IMasterWeeklyScheduleRepository,
    private readonly addressRepository: IAddressRepository,
  ) {}

  async hasService(masterProfileId: string): Promise<boolean> {
    const count = await this.masterServiceRepository.count({
      where: {
        and: [
          { masterProfileId: { eq: masterProfileId } },
          { deletedAt: { isNull: true } },
        ],
      },
    });
    return count > 0;
  }

  async hasSchedule(masterProfileId: string): Promise<boolean> {
    const count = await this.masterWeeklyScheduleRepository.count({
      where: {
        and: [
          { masterProfileId: { eq: masterProfileId } },
          { deletedAt: { isNull: true } },
        ],
      },
    });
    return count > 0;
  }

  async hasAddress(masterProfileId: string): Promise<boolean> {
    const address = await this.addressRepository.findByEntity(
      EAddressEntityType.MASTER_PROFILE,
      masterProfileId,
    );
    return address != null;
  }

  async isFulfilled(masterProfileId: string): Promise<boolean> {
    const [hasService, hasSchedule] = await Promise.all([
      this.hasService(masterProfileId),
      this.hasSchedule(masterProfileId),
    ]);
    return isMasterOnboardingFulfilled({ hasService, hasSchedule });
  }

  async getSnapshot(
    masterProfileId: string,
    bookingStatus: EMasterBookingStatus,
  ): Promise<IMasterOnboardingSnapshot> {
    const [hasService, hasSchedule, hasAddress] = await Promise.all([
      this.hasService(masterProfileId),
      this.hasSchedule(masterProfileId),
      this.hasAddress(masterProfileId),
    ]);

    return buildMasterOnboardingSnapshot(
      { hasService, hasSchedule, hasAddress },
      bookingStatus,
    );
  }
}
