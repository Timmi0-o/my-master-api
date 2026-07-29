import type { IAppointmentActor } from '../../appointment/policies/appointment-actor.types';
import type { IAppointmentChatEntity } from '../i-appointment-chat.entity';
import { AppointmentChatForbiddenError } from '../errors';

/**
 * Проверка, что чат доступен актору (клиент, мастер или персонал)
 */
export function ensureAppointmentChatAccessible(
  chat: IAppointmentChatEntity,
  actor: IAppointmentActor,
  masterProfileUserId: string,
): void {
  if (actor.isStaffUser) {
    return;
  }
  if (chat.clientUserId === actor.userId) {
    return;
  }
  if (masterProfileUserId === actor.userId) {
    return;
  }
  throw new AppointmentChatForbiddenError(chat.id);
}
