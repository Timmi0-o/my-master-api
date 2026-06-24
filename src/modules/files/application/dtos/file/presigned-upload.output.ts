export interface IPresignedUploadApplicationOutputItem {
  fileId: string;
  name: string;
  path: string;
  url: string;
}

export type IPresignedUploadApplicationOutput =
  IPresignedUploadApplicationOutputItem[];
