import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { putSocialMedia } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import type { BrokerProfile, SocialMedia } from "@/api/profile/model";
import WaveLoader from "../WaveLoader";
import { useTranslations } from "next-intl";

interface ModalSocialProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  dataBrokerProfile: BrokerProfile;
  socials: SocialMedia[];
  setSocials: React.Dispatch<React.SetStateAction<SocialMedia[]>>;
}

export const ModalSocialMedia: React.FC<ModalSocialProp> = ({
  handleClose,
  show,
  title,
  socials,
  setSocials,
}) => {
  const t = useTranslations("MyProfile");
  const [updatedSocials, setUpdatedSocials] = useState<SocialMedia[]>(socials);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const urlFormat = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const validateForm = (updatedSocial?: typeof social) => {
  //   const socialToValidate = updatedSocial || social;
  //   const newErrors: { [key: string]: string } = {};

  //   Object.entries(socialToValidate).forEach(([name, { url }]) => {
  //     if (url === "") {
  //       return;
  //     }
  //     if (!urlFormat.test(url)) {
  //       newErrors[name] = `${t("Invalid URL format")}`;
  //     }
  //   });

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;
    const id = dataset.id;
    setUpdatedSocials((prevSocials) =>
      prevSocials.map((item) =>
        item.id === id && item.name === name
          ? { ...item, mediaUrl: value }
          : item,
      ),
    );

    // validateForm(newSocial);
  };

  const submitSocial = async () => {
    // if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await putSocialMedia(updatedSocials);
      setSocials(updatedSocials);
      // setSocialMedias(socialMedia);
      throwToast("Social media updated successfully", "success");
      handleClose();
    } catch (error) {
      throwToast("An error occurred while updating social media", "error");
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
          closeButton={fullscreen !== "sm-down"}
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {updatedSocials?.length > 0 &&
                updatedSocials.map((item) => (
                  <div key={item.id} style={{ flexBasis: "calc(50% - 20px)" }}>
                    <div style={{ width: "100%" }}>
                      <p className="m-0 py-1 fw-600 font-xs">
                        {item.name.toUpperCase()}
                      </p>
                      <input
                        className="px-2"
                        style={{
                          width: "100%",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          height: "56px",
                        }}
                        name={item.name}
                        placeholder=""
                        data-id={item.id}
                        value={item.mediaUrl}
                        onChange={handleInputChange}
                      />
                      {/* {errors[name] && (
                      <p className="text-red font-xsss">{errors[name]}</p>
                    )} */}
                    </div>
                  </div>
                ))}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}>
          <Button
            variant="primary"
            onClick={submitSocial}
            // onClick={() => {
            //   console.log("updateSocial", socials);
            // }}
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && <WaveLoader />}
    </>
  );
};
