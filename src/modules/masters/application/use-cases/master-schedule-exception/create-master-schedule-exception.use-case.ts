import type { ICreateMasterScheduleExceptionApplicationInput } from 'src/modules/masters/application/dtos/master-schedule-exception/create-master-schedule-exception.input';
import type {
  ICreateMasterScheduleExceptionInput,
  IMasterScheduleExceptionEntity,
} from 'src/modules/masters/domain/entities/master-schedule-exception';
import { MasterProfileNotFoundError } from 'src/modules/masters/domain/errors/master-profile-not-found.error';
import type { IMasterProfileRepository } from 'src/modules/masters/domain/repositories/master-profile/i-master-profile.repository';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import { assertMasterProfileAccess } from '../../helpers/assert-master-profile-access';

export class CreateMasterScheduleExceptionUseCase {
  constructor(
    private readonly masterScheduleExceptionRepository: IMasterScheduleExceptionRepository,
    private readonly masterProfileRepository: IMasterProfileRepository,
  ) {}

  async execute(
    input: ICreateMasterScheduleExceptionApplicationInput,
  ): Promise<IMasterScheduleExceptionEntity> {
    const profile = await this.masterProfileRepository.findEntityById(
      input.masterProfileId,
    );
    if (!profile) {
      throw new MasterProfileNotFoundError(input.masterProfileId);
    }

    assertMasterProfileAccess(profile, input.actor);

    const createInput: ICreateMasterScheduleExceptionInput = {
      masterProfileId: input.masterProfileId,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      kind: input.kind,
      customStartTime: input.customStartTime ?? null,
      customEndTime: input.customEndTime ?? null,
      title: input.title ?? null,
      note: input.note ?? null,
    };

    return this.masterScheduleExceptionRepository.create(createInput);
  }
}
