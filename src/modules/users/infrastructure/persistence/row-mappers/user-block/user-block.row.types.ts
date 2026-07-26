export type UserBlockUserRow = {
  id: string;
  username: string;
  name: string;
  surname: string;
  patronymic: string | null;
};

export type UserBlockRow = {
  id: string;
  blockerUserId: string;
  blockedUserId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  blocker?: UserBlockUserRow | null;
  blocked?: UserBlockUserRow | null;
};
