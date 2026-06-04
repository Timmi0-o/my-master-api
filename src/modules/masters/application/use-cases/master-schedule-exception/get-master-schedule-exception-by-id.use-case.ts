import type { IGetMasterScheduleExceptionByIdApplicationInput } from 'src/modules/masters/application/dtos/master-schedule-exception/get-master-schedule-exception-by-id.input';
import type { IMasterScheduleExceptionPublicEntity } from 'src/modules/masters/domain/entities/master-schedule-exception';
import { MasterScheduleExceptionNotFoundError } from 'src/modules/masters/domain/errors/master-schedule-exception-not-found.error';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';

export class GetMasterScheduleExceptionByIdUseCase {
  constructor(
    private readonly masterScheduleExceptionRepository: IMasterScheduleExceptionRepository,
  ) {}

  async execute(
    input: IGetMasterScheduleExceptionByIdApplicationInput,
  ): Promise<IMasterScheduleExceptionPublicEntity> {
    const entity = await this.masterScheduleExceptionRepository.findEntityById(
      input.id,
    );
    if (!entity || (!input.actor.isStaffUser && entity.deletedAt != null)) {
      throw new MasterScheduleExceptionNotFoundError(input.id);
    }

    const item = await this.masterScheduleExceptionRepository.findOne(
      input.id,
      input.params,
    );
    if (!item) {
      throw new MasterScheduleExceptionNotFoundError(input.id);
    }
    return item;
  }
}
