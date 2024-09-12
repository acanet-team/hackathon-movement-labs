import type { UUID } from "crypto";
export type NotificationType =
  | "like_post"
  | "comment_post"
  | "connection"
  | "follow"
  | "community_join_request"
  | "community_join_accept"
  | "community_join_reject"
  | "community_kicked";
export type Notification = {
  id: string;
  type: NotificationType;
  read_at: string | null;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    nickName: string;
  };
  sourceUser: {
    userId: number;
    firstName: string;
    lastName: string;
    nickName: string;
  };
  community: {
    communityId: string;
    name: string;
  } | null;
  additionalData: {
    post_id: string;
    comment_id?: string;
    community_id: string | UUID;
  };
  createdAt: number;
};
