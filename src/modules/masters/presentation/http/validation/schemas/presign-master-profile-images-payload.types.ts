export interface IPresignMasterProfileImagesFilePayload {
  name: string;
  sha256sum: string;
}

export interface IPresignMasterProfileImagesPayload {
  files: IPresignMasterProfileImagesFilePayload[];
}
