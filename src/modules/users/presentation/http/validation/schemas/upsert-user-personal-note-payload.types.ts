export interface IUpsertUserPersonalNotePayload {
  referenceUserId: string;
  context: 'master' | 'client';
  name?: string | null;
  note?: string | null;
}
