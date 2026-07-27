import { DomainError } from '@shared/domain/errors';

export class VapidConfigMissingError extends DomainError {
  constructor() {
    super(
      'VAPID_CONFIG_MISSING',
      'VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT are required',
    );
  }
}
