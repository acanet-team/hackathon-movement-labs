"use client";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { getRegionRequest } from "@/api/onboard";
import styles from "@/styles/modules/createProfile.module.scss";
import CreateProfileForm from "./CreatProfileForm";
import Pagetitle from "../Pagetitle";
import { useTranslations } from "next-intl";

export default function CreateProfile(props: { onNextHandler: () => void }) {
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    const getRegions = async () => {
      try {
        const response = await getRegionRequest();
        const regions = response.data.value.map((obj) => obj.name);
        setRegions(regions);
        return response;
      } catch (err) {
        console.log(err);
        return {
          status: 500,
          message: "can't fetch regions",
          data: { key: "regions", value: [], type: "json" },
        };
      }
    };
    getRegions();
  }, []);

  const t = useTranslations("CreateProfile");

  return (
    <>
      <div
        className="create-profile right-chat-active"
        id={styles["create-profile__container"]}
      >
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="onboard-wrap">
              <div className="card w-100 border-0 bg-white shadow-md rounded-3s p-0 mb-4">
                <Pagetitle
                  title={t("create_profile_title")}
                  intro={t("create_profile_desc")}
                  isSearch={false}
                />

                <CreateProfileForm
                  regions={regions}
                  onNext={props.onNextHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
