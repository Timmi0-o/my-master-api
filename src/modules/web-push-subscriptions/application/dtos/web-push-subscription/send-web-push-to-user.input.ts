export interface ISendWebPushToUserApplicationInput {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}
