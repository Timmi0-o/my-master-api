export type UserPersonalNoteRow = {
  id: string;
  ownerUserId: string;
  referenceUserId: string;
  names: unknown;
  notes: unknown | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
