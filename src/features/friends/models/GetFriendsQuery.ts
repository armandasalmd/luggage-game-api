export interface GetFriendsQuery {
  includePending: boolean;
  includeAvatar: boolean;
  forUsername: string;
}