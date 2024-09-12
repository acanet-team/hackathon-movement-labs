import { getPosts, getTopBrokers } from "@/api/newsfeed";
import Contacts from "@/components/Contacts";
import CreatePost from "@/components/newsfeed/Createpost";
import FetchBrokers from "@/components/newsfeed/FetchBrokers";
import Posts from "@/components/newsfeed/Posts";
import styles from "@/styles/modules/home.module.scss";
import { TabEnum } from "@/types/enum";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import type { IPost } from "@/api/newsfeed/model";

const TAKE = 10;

const Home = ({
  posts,
  totalPage,
  page,
  topBrokers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [feedPosts, setPosts] = useState<IPost[]>(posts);
  const [curTab, setCurTab] = useState<string>("suggestion");
  const { data: session } = useSession() as any;
  const t = useTranslations("FeedTabs");

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === t("for_you")) {
      setCurTab("for_you");
    } else {
      setCurTab("suggestion");
    }
  };
  return (
    // <RootLayout>
    <div className="" id={styles.home}>
      <div className="">
        <div className="middle-sidebar-left">
          <div className="row feed-body">
            <div className="col-xl-8 col-xxl-9 col-lg-8">
              <FetchBrokers brokers={topBrokers} />
              <CreatePost
                userSession={session}
                groupId=""
                // updatePostArr={null}
                updatePostArr={setPosts}
                tab={curTab}
              />
              {/* Tabs */}
              <div className={styles["home-tabs"]}>
                <div
                  className={`${styles["button-tab"]} ${curTab === TabEnum.ForYou ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                  onClick={(e) => onSelectTabHandler(e)}
                >
                  {t("for_you")}
                </div>
                <div
                  className={`${styles["button-tab"]} ${curTab === TabEnum.Suggestion ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                  onClick={(e) => onSelectTabHandler(e)}
                >
                  {t("suggestion")}
                </div>
              </div>
              <Posts
                // posts={posts}
                posts={feedPosts}
                setPosts={setPosts}
                feedType={curTab}
                take={TAKE}
                allPage={totalPage}
                curPage={page}
              />
            </div>
            <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
              <Contacts />
            </div>
          </div>
        </div>
      </div>
    </div>
    // </RootLayout>
  );
};

export default React.memo(Home);

export async function getServerSideProps(context: NextPageContext) {
  const postRes = await getPosts(1, TAKE, "suggestion");
  const brokerRes = await getTopBrokers(1, 20);
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      posts: postRes?.data?.docs || [],
      totalPage: postRes?.data?.meta?.totalPage,
      page: postRes?.data?.meta.page,
      topBrokers: brokerRes?.data.docs || [],
    },
  };
}
