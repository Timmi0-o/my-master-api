import { MasterEmailNotVerifiedError } from '../errors';

export function ensureMasterOwnerEmailVerified(
  masterProfileId: string,
  emailVerifiedAt: Date | null | undefined,
): void {
  if (emailVerifiedAt == null) {
    throw new MasterEmailNotVerifiedError(masterProfileId);
  }
}
