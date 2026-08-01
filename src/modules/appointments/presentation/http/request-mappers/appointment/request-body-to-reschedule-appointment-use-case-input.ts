import type { IRescheduleAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/reschedule-appointment.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { IRescheduleAppointmentPayload } from '../../validation/schemas/reschedule-appointment-payload.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function requestBodyToRescheduleAppointmentUseCaseInput(
  id: string,
  payload: IRescheduleAppointmentPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): IRescheduleAppointmentApplicationInput {
  return {
    id,
    startsAt: new Date(payload.startsAt),
    actor: toAppointmentActor(sessionUser, isStaffUser),
  };
}
