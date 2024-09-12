import React from "react";
import useAuthStore from "@/store/auth";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function HeaderSetting() {
  const logout = useAuthStore((state) => state.logout);
  const t = useTranslations("NavBar");

  const onLogOutHandler = () => {
    logout();
    // Calling next/auth sign out
    signOut({ callbackUrl: "/login" });
  };
  return (
    <div className="dropdown-menu-settings switchcolor-wrap active">
      <h4 className="fw-700 font-sm text-current mb-4">{t("settings")}</h4>
      <div className="card bg-transparent-card border-0 d-block mt-3">
        <h4 className="d-inline font-xsss text-grey-500 fw-700">Setting 1</h4>
        <div className="d-inline float-right mt-1">
          <label className="toggle toggle-menu-color">
            <input type="checkbox" />
            <span className="toggle-icon"></span>
          </label>
        </div>
      </div>
      <div className="card bg-transparent-card border-0 d-block mt-3">
        <h4 className="d-inline font-xsss text-grey-500 fw-700">Setting 2</h4>
        <div className="d-inline float-right mt-1">
          <label className="toggle toggle-menu-color">
            <input type="checkbox" />
            <span className="toggle-icon"></span>
          </label>
        </div>
      </div>
      <div className="card bg-transparent-card border-0 d-block mt-3">
        <h4 className="d-inline font-xsss text-grey-500 fw-700">Setting 3</h4>
        <div className="d-inline float-right mt-1">
          <label className="toggle toggle-menu-color">
            <input type="checkbox" />
            <span className="toggle-icon"></span>
          </label>
        </div>
      </div>
      {/* Log out */}
      <div className="border-top mt-3"></div>
      <div
        className="mt-2 mx-auto d-flex align-items-center cursor-pointer"
        style={{ width: "fit-content" }}
        onClick={onLogOutHandler}
      >
        <button className="btn font-xsss fw-700 text-current p-0 bg-transparent border-0">
          {t("logout")}
        </button>
        <i className="bi bi-box-arrow-right ps-2 text-current fw-700"></i>
      </div>
    </div>
  );
}
