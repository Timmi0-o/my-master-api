import {
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DomainError } from 'src/modules/shared/domain/errors';

export function mapDomainErrorToHttp(error: DomainError): HttpException {
  switch (error.code) {
    case 'USER_NOT_FOUND':
    case 'MEMBER_NOT_FOUND':
      return new NotFoundException(error.message);
    case 'INVALID_CREDENTIALS':
    case 'REFRESH_TOKEN_INVALID':
      return new UnauthorizedException(error.message);
    case 'USER_NOT_ACTIVE':
      return new ForbiddenException(error.message);
    default:
      return new UnprocessableEntityException(error.message);
  }
}
