import type { IUserPersonalNotePublicEntity } from 'src/modules/users/domain/entities/user-personal-note';
import type { IUserPersonalNoteRepository } from 'src/modules/users/domain/repositories/user-personal-note/i-user-personal-note.repository';

export async function resolvePersonalNoteForReference(
  repository: IUserPersonalNoteRepository,
  ownerUserId: string | undefined | null,
  referenceUserId: string,
): Promise<IUserPersonalNotePublicEntity | null> {
  if (!ownerUserId) {
    return null;
  }

  const note = await repository.findEntityByOwnerAndReference(
    ownerUserId,
    referenceUserId,
  );

  if (!note || note.deletedAt != null) {
    return null;
  }

  return note;
}

export async function enrichPersonalNotesByUserId<T extends { userId: string }>(
  repository: IUserPersonalNoteRepository,
  ownerUserId: string | undefined | null,
  items: readonly T[],
): Promise<Array<T & { personalNote: IUserPersonalNotePublicEntity | null }>> {
  if (!ownerUserId || items.length === 0) {
    return items.map((item) => ({ ...item, personalNote: null }));
  }

  const notes = await repository.findActiveByOwnerAndReferenceUserIds(
    ownerUserId,
    items.map((item) => item.userId),
  );
  const notesByReferenceUserId = new Map(
    notes.map((note) => [note.referenceUserId, note] as const),
  );

  return items.map((item) => ({
    ...item,
    personalNote: notesByReferenceUserId.get(item.userId) ?? null,
  }));
}

type AppointmentPeerItem = {
  masterProfile?: { userId?: string | null } | null;
  clientUser?: { id: string } | null;
};

function withPeerPersonalNotes<T extends AppointmentPeerItem>(
  item: T,
  notesByReferenceUserId: Map<string, IUserPersonalNotePublicEntity>,
): T {
  const masterUserId = item.masterProfile?.userId;
  const masterProfile = item.masterProfile
    ? {
        ...item.masterProfile,
        personalNote:
          typeof masterUserId === 'string' && masterUserId.length > 0
            ? (notesByReferenceUserId.get(masterUserId) ?? null)
            : null,
      }
    : item.masterProfile;

  const clientUser = item.clientUser
    ? {
        ...item.clientUser,
        personalNote: notesByReferenceUserId.get(item.clientUser.id) ?? null,
      }
    : item.clientUser;

  return {
    ...item,
    masterProfile,
    clientUser,
  };
}

export async function enrichPersonalNotesWithAppointmentPeers<T>(
  repository: IUserPersonalNoteRepository,
  ownerUserId: string | undefined | null,
  items: readonly T[],
): Promise<T[]> {
  if (items.length === 0) {
    return [];
  }

  const peerItems = items as unknown as AppointmentPeerItem[];

  if (!ownerUserId) {
    return peerItems.map((item) =>
      withPeerPersonalNotes(
        item,
        new Map<string, IUserPersonalNotePublicEntity>(),
      ),
    ) as T[];
  }

  const referenceUserIds = new Set<string>();
  for (const item of peerItems) {
    const masterUserId = item.masterProfile?.userId;
    if (typeof masterUserId === 'string' && masterUserId.length > 0) {
      referenceUserIds.add(masterUserId);
    }
    if (item.clientUser?.id) {
      referenceUserIds.add(item.clientUser.id);
    }
  }

  const notes = await repository.findActiveByOwnerAndReferenceUserIds(
    ownerUserId,
    [...referenceUserIds],
  );
  const notesByReferenceUserId = new Map(
    notes.map((note) => [note.referenceUserId, note] as const),
  );

  return peerItems.map((item) =>
    withPeerPersonalNotes(item, notesByReferenceUserId),
  ) as T[];
}

export async function enrichPersonalNotesWithAppointmentChatPeers<T>(
  repository: IUserPersonalNoteRepository,
  ownerUserId: string | undefined | null,
  item: T,
): Promise<T> {
  const chatItem = item as T & {
    appointment?: AppointmentPeerItem | null;
  };

  if (!chatItem.appointment) {
    return item;
  }

  const [appointment] = await enrichPersonalNotesWithAppointmentPeers(
    repository,
    ownerUserId,
    [chatItem.appointment],
  );

  return {
    ...chatItem,
    appointment,
  };
}
