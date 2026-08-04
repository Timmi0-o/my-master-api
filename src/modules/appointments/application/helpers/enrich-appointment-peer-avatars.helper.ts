import { enrichProfileAvatarsByEntityIds } from 'src/modules/masters/application/helpers/enrich-profile-avatars-by-entity-ids.helper';
import { ImageEntityType } from 'src/modules/masters/domain/entities/image';
import type { IImageRepository } from 'src/modules/masters/domain/repositories/image/i-image.repository';

type AppointmentPeerCarrier = {
  masterProfile?: {
    id: string;
    avatar?: unknown;
  } | null;
  clientUser?: {
    userProfile?: {
      id: string;
      avatar?: unknown;
    } | null;
  } | null;
};

type AppointmentChatPeerCarrier = {
  appointment?: AppointmentPeerCarrier | null;
};

export async function enrichAppointmentPeerAvatars<
  T extends AppointmentPeerCarrier,
>(
  imageRepository: IImageRepository,
  items: readonly T[],
): Promise<T[]> {
  if (items.length === 0) {
    return [...items];
  }

  const masterProfileIds = items
    .map((item) => item.masterProfile?.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);

  const clientProfileIds = items
    .map((item) => item.clientUser?.userProfile?.id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);

  const [masterAvatars, clientAvatars] = await Promise.all([
    enrichProfileAvatarsByEntityIds({
      imageRepository,
      entityType: ImageEntityType.MASTER_PROFILE_AVATAR,
      entityIds: masterProfileIds,
    }),
    enrichProfileAvatarsByEntityIds({
      imageRepository,
      entityType: ImageEntityType.CLIENT_PROFILE_AVATAR,
      entityIds: clientProfileIds,
    }),
  ]);

  return items.map((item) => {
    let next: T = item;

    if (item.masterProfile != null) {
      next = {
        ...next,
        masterProfile: {
          ...item.masterProfile,
          avatar: masterAvatars.get(item.masterProfile.id) ?? null,
        },
      };
    }

    if (item.clientUser?.userProfile != null) {
      const clientUser = next.clientUser ?? item.clientUser;
      next = {
        ...next,
        clientUser: {
          ...clientUser,
          userProfile: {
            ...item.clientUser.userProfile,
            avatar:
              clientAvatars.get(item.clientUser.userProfile.id) ?? null,
          },
        },
      };
    }

    return next;
  });
}

export async function enrichAppointmentChatPeerAvatars<
  T extends AppointmentChatPeerCarrier,
>(
  imageRepository: IImageRepository,
  items: readonly T[],
): Promise<T[]> {
  if (items.length === 0) {
    return [...items];
  }

  const appointments = items
    .map((item) => item.appointment)
    .filter((appointment): appointment is NonNullable<T['appointment']> =>
      appointment != null,
    );

  if (appointments.length === 0) {
    return [...items];
  }

  const enrichedAppointments = await enrichAppointmentPeerAvatars(
    imageRepository,
    appointments,
  );

  let appointmentIndex = 0;
  return items.map((item) => {
    if (item.appointment == null) {
      return item;
    }

    const appointment = enrichedAppointments[appointmentIndex];
    appointmentIndex += 1;

    return {
      ...item,
      appointment,
    };
  });
}
