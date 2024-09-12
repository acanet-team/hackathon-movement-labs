import CommunityHeader from "@/components/communities/CommunityHeader";
import React, { Fragment, useState } from "react";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import {
  getACommunity,
  getCommunityMembers,
  getCommunityPosts,
} from "@/api/community";
import { useSession } from "next-auth/react";
import CommunityFeed from "@/components/communities/CommunityFeed";
import MemberTable from "@/components/communities/MemberTable";

const TAKE = 10;
export default function CommunityView({
  communityMetaData,
  communityFeed,
  page,
  totalPage,
  groupId,
  pendingRequestNum,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [curTab, setCurTab] = useState<string>("posts");
  const { data: session } = useSession() as any;
  const [pendingRequests, setPendingRequests] =
    useState<number>(pendingRequestNum);

  return (
    <Fragment>
      <div className="pe-0 mb-5">
        <div className="mb-3">
          <CommunityHeader
            community={communityMetaData}
            setCurTab={setCurTab}
            curTab={curTab}
            pendingRequests={pendingRequests}
            groupId={groupId}
          />
        </div>

        {curTab === "posts" && (
          <CommunityFeed
            userSession={session}
            posts={communityFeed}
            take={TAKE}
            allPage={totalPage}
            curPage={page}
            groupId={groupId}
            groupData={communityMetaData}
          />
        )}

        {curTab !== "posts" && (
          <MemberTable
            tab={curTab}
            ownerId={communityMetaData.owner.userId}
            groupId={groupId}
            pendingRequests={pendingRequests}
            setPendingRequests={setPendingRequests}
          />
        )}
      </div>
    </Fragment>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const groupId = context.query?.id as string;
  if (!groupId) {
    return {
      notFound: true, // This triggers the 404 page
    };
  }
  const response = await getACommunity(groupId);
  const communityFeed = await getCommunityPosts(1, TAKE, "community", groupId);
  const communityMembers = await getCommunityMembers({
    page: 1,
    take: TAKE,
    communityStatus: "pending_request",
    search: "",
    communityId: groupId,
  });
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      groupId: groupId,
      communityMetaData: response.data,
      communityFeed: communityFeed.data?.docs,
      totalPage: communityFeed.data?.meta?.totalPage,
      page: communityFeed.data?.meta.page,
      pendingRequestNum: communityMembers.data?.totalPendingRequest,
    },
  };
}
