import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import {
  Skill,
  type BrokerProfile,
  type InterestTopics,
  type User,
} from "@/api/profile/model";
import { useTranslations } from "next-intl";
import ModalEditOtherInfo from "./ModalEditOtherInfo";
import { postUpdateSummary } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";

const AiSummary = ({
  dataBrokerProfile,
  role,
  dataUser,
  listInterestTopic,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
  dataUser: User;
  listInterestTopic: InterestTopics[];
}) => {
  const t = useTranslations("MyProfile");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [showAllInterestTopics, setShowAllInterestTopics] =
    useState<boolean>(false);
  const [showAllServiceOffer, setShowAllServiceOffer] =
    useState<boolean>(false);
  const [interestTopics, setInterestTopics] = useState<InterestTopics[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState<string | null>();
  useEffect(() => {
    setInterestTopics(dataBrokerProfile?.interestTopics ?? []);
    setSkills(dataBrokerProfile?.skills ?? []);
    setLocation(dataBrokerProfile?.location || "");
    setSummary(dataBrokerProfile?.summary || null);
  }, [dataBrokerProfile]);

  const [expandPost, setExpandPost] = useState<boolean>(false);

  const interestToShow = showAllInterestTopics
    ? interestTopics
    : interestTopics.slice(0, 3);
  const serviceToShow = showAllServiceOffer ? skills : skills.slice(0, 2);

  const handleEdit = useCallback(() => {
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, []);

  const updateSummary = async () => {
    setIsLoading(true);
    try {
      await postUpdateSummary({});
    } catch (error) {
      throwToast("Error updating", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="card p-4 border-0 shadow-xss"
      style={{
        background: "#FFFFFF",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderRadius: "5px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2px",
          }}
        >
          <p className="m-0 fw-700 font-xss">{t("AI summary")}</p>
          <Image
            src="/assets/images/profile/icons8-lightning-96 1.png"
            width={25}
            height={25}
            alt=""
            className=""
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <h4>
          <i
            className="bi bi-box-arrow-down cursor-pointer"
            onClick={updateSummary}
          ></i>
        </h4>
      </div>
      {summary ? (
        <>
          {expandPost
            ? summary
            : summary.length > 20
              ? summary.substring(0, 20) + "..."
              : summary}
          {summary.length > 20 && !expandPost ? (
            <span
              className={"cursor-pointer text-blue"}
              onClick={() => setExpandPost((open) => !open)}
            >
              {t("See more")}
            </span>
          ) : (
            ""
          )}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "144px",
          }}
        >
          <p className="m-0 fw-400 font-xss">
            {t("New report is coming soon")}
          </p>
        </div>
      )}
      <hr
        style={{
          border: "none",
          borderTop: "2px solid #d1d1d1",
          marginTop: "20px",
        }}
      />
      <div className="mb-2">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p className="m-0 fw-700 font-xsss">{t("contact")}</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "4px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {role === true && (
              <>
                <h4>
                  <i
                    className={`bi bi-pencil-fill ${styles["icon-profile"]} cursor-pointer`}
                    onClick={() => {
                      handleEdit();
                    }}
                  ></i>
                </h4>
              </>
            )}
          </div>
        </div>
        <p className="m-0 fw-500 font-xsss text-gray-follow">
          {dataUser?.email}
        </p>
      </div>

      <div className="mb-2">
        <p className="m-0 fw-700 font-xsss">{t("servicesOffer")}</p>
        {serviceToShow.map((service, index) => (
          <div key={service.id}>
            <p className="m-0 fw-500 font-xsss text-gray-follow">
              {service.interestTopic.topicName}
            </p>
          </div>
        ))}
        {!showAllServiceOffer && skills.length - serviceToShow.length > 0 && (
          <span onClick={() => setShowAllServiceOffer(true)}>....</span>
        )}
      </div>

      <div className="mb-2">
        <p className="m-0 fw-700 font-xsss">{t("location")}</p>
        <p className="m-0 fw-500 font-xsss text-gray-follow">{location}</p>
      </div>
      <div className="">
        <p className="m-0 fw-700 font-xsss">{t("interestTopic")}</p>
        {interestToShow.map((topic, index) => (
          <div key={topic.id}>
            <p className="m-0 fw-500 font-xsss text-gray-follow">
              {topic.topicName}
            </p>
          </div>
        ))}
        {!showAllInterestTopics &&
          interestTopics.length - interestToShow.length > 0 && (
            <span onClick={() => setShowAllInterestTopics(true)}>....</span>
          )}
      </div>
      {show && (
        <ModalEditOtherInfo
          handleClose={handleCancel}
          title="Update Other Information"
          dataUser={dataUser}
          dataBrokerProfile={dataBrokerProfile}
          listInterestTopics={listInterestTopic}
          show={show}
          setLocation={setLocation}
          setSkills={setSkills}
          setInterestTopics={setInterestTopics}
        />
      )}
    </div>
  );
};

export default AiSummary;
