"use client";
import React, { useState } from "react";
import styles from "@/styles/modules/topBrokers.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { followABroker } from "@/api/onboard";
import Link from "next/link";

/* eslint-disable react/display-name */
export const TopBrokers = (props: {
  photoUrl: string;
  firstName: string;
  lastName: string;
  followersCount: number;
  brokerId: number;
}) => {
  const { photoUrl, firstName, lastName, followersCount, brokerId } = props;
  const [followerNum, setFollowerNum] = useState<number>(
    Number(followersCount),
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const onFollowBrokerHandler = (e: any, brokerId: number) => {
    try {
      setIsFollowing((following) => !following);
      // Calling api
      followABroker({
        userId: brokerId,
        followType: isFollowing ? "UNFOLLOW" : "FOLLOW",
      });
      if (!isFollowing) {
        e.target.classList.add(styles["follow-broker"]);
        setFollowerNum((prevState) => prevState + 1);
      } else {
        e.target.classList.remove(styles["follow-broker"]);
        setFollowerNum((prevState) => prevState - 1);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className={styles["image-slider-container"]}
      id={styles["top-brokers"]}
    >
      <div className="card w140 h200 d-block border-0 shadow-md bg-light rounded-3 overflow-hidden my-3 me-3">
        <div className="card-body d-block w-100 ps-4 pe-4 pb-4 text-center">
          <Link href={`/profile/${brokerId}`}>
            <figure className="avatar overflow-hidden ms-auto me-auto mb-0 position-relative w75 z-index-1">
              <Image
                src={photoUrl ? photoUrl : "/assets/images/user.png"}
                alt="avater"
                width={75}
                height={75}
                className="float-right p-1 bg-white rounded-circle object-fit-cover"
                style={{ objectFit: "cover" }}
              />
            </figure>
            <div className="clearfix"></div>
            <h4 className="fw-700 font-xsss mt-2 mb-1">
              {firstName + " " + lastName}
            </h4>
          </Link>
          <p className="fw-500 font-xssss text-grey-700 mt-0 mb-2">
            {followerNum >= 1000
              ? (followerNum / 1000).toFixed(1)
              : followerNum}{" "}
            {followerNum >= 1000 ? "k" : ""}{" "}
            {followerNum > 1 ? "followers" : "follower"}
          </p>
          <span
            className={`${styles["follow-btn"]} mt-2 mb-0 px-3 py-2 z-index-1 rounded-3 text-white font-xsssss cursor-pointer text-uppersace fw-700 ls-3`}
            onClick={(e) => onFollowBrokerHandler(e, brokerId)}
          >
            {isFollowing ? "Following" : "+ Follow"}
          </span>
        </div>
      </div>
    </div>
  );
};
