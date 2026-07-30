import type { ITransactionManager } from '@shared/domain/transactions';
import { ensureUserExists } from 'src/modules/users/domain/entities/user';
import {
  ensureCanUpsertUserPersonalNote,
  isUserPersonalNoteContextMapEmpty,
  mergeUserPersonalNoteContextValue,
  normalizeNotesMap,
  type ICreateUserPersonalNoteInput,
  type IUpdateUserPersonalNoteInput,
} from 'src/modules/users/domain/entities/user-personal-note';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';
import type { IUserRepository } from 'src/modules/users/domain/repositories/user/i-user.repository';
import type { IUpsertUserPersonalNoteApplicationInput } from '../../dtos/user-personal-note/upsert-user-personal-note.input';
import type { IUpsertUserPersonalNoteApplicationOutput } from '../../dtos/user-personal-note/upsert-user-personal-note.output';

export class UpsertUserPersonalNoteUseCase {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userPersonalNoteRepository: IUserPersonalNoteRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    input: IUpsertUserPersonalNoteApplicationInput,
  ): Promise<IUpsertUserPersonalNoteApplicationOutput> {
    ensureCanUpsertUserPersonalNote(input.referenceUserId, input.actor);

    const referenceUser = await this.userRepository.findEntityById(
      input.referenceUserId,
    );
    ensureUserExists(referenceUser, input.referenceUserId);

    const existing =
      await this.userPersonalNoteRepository.findEntityByOwnerAndReference(
        input.actor.userId,
        input.referenceUserId,
      );

    const names = mergeUserPersonalNoteContextValue(
      existing ? { ...existing.names } : {},
      input.context,
      input.name,
    );
    const notes = normalizeNotesMap(
      mergeUserPersonalNoteContextValue(
        existing?.notes ? { ...existing.notes } : {},
        input.context,
        input.note,
      ),
    );

    const shouldClear =
      isUserPersonalNoteContextMapEmpty(names) &&
      isUserPersonalNoteContextMapEmpty(notes);

    return this.transactionManager.runInTransaction(async (scope) => {
      if (!existing) {
        if (shouldClear) {
          return null;
        }

        const createInput: ICreateUserPersonalNoteInput = {
          ownerUserId: input.actor.userId,
          referenceUserId: input.referenceUserId,
          names,
          notes,
        };
        return this.userPersonalNoteRepository.create(createInput, scope);
      }

      if (shouldClear) {
        if (existing.deletedAt != null) {
          return null;
        }

        await this.userPersonalNoteRepository.update(
          existing.id,
          {
            names: {},
            notes: null,
            deletedAt: new Date(),
          } satisfies IUpdateUserPersonalNoteInput,
          scope,
        );
        return null;
      }

      return this.userPersonalNoteRepository.update(
        existing.id,
        {
          names,
          notes,
          deletedAt: null,
        } satisfies IUpdateUserPersonalNoteInput,
        scope,
      );
    });
  }
}
