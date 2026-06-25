import type { IAppointmentChatEntity } from '../i-appointment-chat.entity';
import { AppointmentChatNotFoundError } from '../errors';

/**
 * Проверка, что чат записи существует
 */
export function ensureAppointmentChatExists(
  entity: IAppointmentChatEntity | null | undefined,
  id: string,
): asserts entity is IAppointmentChatEntity {
  if (!entity) {
    throw new AppointmentChatNotFoundError(id);
  }
}
