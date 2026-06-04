import type { EMasterBookingStatus } from './master-profile-booking.enum';

export interface IMasterProfileEntity {
  id: string;
  userId: string;
  displayName: string;
  description: string;
  rating: number;
  timezone: string;
  bookingStatus: EMasterBookingStatus;
  pausedUntil: Date | null;
  minNoticeMinutes: number;
  maxBookingDaysAhead: number;
  slotStepMinutes: number;
  bufferBetweenAppointmentsMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type IMasterProfilePublicEntity = IMasterProfileEntity;

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

export type IUpdateMasterProfileInput = Partial<
  Omit<ICreateMasterProfileInput, 'userId'>
> & {
  userId?: string;
};
