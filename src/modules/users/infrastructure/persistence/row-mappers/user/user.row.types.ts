import type { Language, Role, Status } from '@prisma/client';

export type UserPrismaRow = {
  id: string;
  email: string;
  phone?: string | null;
  username: string;
  role: Role;
  status: Status;
  language: Language;
  name: string;
  surname: string;
  patronymic?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  passwordHash?: string;
};
