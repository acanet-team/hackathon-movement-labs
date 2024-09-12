import type { Post } from "@/types";
import httpClient from "../index";
import { type AllBrokersResponse, type PostRequestParams } from "../model";
import {
  likeParams,
  GetTopicsResponse,
  CreatePostRequest,
  type Comment,
  type CommentResponse,
  type ResponseDto,
  type IPost,
  type IBrokers,
} from "./model";
import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";

export const header = new Headers();

export const likeRequest = (values: any) => {
  return httpClient.post<PostRequestParams<likeParams>, T>(
    "/v1/post/favorite",
    values,
  );
};

export const getComments = (page: number, take: number, postId: string) => {
  return httpClient.get<CommentResponse<Comment>>(
    `/v1/comment?order=DESC&page=${page}&take=${take}&postId=${postId}`,
  );
};

export const getPosts = (page: number, take: number, type: string) => {
  return httpClient.get<ResponseDto<IPost>>(
    `/v1/post?page=${page}&take=${take}&newsFeedType=${type}`,
  );
};

export const getTopics = (
  page: number,
  search: string,
): Promise<GetTopicsResponse> => {
  let url = `/v1/interest-topic?order=DESC`;
  page ? (url += `&page=${page}&take=20`) : null;
  search ? (url += `&keyword=${search}`) : null;
  return httpClient.get(url);
};

export const createNewPostRequest = (values: FormData) => {
  return httpClient.post<FormData, ResponseDto<Post>>("/v1/post", values, {
    contentType: "multi-form",
  });
};

export const getTopBrokers = (page: number, take: number) => {
  return httpClient.get<AllBrokersResponse<IBrokers>>(
    `/v1/users?type=broker&page=${page}&take=${take}&followStatus=notFollowed&sort={"orderBy":"followers_count","order":"DESC"}`,
  );
};

export const postComment = (values: { content: string; postId: string }) => {
  return httpClient.post("/v1/comment", values);
};

export const deleteComment = (commentId: string) => {
  return httpClient.delete(`/v1/comment/${commentId}`);
};

export const deletePost = (postId: string) => {
  return httpClient.delete(`/v1/post/${postId}`);
};
