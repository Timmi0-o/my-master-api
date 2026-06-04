import { Injectable } from '@nestjs/common';
import type {
  IAppointmentEntity,
  IAppointmentPublicEntity,
  IAppointmentRelations,
  ICreateAppointmentInput,
  ICreateAppointmentWithChatInput,
  IUpdateAppointmentInput,
} from 'src/modules/appointments/domain/entities/appointment';
import type { IAppointmentRepository } from 'src/modules/appointments/domain/repositories/appointment/i-appointment.repository';
import type { ReadResult } from 'src/modules/shared/domain/query';
import { PrismaService } from 'src/modules/shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from 'src/modules/shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import {
  mapAppointmentRow,
  type AppointmentRow,
} from '../../row-mappers/appointment';
import {
  APPOINTMENT_RELATIONS,
  APPOINTMENT_VALIDATION_CONFIG,
} from './appointment.relations';

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

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  protected getDelegate() {
    return this.prismaService.appointment;
  }

  protected mapRow(
    row: AppointmentRow,
  ): ReadResult<IAppointmentPublicEntity, IAppointmentRelations> {
    return mapAppointmentRow(row);
  }

  protected toPrismaWhereUnique(id: string): Record<string, unknown> {
    return { id };
  }

  async findEntityById(id: string): Promise<IAppointmentEntity | null> {
    const row = await this.prismaService.appointment.findUnique({
      where: { id },
    });
    return row ? mapAppointmentRow(row as AppointmentRow) : null;
  }

  async create(input: ICreateAppointmentInput): Promise<IAppointmentEntity> {
    const row = await this.prismaService.appointment.create({ data: input });
    return mapAppointmentRow(row as AppointmentRow);
  }

  async createWithChat(
    input: ICreateAppointmentWithChatInput,
  ): Promise<IAppointmentEntity> {
    const { initialMessage, ...appointmentData } = input;

    return this.prismaService.$transaction(async (tx) => {
      const appointment = await tx.appointment.create({
        data: appointmentData,
      });
      await tx.appointmentChat.create({
        data: { appointmentId: appointment.id },
      });
      if (initialMessage) {
        const chat = await tx.appointmentChat.findUnique({
          where: { appointmentId: appointment.id },
        });
        if (chat) {
          await tx.appointmentChatMessage.create({
            data: {
              chatId: chat.id,
              senderUserId: initialMessage.senderUserId,
              body: initialMessage.body,
            },
          });
        }
      }
      return mapAppointmentRow(appointment as AppointmentRow);
    });
  }

  async update(
    id: string,
    input: IUpdateAppointmentInput,
  ): Promise<IAppointmentEntity> {
    const row = await this.prismaService.appointment.update({
      where: { id },
      data: input,
    });
    return mapAppointmentRow(row as AppointmentRow);
  }

  async softDeleteById(id: string): Promise<boolean> {
    const row = await this.prismaService.appointment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return row.deletedAt != null;
  }
}
