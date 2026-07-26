export interface IPresignBugReportImagesPayload {
  files: Array<{
    name: string;
    sha256sum: string;
  }>;
}
