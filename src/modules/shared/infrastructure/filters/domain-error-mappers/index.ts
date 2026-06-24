import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InvalidQueryError } from '@shared/domain/errors';
import type { DomainError } from '@shared/domain/errors';
import type { HttpException } from '@nestjs/common';
import type { DomainErrorMapper } from './domain-error-mapper.types';
import { mapUsersDomainError } from './users-domain-error.mapper';
import { mapMastersDomainError } from './masters-domain-error.mapper';
import { mapAppointmentsDomainError } from './appointments-domain-error.mapper';
import { mapAuthDomainError } from './auth-domain-error.mapper';
import { mapFilesDomainError } from './files-domain-error.mapper';
import { mapAuthorizationDomainError } from './authorization-domain-error.mapper';

const DOMAIN_ERROR_MAPPERS: readonly DomainErrorMapper[] = [
  mapUsersDomainError,
  mapMastersDomainError,
  mapAppointmentsDomainError,
  mapAuthDomainError,
  mapFilesDomainError,
  mapAuthorizationDomainError,
];

export function mapDomainErrorToHttp(error: DomainError): HttpException {
  for (const mapper of DOMAIN_ERROR_MAPPERS) {
    const mapped = mapper(error);
    if (mapped !== null) {
      return mapped;
    }
  }

  if (error instanceof InvalidQueryError) {
    return new BadRequestException(error.message);
  }

  return new UnprocessableEntityException(error.message);
}
