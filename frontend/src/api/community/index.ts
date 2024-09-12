import {
  GetCommunitiesParams,
  type CommunityMembersResponse,
  type CreateCommunityResponse,
  type GetACommunityParams,
  type getAllCommunityMembersParams,
  type GetCommunityResponse,
  type ICommunity,
  type joinCommunityParams,
  type RemoveCommunityParams,
  type RequestJoinCommunityParams,
} from "./model";
import httpClient from "..";
import type { IPost, ResponseDto } from "../newsfeed/model";
import type { BaseResponse } from "../model";
import { removePropertiesEmpty } from "@/utils/Helpers";
import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";

export const getCommunities = ({
  page,
  take,
  type,
  brokerId,
  search,
  feeType,
}: GetCommunitiesParams) => {
  const data = removePropertiesEmpty({
    page,
    take,
    type,
    brokerId,
    search,
    feeType,
  });
  return httpClient.get<GetCommunityResponse<ICommunity>>(`/v1/community`, {
    query: data,
  });
};

export const getACommunity = (id: string) => {
  return httpClient.get<GetACommunityParams<ICommunity>>(
    `/v1/community/detail/${id}`,
  );
};

export const createCommunity = (formData: FormData) => {
  return httpClient.post<FormData, CreateCommunityResponse<ICommunity>>(
    `/v1/community`,
    formData,
    {
      contentType: "multi-form",
    },
  );
};

export const editCommunity = (formData: FormData) => {
  return httpClient.patch<FormData, CreateCommunityResponse<ICommunity>>(
    `/v1/community`,
    formData,
    {
      contentType: "multi-form",
    },
  );
};

export const getCommunityPosts = (
  page: number,
  take: number,
  type: string,
  communityId: string,
) => {
  return httpClient.get<ResponseDto<IPost>>(
    `/v1/post?page=${page}&take=${take}&newsFeedType=${type}&communityId=${communityId}`,
  );
};

export const joinCommunity = (communityId: joinCommunityParams) => {
  return httpClient.post<joinCommunityParams, BaseResponse<T>>(
    `/v1/community/join`,
    communityId,
  );
};

export const getCommunityMembers = ({
  page,
  take,
  communityStatus,
  search,
  communityId,
}: getAllCommunityMembersParams) => {
  const data = removePropertiesEmpty({
    page,
    take,
    communityStatus,
    search,
    communityId,
  });
  return httpClient.get<BaseResponse<CommunityMembersResponse>>(
    `/v1/community/join`,
    {
      query: data,
    },
  );
};

export const removeCommunityMember = (values: RemoveCommunityParams) => {
  return httpClient.fetch({
    url: `/v1/community/join`,
    method: "DELETE",
    body: values,
  });
};

export const requestJoinCommunity = (values: RequestJoinCommunityParams) => {
  return httpClient.patch<RequestJoinCommunityParams, BaseResponse<T>>(
    `/v1/community/join`,
    values,
  );
};
