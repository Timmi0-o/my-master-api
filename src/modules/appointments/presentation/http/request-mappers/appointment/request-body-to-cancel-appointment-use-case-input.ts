import type { ICancelAppointmentApplicationInput } from 'src/modules/appointments/application/dtos/appointment/cancel-appointment.input';
import type { ISessionUser } from 'src/modules/shared/domain/i-session-user';
import type { ICancelAppointmentPayload } from '../../validation/schemas/cancel-appointment-payload.types';
import { toAppointmentActor } from '../shared/to-appointment-actor';

export function requestBodyToCancelAppointmentUseCaseInput(
  id: string,
  payload: ICancelAppointmentPayload,
  sessionUser: ISessionUser,
  isStaffUser: boolean,
): ICancelAppointmentApplicationInput {
  return {
    id,
    actor: toAppointmentActor(sessionUser, isStaffUser),
    cancelReason: payload.cancelReason,
  };
}
