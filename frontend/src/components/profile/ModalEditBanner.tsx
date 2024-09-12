import React, { useEffect, useRef, useState } from "react";
import style from "@/styles/modules/profile.module.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import { updateProfile } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import WaveLoader from "../WaveLoader";
import type { BrokerProfile } from "@/api/profile/model";
import Image from "next/image";
import { ImageCropModal } from "@/components/ImageCropModal";
import { useTranslations } from "next-intl";

function ModalEditBanner(props: {
  id: string;
  title: string;
  show: boolean;
  dataBrokerProfile: BrokerProfile;
  avatar: string;
  coverImg: string;
  handleClose: () => void;
}) {
  const t = useTranslations("MyProfile");
  const { title, show, handleClose, id, avatar, coverImg } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const [uploadedCoverImage, setUploadedCoverImage] = useState<File | null>(
    null,
  );
  const [uploadedAvatarImage, setUploadedAvatarImage] = useState<File | null>(
    null,
  );

  const [previewCover, setPreviewCover] = useState<string>(coverImg);
  const [previewAvatar, setPreviewAvatar] = useState<string>(avatar);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [openImageCrop, setOpenImageCrop] = useState(false);
  const [imageType, setImageType] = useState<string | null>(null);

  useEffect(() => {
    if (selectedImage && imageType) {
      setOpenImageCrop(true);
    }
  }, [selectedImage, imageType]);

  const fileToDataString = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onloadend = () => resolve(reader.result as string);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const file = event.target.files as FileList;
    if (!file) {
      return;
    }
    try {
      setImageType(type);
      const imgUrl = await fileToDataString(file?.[0] as File);
      setSelectedImage(imgUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    setOpenImageCrop(false);
    if (imageType === "avatar") {
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
    if (imageType === "cover") {
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
    setImageType(null);
    setSelectedImage("");
  };

  const onCropped = async (image: File) => {
    const imgUrl = await fileToDataString(image);
    if (imageType === "avatar") {
      setUploadedAvatarImage(image);
      setPreviewAvatar(imgUrl);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
    if (imageType === "cover") {
      setUploadedCoverImage(image);
      setPreviewCover(imgUrl);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
    setOpenImageCrop(false);
    setImageType(null);
    setSelectedImage("");
  };

  const submitBanner = async () => {
    setIsLoading(true);
    try {
      const formDt = new FormData();
      if (uploadedCoverImage) {
        formDt.append("coverImage", uploadedCoverImage);
      }
      if (uploadedAvatarImage) {
        formDt.append("avatar", uploadedAvatarImage);
      }
      const dataUpdate = await updateProfile(formDt);
      handleClose();
      throwToast("About updated successfully", "success");
    } catch (error) {
      throwToast("Error updating", "error");
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
        <Modal.Body className={`$styles["modal-content"] `}>
          <div style={{ height: "300px" }}>
            <div className="position-relative w-100 bg-image-cover bg-image-center">
              <Image
                src={
                  previewCover
                    ? previewCover
                    : `/assets/images/default-upload.jpg`
                }
                width={960}
                height={250}
                alt="cover"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100px",
                  borderRadius: "5px",
                }}
              />
              <label htmlFor="cover" className="cursor-pointer">
                <i
                  className={`${style["image-edit__btn"]} ${style["cover-image-edit__btn"]} bi bi-pencil h3 m-0 position-absolute`}
                ></i>
              </label>
              <input
                id="cover"
                ref={coverInputRef}
                className="visually-hidden"
                type="file"
                onChange={(e) => handleFileChange(e, "cover")}
                accept="image/*"
                style={{ display: "none" }}
              />
              <figure
                className="avatar position-absolute w75 mb-0 z-index-1"
                style={{ left: "50px", bottom: "-50%" }}
              >
                <Image
                  src={
                    previewAvatar
                      ? previewAvatar
                      : `/assets/images/default-avatar.jpg`
                  }
                  alt="avatar"
                  width={100}
                  height={100}
                  className="float-right p-1 bg-white rounded-circle position-relative"
                  style={{ objectFit: "cover", boxShadow: "0 0 2px 2px #eee" }}
                />
                <label htmlFor="avatar" className="cursor-pointer">
                  <i
                    className={`${style["image-edit__btn"]} ${style["avatar-image-edit__btn"]} bi bi-pencil h3 m-0 position-absolute right-0 bottom-0`}
                  ></i>
                </label>
                <input
                  id="avatar"
                  ref={avatarInputRef}
                  className="visually-hidden"
                  type="file"
                  onChange={(e) => handleFileChange(e, "avatar")}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </figure>
            </div>
            {openImageCrop && (
              <ImageCropModal
                isOpen={openImageCrop}
                onCancel={onCancel}
                cropped={onCropped}
                imageUrl={selectedImage}
                aspect={imageType === "cover" ? 960 / 250 : 1}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}>
          <Button
            variant="primary"
            onClick={submitBanner}
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && <WaveLoader />}
    </>
  );
}

export default ModalEditBanner;
