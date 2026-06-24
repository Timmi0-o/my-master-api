export interface IFileUploadedApplicationInput {
  fileUrl: string;
  size: number;
  eTag: string;
  location: string;
  userMetadata?: Record<string, unknown>;
}
