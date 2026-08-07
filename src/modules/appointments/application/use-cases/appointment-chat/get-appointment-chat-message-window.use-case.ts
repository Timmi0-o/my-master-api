import { InvalidQueryError } from '@shared/domain/errors';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import { ResolveFileDisplayUrlUseCase } from 'src/modules/files/application/use-cases/file/resolve-file-display-url.use-case';
import type { IGetAppointmentChatMessageWindowApplicationInput } from '../../dtos/appointment-chat/get-appointment-chat-message-window.input';
import type { IGetAppointmentChatMessageWindowApplicationOutput } from '../../dtos/appointment-chat/get-appointment-chat-message-window.output';
import { enrichAppointmentChatMessagesAttachmentDisplayUrls } from '../../helpers/enrich-appointment-chat-message-attachment-display-urls.helper';
import { enrichAppointmentChatMessagesReplyTo } from '../../helpers/enrich-appointment-chat-message-reply-to.helper';
import { AssertAppointmentChatAccessUseCase } from './assert-appointment-chat-access.use-case';

const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 100;

export class GetAppointmentChatMessageWindowUseCase {
  constructor(
    private readonly assertAccessUseCase: AssertAppointmentChatAccessUseCase,
    private readonly messageRepository: IAppointmentChatMessageRepository,
    private readonly resolveFileDisplayUrlUseCase: ResolveFileDisplayUrlUseCase,
  ) {}

  async execute(
    input: IGetAppointmentChatMessageWindowApplicationInput,
  ): Promise<IGetAppointmentChatMessageWindowApplicationOutput> {
    await this.assertAccessUseCase.execute({
      chatId: input.chatId,
      actor: input.actor,
    });

    const hasBeforeTime = Boolean(input.beforeCreatedAt);
    const hasAfterTime = Boolean(input.afterCreatedAt);

    if (hasBeforeTime && hasAfterTime) {
      throw new InvalidQueryError('Параметры before и after взаимоисключающие');
    }

    const limit = Math.min(
      Math.max(input.limit || DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );

    const window = await this.messageRepository.findMessageWindow({
      chatId: input.chatId,
      limit,
      viewerUserId: input.actor.userId,
      ...(hasBeforeTime
        ? {
            before: {
              createdAt: input.beforeCreatedAt as Date,
              id: input.beforeId,
            },
          }
        : {}),
      ...(hasAfterTime
        ? {
            after: {
              createdAt: input.afterCreatedAt as Date,
              id: input.afterId,
            },
          }
        : {}),
    });

    const itemsWithDisplayUrls =
      await enrichAppointmentChatMessagesAttachmentDisplayUrls(
        window.items,
        this.resolveFileDisplayUrlUseCase,
      );

    const items = await enrichAppointmentChatMessagesReplyTo(
      itemsWithDisplayUrls,
      this.messageRepository,
      input.actor.userId,
    );

    return {
      items,
      hasMoreBefore: window.hasMoreBefore,
      hasMoreAfter: window.hasMoreAfter,
      limit,
    };
  }
}
