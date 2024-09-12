import React, { useCallback, useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { FormDtLicense } from "@/api/profile/model";
import ImageUpload from "@/components/ImageUpload";
import dayjs from "dayjs";
import { throwToast } from "@/utils/throw-toast";
import { createNewLicense, updateLicense } from "@/api/profile";
import WaveLoader from "../WaveLoader";
import type { BaseArrayResponse, BaseResponse } from "@/api/model";
import { useTranslations } from "next-intl";

interface ModalLisenceProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  isEditing: boolean;
  formDt: FormDtLicense;
  setLicenses: React.Dispatch<React.SetStateAction<FormDtLicense[]>>;
}

export const ModalLicense: React.FC<ModalLisenceProp> = ({
  handleClose,
  isEditing,
  show,
  title,
  formDt,
  setLicenses,
}) => {
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    if (window) {
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const t = useTranslations("MyProfile");
  const [formData, setFormData] = useState(formDt);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.licenseIssueDate)
      newErrors.licenseIssueDate = "License Issue Date is required";
    if (!formData.licenseType)
      newErrors.licenseType = "License type is required";
    if (!formData.licenseStatus)
      newErrors.licenseStatus = "License Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (file: File) => {
    setUploadedImage(file);
    console.log("Uploaded Image: ", file);
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    },
    [formData],
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setFormData({
        ...formData,
        licenseStatus: event.target.value,
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        licenseStatus: "",
      }));
    },
    [formData],
  );

  const submitAddLicense = async () => {
    setIsLoading(true);
    try {
      if (validateForm()) {
        const license = {
          licenseType: formData.licenseType,
          logo: "",
          licenseIssuer: formData.licenseIssuer,
          licenseState: formData.licenseState,
          licenseIssueDate: new Date(formData.licenseIssueDate),
          licenseStatus: formData.licenseStatus,
          licenseExpirationDate: formData.licenseExpirationDate
            ? new Date("")
            : new Date(formData.licenseExpirationDate),
          credentialID: formData.credentialID,
        };
        const newLicense = {
          licenses: [license],
        };
        const res: BaseArrayResponse<FormDtLicense> =
          await createNewLicense(newLicense);
        if (res.data) {
          setLicenses((prev) => {
            const newLicense: FormDtLicense = res.data[0] as FormDtLicense;
            return [newLicense, ...prev];
          });
        }
        // setLicenses((prev) => [license, ...prev]);
        handleClose();
      }
    } catch (error) {
      throwToast("Error creating license", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const submitEditLicense = async () => {
    setIsLoading(true);
    try {
      if (validateForm()) {
        const license = {
          id: formData.id,
          licenseType: formData.licenseType,
          logo: "",
          licenseIssuer: formData.licenseIssuer,
          licenseState: formData.licenseState,
          licenseIssueDate: new Date(formData.licenseIssueDate),
          licenseStatus: formData.licenseStatus,
          licenseExpirationDate: formData.licenseExpirationDate
            ? new Date("")
            : new Date(formData.licenseExpirationDate),
          credentialID: formData.credentialID,
        };
        const newLicense = {
          licenses: [license],
        };
        await updateLicense(newLicense);
        setLicenses((prev) =>
          prev.map((cer) => (cer.id === formDt.id ? license : cer)),
        );
        handleClose();
      }
    } catch (error) {
      throwToast("Error updating license", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        fullscreen={fullscreen}
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        className={`${styles["customModal"]} nunito-font`}
      >
        <Modal.Header
          closeButton={fullscreen === "sm-down" ? false : true}
          className={styles["modal-header"]}
        >
          {fullscreen && (
            <i
              className={`${styles["modal-back__btn"]} bi bi-arrow-left h1 m-0`}
              onClick={handleClose}
            ></i>
          )}
          <Modal.Title>
            <h1 className="m-0 fw-bold">{title}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles["modal-content"]}>
          <form className="p-1">
            {/* <ImageUpload
              folderUpload={""}
              onChange={handleImageChange}
              aspect={0}
              uploadAvatar={false}
              previewImage={""}
            /> */}
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs">
                  {t("name")} {t("certification")}
                </p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "56px",
                  }}
                  value={formData.licenseType}
                  name="licenseType"
                  onChange={handleChange}
                  placeholder="Please enter your license or certification name"
                />
                {errors.licenseType && (
                  <p className="text-red font-xsss ">{errors.licenseType}</p>
                )}
              </div>

              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs">
                  {t("Issuing Organization")}
                </p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "56px",
                  }}
                  value={formData.licenseIssuer}
                  name="licenseIssuer"
                  onChange={handleChange}
                  placeholder="Please enter your issuing organization"
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs ">{t("Issued year")}</p>
                <DatePicker
                  className="w__100"
                  value={dayjs(formData.licenseIssueDate)}
                  onChange={(date) => {
                    const formattedDate = date ? dayjs(date).toISOString() : "";
                    setFormData({
                      ...formData,
                      licenseIssueDate: formattedDate,
                    });
                    if (formattedDate) {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        licenseIssueDate: "",
                      }));
                    }
                  }}
                  views={["day", "month", "year"]}
                />
                {errors.licenseIssueDate && (
                  <p className="text-red font-xsss ">
                    {errors.licenseIssueDate}
                  </p>
                )}
              </div>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs ">
                  {t("Expiration year")}
                </p>
                <DatePicker
                  className="w__100"
                  value={dayjs(formData.licenseExpirationDate)}
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      licenseExpirationDate: date
                        ? dayjs(date).toISOString()
                        : "",
                    })
                  }
                  views={["day", "month", "year"]}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs">{t("Credential ID")}</p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "56px",
                  }}
                  value={formData.credentialID}
                  name="credentialID"
                  onChange={handleChange}
                  placeholder="Please enter your credential id"
                />
              </div>
              <div style={{ width: "50%" }}>
                <p className="m-0 py-1 fw-600 font-xs">{t("License Status")}</p>
                <Select
                  value={formData.licenseStatus}
                  onChange={handleSelectChange}
                  displayEmpty
                  style={{ width: "100%", height: "56px" }}
                >
                  <MenuItem value="" disabled>
                    {t("select")} {t("License Status")}
                  </MenuItem>
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
                  <MenuItem value="REVOKED">REVOKED</MenuItem>
                  <MenuItem value="EXPIRED">EXPIRED</MenuItem>
                </Select>
                {errors.licenseStatus && (
                  <p className="text-red font-xsss ">{errors.licenseStatus}</p>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}>
          <Button
            variant="primary"
            onClick={
              isEditing ? () => submitEditLicense() : () => submitAddLicense()
            }
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && <WaveLoader />}
    </>
  );
};
