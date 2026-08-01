import type { EMasterBookingStatus } from './master-profile-booking.enum';

export interface IMasterOnboardingFlags {
  hasService: boolean;
  hasSchedule: boolean;
  hasAddress: boolean;
}

export interface IMasterOnboardingSnapshot extends IMasterOnboardingFlags {
  canAcceptBookings: boolean;
  bookingStatus: EMasterBookingStatus;
  fullFill: boolean;
}

export function buildMasterOnboardingSnapshot(
  flags: IMasterOnboardingFlags,
  bookingStatus: EMasterBookingStatus,
): IMasterOnboardingSnapshot {
  const fullFill = flags.hasService && flags.hasSchedule;

  return {
    hasService: flags.hasService,
    hasSchedule: flags.hasSchedule,
    hasAddress: flags.hasAddress,
    canAcceptBookings: fullFill,
    bookingStatus,
    fullFill,
  };
}

export function isMasterOnboardingFulfilled(
  flags: Pick<IMasterOnboardingFlags, 'hasService' | 'hasSchedule'>,
): boolean {
  return flags.hasService && flags.hasSchedule;
}
