import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateAppointmentInput,
  IAppointmentEntity,
  IAppointmentPublicEntity,
  IAppointmentRelations,
  IUpdateAppointmentInput,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { ReadResult } from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapAppointmentRow,
  type AppointmentRow,
} from '../../row-mappers/appointment';
import {
  APPOINTMENT_RELATIONS,
  APPOINTMENT_VALIDATION_CONFIG,
} from './appointment.relations';
import { mapAppointmentWriteError } from './appointment-write-error.mapper';

@Injectable()
export class PrismaAppointmentRepository
  extends PrismaReadRepository<
    IAppointmentPublicEntity,
    string,
    IAppointmentRelations,
    AppointmentRow
  >
  implements IAppointmentRepository
{
  protected readonly validationConfig = APPOINTMENT_VALIDATION_CONFIG;
  protected readonly relationConfig = APPOINTMENT_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).appointment
      : this.prismaService.appointment;
  }

  protected mapRow(
    row: AppointmentRow,
  ): ReadResult<IAppointmentPublicEntity, IAppointmentRelations> {
    return mapAppointmentRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IAppointmentEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapAppointmentRow(row as AppointmentRow) : null;
  }

  async existsByClientUserIdAndMasterServiceId(
    clientUserId: string,
    masterServiceId: string,
    scope?: TransactionScope,
  ): Promise<boolean> {
    const count = await this.getDelegate(scope).count({
      where: { clientUserId, masterServiceId, deletedAt: null },
    });
    return count > 0;
  }

  async create(
    input: ICreateAppointmentInput,
    scope: TransactionScope,
  ): Promise<IAppointmentEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointment.create({ data: input });
      return mapAppointmentRow(row as AppointmentRow);
    } catch (error) {
      throw mapAppointmentWriteError(error, { masterProfileId: input.masterProfileId });
    }
  }

  async createMany(
    inputs: readonly ICreateAppointmentInput[],
    scope: TransactionScope,
  ): Promise<IAppointmentEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.appointment.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) => mapAppointmentRow(row as AppointmentRow));
    } catch (error) {
      const first = inputs[0];
      throw mapAppointmentWriteError(error, { masterProfileId: first.masterProfileId });
    }
  }

  async update(
    id: string,
    patch: IUpdateAppointmentInput,
    scope: TransactionScope,
  ): Promise<IAppointmentEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointment.update({
        where: { id },
        data: patch,
      });
      return mapAppointmentRow(row as AppointmentRow);
    } catch (error) {
      throw mapAppointmentWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IAppointmentEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapAppointmentRow(row as AppointmentRow);
    } catch (error) {
      throw mapAppointmentWriteError(error, { id });
    }
  }
}
