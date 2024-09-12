import { useCallback, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/postModal.module.scss";
import Image from "next/image";
import Link from "next/link";
import { TimeSinceDate } from "@/utils/time-since-date";
import Masonry from "@mui/lab/Masonry";
import { Box } from "@mui/material";
import RoundedNumber from "../RoundedNumber";
import { deletePost, getComments, likeRequest } from "@/api/newsfeed";
import { throwToast } from "@/utils/throw-toast";
import { useTranslations } from "next-intl";
import page from "@/pages/courses/investor/page";
import DotWaveLoader from "../DotWaveLoader";
import React from "react";
import Comments from "./Comments";
import { useMediaQuery } from "react-responsive";

function PostModal(props: {
  show: boolean;
  handleClose: () => void;
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
  userId: number | undefined;
  setPostHandler: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
  updateLike: React.Dispatch<React.SetStateAction<string>>;
  updateComments: React.Dispatch<React.SetStateAction<string>>;
  updateIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    show,
    handleClose,
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
    userId,
    setPostHandler,
    updateLike,
    updateComments,
    updateIsLiked,
  } = props;
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const commentListMobileRef = useRef<any>(null);
  const childRef = useRef<any>(null);
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const [likeNum, setLikeNum] = useState<number>(like);
  const [commentNum, setCommentNum] = useState<number>(comment || 0);
  const [expandPost, setExpandPost] = useState<boolean>(false);
  const tComment = useTranslations("Comment");
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Comment states
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [take, setTake] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  const tBase = useTranslations("Base");

  const initialFetchComments = async () => {
    setIsLoading(true);
    try {
      const response: any = await getComments(page, take, postId);
      // Update the comments state with the fetched data
      // setComments((prevState) => [...prevState, ...response.data.docs]);
      setComments(response.data.docs);
      // console.log("comment array", response.data.docs);
      setTotalPage(response.data.meta.totalPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      initialFetchComments();
    }
  }, [show]);

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const onClickLikeHandler = (e: any, id: string, like: number) => {
    const likeBtn = e.target;
    if (likeBtn) {
      try {
        if (isLiked) {
          setLikeNum((prev) => prev - 1);
          updateLike("remove");
          setIsLiked(false);
          updateIsLiked(false);
          likeRequest({ postId: id, action: "unfavorite" });
        } else {
          setLikeNum((prev) => prev + 1);
          updateLike("add");
          setIsLiked(true);
          updateIsLiked(true);
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
      updateComments("add");
    } else {
      setCommentNum((prevState: number) => prevState - 1);
      updateComments("remove");
    }
  }, []);

  // Fetch comments on scroll on mobile
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile && commentListMobileRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          commentListMobileRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          childRef.current.fetchMobileComments();
        }
      }
    };

    const div = commentListMobileRef.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <Modal
      fullscreen={fullscreen}
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      className={`${styles["customModal"]} nunito-font`}
    >
      <Modal.Header
        closeButton={fullscreen === "sm-down" ? false : true}
        className={styles["modal-header"]}
        style={{ height: "50px" }}
      >
        {fullscreen && (
          <i
            className={`${styles["modal-back__btn"]} bi bi-arrow-left h1 m-0`}
            onClick={handleClose}
          ></i>
        )}
        <h2 className="p-0 m-0 fs-4 fw-bold">{nickName}&apos;s post</h2>
      </Modal.Header>
      <div className="border-top" />
      <Modal.Body className={styles["modal-content"]}>
        {/* Post content */}
        <div
          className={`${styles.post} post-card card w-100 h-100 shadow-xss rounded-3 border-0 p-sm-3 p-1 mb-3`}
          ref={commentListMobileRef}
        >
          <div className="card-body p-0 d-flex">
            <figure className="avatar me-3">
              {groupAvatar ? (
                <div className="position-relative">
                  <Image
                    src={groupAvatar}
                    width={45}
                    height={45}
                    alt="avater"
                    className="shadow-sm rounded-3 w45"
                    style={{ border: "1px solid #ddd" }}
                  />
                  <Image
                    src={avatar}
                    width={30}
                    height={30}
                    alt="avater"
                    className="shadow-sm rounded-circle position-absolute border-1"
                    style={{
                      bottom: "-5px",
                      right: "-5px",
                      border: "1px solid #eee",
                    }}
                  />
                </div>
              ) : (
                <Image
                  src={avatar}
                  width={45}
                  height={45}
                  alt="avater"
                  className="shadow-sm rounded-circle w45"
                />
              )}
            </figure>

            <div>
              <Link href={`/profile/${authorNickname}`}>
                <h4 className="fw-700 text-grey-900 font-xss m-0 mt-1">
                  @{nickName}
                </h4>
              </Link>
              <span className="d-block font-xsss fw-500 mt-1 lh-3 text-grey-500">
                {createdAt ? TimeSinceDate(createdAt) : ""}
              </span>
            </div>

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
                {likeNum >= 1000
                  ? Math.round(likeNum / 1000).toFixed(1)
                  : likeNum}
              </span>
              <span className="like-thousand">
                {likeNum >= 1000 ? "k" : ""}
              </span>
            </div>
            <div
              className={`${styles["post-comment"]} d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xsss`}
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
          </div>
          {/* All comments */}
          {comments?.length === 0 && (
            <div className="text-center pointer align-items-center text-dark lh-26 font-xss">
              <span className="d-none-xs font-xss fw-600 text-grey-700">
                {tComment("no_comment")}
              </span>
            </div>
          )}
          {isMobile && (
            <Comments
              comments={comments}
              page={page}
              totalPage={totalPage}
              take={take}
              postId={postId}
              setCommentNum={setCommentNumHandler}
              postAuthor={authorId}
              ref={childRef}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default React.memo(PostModal);
