import { NotFoundException } from '@nestjs/common';
import { BugReportNotFoundError } from 'src/modules/bug-reports/domain/entities/bug-report';
import type { DomainErrorMapper } from './domain-error-mapper.types';

export const mapBugReportsDomainError: DomainErrorMapper = (error) => {
  if (error instanceof BugReportNotFoundError) {
    return new NotFoundException(error.message);
  }

  return null;
};
