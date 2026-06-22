import type { DomainError } from '@shared/domain/errors';
import type { HttpException } from '@nestjs/common';

export type DomainErrorMapper = (error: DomainError) => HttpException | null;
