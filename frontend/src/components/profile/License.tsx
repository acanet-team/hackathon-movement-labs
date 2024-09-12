import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/profile.module.scss";
import type {
  BrokerProfile,
  FormDtLicense,
  License,
} from "@/api/profile/model";
import { ModalLicense } from "./ModalLicense";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { deleteLicense } from "@/api/profile";
import WaveLoader from "../WaveLoader";

const License = ({
  dataBrokerProfile,
  role,
}: {
  dataBrokerProfile: BrokerProfile;
  role: boolean;
}) => {
  const t = useTranslations("MyProfile");
  const [showAllLicense, setshowAllLicense] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [iconEdit, setShowIconEdit] = useState(false);
  const [iconBack, setShowIconBack] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formDt, setFormDt] = useState<FormDtLicense>({
    id: "",
    logo: "",
    licenseType: "",
    licenseIssuer: "",
    licenseState: "",
    licenseIssueDate: "",
    licenseStatus: "",
    licenseExpirationDate: "",
    credentialID: "",
  });
  const [licenses, setLicenses] = useState<License[]>([]);
  useEffect(() => {
    setLicenses(dataBrokerProfile?.licenses ?? []);
  }, [dataBrokerProfile]);

  const licenseToShow = showAllLicense ? licenses : licenses.slice(0, 2);

  const handleAddModal = useCallback(() => {
    setIsEditing(false);
    setShow(true);
  }, []);

  const handleCancel = useCallback(() => {
    setShow(false);
  }, []);

  const handleEditModal = useCallback((cer: FormDtLicense) => {
    setIsEditing(true);
    setShow(true);
    setFormDt(cer);
  }, []);

  const handleOpenEdit = useCallback(() => {
    setShowIconEdit(true);
    setShowIconBack(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setShowIconEdit(false);
    setShowIconBack(false);
  }, []);

  const delCertifications = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      if (id) {
        await deleteLicense(id);
        setLicenses((prev) => prev.filter((cer) => cer.id !== id));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <div
        className="card p-4 border-0 shadow-xss"
        style={{
          background: "#FFFFFF",
          borderRadius: "5px",
          marginTop: "40px",
          marginBottom: "100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h2 className="m-0 fw-600 mb-4">{t("license&certifications")}</h2>
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
                <h1>
                  <i
                    className={`bi bi-plus-lg ${styles["icon-profile"]} cursor-pointer`}
                    onClick={() => handleAddModal()}
                  ></i>
                </h1>
                {licenses.length != 0 && (
                  <>
                    {iconBack ? (
                      <h4>
                        <i
                          className={`bi bi-arrow-left ${styles["icon-profile"]} cursor-pointer`}
                          onClick={() => handleCloseEdit()}
                        ></i>
                      </h4>
                    ) : (
                      <h4>
                        <i
                          className={`bi bi-pencil-fill ${styles["icon-profile"]} cursor-pointer`}
                          onClick={() => handleOpenEdit()}
                        ></i>
                      </h4>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {licenseToShow?.length > 0 &&
          licenseToShow.map((license, index) => (
            <>
              <div
                key={license.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                }}
              >
                <Image
                  src={
                    license.logo ||
                    "/assets/images/profile/alabaster_global_logo.png"
                  }
                  width={48}
                  height={48}
                  alt={license.licenseType}
                  style={{
                    objectFit: "cover",
                  }}
                />
                <div className="w-100">
                  <div>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <p className="m-0 fw-600 font-xs">
                        {license.licenseType}
                      </p>
                      {iconEdit && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "4px",
                          }}
                        >
                          <i
                            className={`bi bi-pencil-fill ${styles["icon-profile"]} cursor-pointer`}
                            onClick={() => handleEditModal(license)}
                          ></i>
                          <i
                            className={`bi bi-trash3-fill ${styles["icon-profile"]} cursor-pointer`}
                            onClick={() => delCertifications(license.id)}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="m-0 font-xss lh-20">{license.licenseIssuer}</p>
                  <p className="m-0 font-xss lh-20 text-gray-follow">
                    {t("Issued")}{" "}
                    {dayjs(license.licenseIssueDate).format("MMM-YYYY")} -{" "}
                    {license.licenseExpirationDate
                      ? dayjs(license.licenseExpirationDate).format("MMM-YYYY")
                      : "No expiration date"}
                  </p>
                  <p className="m-0 mt-2 font-xss lh-20 text-gray-follow">
                    {t("Credential")} {license.credentialID}
                  </p>
                </div>
              </div>
              {index < licenseToShow.length - 1 && (
                <hr
                  style={{
                    border: "none",
                    borderTop: "2px solid #d1d1d1",
                    marginTop: "20px",
                  }}
                />
              )}
            </>
          ))}
        {!showAllLicense && licenses?.length - licenseToShow?.length > 0 && (
          <>
            <hr
              style={{
                border: "none",
                borderTop: "2px solid #d1d1d1",
                marginTop: "20px",
              }}
            />
            <button
              onClick={() => setshowAllLicense(!showAllLicense)}
              style={{
                border: "none",
                cursor: "pointer",
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "row",
                gap: "4px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p className="m-0 font-xss fw-600">
                {t("Show all")} {licenses.length - licenseToShow.length}{" "}
                {t("license&certifications")}
              </p>

              <i
                className={`bi bi-arrow-right ${styles["icon-profile"]} cursor-pointer`}
              ></i>
            </button>
          </>
        )}
      </div>
      {show && (
        <ModalLicense
          handleClose={handleCancel}
          isEditing={isEditing}
          title={isEditing ? "Edit License" : "Create License"}
          show={show}
          formDt={formDt}
          setLicenses={setLicenses}
        />
      )}
      {isLoading && <WaveLoader />}
    </>
  );
};

export default License;
