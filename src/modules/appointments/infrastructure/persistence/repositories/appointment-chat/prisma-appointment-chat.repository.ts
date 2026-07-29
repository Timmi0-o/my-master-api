import { Inject, Injectable } from '@nestjs/common';
import {
  LOGGER_TOKEN,
  type ILogger,
} from '@shared/domain/logging/logger.token';
import type {
  FindManyParams,
  FindOneParams,
  ReadResult,
} from '@shared/domain/query';
import type { TransactionScope } from '@shared/domain/transactions';
import { PrismaService } from '@shared/infrastructure/persistence/prisma/prisma.service';
import { PrismaReadRepository } from '@shared/infrastructure/persistence/repositories/base/prisma-read.repository';
import { unwrapPrismaTxFromScope } from '@shared/infrastructure/persistence/transactions';
import type {
  IAppointmentChatEntity,
  IAppointmentChatPublicEntity,
  IAppointmentChatRelations,
  ICreateAppointmentChatInput,
  IUpdateAppointmentChatInput,
} from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatRepository } from 'src/modules/appointments/domain/repositories/appointment-chat/i-appointment-chat.repository';
import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';
import { IMAGE_REPOSITORY_TOKEN } from 'src/modules/masters/domain/repositories/image/image.repository.tokens';
import {
  groupAvatarsByEntityId,
  wantsNestedAppointmentPeerAvatarsInclude,
  wantsNestedClientUserProfileAvatarInclude,
  wantsNestedMasterProfileAvatarInclude,
} from 'src/modules/masters/infrastructure/persistence/helpers/hydrate-profile-avatar.helper';
import {
  mapAppointmentChatRow,
  type AppointmentChatRow,
} from '../../row-mappers/appointment-chat';
import { mapAppointmentChatWriteError } from './appointment-chat-write-error.mapper';
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

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(IMAGE_REPOSITORY_TOKEN)
    private readonly imageRepository: IImageRepository,
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

  async findOne(
    id: string,
    params?: FindOneParams<
      IAppointmentChatPublicEntity,
      IAppointmentChatRelations
    >,
    scope?: TransactionScope,
  ): Promise<ReadResult<
    IAppointmentChatPublicEntity,
    IAppointmentChatRelations
  > | null> {
    const result = await super.findOne(id, params, scope);
    if (result == null) {
      return null;
    }

    const [hydrated] = await this.hydratePeerAvatars(
      [result],
      params?.selectOptions?.include,
      scope,
    );
    return hydrated ?? null;
  }

  async findMany(
    params?: FindManyParams<
      IAppointmentChatPublicEntity,
      IAppointmentChatRelations
    >,
    scope?: TransactionScope,
  ): Promise<
    ReadResult<IAppointmentChatPublicEntity, IAppointmentChatRelations>[]
  > {
    const results = await super.findMany(params, scope);
    return this.hydratePeerAvatars(
      results,
      params?.selectOptions?.include,
      scope,
    );
  }

  private async hydratePeerAvatars(
    chats: ReadResult<
      IAppointmentChatPublicEntity,
      IAppointmentChatRelations
    >[],
    include: unknown,
    scope?: TransactionScope,
  ): Promise<
    ReadResult<IAppointmentChatPublicEntity, IAppointmentChatRelations>[]
  > {
    if (!wantsNestedAppointmentPeerAvatarsInclude(include)) {
      return chats;
    }

    const appointmentInclude =
      include && typeof include === 'object'
        ? ((include as { appointment?: { include?: unknown } }).appointment
            ?.include ?? undefined)
        : undefined;

    let next = chats;

    if (wantsNestedMasterProfileAvatarInclude(appointmentInclude)) {
      next = await this.hydrateMasterProfileAvatars(next, scope);
    }

    if (wantsNestedClientUserProfileAvatarInclude(appointmentInclude)) {
      next = await this.hydrateClientUserProfileAvatars(next, scope);
    }

    return next;
  }

  private async hydrateMasterProfileAvatars(
    chats: ReadResult<
      IAppointmentChatPublicEntity,
      IAppointmentChatRelations
    >[],
    scope?: TransactionScope,
  ): Promise<
    ReadResult<IAppointmentChatPublicEntity, IAppointmentChatRelations>[]
  > {
    const profileIds = [
      ...new Set(
        chats
          .map((chat) => chat.appointment?.masterProfile?.id)
          .filter(
            (id): id is string => typeof id === 'string' && id.length > 0,
          ),
      ),
    ];

    if (profileIds.length === 0) {
      return chats;
    }

    const images = await this.imageRepository.findByEntityTypeAndEntityIds(
      ImageEntityType.MASTER_PROFILE_AVATAR,
      profileIds,
      { includeFile: true },
      scope,
    );
    const byProfileId = groupAvatarsByEntityId(images);

    return chats.map((chat) => {
      if (chat.appointment?.masterProfile == null) {
        return chat;
      }

      return {
        ...chat,
        appointment: {
          ...chat.appointment,
          masterProfile: {
            ...chat.appointment.masterProfile,
            avatar: byProfileId.get(chat.appointment.masterProfile.id) ?? null,
          },
        },
      };
    });
  }

  private async hydrateClientUserProfileAvatars(
    chats: ReadResult<
      IAppointmentChatPublicEntity,
      IAppointmentChatRelations
    >[],
    scope?: TransactionScope,
  ): Promise<
    ReadResult<IAppointmentChatPublicEntity, IAppointmentChatRelations>[]
  > {
    const profileIds = [
      ...new Set(
        chats
          .map((chat) => chat.appointment?.clientUser?.userProfile?.id)
          .filter(
            (id): id is string => typeof id === 'string' && id.length > 0,
          ),
      ),
    ];

    if (profileIds.length === 0) {
      return chats;
    }

    const images = await this.imageRepository.findByEntityTypeAndEntityIds(
      ImageEntityType.CLIENT_PROFILE_AVATAR,
      profileIds,
      { includeFile: true },
      scope,
    );
    const byProfileId = groupAvatarsByEntityId(images);

    return chats.map((chat) => {
      if (chat.appointment?.clientUser?.userProfile == null) {
        return chat;
      }

      return {
        ...chat,
        appointment: {
          ...chat.appointment,
          clientUser: {
            ...chat.appointment.clientUser,
            userProfile: {
              ...chat.appointment.clientUser.userProfile,
              avatar:
                byProfileId.get(chat.appointment.clientUser.userProfile.id) ??
                null,
            },
          },
        },
      };
    });
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

  async findEntityByMasterProfileAndClient(
    masterProfileId: string,
    clientUserId: string,
    scope?: TransactionScope,
  ): Promise<IAppointmentChatEntity | null> {
    const row = await this.getDelegate(scope).findUnique({
      where: {
        masterProfileId_clientUserId: {
          masterProfileId,
          clientUserId,
        },
      },
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
      throw mapAppointmentChatWriteError(error, {
        masterProfileId: input.masterProfileId,
        clientUserId: input.clientUserId,
      });
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
      return rows.map((row) =>
        mapAppointmentChatRow(row as AppointmentChatRow),
      );
    } catch (error) {
      const first = inputs[0];
      throw mapAppointmentChatWriteError(error, {
        masterProfileId: first.masterProfileId,
        clientUserId: first.clientUserId,
      });
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
