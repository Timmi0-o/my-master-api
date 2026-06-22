import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateAppointmentChatInput,
  IAppointmentChatEntity,
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
  IUpdateAppointmentChatInput,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { ReadResult } from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapAppointmentChatRow,
  type AppointmentChatRow,
} from '../../row-mappers/appointment-chat';
import {
  APPOINTMENT_CHAT_RELATIONS,
  APPOINTMENT_CHAT_VALIDATION_CONFIG,
} from './appointment-chat.relations';
import { mapAppointmentChatWriteError } from './appointment-chat-write-error.mapper';

@Injectable()
export class PrismaAppointmentChatRepository
  extends PrismaReadRepository<
    IAppointmentChatPublicEntity,
    string,
    IAppointmentChatRelations,
    AppointmentChatRow
  >
  implements IAppointmentChatRepository
{
  protected readonly validationConfig = APPOINTMENT_CHAT_VALIDATION_CONFIG;
  protected readonly relationConfig = APPOINTMENT_CHAT_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).appointmentChat
      : this.prismaService.appointmentChat;
  }

  protected mapRow(
    row: AppointmentChatRow,
  ): ReadResult<IAppointmentChatPublicEntity, IAppointmentChatRelations> {
    return mapAppointmentChatRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapAppointmentChatRow(row as AppointmentChatRow) : null;
  }

  async findEntityByAppointmentId(
    appointmentId: string,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { appointmentId },
    });
    return row ? mapAppointmentChatRow(row as AppointmentChatRow) : null;
  }

  async create(
    input: ICreateAppointmentChatInput,
    scope: TransactionScope,
  ): Promise<IAppointmentChatEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointmentChat.create({ data: input });
      return mapAppointmentChatRow(row as AppointmentChatRow);
    } catch (error) {
      throw mapAppointmentChatWriteError(error, { appointmentId: input.appointmentId });
    }
  }

  async createMany(
    inputs: readonly ICreateAppointmentChatInput[],
    scope: TransactionScope,
  ): Promise<IAppointmentChatEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.appointmentChat.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) => mapAppointmentChatRow(row as AppointmentChatRow));
    } catch (error) {
      const first = inputs[0];
      throw mapAppointmentChatWriteError(error, { appointmentId: first.appointmentId });
    }
  }

  async update(
    id: string,
    patch: IUpdateAppointmentChatInput,
    scope: TransactionScope,
  ): Promise<IAppointmentChatEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointmentChat.update({
        where: { id },
        data: patch,
      });
      return mapAppointmentChatRow(row as AppointmentChatRow);
    } catch (error) {
      throw mapAppointmentChatWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IAppointmentChatEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointmentChat.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapAppointmentChatRow(row as AppointmentChatRow);
    } catch (error) {
      throw mapAppointmentChatWriteError(error, { id });
    }
  }
}
