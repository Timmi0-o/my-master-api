export type INotificationActorUserPublic = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic?: string | null;
};

export interface INotificationRelations {
  actor?: INotificationActorUserPublic | null;
}
