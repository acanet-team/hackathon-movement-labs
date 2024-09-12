import type { Meta } from "../model";

export interface GetCommunitiesParams {
  page: number;
  take: number;
  type: string | "";
  brokerId: number | "";
  search: string | "";
  feeType: string | "";
}

export interface GetACommunityParams<ICommunity> {
  data: ICommunity;
}

export interface PostCreateCommunityParams {
  name: string;
  description: string;
  fee: string;
  avatar: File | null;
  coverImage: File | null;
}

export interface CreateCommunityResponse<ICommunity> {
  status: number;
  message: string;
  data: ICommunity;
}

interface Photo {
  id: string;
  path: string;
}

interface IUserInfo {
  userId: number;
  firstName: string;
  lastName: string;
  nickName: string;
  photo: Photo;
}

export interface ICommunity {
  id: string;
  owner: IUserInfo;
  name: string;
  description: string;
  avatar: Photo;
  coverImage: Photo;
  fee: number;
  membersCount: number;
  communityStatus: string;
}

export interface ICommunityInfo {
  avatar: Photo;
  coverImage: Photo;
  communityId: string;
  description: string;
  fee: number;
  name: string;
}

export interface GetCommunityResponse<ICommunity> {
  data: {
    docs: ICommunity[];
    meta: Meta;
  };
}

interface ICommunityUser {
  userId: number;
  firstName: string;
  lastName: string;
  nickName: string;
  gmail: string;
  phone: string;
  photo: Photo;
}

export interface ICommunityMember {
  id: string;
  user: ICommunityUser;
  communityId: string;
  communityRole: string;
  communityStatus: string;
  createdAt: string;
}

export interface joinCommunityParams {
  communityId: string;
}

export interface getAllCommunityMembersParams {
  page: number;
  take: number;
  communityStatus: string;
  search: string;
  communityId: string;
}

export interface ICommunityMember {
  id: string;
  user: ICommunityUser;
  communityId: string;
  communityRole: string;
  communityStatus: string;
  createdAt: string;
}

export interface CommunityMembersResponse {
  docs: ICommunityMember[];
  meta: Meta;
  totalPendingRequest: number;
}

export interface RemoveCommunityParams {
  [key: string]: unknown;
  userId: number;
  communityId: string;
}

export interface RequestJoinCommunityParams {
  // [key: string]: unknown;
  requestId: string;
  action: string;
}
