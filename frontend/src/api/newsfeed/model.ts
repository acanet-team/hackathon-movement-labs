import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";
import { Photo, Role, IUserInfo } from "../onboard/model";
import type { ICommunityInfo } from "../community/model";
export interface likeParams {
  postId: string;
  action: "favorite" | "unfavorite";
}

interface CreateBy {
  id: number;
  firstName: string;
  lastName: string;
  photo: Photo;
  role: Role;
  refCode: string;
  nickName: string;
}

export interface Comment {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  content: string;
  childrenCount: number;
  createBy: CreateBy;
  post: {};
  parent: string;
  children: string[];
}

export type CommentResponse<T> = {
  status: number;
  message: string;
  data: {
    data?: Comment[];
    docs?: Comment[];
    meta: {
      page: number;
      take: number;
      total: number;
      totalPage: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
};

export type ResponseDto<T> = {
  status: number;
  message: string;
  data: {
    data?: T[];
    docs?: T[];
    meta: {
      page: number;
      take: number;
      total: number;
      totalPage: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
};

export interface IPost {
  id: string;
  content: string;
  favoriteCount: number;
  commentCount: number;
  community?: ICommunityInfo;
  assets: Photo[];
  createBy: IUserInfo;
  comments: Comment[];
  liked: boolean;
  user: IUserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface GetTopicsResponse {
  data: {
    docs: {
      topicName: any;
      id: string;
    }[];
    meta: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      page: number;
      take: number;
      total: number;
      totalPage: number;
    };
  };
}

export interface CreatePostRequest {
  interestTopicId: string;
  content: string;
  images: File[];
}

export interface IBrokers {
  brokerProfileId: string;
  coursesEnrolledCount: number;
  firstName: string;
  followed: boolean;
  followersCount: number;
  followingsCount: number;
  lastName: string;
  photo: {
    id: string;
    path: string;
  };
  rank: string;
  rating: number;
  role: string;
  skills: { interestTopicId: string; topicName: string };
  userId: number;
}
