import type { IMasterProfileEntity } from './i-master-profile.entity';

export type ICreateMasterProfileInput = Pick<
  IMasterProfileEntity,
  'userId' | 'displayName' | 'description' | 'rating'
> &
  Partial<
    Pick<
      IMasterProfileEntity,
      | 'timezone'
      | 'bookingStatus'
      | 'pausedUntil'
      | 'minNoticeMinutes'
      | 'maxBookingDaysAhead'
      | 'slotStepMinutes'
      | 'bufferBetweenAppointmentsMinutes'
    >
  >;
