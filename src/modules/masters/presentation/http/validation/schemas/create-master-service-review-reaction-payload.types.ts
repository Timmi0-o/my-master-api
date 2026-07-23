export interface ICreateMasterServiceReviewReactionPayload {
  masterServiceReviewId: string;
  type: 'LIKE' | 'DISLIKE';
}
