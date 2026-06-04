import type { IDateRangeArrayFilter, IStringArrayFilter, ITextSearchFilterPreset } from 'src/modules/shared/application/presets/common/filter-preset.types';

export interface IAppointmentChatMessageFiltersPreset {
  search?: ITextSearchFilterPreset | null;
  id?: IStringArrayFilter | null;
  chatId?: IStringArrayFilter | null;
  senderUserId?: IStringArrayFilter | null;
  createdAt?: IDateRangeArrayFilter | null;
  updatedAt?: IDateRangeArrayFilter | null;
  deletedAt?: IDateRangeArrayFilter | null;
}
