export interface IGetMasterServiceAvailableSlotsInput {
  masterServiceId: string;
  date?: string;
  clientUserId: string;
  excludeAppointmentId?: string;
}
