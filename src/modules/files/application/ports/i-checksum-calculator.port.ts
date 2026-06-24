import type { IFileEntity } from '../../domain/entities/file';

export interface IChecksumCalculatorPort {
  getChecksum(file: IFileEntity): Promise<string | undefined>;
}

export const CHECKSUM_CALCULATOR_PORT_TOKEN = Symbol(
  'CHECKSUM_CALCULATOR_PORT_TOKEN',
);
