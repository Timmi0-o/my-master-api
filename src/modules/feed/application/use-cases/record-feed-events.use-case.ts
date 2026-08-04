import {
  type ICreateUserServiceInteractionInput,
  resolveUserServiceInteractionDedupWindowMs,
  USER_SERVICE_INTERACTION_MAX_EVENTS_PER_REQUEST,
} from 'src/modules/feed/domain/entities/user-service-interaction';
import type { IUserServiceInteractionRepository } from 'src/modules/feed/domain/repositories/user-service-interaction';
import {
  ensureMasterServiceExists,
  MasterServiceNotFoundError,
} from 'src/modules/masters/domain/entities/master-service';
import type { IMasterServiceRepository } from 'src/modules/masters/domain/repositories/master-service';
import type { IRecordFeedEventsApplicationInput } from '../dtos/i-record-feed-events-input.dto';
import type { IRecordFeedEventsApplicationOutput } from '../dtos/i-record-feed-events-output.dto';

export class RecordFeedEventsUseCase {
  constructor(
    private readonly interactionRepository: IUserServiceInteractionRepository,
    private readonly masterServiceRepository: IMasterServiceRepository,
  ) {}

  async execute(
    input: IRecordFeedEventsApplicationInput,
  ): Promise<IRecordFeedEventsApplicationOutput> {
    const events = input.events.slice(
      0,
      USER_SERVICE_INTERACTION_MAX_EVENTS_PER_REQUEST,
    );
    const toCreate: ICreateUserServiceInteractionInput[] = [];
    let skipped = 0;

    const seenInBatch = new Set<string>();

    for (const event of events) {
      const batchKey = `${event.masterServiceId}:${event.type}`;
      if (seenInBatch.has(batchKey)) {
        skipped += 1;
        continue;
      }
      seenInBatch.add(batchKey);

      const service = await this.masterServiceRepository.findEntityById(
        event.masterServiceId,
      );
      ensureMasterServiceExists(service, event.masterServiceId);
      if (service.deletedAt != null) {
        throw new MasterServiceNotFoundError(event.masterServiceId);
      }

      const since = new Date(
        Date.now() - resolveUserServiceInteractionDedupWindowMs(event.type),
      );
      const duplicate = await this.interactionRepository.findRecentDuplicate(
        input.userId,
        event.masterServiceId,
        event.type,
        since,
      );

      if (duplicate) {
        skipped += 1;
        continue;
      }

      toCreate.push({
        userId: input.userId,
        masterServiceId: event.masterServiceId,
        type: event.type,
      });
    }

    const created = await this.interactionRepository.createMany(toCreate);

    return {
      accepted: created.length,
      skipped,
    };
  }
}
