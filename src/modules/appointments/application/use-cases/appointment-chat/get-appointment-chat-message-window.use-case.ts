import { InvalidQueryError } from '@shared/domain/errors';
import type { IAppointmentChatMessageRepository } from 'src/modules/appointments/domain/repositories/appointment-chat-message/i-appointment-chat-message.repository';
import type { IGetAppointmentChatMessageWindowApplicationInput } from '../../dtos/appointment-chat/get-appointment-chat-message-window.input';
import type { IGetAppointmentChatMessageWindowApplicationOutput } from '../../dtos/appointment-chat/get-appointment-chat-message-window.output';
import { AssertAppointmentChatAccessUseCase } from './assert-appointment-chat-access.use-case';

const DEFAULT_LIMIT = 40;
const MAX_LIMIT = 100;

export class GetAppointmentChatMessageWindowUseCase {
  constructor(
    private readonly assertAccessUseCase: AssertAppointmentChatAccessUseCase,
    private readonly messageRepository: IAppointmentChatMessageRepository,
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

    return {
      items: window.items,
      hasMoreBefore: window.hasMoreBefore,
      hasMoreAfter: window.hasMoreAfter,
      limit,
    };
  }
}
