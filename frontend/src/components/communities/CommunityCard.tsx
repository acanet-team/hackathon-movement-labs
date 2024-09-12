import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { CommunityJoiningStatus } from "@/types/enum";
import Link from "next/link";
import { joinCommunity } from "@/api/community";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/communities.module.scss";
import { useSession } from "next-auth/react";
import { getMe } from "@/api/auth";
import WalletConnectionModal from "../wallets/WalletConnectionModal";

export default function CommunityCard(props: {
  ownerId: number;
  groupId: string;
  name: string;
  coverImg: string;
  avatar: string;
  firstName: string;
  lastName: string;
  nickName: string;
  membersCount: number;
  communityStatus: string;
  communityType: string;
  description: string;
  fee: number;
  isBroker: boolean;
  onEditGroupHandler: (arg: string) => void;
}) {
  const {
    ownerId,
    groupId,
    name,
    coverImg,
    avatar,
    firstName,
    lastName,
    nickName,
    membersCount,
    communityStatus,
    communityType,
    description,
    fee,
    isBroker,
    onEditGroupHandler,
  } = props;
  const t = useTranslations("Community");
  const tBase = useTranslations("Base");
  const [joiningStatus, setJoiningStatus] = useState(communityStatus);
  const [curUser, setCurUser] = useState<number>();
  const [openWalletConnection, setOpenWalletConnection] =
    useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setCurUser(session.user?.id);
    }
  }, [session]);

  const onJoinCommunityHandler = async (e: any, groupId: string) => {
    try {
      // Check wallet availability
      const userRes = await getMe();
      if (!userRes.user?.wallet_address && fee > 0) {
        setOpenWalletConnection(true);
      }
      if (fee === 0) {
        await joinCommunity({ communityId: groupId });
        setJoiningStatus("pending_request");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = useCallback(() => {
    setOpenWalletConnection(false);
  }, []);

  return (
    <div className="card d-block border-0 shadow-md h-100 rounded-3 overflow-hidden">
      <div className="position-relative">
        <div
          className="card-body h100 bg-image-cover bg-image-center"
          style={{
            backgroundImage: `url(${
              coverImg ? coverImg : `/assets/images/e-1.jpg`
            })`,
          }}
        ></div>
        <figure
          className="avatar position-absolute w75 z-index-1 left-15"
          style={{ marginTop: `-40px` }}
        >
          <Image
            src={avatar ? avatar : `/assets/images/user.png`}
            alt="avatar"
            width={75}
            height={75}
            className="float-right p-1 bg-white rounded-circle"
            style={{ objectFit: "cover" }}
          />
        </figure>
      </div>

      <div className="card-body d-block w-100 py-0 text-left position-relative">
        <div className="mt-3 pl-10 d-flex justify-content-between align-items-start">
          <div className="me-3 e-sm-2 d-flex flex-column align-items-between">
            <Link href={`/profile/${nickName}`}>
              <h4 className="fw-700 font-xss mb-1">
                {firstName + " " + lastName}
              </h4>
              <div className="fw-500 font-xsss text-break text-grey-500 mt-0 mb-1 lh-3">
                @{nickName}
              </div>
            </Link>
            <div className="fw-500 font-xsss fst-italic text-dark mt-0 lh-3">
              {membersCount?.toLocaleString("en-US") || 1}{" "}
              {membersCount > 1 ? `${tBase("members")}` : tBase("member")}
            </div>
          </div>
          <div className="d-flex align-items-center d-flex flex-column">
            {curUser !== ownerId && (
              <button
                disabled={
                  joiningStatus === CommunityJoiningStatus.joined ||
                  joiningStatus === CommunityJoiningStatus.pending
                    ? true
                    : false
                }
                className={`${joiningStatus === CommunityJoiningStatus.joined ? "btn-secondary" : joiningStatus === CommunityJoiningStatus.pending ? "btn-dark" : "btn-primary"} group-status btn text-white px-3 rounded-3 py-1 mb-2`}
                onClick={(e) => onJoinCommunityHandler(e, groupId)}
              >
                {joiningStatus === CommunityJoiningStatus.joined
                  ? t("joined")
                  : joiningStatus === CommunityJoiningStatus.pending
                    ? t("pending")
                    : t("join")}
              </button>
            )}
            {/* eslint-disable react/no-unescaped-entities */}
            {fee === 0 ? (
              <div className="text-success fw-bolder">{tBase("free")}</div>
            ) : (
              <div className="d-flex align-items-center">
                <Image
                  width={25}
                  height={25}
                  src={"/assets/images/logo/logo-only-transparent.png"}
                  alt="logo"
                />
                <span className="ms-2 fw-bolder text-dark">
                  {fee?.toLocaleString("en-US")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="card-body h-100 mt-2 pb-4 cursor-pointer">
        <div className="d-flex align-items-center mb-2">
          <Link href={`/communities/detail/${groupId}`}>
            <h3 className="fw-bold fs-3 m-0">{name}</h3>
          </Link>
          {isBroker && communityType === "owned" && (
            <i
              className={`${styles["edit-group__btn"]} bi bi-pencil ms-2 cursor-pointer`}
              onClick={() => onEditGroupHandler(groupId)}
            ></i>
          )}
        </div>
        <p>{description}</p>
      </div>
      {openWalletConnection && (
        <WalletConnectionModal
          handleClose={handleClose}
          show={openWalletConnection}
        />
      )}
    </div>
  );
}
