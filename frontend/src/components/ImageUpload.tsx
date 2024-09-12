import { useLoading } from "@/context/Loading/context";
import styles from "@/styles/modules/image-upload.module.scss";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { ImageCropModal } from "./ImageCropModal";

interface Props {
  folderUpload: string;
  onChange: (file: File) => void;
  aspect: number;
  uploadAvatar: boolean;
  previewImage: string;
}

function ImageUpload({
  folderUpload,
  onChange,
  aspect,
  uploadAvatar,
  previewImage,
}: Props) {
  const { showLoading, hideLoading } = useLoading();
  const [selectedImage, setSelectedImage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState("");
  const [openImageCrop, setOpenImageCrop] = useState(false);

  useEffect(() => {
    if (previewImage) {
      setPreviewImgUrl(previewImage);
    }
  }, [previewImage]);

  const fileToDataString = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onloadend = () => resolve(reader.result as string);
    });
  };

  const onCropped = async (image: File) => {
    onChange(image);
    const imgUrl = await fileToDataString(image);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setOpenImageCrop(false);
    setPreviewImgUrl(imgUrl);
  };

  const onCancel = () => {
    setOpenImageCrop(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const file = event.target.files as FileList;
    if (!file) {
      return;
    }
    try {
      const imgUrl = await fileToDataString(file?.[0] as File);
      setSelectedImage(imgUrl);
      setOpenImageCrop(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={uploadAvatar ? styles["avatar-wrapper"] : styles["wrapper"]}
    >
      <form>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <i
            className="bi bi-cloud-arrow-up font-xxl cursor-pointer"
            onClick={() => inputRef.current?.click()}
          ></i>
          <p className="text-center">
            Click or drag file to this area to upload
          </p>
        </div>
        {previewImgUrl && (
          <div className="image_wrapper d-flex justify-content-center">
            <img
              src={previewImgUrl}
              style={{ maxWidth: "100%", objectFit: "contain" }}
            />
          </div>
        )}
        <input
          ref={inputRef}
          className="visually-hidden"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />
      </form>
      <ImageCropModal
        isOpen={openImageCrop}
        onCancel={onCancel}
        cropped={onCropped}
        imageUrl={selectedImage}
        aspect={aspect}
      />
    </div>
  );
}

export default ImageUpload;
