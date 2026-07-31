import type { TransactionScope } from '@shared/domain/transactions';
import type {
  IAppointmentReminderJobEntity,
  ICreateAppointmentReminderJobInput,
} from '../../entities/appointment-reminder-job';

export type IAppointmentReminderJobRepository = {
  upsertPendingMany(
    inputs: readonly ICreateAppointmentReminderJobInput[],
    scope?: TransactionScope,
  ): Promise<IAppointmentReminderJobEntity[]>;

  cancelActiveByAppointmentId(
    appointmentId: string,
    scope?: TransactionScope,
  ): Promise<number>;

  claimDueBatch(
    limit: number,
    now?: Date,
  ): Promise<IAppointmentReminderJobEntity[]>;

  markSent(id: string, sentAt?: Date): Promise<IAppointmentReminderJobEntity>;

  markFailedOrRetry(input: {
    id: string;
    attempts: number;
    lastError: string;
    retryAt: Date | null;
  }): Promise<IAppointmentReminderJobEntity>;

  markCancelled(id: string): Promise<IAppointmentReminderJobEntity>;
};
