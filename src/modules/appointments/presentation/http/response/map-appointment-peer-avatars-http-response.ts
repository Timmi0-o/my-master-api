import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';
import { mapProfileAvatarToHttpResponse } from 'src/modules/masters/presentation/http/response/map-profile-avatar-http-response';

type AppointmentPeerAvatarCarrier = {
  masterProfile?: {
    avatar?: IProfileAvatarView | null;
  } | null;
  clientUser?: {
    userProfile?: {
      avatar?: IProfileAvatarView | null;
    } | null;
  } | null;
};

export function mapAppointmentPeerAvatarsToHttpResponse<T>(appointment: T): T {
  const carrier = appointment as T & AppointmentPeerAvatarCarrier;
  let next = carrier;

  if (next.masterProfile != null && next.masterProfile.avatar !== undefined) {
    next = {
      ...next,
      masterProfile: {
        ...next.masterProfile,
        avatar: mapProfileAvatarToHttpResponse(next.masterProfile.avatar),
      },
    };
  }

  if (
    next.clientUser?.userProfile != null &&
    next.clientUser.userProfile.avatar !== undefined
  ) {
    next = {
      ...next,
      clientUser: {
        ...next.clientUser,
        userProfile: {
          ...next.clientUser.userProfile,
          avatar: mapProfileAvatarToHttpResponse(
            next.clientUser.userProfile.avatar,
          ),
        },
      },
    };
  }

  return next;
}
