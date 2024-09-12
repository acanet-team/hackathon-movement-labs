import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/commentView.module.scss";
import { TimeSinceDate } from "@/utils/time-since-date";
import { useTranslations } from "next-intl";

export default function CommentView(props: {
  commentId: string;
  photo: any;
  nickName: string;
  content: string;
  status: string;
  postAuthor: number;
  createdAt: string;
  createdBy: number;
  userSession: any;
  onClickDelete: (id: string) => void;
}) {
  const {
    commentId,
    photo,
    nickName,
    content,
    status,
    createdAt,
    createdBy,
    postAuthor,
    onClickDelete,
    userSession,
  } = props;
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const timePassed = TimeSinceDate(createdAt);
  const [userId, setUserId] = useState<number>();
  const settingsRef = useRef<HTMLButtonElement>(null);
  const tComment = useTranslations("Comment");

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

  useEffect(() => {
    setUserId(userSession?.user?.id);
  }, [userSession]);

  const onClickSettings = () => {
    setOpenSettings((open) => !open);
  };

  return (
    <div className={`d-flex gap-2 align-items-center`}>
      <Image
        src={photo ? photo : "/assets/images/user.png"}
        width={35}
        height={35}
        className="rounded-circle"
        alt={""}
      />
      <div className="d-flex flex-column">
        <div
          className={`${status === "failed" ? styles["comment-failed"] : ""} ${styles["content-container"]} rounded-3 d-flex flex-column`}
        >
          <div className="fw-bolder">{nickName}</div>
          <div style={{ wordBreak: "break-word" }}>{content}</div>
          {/* Error mark */}
          {status === "failed" && (
            <div className={styles["comment-error__mark"]}>
              <i className="bi bi-exclamation-lg text-danger"></i>
            </div>
          )}
        </div>
        {/* Post time/error massage */}
        {status === "failed" ? (
          <div className={`${styles["comment-msg"]} text-danger`}>
            {tComment("error_post_comment")}
          </div>
        ) : (
          <div className={styles["comment-msg"]}>{timePassed}</div>
        )}
      </div>

      {/* Delete button */}
      {userId && (userId === createdBy || userId === postAuthor) && (
        <button
          className={`${styles["comment-settings"]} bg-transparent border-0`}
          onClick={onClickSettings}
          ref={settingsRef}
        >
          <i className="bi bi-three-dots-vertical"></i>
          {openSettings && (
            <div
              className={`${styles["delete-comment__btn"]} border-0 py-2 px-3 py-1 rounded-3`}
              onClick={() => onClickDelete(commentId)}
            >
              Delete
            </div>
          )}
        </button>
      )}
    </div>
  );
}
