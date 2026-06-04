import { Injectable } from '@nestjs/common';
import type {
  IAppointmentChatMessageEntity,
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
  ICreateAppointmentChatMessageInput,
  IUpdateAppointmentChatMessageInput,
} from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { ReadResult } from 'src/modules/shared/domain/query';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapAppointmentChatMessageRow,
  type AppointmentChatMessageRow,
} from '../../row-mappers/appointment-chat-message';
import {
  APPOINTMENT_CHAT_MESSAGE_RELATIONS,
  APPOINTMENT_CHAT_MESSAGE_VALIDATION_CONFIG,
} from './appointment-chat-message.relations';

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

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.appointmentChatMessage;
  }

  protected mapRow(
    row: AppointmentChatMessageRow,
  ): ReadResult<
    IAppointmentChatMessagePublicEntity,
    IAppointmentChatMessageRelations
  > {
    return mapAppointmentChatMessageRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(
    id: string,
  ): Promise<IAppointmentChatMessageEntity | null> {
    const row = await this.prismaService.appointmentChatMessage.findUnique({
      where: { id },
    });
    return row ? mapAppointmentChatMessageRow(row as AppointmentChatMessageRow) : null;
  }

  async create(
    input: ICreateAppointmentChatMessageInput,
  ): Promise<IAppointmentChatMessageEntity> {
    const row = await this.prismaService.appointmentChatMessage.create({
      data: input,
    });
    return mapAppointmentChatMessageRow(row as AppointmentChatMessageRow);
  }

  async update(
    id: string,
    input: IUpdateAppointmentChatMessageInput,
  ): Promise<IAppointmentChatMessageEntity> {
    const row = await this.prismaService.appointmentChatMessage.update({
      where: { id },
      data: input,
    });
    return mapAppointmentChatMessageRow(row as AppointmentChatMessageRow);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.appointmentChatMessage.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
