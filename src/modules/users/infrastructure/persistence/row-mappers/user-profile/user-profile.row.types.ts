export type UserProfileRow = {
  id: string;
  userId: string;
  displayName: string;
  rating: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type UserProfileEntityRow = UserProfileRow;
