import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserLanguage, UserRole, UserStatus } from '../../domain/user.enums';

export class CreateUserRequestDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  username!: string;

  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;

  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.PENDING;

  @IsString()
  passwordHash!: string;

  @IsString()
  name!: string;

  @IsString()
  surname!: string;

  @IsOptional()
  @IsString()
  patronymic?: string;

  @IsEnum(UserLanguage)
  language: UserLanguage = UserLanguage.RU;
}

export class UserIdParamDto {
  @IsUUID()
  id!: string;
}

export class UserEmailQueryDto {
  @IsEmail()
  email!: string;
}
