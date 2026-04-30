import { UserLanguage, UserRole, UserStatus } from './user.enums';

export interface UserEntityProps {
  id: string;
  email: string;
  phone: string | null;
  username: string;
  role: UserRole;
  status: UserStatus;
  passwordHash: string;
  name: string;
  surname: string;
  patronymic: string | null;
  language: UserLanguage;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class UserEntity {
  constructor(private readonly props: UserEntityProps) {}

  get value(): UserEntityProps {
    return this.props;
  }
}
