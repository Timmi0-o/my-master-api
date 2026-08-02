import type {
  ICreateRepository,
  IReadRepository,
  ISoftDeleteRepository,
  IUpdateRepository,
} from '@shared/domain/repositories';
import type { TransactionScope } from '@shared/domain/transactions';
import type {
  IAppointmentChatMessageEntity,
  IAppointmentChatMessagePublicEntity,
  IAppointmentChatMessageRelations,
  ICreateAppointmentChatMessageInput,
  IUpdateAppointmentChatMessageInput,
} from '../../entities/appointment-chat-message';

export type ICountUnreadForChatInput = {
  chatId: string;
  viewerUserId: string;
  myLastReadAt: Date | null;
};

export type IMessageWindowCursor = {
  createdAt: Date;
  id?: string;
};

export type IFindMessageWindowInput = {
  chatId: string;
  limit: number;
  before?: IMessageWindowCursor;
  after?: IMessageWindowCursor;
};

export type IFindMessageWindowResult = {
  items: IAppointmentChatMessagePublicEntity[];
  hasMoreBefore: boolean;
  hasMoreAfter: boolean;
};

export type IAppointmentChatMessageRepository = IReadRepository<
  IAppointmentChatMessagePublicEntity,
  string,
  IAppointmentChatMessageRelations
> &
  ICreateRepository<
    IAppointmentChatMessageEntity,
    ICreateAppointmentChatMessageInput
  > &
  IUpdateRepository<
    IAppointmentChatMessageEntity,
    string,
    IUpdateAppointmentChatMessageInput
  > &
  ISoftDeleteRepository<IAppointmentChatMessageEntity, string> & {
    findEntityById(
      id: string,
      scope?: TransactionScope,
    ): Promise<IAppointmentChatMessageEntity | null>;

    countUnreadForChat(input: ICountUnreadForChatInput): Promise<number>;

    countUnreadForChats(
      viewerUserId: string,
      chats: ReadonlyArray<Omit<ICountUnreadForChatInput, 'viewerUserId'>>,
    ): Promise<Map<string, number>>;

    findLatestByChatIds(
      chatIds: readonly string[],
    ): Promise<Map<string, IAppointmentChatMessagePublicEntity>>;

    findMessageWindow(
      input: IFindMessageWindowInput,
    ): Promise<IFindMessageWindowResult>;
  };
