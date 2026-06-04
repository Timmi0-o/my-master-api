import { Injectable } from '@nestjs/common';
import type {
  IAppointmentChatEntity,
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
  ICreateAppointmentChatInput,
  IUpdateAppointmentChatInput,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import type { ReadResult } from 'src/modules/shared/domain/query';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapAppointmentChatRow,
  type AppointmentChatRow,
} from '../../row-mappers/appointment-chat';
import {
  APPOINTMENT_CHAT_RELATIONS,
  APPOINTMENT_CHAT_VALIDATION_CONFIG,
} from './appointment-chat.relations';

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

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.appointmentChat;
  }

  protected mapRow(
    row: AppointmentChatRow,
  ): ReadResult<IAppointmentChatPublicEntity, IAppointmentChatRelations> {
    return mapAppointmentChatRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(id: string): Promise<IAppointmentChatEntity | null> {
    const row = await this.prismaService.appointmentChat.findUnique({
      where: { id },
    });
    return row ? mapAppointmentChatRow(row as AppointmentChatRow) : null;
  }

  async findEntityByAppointmentId(
    appointmentId: string,
  ): Promise<IAppointmentChatEntity | null> {
    const row = await this.prismaService.appointmentChat.findUnique({
      where: { appointmentId },
    });
    return row ? mapAppointmentChatRow(row as AppointmentChatRow) : null;
  }

  async create(
    input: ICreateAppointmentChatInput,
  ): Promise<IAppointmentChatEntity> {
    const row = await this.prismaService.appointmentChat.create({ data: input });
    return mapAppointmentChatRow(row as AppointmentChatRow);
  }

  async update(
    id: string,
    input: IUpdateAppointmentChatInput,
  ): Promise<IAppointmentChatEntity> {
    const row = await this.prismaService.appointmentChat.update({
      where: { id },
      data: input,
    });
    return mapAppointmentChatRow(row as AppointmentChatRow);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.appointmentChat.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
