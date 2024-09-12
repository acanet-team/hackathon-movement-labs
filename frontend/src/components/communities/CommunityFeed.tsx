import { cleanPath } from "@/utils/Helpers";
import React, { useEffect, useState } from "react";
import DotWaveLoader from "../DotWaveLoader";
import PostCard from "../newsfeed/Postcard";
import { getCommunityPosts } from "@/api/community";
import { combineUniqueById } from "@/utils/combine-arrs";
import type { IPost } from "@/api/newsfeed/model";
import CreatePost from "../newsfeed/Createpost";
import CommunityOverview from "./CommunityOverview";
import type { ICommunity } from "@/api/community/model";

export default function CommunityFeed(props: {
  posts: any;
  take: number;
  allPage: number;
  curPage: number;
  groupId: string;
  userSession: {};
  groupData: ICommunity;
}) {
  const [posts, setPosts] = useState<IPost[]>(props.posts);
  const [take, setTake] = useState<number>(props.take);
  const [page, setPage] = useState<number>(props.curPage);
  const [totalPage, setTotalPage] = useState<number>(props.allPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  // const [hasFetchedInitialData, setHasFetchedInitialData] =
  //   useState<boolean>(false);

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response: any = await getCommunityPosts(
        page,
        take,
        "community",
        props.groupId,
      );
      console.log("posts", response);
      setPosts((prev: IPost[]) => {
        const newPosts: IPost[] = combineUniqueById(
          prev,
          response.data.docs,
        ) as IPost[];
        return newPosts;
      });
      setTotalPage(response.data.meta.totalPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onScrollHandler = () => {
    if (document.documentElement) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight &&
        !isLoading &&
        page < totalPage
      ) {
        setPage((page) => page + 1);
      }
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  useEffect(() => {
    if (document.documentElement && page < totalPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage, isLoading]);

  // // Avoid fetching data on initial render
  // useEffect(() => {
  //   if (!hasFetchedInitialData) {
  //     setHasFetchedInitialData(true);
  //   }
  // }, []);

  return (
    <div className="row g-0 g-sm-4 mb-5">
      <div className="col-xl-3 col-xxl-3 col-lg-4 pe-0">
        <CommunityOverview groupData={props.groupData} />
        {/* <Profilephoto /> */}
      </div>
      <div className="col-xl-9 col-xxl-9 col-lg-8">
        <div>
          <CreatePost
            userSession={props.userSession}
            groupId={props.groupId}
            updatePostArr={setPosts}
          />
          {!isLoading && posts.length === 0 && (
            <div className="mt-5 text-center">No posts found.</div>
          )}
          {posts.map((p) => (
            <div key={p.id}>
              <PostCard
                groupOwnerId={props.groupData?.owner?.userId || ""}
                groupName={""}
                groupAvatar={""}
                groupId={p.community?.communityId || ""}
                postId={p.id}
                nickName={
                  p.user?.nickName || p.user?.firstName + " " + p.user?.lastName
                }
                authorId={p.user?.userId}
                authorNickname={p.user?.nickName || ""}
                avatar={
                  p.user?.photo?.id
                    ? cleanPath(p.user?.photo?.path)
                    : "/assets/images/user.png"
                }
                content={p.content}
                assets={p?.assets}
                createdAt={p.createdAt}
                like={p.favoriteCount}
                comment={p.commentCount}
                columnsCount={p.assets?.length > 3 ? 3 : p.assets?.length}
                liked={p.liked}
                setPostHandler={setPosts}
              />
            </div>
          ))}
        </div>
        {isLoading && <DotWaveLoader />}
      </div>
    </div>
  );
}
