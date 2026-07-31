import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import {
  EAppointmentReminderJobStatus,
  EAppointmentReminderJobType,
  type IAppointmentReminderJobEntity,
  type ICreateAppointmentReminderJobInput,
} from 'src/modules/appointments/domain/entities/appointment-reminder-job';
import type { IAppointmentReminderJobRepository } from 'src/modules/appointments/domain/repositories/appointment-reminder-job/i-appointment-reminder-job.repository';

type ReminderJobRow = {
  id: string;
  appointmentId: string;
  type: string;
  runAt: Date;
  status: string;
  attempts: number;
  lastError: string | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAppointmentReminderJobRepository implements IAppointmentReminderJobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertPendingMany(
    inputs: readonly ICreateAppointmentReminderJobInput[],
    scope?: TransactionScope,
  ): Promise<IAppointmentReminderJobEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;
    const results: IAppointmentReminderJobEntity[] = [];

    for (const input of inputs) {
      const row = await client.appointmentReminderJob.upsert({
        where: {
          appointmentId_type: {
            appointmentId: input.appointmentId,
            type: input.type,
          },
        },
        create: {
          appointmentId: input.appointmentId,
          type: input.type,
          runAt: input.runAt,
          status: EAppointmentReminderJobStatus.PENDING,
        },
        update: {
          runAt: input.runAt,
          status: EAppointmentReminderJobStatus.PENDING,
          attempts: 0,
          lastError: null,
          sentAt: null,
        },
      });
      results.push(this.mapRow(row));
    }

    return results;
  }

  async cancelActiveByAppointmentId(
    appointmentId: string,
    scope?: TransactionScope,
  ): Promise<number> {
    const client = scope ? unwrapPrismaTxFromScope(scope) : this.prisma;

    const result = await client.appointmentReminderJob.updateMany({
      where: {
        appointmentId,
        status: {
          in: [
            EAppointmentReminderJobStatus.PENDING,
            EAppointmentReminderJobStatus.PROCESSING,
          ],
        },
      },
      data: {
        status: EAppointmentReminderJobStatus.CANCELLED,
      },
    });

    return result.count;
  }

  async claimDueBatch(
    limit: number,
    now: Date = new Date(),
  ): Promise<IAppointmentReminderJobEntity[]> {
    const rows = await this.prisma.$queryRaw<ReminderJobRow[]>(Prisma.sql`
      UPDATE "AppointmentReminderJobs"
      SET
        "status" = 'PROCESSING'::"AppointmentReminderJobStatus",
        "updated_at" = NOW()
      WHERE "id" IN (
        SELECT "id"
        FROM "AppointmentReminderJobs"
        WHERE "status" = 'PENDING'::"AppointmentReminderJobStatus"
          AND "run_at" <= ${now}
        ORDER BY "run_at" ASC
        FOR UPDATE SKIP LOCKED
        LIMIT ${limit}
      )
      RETURNING
        "id",
        "appointment_id" AS "appointmentId",
        "type",
        "run_at" AS "runAt",
        "status",
        "attempts",
        "last_error" AS "lastError",
        "sent_at" AS "sentAt",
        "created_at" AS "createdAt",
        "updated_at" AS "updatedAt"
    `);

    return rows.map((row) => this.mapRow(row));
  }

  async markSent(
    id: string,
    sentAt: Date = new Date(),
  ): Promise<IAppointmentReminderJobEntity> {
    const row = await this.prisma.appointmentReminderJob.update({
      where: { id },
      data: {
        status: EAppointmentReminderJobStatus.SENT,
        sentAt,
        lastError: null,
      },
    });

    return this.mapRow(row);
  }

  async markFailedOrRetry(input: {
    id: string;
    attempts: number;
    lastError: string;
    retryAt: Date | null;
  }): Promise<IAppointmentReminderJobEntity> {
    const row = await this.prisma.appointmentReminderJob.update({
      where: { id: input.id },
      data: input.retryAt
        ? {
            status: EAppointmentReminderJobStatus.PENDING,
            attempts: input.attempts,
            lastError: input.lastError,
            runAt: input.retryAt,
          }
        : {
            status: EAppointmentReminderJobStatus.FAILED,
            attempts: input.attempts,
            lastError: input.lastError,
          },
    });

    return this.mapRow(row);
  }

  async markCancelled(id: string): Promise<IAppointmentReminderJobEntity> {
    const row = await this.prisma.appointmentReminderJob.update({
      where: { id },
      data: {
        status: EAppointmentReminderJobStatus.CANCELLED,
      },
    });

    return this.mapRow(row);
  }

  private mapRow(row: ReminderJobRow): IAppointmentReminderJobEntity {
    return {
      id: row.id,
      appointmentId: row.appointmentId,
      type: row.type as EAppointmentReminderJobType,
      runAt: row.runAt,
      status: row.status as EAppointmentReminderJobStatus,
      attempts: row.attempts,
      lastError: row.lastError,
      sentAt: row.sentAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
