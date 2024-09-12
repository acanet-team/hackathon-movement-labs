import React from "react";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/userInvite.module.scss";

export default function UserInvite() {
  const t = useTranslations("Community");

  return (
    <div className={styles["user-invite__container"]}>
      <h4 className="fw-700 fs-3 text-current mb-2">{t("invite_user")}</h4>
      <div className="border-top mt-3"></div>
      <div
        className={`${styles["invite-user__option"]} my-3 d-flex align-items-center cursor-pointer`}
      >
        <i className="bi bi-link-45deg text-grey-600 h3 m-0 me-2"></i>
        <div className="text-grey-600">Send an invitation</div>
      </div>
      <div
        className={`${styles["invite-user__option"]} d-flex align-items-center cursor-pointer`}
      >
        <i className="bi bi-person text-grey-600 h3 m-0 me-2"></i>
        <div className="text-grey-600">Find members</div>
      </div>
    </div>
  );
}
