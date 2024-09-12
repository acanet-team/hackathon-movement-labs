import React, { useEffect, useRef, useState } from "react";
import { getPosts } from "@/api/newsfeed";
import { cleanPath } from "@/utils/Helpers";
import PostCard from "./Postcard";
import { useTranslations } from "next-intl";
import DotWaveLoader from "../DotWaveLoader";
import { combineUniqueById } from "@/utils/combine-arrs";
import { IPost } from "@/api/newsfeed/model";

export default function Posts(props: {
  posts: any;
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  feedType: string;
  take: number;
  allPage: number;
  curPage: number;
}): JSX.Element {
  const { posts, setPosts } = props;
  // const [posts, setPosts] = useState<any[]>(props.posts);
  const [take, setTake] = useState<number>(props.take);
  const [page, setPage] = useState<number>(props.curPage);
  const [totalPage, setTotalPage] = useState<number>(props.allPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);
  const [readyToFetch, setReadyToFetch] = useState<boolean>(false);
  const t = useTranslations("Post");
  // const post = usePostStore((state) => state.posts);

  // useEffect(() => {
  //   // setPosts(prev => [...posts, ...prev]);
  //   setPosts((prev) => {
  //     const newPosts = combineUniqueById(prev, posts);
  //     return newPosts;
  //   });
  // }, [post]);

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response: any = await getPosts(page, take, props.feedType);
      console.log("posts", response);
      setPosts((prev) => [...prev, ...response.data.docs]);
      // setPosts((prev) => {
      //   const newPosts = combineUniqueById(prev, response.data.docs);
      //   return newPosts;
      // });
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
    if (document.documentElement && page < totalPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage, isLoading]);

  // Reset states and fetch data on tab (feedType) change
  useEffect(() => {
    if (hasFetchedInitialData) {
      setPage(1);
      setTotalPage(2);
      setPosts([]);
      setReadyToFetch(true);
    }
  }, [props.feedType]);

  useEffect(() => {
    if (readyToFetch) {
      fetchPosts(1);
      setReadyToFetch(false);
    }
  }, [readyToFetch]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
    }
  }, []);

  return (
    <>
      <div>
        {!isLoading && posts?.length === 0 && props.feedType === "for_you" ? (
          <div>
            <div className="text-center pointer align-items-center lh-26 font-xss mt-5 mb-3">
              <span className="d-none-xs fw-600 text-grey-700">
                {t("No_Posts_Found")}
              </span>
            </div>
            <button
              className="main-btn bg-current text-center text-white fw-600 p-2 w150 rounded-3 border-0 d-block mb-5 mx-auto"
              onClick={() => (window.location.href = "/")}
            >
              {t("Explore_More")}
            </button>
          </div>
        ) : (
          posts.map((p: IPost) => (
            <div key={p.id}>
              <PostCard
                groupOwnerId={""}
                groupName={p.community?.name || ""}
                groupAvatar={p.community?.avatar?.path || ""}
                groupId={p.community?.communityId || ""}
                postId={p.id}
                nickName={
                  p.user.nickName || p.user.firstName + " " + p.user.lastName
                }
                authorId={p.user.userId}
                authorNickname={p.user.nickName || ""}
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
          ))
        )}
      </div>
      {isLoading && <DotWaveLoader />}
    </>
  );
}
