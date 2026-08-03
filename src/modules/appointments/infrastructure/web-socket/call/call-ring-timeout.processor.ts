import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@shared/infrastructure/queues/queue.constants';
import type { Job } from 'bullmq';
import { CallSessionService } from './call-session.service';

type TCallRingTimeoutJob = {
  callId: string;
};

@Processor(QUEUE_NAMES.CALL_RING_TIMEOUT)
export class CallRingTimeoutProcessor extends WorkerHost {
  constructor(private readonly callSessionService: CallSessionService) {
    super();
  }

  async process(job: Job<TCallRingTimeoutJob>): Promise<void> {
    const session = await this.callSessionService.findById(job.data.callId);
    if (!session || session.status !== 'ringing') {
      return;
    }

    const removed = await this.callSessionService.removeRinging(session.callId);
    if (removed) {
      this.callSessionService.invokeRingTimeoutHandler(removed);
    }
  }
}
