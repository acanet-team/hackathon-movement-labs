import React, { useEffect, useState } from "react";
import type {
  InferGetServerSidePropsType,
  NextPage,
  NextPageContext,
} from "next";
import styles from "@/styles/modules/communities.module.scss";
import { CommunityEnum } from "@/types";
import { useTranslations } from "next-intl";
import CommunitySection from "@/components/communities/CommunitySection";
import { useSession } from "next-auth/react";
import { getCommunities } from "@/api/community";
import { removePropertiesEmpty } from "@/utils/Helpers";

const TAKE = 10;

const Communities: NextPage = ({
  communityPosts,
  totalPage,
  page,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [curTab, setCurTab] = useState<string>("popular");
  const [isBroker, setIsBroker] = useState<boolean>(false);
  const t = useTranslations("Community");
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setIsBroker(session.user.isBroker);
    }
  }, [session, isBroker]);

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === t("popular_community")) {
      setCurTab("popular");
    } else if (chosenTab === t("following_community")) {
      setCurTab("following");
    } else {
      setCurTab("owned");
    }
  };

  return (
    <div id={styles.community} className="nunito-font">
      <h1 className="fs-2 fw-bolder mb-3 mt-1">{t("community")}</h1>
      <div className="card shadow-xss w-100 border-0">
        <div className={`${styles["community-tabs"]} card-body`}>
          <div
            className={`${styles["button-tab"]} ${curTab === CommunityEnum.popular ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            {t("popular_community")}
          </div>
          <div
            className={`${styles["button-tab"]} ${curTab === CommunityEnum.following ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
            onClick={(e) => onSelectTabHandler(e)}
          >
            {t("following_community")}
          </div>
          {isBroker ? (
            <div
              className={`${styles["button-tab"]} ${curTab === CommunityEnum.owned ? styles["tab-active"] : ""} ${styles.owned} d-flex justify-content-center cursor-pointer`}
              onClick={(e) => onSelectTabHandler(e)}
            >
              {t("owned_community")}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <CommunitySection
        isBroker={isBroker}
        communities={communityPosts}
        communityType={curTab}
        take={TAKE}
        allPage={totalPage}
        curPage={page}
      />
    </div>
  );
};

export default Communities;

export async function getServerSideProps(context: NextPageContext) {
  const res = await getCommunities({
    page: 1,
    take: TAKE,
    type: "not_joined",
    brokerId: "",
    search: "",
    feeType: "",
  });
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      communityPosts: res.data?.docs || [],
      totalPage: res.data?.meta.totalPage || 1,
      page: res.data?.meta.page || 1,
    },
  };
}
