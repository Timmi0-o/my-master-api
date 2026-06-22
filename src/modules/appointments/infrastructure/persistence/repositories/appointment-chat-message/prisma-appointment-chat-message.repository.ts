import { Inject, Injectable } from '@nestjs/common';
import { LOGGER_TOKEN, type ILogger } from '@shared/domain/logging/logger.token';
import type { TransactionScope } from '@shared/domain/transactions';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  ICreateAppointmentChatMessageInput,
  IAppointmentChatMessageEntity,
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
  IUpdateAppointmentChatMessageInput,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { ReadResult } from '@shared/domain/query';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapAppointmentChatMessageRow,
  type AppointmentChatMessageRow,
} from '../../row-mappers/appointment-chat-message';
import {
  APPOINTMENT_CHAT_MESSAGE_RELATIONS,
  APPOINTMENT_CHAT_MESSAGE_VALIDATION_CONFIG,
} from './appointment-chat-message.relations';
import { mapAppointmentChatMessageWriteError } from './appointment-chat-message-write-error.mapper';

@Injectable()
export class PrismaAppointmentChatMessageRepository
  extends PrismaReadRepository<
    IAppointmentChatMessagePublicEntity,
    string,
    IAppointmentChatMessageRelations,
    AppointmentChatMessageRow
  >
  implements IAppointmentChatMessageRepository
{
  protected readonly validationConfig = APPOINTMENT_CHAT_MESSAGE_VALIDATION_CONFIG;
  protected readonly relationConfig = APPOINTMENT_CHAT_MESSAGE_RELATIONS;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(LOGGER_TOKEN) logger: ILogger,
  ) {
    super(logger);
  }

  protected getDelegate(scope?: TransactionScope) {
    return scope
      ? unwrapPrismaTxFromScope(scope).appointmentChatMessage
      : this.prismaService.appointmentChatMessage;
  }

  protected mapRow(
    row: AppointmentChatMessageRow,
  ): ReadResult<IAppointmentChatMessagePublicEntity, IAppointmentChatMessageRelations> {
    return mapAppointmentChatMessageRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: { id },
    });
    return row ? mapAppointmentChatMessageRow(row as AppointmentChatMessageRow) : null;
  }

  async create(
    input: ICreateAppointmentChatMessageInput,
    scope: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointmentChatMessage.create({ data: input });
      return mapAppointmentChatMessageRow(row as AppointmentChatMessageRow);
    } catch (error) {
      throw mapAppointmentChatMessageWriteError(error, { chatId: input.chatId });
    }
  }

  async createMany(
    inputs: readonly ICreateAppointmentChatMessageInput[],
    scope: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity[]> {
    if (inputs.length === 0) {
      return [];
    }

    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const rows = await tx.appointmentChatMessage.createManyAndReturn({
        data: [...inputs],
      });
      return rows.map((row) => mapAppointmentChatMessageRow(row as AppointmentChatMessageRow));
    } catch (error) {
      const first = inputs[0];
      throw mapAppointmentChatMessageWriteError(error, { chatId: first.chatId });
    }
  }

  async update(
    id: string,
    patch: IUpdateAppointmentChatMessageInput,
    scope: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointmentChatMessage.update({
        where: { id },
        data: patch,
      });
      return mapAppointmentChatMessageRow(row as AppointmentChatMessageRow);
    } catch (error) {
      throw mapAppointmentChatMessageWriteError(error, { id });
    }
  }

  async softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IAppointmentChatMessageEntity> {
    const tx = unwrapPrismaTxFromScope(scope);

    try {
      const row = await tx.appointmentChatMessage.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return mapAppointmentChatMessageRow(row as AppointmentChatMessageRow);
    } catch (error) {
      throw mapAppointmentChatMessageWriteError(error, { id });
    }
  }
}
