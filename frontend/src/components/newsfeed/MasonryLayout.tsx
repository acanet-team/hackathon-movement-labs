import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/modules/MasonryLayout.module.scss";

interface ImageData {
  path: string;
  id: string;
}

interface MasonryLayoutProps {
  images: ImageData[];
}

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ images }) => {
  const [visibleImages, setVisibleImages] = useState<ImageData[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    setVisibleImages(images.slice(0, 4));
  }, [images]);

  const handleImageClick = (image: ImageData) => {
    console.log("Clicked image:", image);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["masonry"]}>
        {visibleImages.map((image, index) =>
          image.path ? (
            <div
              key={index}
              className={styles["imageContainer"]}
              onClick={() => handleImageClick(image)}
            >
              <Image
                src={image.path}
                alt={image.id}
                layout="fill"
                objectFit="cover"
                className={styles["imageCustom"]}
              />
            </div>
          ) : null,
        )}
      </div>

      {images.length > 4 && (
        <div
          className={styles["moreImages"]}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? (
            <>
              {images.slice(4).map((image, index) =>
                image.path ? (
                  <div
                    key={index}
                    className={styles["imageContainer"]}
                    onClick={() => handleImageClick(image)}
                  >
                    <Image
                      src={image.path}
                      alt={image.id}
                      layout="fill"
                      objectFit="cover"
                      className={styles["imageCustom"]}
                    />
                  </div>
                ) : null,
              )}
            </>
          ) : (
            <span className={styles["moreText"]}>
              + {images.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MasonryLayout;
