import React, { useCallback, useEffect, useState } from "react";
import PostCard from "../newsfeed/Postcard";
import DotWaveLoader from "../DotWaveLoader";
import type { IPost } from "@/api/newsfeed/model";
import { getMyPosts } from "@/api/profile";
import { combineUniqueById } from "@/utils/combine-arrs";
import { cleanPath } from "@/utils/Helpers";

const TabPostProfile = (props: {
  myPosts: any;
  take: number;
  totalPages: number;
  curPage: number;
  id: string;
}) => {
  const [myPosts, setMyPosts] = useState<IPost[]>(props.myPosts);
  const [take, setTake] = useState<number>(props.take);
  const [page, setPage] = useState<number>(props.curPage);
  const [totalPage, setTotalPage] = useState<number>(props.totalPages);
  const [id, setId] = useState<string>(props.id);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  console.log("postsssss", myPosts);
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);

  const fetchPosts = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response: any = await getMyPosts(page, take, "owner", Number(id));
      console.log("postsssss", response);
      setMyPosts((prev: IPost[]) => {
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
  }, []);

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

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
    }
  }, []);
  return (
    <div style={{ marginTop: "40px", paddingBottom: "100px" }}>
      {!isLoading && myPosts?.length === 0 && (
        <div className="mt-5 text-center">No posts found.</div>
      )}
      {myPosts &&
        myPosts.length > 0 &&
        myPosts.map((myPost) => (
          <div key={""}>
            <PostCard
              groupOwnerId=""
              groupName=""
              groupId=""
              groupAvatar={myPost.community?.avatar?.path || ""}
              postId={myPost.id}
              nickName={
                myPost.user?.nickName ||
                myPost.user?.firstName + " " + myPost.user.lastName
              }
              authorId={myPost.user?.userId}
              authorNickname={myPost.user?.nickName || ""}
              avatar={
                myPost.user?.photo?.id
                  ? cleanPath(myPost.user?.photo?.path)
                  : "/assets/images/user.png"
              }
              content={myPost.content}
              assets={myPost.assets}
              createdAt={myPost.createdAt}
              like={myPost.favoriteCount}
              comment={myPost.commentCount}
              columnsCount={
                myPost.assets?.length > 3 ? 3 : myPost.assets?.length
              }
              liked={myPost.liked}
              setPostHandler={setMyPosts}
            />
          </div>
        ))}
      {isLoading && <DotWaveLoader />}
    </div>
  );
};

export default TabPostProfile;
