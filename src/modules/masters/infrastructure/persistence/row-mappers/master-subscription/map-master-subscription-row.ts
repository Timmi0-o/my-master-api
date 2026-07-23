import type {
  IMasterSubscriptionEntity,
  IMasterSubscriptionPublicEntity,
  IMasterSubscriptionRelations,
} from 'src/modules/masters/domain/entities/master-subscription';
import { mapMasterProfileRow } from '../master-profile/map-master-profile-row';
import type { MasterProfileRow } from '../master-profile/master-profile.row.types';
import type { MasterSubscriptionRow } from './master-subscription.row.types';

function mapUserRelation(
  row: NonNullable<MasterSubscriptionRow['user']>,
): IMasterSubscriptionRelations['user'] {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    surname: row.surname,
    patronymic: row.patronymic,
  };
}

export function mapMasterSubscriptionRow(
  row: MasterSubscriptionRow,
): IMasterSubscriptionPublicEntity & Partial<IMasterSubscriptionRelations> {
  const entity: IMasterSubscriptionEntity &
    Partial<IMasterSubscriptionRelations> = {
    id: row.id,
    userId: row.userId,
    masterProfileId: row.masterProfileId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt ?? null,
  };

  if (row.user != null) {
    entity.user = mapUserRelation(row.user);
  }

  if (row.masterProfile != null) {
    entity.masterProfile = mapMasterProfileRow(
      row.masterProfile as MasterProfileRow,
    );
  }

  return entity;
}
