import type { IAppointmentChatMessageEntity } from '../i-appointment-chat-message.entity';
import { AppointmentChatMessageNotFoundError } from '../errors';

export function ensureAppointmentChatMessageExists(
  entity: IAppointmentChatMessageEntity | null | undefined,
  id: string,
): asserts entity is IAppointmentChatMessageEntity {
  if (!entity) {
    throw new AppointmentChatMessageNotFoundError(id);
  }
}
