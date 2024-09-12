import { Button } from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  imageUrl: string;
  cropped: (file: File) => void;
  aspect: number;
}

export const ImageCropModal = ({
  isOpen,
  onCancel,
  imageUrl,
  cropped,
  aspect: defaultAspect,
}: Props) => {
  const [crop, setCrop] = useState<any>();
  const [completedCrop, setCompletedCrop] = useState();
  const [aspect, setAspect] = useState(defaultAspect);
  const [imagepreview, setPreviewImage] = useState("");

  const imgRef = useRef(null);

  const onImageLoad = (e: any) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const centerAspectCrop = (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
  ) => {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    );
  };

  const onCrop = async () => {
    const croppedImage = await getCroppedImg(imgRef.current);
    cropped(croppedImage as File);
  };

  const canvasPreview = async (
    image: any,
    canvas: any,
    crop: any,
    scale = 1,
  ) => {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = 0.3;
    // const pixelRatio = 1

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "low";

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY);
    // 3) Rotate around the origin
    // 2) Scale the image
    ctx.scale(scale, scale);
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    ctx.restore();
  };

  const toBlob = async (canvas: any) => {
    return new Promise((resolve) => {
      canvas.toBlob(resolve);
    });
  };

  const getCroppedImg = async (image: any) => {
    const canvas = document.createElement("canvas");
    console.log("Completed Crop:", completedCrop);
    canvasPreview(image, canvas, completedCrop);
    const blob = await toBlob(canvas);

    if (!blob) {
      console.error("Failed to create blob");
      return "";
    }
    return blob;
  };

  return (
    <Modal show={isOpen} onHide={onCancel}>
      <Modal.Body>
        <div className="py-[10px] xls:py-0">
          <div className=" text-black mx-auto text-[16px] font-medium flex justify-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c: any) => setCompletedCrop(c)}
              aspect={aspect}
              // minWidth={400}
              minHeight={100}
              maxHeight={400}
              // circularCrop
            >
              <Image
                ref={imgRef}
                alt="Crop me"
                src={imageUrl}
                onLoad={onImageLoad}
                width={500}
                height={500}
                style={{ maxHeight: "500px", objectFit: "contain" }}
              />
            </ReactCrop>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCancel}>Close</Button>
        <Button onClick={onCrop}>Crop</Button>
      </Modal.Footer>
    </Modal>
  );
};
