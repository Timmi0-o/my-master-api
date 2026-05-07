import { Injectable } from '@nestjs/common';
import {
  GetManyHelper,
  type IBuildGetManyResponseResult,
} from 'src/modules/shared/application/helpers/get-many.helper';
import type { TPresetType } from 'src/modules/shared/application/presets/common/preset.types';
import {
  omitDisallowedSelectFieldsForNonStaff,
  toDbWhere,
} from 'src/modules/shared/application/presets/common/query-filter.helper';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';

import { IMetadata } from 'src/modules/shared/domain/i-metadata';
import { IUserPublicEntity } from 'src/modules/users/domain/entities/user';
import {
  getUserPresetConfig,
  UserFilterExtractor,
  type IUserFiltersPreset,
} from '../../presets';
import type { IGetUsersInput } from './get-users.input';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    input: IGetUsersInput,
    metadata: IMetadata,
  ): Promise<IBuildGetManyResponseResult<IUserPublicEntity>> {
    const preset: TPresetType = input.preset ?? 'SHORT';
    const presetConfig = getUserPresetConfig(preset);

    const select = omitDisallowedSelectFieldsForNonStaff(
      presetConfig.select,
      metadata.isStaffUser,
    );

    const sanitizedFilter = this.sanitizeFilterForStaff(
      input.filter,
      metadata.isStaffUser,
    );

    const filterWhere = UserFilterExtractor.extract(sanitizedFilter);

    const visibilityWhere = metadata.isStaffUser
      ? ({} as Record<string, unknown>)
      : { deletedAt: null };

    const scopedWhere = this.mergeWhereParts([filterWhere, visibilityWhere]);

    const dbWhere = toDbWhere(scopedWhere);

    const orderField = input.orderField ?? 'id';
    const orderDir = input.orderDir ?? 'asc';
    const orderBy: Record<string, 'asc' | 'desc'> = {
      [orderField]: orderDir,
    };

    const findParams = GetManyHelper.prepareFindManyParams({
      payload: {
        limit: input.limit,
        page: input.page,
        orderBy,
      },
      isStaffUser: metadata.isStaffUser,
      presetSelect: select,
      where: dbWhere,
      requiredIds: input.requiredIds,
    });

    const [items, totalCount] =
      await this.userRepository.findManyAndCountForList(findParams);

    return GetManyHelper.buildResponse({
      data: items ?? null,
      totalCount,
      limit: findParams.limit,
      offset: findParams.offset,
      page: input.page,
      emptyLogMessage: 'Users list empty',
      emptyErrorMessage: 'Пользователи не найдены',
    });
  }

  private sanitizeFilterForStaff(
    filter: IUserFiltersPreset | undefined,
    isStaffUser: boolean,
  ): IUserFiltersPreset | undefined {
    if (!filter || isStaffUser) return filter;

    if (filter.deletedAt === undefined) return filter;
    const next: IUserFiltersPreset = { ...filter };
    delete next.deletedAt;
    return Object.keys(next).length > 0 ? next : undefined;
  }

  private mergeWhereParts(
    parts: Record<string, unknown>[],
  ): Record<string, unknown> {
    const nonEmpty = parts.filter((p) => Object.keys(p).length > 0);

    if (nonEmpty.length === 0) return {};
    if (nonEmpty.length === 1) return nonEmpty[0];
    return { AND: nonEmpty };
  }
}
