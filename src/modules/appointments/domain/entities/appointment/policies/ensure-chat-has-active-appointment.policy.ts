import type { IAppointmentEntity } from '../i-appointment.entity';
import { AppointmentForbiddenError } from '../errors';
import { isAppointmentDisplayActive } from '../../appointment-chat/resolve-display-appointment';

/**
 * Проверка, что среди записей чата есть активная (можно писать сообщения)
 */
export function ensureChatHasActiveAppointment(
  appointments: readonly IAppointmentEntity[],
  chatId: string,
): void {
  if (appointments.some(isAppointmentDisplayActive)) {
    return;
  }

  throw new AppointmentForbiddenError(
    chatId,
    'Запрещено писать сообщения в чат если нет активной записи',
  );
}
