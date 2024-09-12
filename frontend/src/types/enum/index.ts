export enum TabEnum {
  ForYou = "for_you",
  Suggestion = "suggestion",
}
export enum TabPnum {
  Posts = "posts",
  Communities = "communities",
  About = "about",
  Rating = "rating",
}
export enum CommunityEnum {
  popular = "popular",
  following = "following",
  owned = "owned",
}

export enum CommunityViewEnum {
  posts = "posts",
  members = "members",
  requests = "requests",
}

export enum CommunityJoiningStatus {
  not_join = "",
  pending = "pending_request", // Đang gửi yêu cầu vào nhóm
  joined = "joined", // Đã vào nhóm
  invited = "invited", // Đã gửi lời mời vào nhóm
  rejected = "rejected", // Bị từ chối
  banned = "banned", // Bị ban
}
