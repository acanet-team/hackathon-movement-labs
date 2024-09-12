import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Darkbutton from "./Darkbutton";
import useAuthStore from "@/store/auth";
import { useSession } from "next-auth/react";
import HeaderSetting from "./auth/HeaderSetting";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/header.module.scss";
import { useWebSocket } from "@/context/websocketProvider";
import Notifications from "./Notification";
import type { Notification } from "@/api/notification/model";

const fakeData: Notification[] = [
  {
    id: "25ecc472-d30d-47e1-ad86-73aa7abc63bf",
    type: "comment_post",
    read_at: null,
    user: {
      userId: 7,
      firstName: "Huyy",
      lastName: "Trần",
      nickName: "huytran",
    },
    sourceUser: {
      userId: 169,
      firstName: "huy18",
      lastName: "tran",
      nickName: "huytran18",
    },
    community: {
      communityId: "40c54a12-9ade-4af9-ae6d-3985f1d6e552",
      name: "huy test done 2",
    },
    additionalData: {
      post_id: "ea0a42b4-9552-4cef-a418-64dbb309d776",
      comment_id: "e0ca6bf1-2b17-40b8-9f41-3a5e2035824c",
      community_id: "40c54a12-9ade-4af9-ae6d-3985f1d6e552",
    },
    createdAt: 1725522931173,
  },
  {
    id: "86e2a281-d521-41cd-88c5-a031fc4f0039",
    type: "like_post",
    read_at: null,
    user: {
      userId: 7,
      firstName: "Huyy",
      lastName: "Trần",
      nickName: "huytran",
    },
    sourceUser: {
      userId: 169,
      firstName: "huy18",
      lastName: "tran",
      nickName: "huytran18",
    },
    community: null,
    additionalData: {
      post_id: "ea0a42b4-9552-4cef-a418-64dbb309d776",
      community_id: "40c54a12-9ade-4af9-ae6d-3985f1d6e552",
    },
    createdAt: 1725522883219,
  },
];

export default function Header(props: { isOnboarding: boolean }) {
  const [isOpen, toggleOpen] = useState(false);
  const [isActive, toggleActive] = useState(false);
  const [isNoti, toggleisNoti] = useState(false);
  const [curTheme, setCurTheme] = useState("theme-light");
  const [openSettings, setOpenSettings] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const [photo, setPhoto] = useState<string>("");
  const { data: session } = useSession() as any;
  const modalRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const t = useTranslations("NavBar");
  const userId = session?.user?.id;
  const { notifications } = useWebSocket();

  useEffect(() => {
    console.log("yyy", notifications);
  }, [notifications]);

  useEffect(() => {
    if (session) {
      setPhoto(session?.user?.photo?.path || "/assets/images/user.png");
    }
  }, [session]);

  const navClass = `${isOpen ? " nav-active" : ""}`;
  const buttonClass = `${isOpen ? " active" : ""}`;
  const searchClass = `${isActive ? " show" : ""}`;
  const notiClass = `${isNoti ? " show" : ""}`;

  useEffect(() => {
    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme");
      if (theme) setCurTheme(theme);
    };
    window.addEventListener("themeChange", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener,
      );
    };
  }, []);

  const onLogOutHandler = () => {
    logout();
    // Calling next/auth sign out
    signOut({ callbackUrl: "/login" });
  };

  const onOpenSettingHandler = () => {
    setOpenSettings((open) => !open);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !avatarRef?.current?.contains(event.target as Node) &&
      !modalRef?.current?.contains(event.target as Node)
    ) {
      setOpenSettings(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="nav-header shadow-xs border-0 nunito-font">
      <div className="nav-top">
        <Link
          href="/"
          className="d-flex justify-content-left align-items-center"
        >
          <span
            id="site-logo"
            className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0
            "
          >
            <Image
              src={
                curTheme === "theme-dark"
                  ? "/assets/images/logo/logo-horizontal-white.png"
                  : "/assets/images/logo/logo-horizontal-dark.png"
              }
              width={220}
              height={55}
              // style={{ width: "140px", height: "50px" }}
              alt="logo"
              className={`${styles["logo-header"]}`}
            />
          </span>
        </Link>
        <Link
          href="/defaultmessage"
          className="mob-menu ms-auto me-2 chat-active-btn"
        >
          <i className="feather-message-circle text-grey-900 font-md btn-round-sm bg-greylight"></i>
        </Link>
        <span
          className={`me-2 menu-search-icon mob-menu ${notiClass}`}
          // id="dropdownMenu"
          // data-bs-toggle="dropdown"
          // aria-expanded="false"
          onClick={() => toggleisNoti((prevState) => !prevState)}
        >
          <span className="dot-count bg-warning"></span>
          <i className="feather-bell  text-grey-900 font-md btn-round-sm bg-greylight"></i>
        </span>
        <span
          onClick={() => toggleActive((prevState) => !prevState)}
          className="me-2 menu-search-icon mob-menu"
        >
          <i className="feather-search text-grey-900 font-md btn-round-sm bg-greylight"></i>
        </span>
        {props.isOnboarding && photo ? (
          <Image
            src={photo}
            alt="user"
            width={40}
            height={40}
            className="w40 rounded-xl p-0 me-0 nav-menu rounded-circle cursor-pointer"
            onClick={onOpenSettingHandler}
            style={{ height: "40px", objectFit: "cover" }}
          />
        ) : (
          <button
            onClick={() => toggleOpen((prevState) => !prevState)}
            className={`nav-menu me-0 ms-2 ${buttonClass}`}
          ></button>
        )}
      </div>
      <form action="#" className="float-left header-search ms-3">
        <div className="form-group mb-0 icon-input">
          <i className="feather-search font-sm text-grey-400"></i>
          <input
            type="text"
            placeholder="Start typing to search.."
            className="bg-grey border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xssss fw-500 rounded-xl w400"
          />
        </div>
      </form>
      <span
        className={`p-2 pointer text-center ms-auto menu-icon ${notiClass}`}
        // id="dropdownMenu"
        // data-bs-toggle="dropdown"
        // aria-expanded="false"
        onClick={() => toggleisNoti((prevState) => !prevState)}
      >
        <span className="dot-count bg-warning"></span>
        <i className="feather-bell font-xl text-current"></i>
      </span>
      {/* Notification */}
      <div
        className={`dropdown-menu ${styles["height-dropdown-menu"]} p-4 right-0 rounded-3 border-0 shadow-lg ${notiClass}`}
        // aria-labelledby="dropdownMenu"
      >
        <Notifications photo={photo} data={fakeData} />
      </div>

      <Darkbutton />
      {photo && (
        <Image
          src={photo}
          alt="user"
          width={40}
          ref={avatarRef}
          height={40}
          className="w40 rounded-xl p-0 ms-3 menu-icon cursor-pointer"
          onClick={onOpenSettingHandler}
          style={{ objectFit: "cover" }}
        />
      )}
      {openSettings && (
        <div ref={modalRef}>
          <HeaderSetting />
        </div>
      )}
      {/* Left navbar */}
      {!props.isOnboarding && (
        <nav
          className={`navigation scroll-bar ${navClass} header-navbar__margin`}
        >
          <div className="container ps-0 pe-0">
            <div className="nav-content">
              <div className="nav-wrap bg-white bg-transparent-card rounded-3 shadow-xss pt-3 pb-1 mb-2 mt-2">
                <div className="nav-caption fw-600 font-xsss text-grey-500">
                  <span>{t("newsfeed")}</span>
                </div>
                <ul className="mb-1 top-content">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  <li>
                    <Link
                      href={`/profile/${userId}`}
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-user btn-round-md bg-blue-gradiant me-3"></i>

                      <span>{t("my profile")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="nav-content-bttn open-font">
                      <i className="feather-home btn-round-md bg-blue-gradiant me-3"></i>

                      <span>{t("newsfeed")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/brokers"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-user btn-round-md bg-red-gradiant me-3"></i>
                      <span>{t("brokers")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/communities"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-globe btn-round-md bg-mini-gradiant me-3"></i>
                      <span>{t("community")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/defaultstorie"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-shopping-bag btn-round-md bg-gold-gradiant me-3"></i>
                      <span>{t("courses")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/defaultgroup"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-zap btn-round-md bg-mini-gradiant me-3"></i>
                      <span>{t("messages")}</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="nav-wrap bg-white bg-transparent-card rounded-3 shadow-xss pt-3 pb-1">
                <div className="nav-caption fw-600 font-xsss text-grey-500">
                  <span>{t("account")}</span>
                </div>
                <ul className="mb-1">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  <li>
                    <Link
                      href="/defaultsettings"
                      className="nav-content-bttn open-font h-auto"
                    >
                      <i className="font-xl text-current feather-settings me-3"></i>
                      <span>{t("settings")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/defaultmessage"
                      className="nav-content-bttn open-font h-auto"
                    >
                      <i className="font-xl text-current feather-message-square me-3"></i>
                      <span>{t("chat")}</span>
                      <span className="circle-count bg-warning mt-0">23</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="nav-content-bttn open-font h-auto"
                      onClick={onLogOutHandler}
                    >
                      <i className="font-xl text-current bi bi-box-arrow-right me-3"></i>
                      <span>{t("logout")}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
