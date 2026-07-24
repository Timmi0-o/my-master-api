export interface IPresignUserProfileImagesFilePayload {
  name: string;
  sha256sum: string;
}

export interface IPresignUserProfileImagesPayload {
  files: IPresignUserProfileImagesFilePayload[];
}
