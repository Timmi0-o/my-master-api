import type { IAppointmentChatMessageAttachmentPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message-attachment';
import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IProfileAvatarView } from 'src/modules/masters/domain/entities/image';
import { mapProfileAvatarToHttpResponse } from 'src/modules/masters/presentation/http/http-responses/map-profile-avatar-http-response';
import { mapAppointmentChatMessageWithAttachmentsToHttp } from './map-appointment-chat-message-with-attachments';

type AppointmentChatInboxMessage = IAppointmentChatMessagePublicEntity & {
  attachments?: IAppointmentChatMessageAttachmentPublicEntity[];
};

type AppointmentPeerAvatarCarrier = {
  masterProfile?: {
    avatar?: IProfileAvatarView | null;
  } | null;
  clientUser?: {
    userProfile?: {
      avatar?: IProfileAvatarView | null;
    } | null;
  } | null;
  chat?: {
    messages?: AppointmentChatInboxMessage[];
  } | null;
};

export function mapAppointmentPeerAvatarsToHttpResponse<T>(appointment: T): T {
  const carrier = appointment as T & AppointmentPeerAvatarCarrier;
  let next: T & AppointmentPeerAvatarCarrier = carrier;

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

  if (next.chat?.messages != null) {
    // Wire DTO (fileSize: number) is not the domain entity shape; cast back to T.
    next = {
      ...next,
      chat: {
        ...next.chat,
        messages: next.chat.messages.map(
          mapAppointmentChatMessageWithAttachmentsToHttp,
        ) as unknown as AppointmentChatInboxMessage[],
      },
    };
  }

  return next;
}
