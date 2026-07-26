export type IUserBlockUserPublic = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic?: string | null;
};

export interface IUserBlockRelations {
  blocker?: IUserBlockUserPublic;
  blocked?: IUserBlockUserPublic;
}
