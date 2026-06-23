import { DomainError } from '@shared/domain/errors';

export class AppointmentMasterIdMustBeStrangerError extends DomainError {
  constructor(masterProfileId: string) {
    super(
      'APPOINTMENT_MASTER_ID_MUST_BE_STRANGER',
      'Master ID must be a stranger',
      {
        masterProfileId,
      },
    );
  }
}
