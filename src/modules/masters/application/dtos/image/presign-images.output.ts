export interface IPresignImagesApplicationOutputItem {
  imageId: string;
  fileId: string;
  name: string;
  path: string;
  url: string;
}

export type IPresignImagesApplicationOutput =
  IPresignImagesApplicationOutputItem[];
