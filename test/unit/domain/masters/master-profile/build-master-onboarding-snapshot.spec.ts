import {
  buildMasterOnboardingSnapshot,
  EMasterBookingStatus,
  isMasterOnboardingFulfilled,
} from 'src/modules/masters/domain/entities/master-profile';

describe('buildMasterOnboardingSnapshot', () => {
  it('sets fullFill and canAcceptBookings when service and schedule exist', () => {
    const snapshot = buildMasterOnboardingSnapshot(
      {
        hasService: true,
        hasSchedule: true,
        hasAddress: false,
      },
      EMasterBookingStatus.CLOSED,
    );

    expect(snapshot.fullFill).toBe(true);
    expect(snapshot.canAcceptBookings).toBe(true);
    expect(snapshot.hasAddress).toBe(false);
    expect(snapshot.bookingStatus).toBe(EMasterBookingStatus.CLOSED);
  });

  it('does not require address for fullFill', () => {
    expect(
      isMasterOnboardingFulfilled({ hasService: true, hasSchedule: true }),
    ).toBe(true);

    const snapshot = buildMasterOnboardingSnapshot(
      {
        hasService: true,
        hasSchedule: true,
        hasAddress: false,
      },
      EMasterBookingStatus.ACCEPTING,
    );

    expect(snapshot.fullFill).toBe(true);
  });

  it('is incomplete without service or schedule', () => {
    expect(
      buildMasterOnboardingSnapshot(
        { hasService: false, hasSchedule: true, hasAddress: true },
        EMasterBookingStatus.CLOSED,
      ).fullFill,
    ).toBe(false);

    expect(
      buildMasterOnboardingSnapshot(
        { hasService: true, hasSchedule: false, hasAddress: true },
        EMasterBookingStatus.CLOSED,
      ).canAcceptBookings,
    ).toBe(false);
  });
});
