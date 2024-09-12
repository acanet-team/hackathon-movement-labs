import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/postCard.module.scss";
import { deletePost, getComments, likeRequest } from "@/api/newsfeed";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TimeSinceDate } from "@/utils/time-since-date";
import Image from "next/image";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import DotWaveLoader from "../DotWaveLoader";
import { useSession } from "next-auth/react";
import { throwToast } from "@/utils/throw-toast";
import RoundedNumber from "../RoundedNumber";
import type { IPost } from "@/api/newsfeed/model";
import { useTranslations } from "next-intl";
import Link from "next/link";
import PostModal from "./PostModal";
import { useMediaQuery } from "react-responsive";
import Comments from "./Comments";

export default function PostCard(props: {
  postId: string;
  nickName: string;
  authorId: number;
  authorNickname: string;
  avatar: string;
  content: string;
  assets: Array<{ id: string; path: string }>;
  like: number;
  comment: number;
  createdAt: string;
  columnsCount: number;
  liked: boolean;
  groupAvatar: string;
  groupName: string | "";
  groupOwnerId: number | "";
  groupId: string;
  setPostHandler: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
}) {
  const {
    postId,
    nickName,
    avatar,
    content,
    assets,
    authorId,
    authorNickname,
    like = 0,
    comment = 0,
    createdAt,
    columnsCount = 1,
    liked,
    groupAvatar,
    groupName,
    groupOwnerId,
    groupId,
    setPostHandler,
  } = props;
  const [expandPost, setExpandPost] = useState<boolean>(false);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [openMobileComments, setOpenMobileComments] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [commentNum, setCommentNum] = useState<number>(comment || 0);
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  // const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const [likeNum, setLikeNum] = useState<number>(like);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession() as any;
  const [userId, setUserId] = useState<number>();
  const tBase = useTranslations("Base");

  // Comment states
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [take, setTake] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response: any = await getComments(page, take, postId);
      // Update the comments state with the fetched data
      // setComments((prevState) => [...prevState, ...response.data.docs]);
      setComments(response.data.docs);
      console.log("comment array", response.data.docs);
      setTotalPage(response.data.meta.totalPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      setUserId(session.user?.id);
    }
  }, [session]);

  useEffect(() => {
    // Fetch comments again every time user opens the comment section on PC
    if (openComments) {
      fetchComments();
    }
  }, [postId, openComments]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setOpenSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsRef]);

  const onShowCommentHandler = (id: string) => {
    if (isMobile) {
      setOpenMobileComments(true);
    } else {
      setOpenComments((open) => !open);
    }
    // const updatedSearchParams = new URLSearchParams(searchParams ?? "");
    // if (id) {
    //   updatedSearchParams.set("comments", id);
    // } else {
    //   updatedSearchParams.delete("comments");
    // }

    // startTransition(() => {
    //   router.replace(`${pathname}?${updatedSearchParams.toString()}`, {
    //     scroll: false,
    //   });
    // });
  };

  const handleClose = useCallback(() => {
    if (isMobile) {
      setOpenMobileComments(false);
    } else {
      setOpenComments((open) => !open);
    }
  }, []);

  const onClickLikeHandler = (e: any, id: string, like: number) => {
    const likeBtn = e.target;
    if (likeBtn) {
      try {
        if (isLiked) {
          setLikeNum((prev) => prev - 1);
          setIsLiked(false);
          likeRequest({ postId: id, action: "unfavorite" });
        } else {
          setLikeNum((prev) => prev + 1);
          setIsLiked(true);
          likeRequest({ postId: id, action: "favorite" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onDeletePost = async (e: any, postId: string) => {
    try {
      // Calling api;
      await deletePost(postId);
      setPostHandler((prev) => prev.filter((post) => post.id !== postId));
      throwToast("Post was successfully deleted", "success");
    } catch (err) {
      console.log(err);
    }
  };

  const setCommentNumHandler = useCallback((action: string) => {
    if (action === "add") {
      setCommentNum((prevState: number) => prevState + 1);
    } else {
      setCommentNum((prevState: number) => prevState - 1);
    }
  }, []);

  const updateLikeHandler = useCallback((action: string) => {
    if (action === "add") {
      setLikeNum((prevState: number) => prevState + 1);
    } else {
      setLikeNum((prevState: number) => prevState - 1);
    }
  }, []);

  const updateCommentHandler = useCallback((action: string) => {
    if (action === "add") {
      setCommentNum((prevState: number) => prevState + 1);
    } else {
      setCommentNum((prevState: number) => prevState - 1);
    }
  }, []);

  return (
    <div
      className={`${styles.post} post-card card w-100 shadow-xss rounded-3 border-0 p-sm-4 p-3 mb-3`}
    >
      <div className="card-body p-0 d-flex">
        <figure className="avatar me-3">
          {groupAvatar ? (
            <div className="position-relative">
              <Link href={`/communities/detail/${groupId}`}>
                <Image
                  src={groupAvatar}
                  width={45}
                  height={45}
                  alt="group"
                  className="shadow-sm rounded-3 w45"
                  style={{ border: "1px solid #ddd" }}
                />
              </Link>
              <Link href={`/profile/${authorNickname}`}>
                <Image
                  src={avatar}
                  width={30}
                  height={30}
                  alt="avatar"
                  className="shadow-sm rounded-circle position-absolute border-1"
                  style={{
                    bottom: "-5px",
                    right: "-5px",
                    border: "1px solid #eee",
                  }}
                />
              </Link>
            </div>
          ) : (
            <Link href={`/profile/${authorNickname}`}>
              <Image
                src={avatar}
                width={45}
                height={45}
                alt="avater"
                className="shadow-sm rounded-circle w45"
              />
            </Link>
          )}
        </figure>
        {groupName ? (
          <div>
            <Link href={`/communities/detail/${groupId}`}>
              <h4 className="fw-700 text-grey-900 text-break font-xss m-0">
                {isMobile
                  ? groupName.length > 23
                    ? `${groupName.substring(0, 20)}...`
                    : groupName
                  : groupName}
              </h4>
            </Link>
            <div className="d-flex align-items-end">
              <Link
                href={`/profile/${authorNickname}`}
                className="lh-3 d-flex align-items-end"
              >
                <span className="font-xsss fw-500 text-break text-grey-600">
                  @
                  {isMobile
                    ? nickName.length > 20
                      ? `${nickName.substring(0, 20)}...`
                      : nickName
                    : nickName}
                </span>
              </Link>
              <div className="d-flex align-items-end">
                <i className="bi bi-dot h4 m-0 text-grey-500"></i>
                <span className="font-xsss fw-500 mt-1 lh-3 text-grey-500">
                  {createdAt ? TimeSinceDate(createdAt) : ""}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Link href={`/profile/${authorNickname}`}>
              <h4 className="fw-700 text-grey-900 font-xss mt-1">
                @
                {isMobile
                  ? nickName.length > 20
                    ? `${nickName.substring(0, 20)}...`
                    : nickName
                  : nickName}
              </h4>
            </Link>
            <span className="d-block font-xsss fw-500 mt-1 lh-3 text-grey-500">
              {createdAt ? TimeSinceDate(createdAt) : ""}
            </span>
          </div>
        )}
        {userId && (userId === authorId || userId === groupOwnerId) && (
          <div
            className="ms-auto pointer position-relative"
            onClick={() => setOpenSettings((open) => !open)}
            ref={settingsRef}
          >
            <i className="bi bi-three-dots h1 me-2 position-absolute right-0"></i>
            {openSettings && (
              <div
                className={`${styles["delete-post__btn"]} font-xsss border-0 py-2 px-3 py-1 rounded-3 cursor-pointer`}
                onClick={(e) => onDeletePost(e, postId)}
              >
                Delete
              </div>
            )}
          </div>
        )}
      </div>
      <div className="card-body p-0 ms-1 mt-2 me-lg-6">
        <Box
          sx={{
            width: "100%",
            maxHeight: 500,
            overflow: "hidden",
          }}
        >
          <p className="fw-500 lh-26 font-xss w-100 mb-2">
            {expandPost
              ? content
              : content.length > 150
                ? content.substring(0, 150) + "..."
                : content}
            {content.length > 150 && !expandPost ? (
              <span
                className={styles["expand-btn"]}
                onClick={() => setExpandPost((open) => !open)}
              >
                See more
              </span>
            ) : (
              ""
            )}
          </p>
          <Masonry columns={columnsCount}>
            {assets?.slice(0, 5).map(({ path, id }) =>
              path ? (
                <div key={id}>
                  <img
                    srcSet={`${path}?w=162&auto=format&dpr=2 2x`}
                    src={`${path}?w=162&auto=format`}
                    alt={id}
                    loading="lazy"
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      display: "block",
                      width: "100%",
                    }}
                  />
                </div>
              ) : null,
            )}
          </Masonry>
        </Box>
      </div>

      <div className="card-body d-flex p-0 mt-4">
        <div className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xsss me-3">
          {/* <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss"></i>{' '} */}
          <i
            className={`${isLiked ? "bi-heart-fill" : "bi-heart"} bi h2 m-0 me-2 d-flex align-items-center cursor-pointer`}
            onClick={(e) => onClickLikeHandler(e, postId, like)}
          ></i>
          <span className="like-number">
            {likeNum >= 1000 ? Math.round(likeNum / 1000).toFixed(1) : likeNum}
          </span>
          <span className="like-thousand">{likeNum >= 1000 ? "k" : ""}</span>
        </div>
        <div
          className={`${styles["post-comment"]} d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xsss`}
          // onClick={() => onShowCommentHandler(postId.toString())}
          onClick={() => onShowCommentHandler(postId.toString())}
        >
          <i className="bi bi-chat h2 m-0 me-2 d-flex align-items-center"></i>
          <span className="d-none-xss">
            <RoundedNumber
              num={commentNum}
              unitSingular={tBase("comment")}
              unitPlural={tBase("comments")}
            />
          </span>
        </div>
        {/* <div
          className="pointer ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
          id={`dropdownMenu${props.id}`}
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={() => toggleOpen((prevState) => !prevState)}
        >
          <i className="feather-share-2 text-grey-900 text-dark btn-round-sm font-lg"></i>
          <span className="d-none-xs">Share</span>
        </div> */}

        {/* <div
          className="dropdown-menu dropdown-menu-end p-4 rounded-3 border-0 shadow-lg right-0"
          aria-labelledby={`dropdownMenu${props.id}`}
        >
          <h4 className="fw-700 font-xss text-grey-900 d-flex align-items-center">
            Share{" "}
            <i className="feather-x ms-auto font-xssss btn-round-xs bg-greylight text-grey-900 me-2"></i>
          </h4>
          <div className="card-body p-0 d-flex">
            <ul className="d-flex align-items-center justify-content-between mt-2">
              <li className="me-1">
                <span className="btn-round-lg pointer bg-facebook">
                  <i className="font-xs ti-facebook text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-twiiter">
                  <i className="font-xs ti-twitter-alt text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-linkedin">
                  <i className="font-xs ti-linkedin text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-instagram">
                  <i className="font-xs ti-instagram text-white"></i>
                </span>
              </li>
              <li>
                <span className="btn-round-lg pointer bg-pinterest">
                  <i className="font-xs ti-pinterest text-white"></i>
                </span>
              </li>
            </ul>
          </div>
          <div className="card-body p-0 d-flex">
            <ul className="d-flex align-items-center justify-content-between mt-2">
              <li className="me-1">
                <span className="btn-round-lg pointer bg-tumblr">
                  <i className="font-xs ti-tumblr text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-youtube">
                  <i className="font-xs ti-youtube text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-flicker">
                  <i className="font-xs ti-flickr text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-black">
                  <i className="font-xs ti-vimeo-alt text-white"></i>
                </span>
              </li>
              <li>
                <span className="btn-round-lg pointer bg-whatsup">
                  <i className="font-xs feather-phone text-white"></i>
                </span>
              </li>
            </ul>
          </div>
          <h4 className="fw-700 font-xssss mt-4 text-grey-500 d-flex align-items-center mb-3">
            Copy Link
          </h4>
          <i className="feather-copy position-absolute right-35 mt-3 font-xs text-grey-500"></i>
          <input
            type="text"
            placeholder="https://socia.be/1rGxjoJKVF0"
            className="bg-grey text-grey-500 font-xssss border-0 lh-32 p-2 font-xssss fw-600 rounded-3 w-100 theme-dark-bg"
          />
        </div> */}
      </div>
      {/* All comments */}
      {isLoading && <DotWaveLoader />}
      {!isMobile && openComments && !isLoading && (
        <Comments
          comments={comments}
          page={page}
          totalPage={totalPage}
          take={take}
          postId={postId}
          setCommentNum={setCommentNumHandler}
          postAuthor={authorId}
        />
      )}
      {isMobile && openMobileComments && (
        <PostModal
          show={openMobileComments}
          handleClose={handleClose}
          postId={postId}
          nickName={nickName}
          avatar={avatar}
          content={content}
          assets={assets}
          authorId={authorId}
          authorNickname={authorNickname}
          createdAt={createdAt}
          columnsCount={columnsCount}
          groupAvatar={groupAvatar}
          groupName={groupName}
          groupOwnerId={groupOwnerId}
          groupId={groupId}
          userId={userId}
          like={likeNum}
          comment={commentNum}
          liked={isLiked}
          updateLike={updateLikeHandler}
          updateComments={updateCommentHandler}
          updateIsLiked={setIsLiked}
          setPostHandler={setPostHandler}
        />
      )}
    </div>
  );
}
