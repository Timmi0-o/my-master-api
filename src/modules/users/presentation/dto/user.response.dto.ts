import { UserEntityProps } from '../../domain/user.entity';
import { UserLanguage, UserRole, UserStatus } from '../../domain/user.enums';

export class UserResponseDto {
  id!: string;
  email!: string;
  phone!: string | null;
  username!: string;
  role!: UserRole;
  status!: UserStatus;
  name!: string;
  surname!: string;
  patronymic!: string | null;
  language!: UserLanguage;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(user: UserEntityProps): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.username,
      role: user.role,
      status: user.status,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      language: user.language,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
