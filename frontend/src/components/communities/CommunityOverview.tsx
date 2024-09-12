import type { ICommunity } from "@/api/community/model";
import { useTranslations } from "next-intl";
import React from "react";

export default function CommunityOverview(props: { groupData: ICommunity }) {
  const { groupData } = props;
  const t = useTranslations("Community");
  return (
    <div className="card w-100 shadow-xss nunito-font rounded-3 border-0 mb-3">
      <div className="card-body d-block p-4">
        <h4 className="fw-700 mb-3 font-xss text-grey-900">{t("about")}</h4>
        <p className="fw-500 text-grey-500 lh-24 font-xss mb-0">
          {groupData.description}
        </p>
      </div>
      <div className="card-body border-top-xs d-flex align-items-center">
        <i className="feather-lock text-grey-500 me-3 font-lg"></i>
        <h4 className="fw-700 text-grey-900 font-xsss m-0">{t("private")}</h4>
      </div>

      <div className="card-body d-flex pt-0">
        <i className="feather-users text-grey-500 me-3 font-lg"></i>
        <h4 className="fw-700 text-grey-900 font-xsss mt-0">
          {t("owner")}
          <span className="d-block font-xsss fw-500 mt-1 lh-3 text-grey-500">
            @{groupData.owner.nickName}
          </span>
        </h4>
      </div>
      <div className="card-body d-flex pt-0">
        <i className="feather-map-pin text-grey-500 me-3 font-lg"></i>
        <h4 className="fw-700 text-grey-900 font-xsss mt-1">Flodia, Austia </h4>
      </div>
    </div>
  );
}
