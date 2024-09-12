import type {
  BrokerProfile,
  InterestTopics,
  SSI,
  User,
} from "@/api/profile/model";
import React, { useEffect, useState } from "react";
import AISummary from "./AISummary";
import SocialMedia from "./SocialMedia";
import { About } from "./About";
import { Experience } from "./Experience";
import Education from "./Education";
import License from "./License";
import Image from "next/image";
import { useSession } from "next-auth/react";
import DotWaveLoader from "../DotWaveLoader";

const TabAbout = (props: {
  ssi: SSI[] | null;
  dataBrokerProfile: BrokerProfile;
  dataUser: User;
  interestTopic: InterestTopics[];
  idParam: string | undefined | string[];
}) => {
  const { ssi, dataBrokerProfile, dataUser, interestTopic, idParam } = props;
  const { data: session } = useSession() as any;
  const [id, setId] = useState<number>();
  const [role, setRole] = useState(false);
  const [isLoading, setLoading] = useState<Boolean>(false);

  useEffect(() => {
    if (session) {
      setId(session?.user?.id);
    }
  }, [session]);

  useEffect(() => {
    if (Number(idParam) === id) {
      setRole(true);
    }
  }, [idParam, id]);

  return (
    <>
      <div className="row">
        <div className="col-md-3 col-12">
          {ssi && (
            <>
              <div
                className="card p-4 border-0 shadow-xss"
                style={{
                  background: "#FFFFFF",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  borderRadius: "5px",
                  marginTop: "40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {ssi?.length > 0 &&
                  ssi.map((ssi) => (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "12px",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          src={
                            ssi.company.logo ||
                            "/assets/images/profile/image 2 (1).png"
                          }
                          width={48}
                          height={48}
                          alt=""
                          className=""
                          style={{
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <p className="m-0 fw-700 font-xss">
                            {ssi.company.name || "Certified SSI Broker"}
                          </p>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            </>
          )}
          <AISummary
            role={role}
            dataBrokerProfile={dataBrokerProfile}
            dataUser={dataUser}
            listInterestTopic={interestTopic}
          />
          <SocialMedia role={role} dataBrokerProfile={dataBrokerProfile} />
        </div>
        <div className="col-md-9 col-12">
          <About role={role} dataBrokerProfile={dataBrokerProfile} />
          <Experience
            role={role}
            dataBrokerProfile={dataBrokerProfile}
            id={props.idParam as string}
          />
          <Education role={role} dataBrokerProfile={dataBrokerProfile} />
          <License role={role} dataBrokerProfile={dataBrokerProfile} />
        </div>
      </div>
      {isLoading && <DotWaveLoader />}
    </>
  );
};

export default TabAbout;
