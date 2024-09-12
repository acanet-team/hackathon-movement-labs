import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Notification } from "@/api/notification/model";
interface NotificationProps {
  photo: string;
  data: Notification[];
}

const renderNotificationMessage = (
  type: Notification["type"],
  user: Notification["user"],
  community: Notification["community"] | null,
  additionalData: Notification["additionalData"],
  createdAt: number,
) => {
  switch (type) {
    case "like_post":
      return (
        <>
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            {user.firstName} {user.lastName}{" "}
            <span className="text-grey-600 fw-500 font-xssss lh-4 m-0">
              {`${
                additionalData.post_id
                  ? `liked your post`
                  : `and others liked your post`
              }`}
            </span>
          </h5>
        </>
      );
    case "comment_post":
      return (
        <>
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            {user.firstName} {user.lastName}{" "}
            <span className="text-grey-600 fw-500 font-xssss lh-4 m-0">
              {`${
                additionalData.comment_id
                  ? `commented on your post`
                  : `and others commented on your post`
              }`}
            </span>
          </h5>
        </>
      );
    case "community_join_request":
      return (
        <>
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            {user.firstName} {user.lastName}{" "}
            <span className="text-grey-600 fw-500 font-xssss lh-4 m-0">
              {`has requested to join your ${community?.name} Group`}
            </span>
          </h5>
        </>
      );
    case "community_join_accept":
      return (
        <>
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            {`You are now a member of ${community?.name}`}
          </h5>
        </>
      );
    case "community_join_reject":
      return (
        <>
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            {`Your request to join ${community?.name} has been unsuccessful`}
          </h5>
        </>
      );
    case "community_kicked":
      return (
        <>
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            {`You have been removed from ${community?.name}`}
          </h5>
        </>
      );
    case "follow":
      return (
        <>
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            {user.firstName} {user.lastName}{" "}
            <span className="text-grey-600 fw-500 font-xssss lh-4 m-0">
              {`has followed you`}
            </span>
          </h5>
        </>
      );
    default:
      return null;
  }
};

const Notifications: React.FC<NotificationProps> = ({ photo, data }) => {
  return (
    <>
      <h4 className="fw-700 font-xs mb-4 pe-auto">Notification</h4>
      {data.map((notification) => (
        <div
          key={notification.id}
          className="card w-100 border-0 ps-5 mb-3 cursor-pointer"
        >
          <Link href={""}>
            {photo && (
              <Image
                src={photo}
                width={40}
                height={40}
                alt="user"
                className="w40 position-absolute left-0 rounded-xl"
              />
            )}
            {renderNotificationMessage(
              notification.type,
              notification.user,
              notification.community,
              notification.additionalData,
              notification.createdAt,
            )}
            <p className="text-grey-500 font-xsssss fw-600 m-0">
              {notification.createdAt}
            </p>
          </Link>
        </div>
      ))}
      <div className="card w-100 border-0 ps-5 mb-3 cursor-pointed">
        <Link href={""}>
          {photo && (
            <Image
              src={photo}
              width={40}
              height={40}
              alt="user"
              className="w40 position-absolute left-0 rounded-xl"
            />
          )}
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            Goria Coast{" "}
            <span className="text-grey-600 fw-500 font-xssss lh-4 m-0">
              Mobile Apps UI Designer is require.. Mobile Apps UI Designer is
              require.
            </span>
          </h5>
          <p className="text-grey-500 font-xsssss fw-600 m-0"> 2 min</p>
        </Link>
      </div>
    </>
  );
};

export default Notifications;
