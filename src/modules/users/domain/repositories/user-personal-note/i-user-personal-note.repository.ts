import type { TransactionScope } from '@shared/domain/transactions';
import type {
  ICreateUserPersonalNoteInput,
  IUpdateUserPersonalNoteInput,
  IUserPersonalNoteEntity,
} from '../../entities/user-personal-note';

export interface IUserPersonalNoteRepository {
  findEntityById(
    id: string,
    scope?: TransactionScope,
  ): Promise<IUserPersonalNoteEntity | null>;

  findEntityByOwnerAndReference(
    ownerUserId: string,
    referenceUserId: string,
    scope?: TransactionScope,
  ): Promise<IUserPersonalNoteEntity | null>;

  findActiveByOwnerAndReferenceUserIds(
    ownerUserId: string,
    referenceUserIds: readonly string[],
    scope?: TransactionScope,
  ): Promise<IUserPersonalNoteEntity[]>;

  create(
    input: ICreateUserPersonalNoteInput,
    scope: TransactionScope,
  ): Promise<IUserPersonalNoteEntity>;

  update(
    id: string,
    patch: IUpdateUserPersonalNoteInput,
    scope: TransactionScope,
  ): Promise<IUserPersonalNoteEntity>;

  softDelete(
    id: string,
    scope: TransactionScope,
  ): Promise<IUserPersonalNoteEntity>;
}
