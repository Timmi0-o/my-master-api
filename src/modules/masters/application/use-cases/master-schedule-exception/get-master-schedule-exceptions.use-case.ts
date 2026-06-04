import type { FindManyParams } from 'src/modules/shared/domain/query';
import type {
  IMasterScheduleExceptionPublicEntity,
  IMasterScheduleExceptionRelations,
} from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { IMasterScheduleExceptionRepository } from 'src/modules/masters/domain/repositories/master-schedule-exception/i-master-schedule-exception.repository';
import type { GetMasterScheduleExceptionsOutput } from '../../dtos/master-schedule-exception/get-master-schedule-exceptions.output';

export class GetMasterScheduleExceptionsUseCase {
  constructor(
    private readonly masterScheduleExceptionRepository: IMasterScheduleExceptionRepository,
  ) {}

  async execute(
    params: FindManyParams<
      IMasterScheduleExceptionPublicEntity,
      IMasterScheduleExceptionRelations
    >,
  ): Promise<GetMasterScheduleExceptionsOutput> {
    const [items, total] = await Promise.all([
      this.masterScheduleExceptionRepository.findMany(params),
      this.masterScheduleExceptionRepository.count({ where: params.where }),
    ]);

    return { items, total };
  }
}
