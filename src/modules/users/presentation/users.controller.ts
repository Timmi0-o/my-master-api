import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../application/use-cases/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from '../application/use-cases/get-user-by-email.use-case';
import { ListUsersUseCase } from '../application/use-cases/list-users.use-case';
import { SoftDeleteUserUseCase } from '../application/use-cases/soft-delete-user.use-case';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../application/users.errors';
import {
  CreateUserRequestDto,
  UserEmailQueryDto,
} from './dto/create-user.request.dto';
import { ListUsersQueryDto } from './dto/list-users.query.dto';
import { UserResponseDto } from './dto/user.response.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly softDeleteUserUseCase: SoftDeleteUserUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      const user = await this.createUserUseCase.execute({
        email: dto.email,
        phone: dto.phone ?? null,
        username: dto.username,
        role: dto.role,
        status: dto.status,
        passwordHash: dto.passwordHash,
        name: dto.name,
        surname: dto.surname,
        patronymic: dto.patronymic ?? null,
        language: dto.language,
      });

      return UserResponseDto.fromEntity(user.value);
    } catch (error: unknown) {
      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Get()
  async list(@Query() query: ListUsersQueryDto): Promise<UserResponseDto[]> {
    const users = await this.listUsersUseCase.execute(
      query.limit,
      query.offset,
    );
    return users.map((user) => UserResponseDto.fromEntity(user.value));
  }

  @Get('by-email/search')
  async getByEmail(
    @Query() query: UserEmailQueryDto,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.getUserByEmailUseCase.execute(query.email);
      return UserResponseDto.fromEntity(user.value);
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.getUserByIdUseCase.execute(id);
      return UserResponseDto.fromEntity(user.value);
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    try {
      await this.softDeleteUserUseCase.execute(id);
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
