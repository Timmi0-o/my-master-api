import type { IFileEntity } from '../../domain/entities/file';

export interface IMimeDetectorPort {
  detect(file: IFileEntity): Promise<string | undefined>;
}

export const MIME_DETECTOR_PORT_TOKEN = Symbol('MIME_DETECTOR_PORT_TOKEN');
