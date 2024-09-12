import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Leftnav() {
  const [isOpen, toggleOpen] = useState(false);
  const navClass = `${isOpen ? " nav-active" : ""}`;
  const t = useTranslations("NavBar");

  return (
    <nav className={`navigation scroll-bar ${navClass}`}>
      <div className="container ps-0 pe-0">
        <div className="nav-content">
          <div className="nav-wrap bg-white bg-transparent-card rounded-3 shadow-xss pt-3 pb-1 mb-2 mt-2">
            <div className="nav-caption fw-600 font-xssss text-grey-500">
              <span>{t("newsfeed")}</span>
            </div>
            <ul className="mb-1 top-content">
              <li className="logo d-none d-xl-block d-lg-block"></li>
              <li>
                <Link href="/home" className="nav-content-bttn open-font">
                  <i className="feather-home btn-round-md bg-blue-gradiant me-3"></i>

                  <span>{t("newsfeed")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/broker-list"
                  className="nav-content-bttn open-font"
                >
                  <i className="feather-user btn-round-md bg-red-gradiant me-3"></i>
                  <span>{t("brokers")}</span>
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
              <li>
                <Link
                  href="/defaultgroup"
                  className="nav-content-bttn open-font"
                >
                  <i className="feather-zap btn-round-md bg-mini-gradiant me-3"></i>
                  <span>{t("community")}</span>
                </Link>
              </li>
              <li>
                <Link href="/userpage" className="nav-content-bttn open-font">
                  <i className="feather-settings btn-round-md bg-primary-gradiant me-3"></i>
                  <span>{t("settings")}</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-wrap bg-white bg-transparent-card rounded-3 shadow-xss pt-3 pb-1">
            <div className="nav-caption fw-600 font-xssss text-grey-500">
              <span>{t("account")}</span>
            </div>
            <ul className="mb-1">
              <li className="logo d-none d-xl-block d-lg-block"></li>
              <li>
                <Link
                  href="/defaultsettings"
                  className="nav-content-bttn open-font h-auto pt-2 pb-2"
                >
                  <i className="font-sm feather-settings me-3 text-grey-500"></i>
                  <span>{t("settings")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/defaultanalytics"
                  className="nav-content-bttn open-font h-auto pt-2 pb-2"
                >
                  <i className="font-sm feather-pie-chart me-3 text-grey-500"></i>
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/defaultmessage"
                  className="nav-content-bttn open-font h-auto pt-2 pb-2"
                >
                  <i className="font-sm feather-message-square me-3 text-grey-500"></i>
                  <span>{t("chat")}</span>
                  <span className="circle-count bg-warning mt-0">23</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
  // return (
  //   <div className="navigation scroll-bar">
  //     <div className="container ps-0 pe-0">
  //       <div className="nav-content">
  //         <div className="nav-wrap bg-white bg-transparent-card rounded-3 shadow-xss pt-3 pb-1 mb-2 mt-2">
  //           <div className="nav-caption fw-600 font-xssss text-grey-500">
  //             <span>Newsfeed</span>
  //             <ul className="mb-1 top-content">
  //               <li className="logo d-none d-xl-block d-lg-block"></li>
  //               <li>
  //                 <Link href="/home" className="nav-content-bttn open-font">
  //                   <i className="feather-home btn-round-md bg-blue-gradiant me-3"></i>

  //                   <span>Newsfeed</span>
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link
  //                   href="/broker-list"
  //                   className="nav-content-bttn open-font"
  //                 >
  //                   <i className="feather-user btn-round-md bg-red-gradiant me-3"></i>
  //                   <span>Brokersss</span>
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link
  //                   href="/defaultstorie"
  //                   className="nav-content-bttn open-font"
  //                 >
  //                   <i className="feather-shopping-bag btn-round-md bg-gold-gradiant me-3"></i>
  //                   <span>Courses</span>
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link
  //                   href="/defaultgroup"
  //                   className="nav-content-bttn open-font"
  //                 >
  //                   <i className="feather-zap btn-round-md bg-mini-gradiant me-3"></i>
  //                   <span>Messages</span>
  //                 </Link>
  //               </li>
  //               <li>
  //                 <Link href="/userpage" className="nav-content-bttn open-font">
  //                   <i className="feather-settings btn-round-md bg-primary-gradiant me-3"></i>
  //                   <span>Settings</span>
  //                 </Link>
  //               </li>
  //             </ul>
  //           </div>
  //         </div>

  //         <div className="nav-wrap bg-white bg-transparent-card rounded-3 shadow-xss pt-3 pb-1 mb-2">
  //           <div className="nav-caption fw-600 font-xssss text-grey-500">
  //             <span>More </span>Pages
  //           </div>
  //           <ul className="mb-3">
  //             <li>
  //               <Link
  //                 href="/defaultemailbox"
  //                 className="nav-content-bttn open-font"
  //               >
  //                 <i className="font-xl text-current feather-inbox me-3"></i>
  //                 <span>Email Box</span>
  //                 <span className="circle-count bg-warning mt-1">584</span>
  //               </Link>
  //             </li>
  //             <li>
  //               <Link
  //                 href="/defaulthotel"
  //                 className="nav-content-bttn open-font"
  //               >
  //                 <i className="font-xl text-current feather-home me-3"></i>
  //                 <span>Near Hotel</span>
  //               </Link>
  //             </li>
  //             <li>
  //               <Link
  //                 href="/defaultevent"
  //                 className="nav-content-bttn open-font"
  //               >
  //                 <i className="font-xl text-current feather-map-pin me-3"></i>
  //                 <span>Latest Event</span>
  //               </Link>
  //             </li>
  //             <li>
  //               <Link
  //                 href="/defaultlive"
  //                 className="nav-content-bttn open-font"
  //               >
  //                 <i className="font-xl text-current feather-youtube me-3"></i>
  //                 <span>Live Stream</span>
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>

  //         <div className="nav-wrap bg-white bg-transparent-card rounded-3 shadow-xss pt-3 pb-1">
  //           <div className="nav-caption fw-600 font-xssss text-grey-500">
  //             <span></span> Account
  //           </div>
  //           <ul className="mb-1">
  //             <li className="logo d-none d-xl-block d-lg-block"></li>
  //             <li>
  //               <Link
  //                 href="/defaultsettings"
  //                 className="nav-content-bttn open-font h-auto pt-2 pb-2"
  //               >
  //                 <i className="font-sm feather-settings me-3 text-grey-500"></i>
  //                 <span>Settings</span>
  //               </Link>
  //             </li>
  //             <li>
  //               <Link
  //                 href="/defaultanalytics"
  //                 className="nav-content-bttn open-font h-auto pt-2 pb-2"
  //               >
  //                 <i className="font-sm feather-pie-chart me-3 text-grey-500"></i>
  //                 <span>Analytics</span>
  //               </Link>
  //             </li>
  //             <li>
  //               <Link
  //                 href="/defaultmessage"
  //                 className="nav-content-bttn open-font h-auto pt-2 pb-2"
  //               >
  //                 <i className="font-sm feather-message-square me-3 text-grey-500"></i>
  //                 <span>Chat</span>
  //                 <span className="circle-count bg-warning mt-0">23</span>
  //               </Link>
  //             </li>
  //           </ul>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
