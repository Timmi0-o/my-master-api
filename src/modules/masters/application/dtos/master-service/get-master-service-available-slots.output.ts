import type { IAvailableSlot } from '../../services/calculate-master-available-slots';

export interface IGetMasterServiceAvailableSlotsOutput {
  date: string;
  timezone: string;
  slots: IAvailableSlot[];
}
