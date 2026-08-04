import type { IAppointmentChatMessagePublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat-message';
import type { IAppointmentChatPublicEntity } from 'src/modules/appointments/domain/entities/appointment-chat';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';

export function getAppointmentChatMyLastReadAt(
  chat: Pick<
    IAppointmentChatPublicEntity,
    'clientUserId' | 'clientLastReadAt' | 'masterLastReadAt'
  >,
  viewerUserId: string,
): Date | null {
  if (!viewerUserId) {
    return null;
  }

  if (chat.clientUserId === viewerUserId) {
    return chat.clientLastReadAt ?? null;
  }

  return chat.masterLastReadAt ?? null;
}

type IChatWithOptionalMessages = IAppointmentChatPublicEntity & {
  messages?: IAppointmentChatMessagePublicEntity[];
};

type IAppointmentWithOptionalChat = {
  chat?: IChatWithOptionalMessages | null;
};

/**
 * Вешает unreadCount (COUNT в БД) и опционально last message как chat.messages = [last].
 */
export async function enrichAppointmentChatsWithInboxFields<
  T extends IAppointmentWithOptionalChat,
>(
  messageRepository: IAppointmentChatMessageRepository,
  viewerUserId: string,
  items: T[],
  options?: { includeLastMessage?: boolean },
): Promise<T[]> {
  const includeLastMessage = options?.includeLastMessage ?? true;
  const chats = items
    .map((item) => item.chat)
    .filter((chat): chat is IChatWithOptionalMessages => chat != null);

  if (chats.length === 0) {
    return items;
  }

  const unreadByChatId = await messageRepository.countUnreadForChats(
    viewerUserId,
    chats.map((chat) => ({
      chatId: chat.id,
      myLastReadAt: getAppointmentChatMyLastReadAt(chat, viewerUserId),
    })),
  );

  const latestByChatId = includeLastMessage
    ? await messageRepository.findLatestByChatIds(chats.map((chat) => chat.id))
    : new Map<string, IAppointmentChatMessagePublicEntity>();

  return items.map((item) => {
    if (!item.chat) {
      return item;
    }

    const lastMessage = latestByChatId.get(item.chat.id);

    return {
      ...item,
      chat: {
        ...item.chat,
        unreadCount: unreadByChatId.get(item.chat.id) ?? 0,
        ...(includeLastMessage
          ? { messages: lastMessage ? [lastMessage] : [] }
          : {}),
      },
    };
  });
}

export async function enrichAppointmentChatWithUnreadCount<
  T extends IAppointmentChatPublicEntity,
>(
  messageRepository: IAppointmentChatMessageRepository,
  viewerUserId: string,
  chat: T,
): Promise<T & { unreadCount: number }> {
  const unreadCount = await messageRepository.countUnreadForChat({
    chatId: chat.id,
    viewerUserId,
    myLastReadAt: getAppointmentChatMyLastReadAt(chat, viewerUserId),
  });

  return {
    ...chat,
    unreadCount,
  };
}
