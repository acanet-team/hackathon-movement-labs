import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/courses.module.scss";

interface ChildItem {
  child: string;
}

interface DropDownProp {
  label: string;
  course_duration: number;
  childList: ChildItem[];
}

interface Data {
  data: DropDownProp[] | undefined;
  totalLectures: number | undefined;
  totalCourseDuration: number | undefined;
}

export const DropDown: React.FC<Data> = ({
  data,
  totalLectures,
  totalCourseDuration,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openAll, setOpenAll] = useState(false);

  const handleToggle = (index: number) => {
    if (openAll) return;
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAllToggle = () => {
    setOpenAll(!openAll);
    setOpenIndex(null);
  };

  const formatCourseDuration = (courseDuration: number) => {
    if (courseDuration < 60) {
      return `${courseDuration} min`;
    }
    const hours = Math.floor(courseDuration / 60);
    const minutes = courseDuration % 60;
    return `${hours} hr ${minutes} min`;
  };

  return (
    <>
      <div className={styles["group-child-label"]}>
        <div className={styles["group-label"]}>
          <p className="m-0 text-white font-xssss">{data?.length} sections</p>
          <p className="m-0 text-white font-xsssss">•</p>
          <p className="m-0 text-white font-xssss">{totalLectures} lectures</p>
          <p className="m-0 text-white font-xsssss">•</p>
          <p className="m-0 text-white font-xssss">
            {totalCourseDuration !== undefined
              ? formatCourseDuration(totalCourseDuration)
              : ""}{" "}
            total length
          </p>
        </div>
        <p
          className="text-blue font-xssss m-0 cursor-pointer"
          onClick={handleAllToggle}
        >
          Expand all sections
        </p>
      </div>
      <div className={`${styles["bgCard"]} card`}>
        {data?.map((item, index) => (
          <div key={index} className="">
            <div
              className={`${styles["dropdown-button"]} px-4 py-3`}
              onClick={() => handleToggle(index)}
            >
              <div className={styles["group-label"]}>
                {openAll || openIndex === index ? (
                  <Image
                    src={`/assets/images/icon-chev-up.png`}
                    width={10}
                    height={5}
                    alt="arrow up icon"
                  />
                ) : (
                  <Image
                    src={`/assets/images/icon-chev-down.png`}
                    width={10}
                    height={5}
                    alt="arrow down icon"
                  />
                )}
                <p className="m-0 text-white font-xss">{item.label}</p>
              </div>
              <div className={styles["group-label"]}>
                <p className="m-0 text-white font-xsss">
                  {item.childList.length} lectures
                </p>
                <p className="m-0 text-white font-xssss">•</p>
                <p className="m-0 text-white font-xsss">
                  {formatCourseDuration(item.course_duration)}
                </p>
              </div>
            </div>
            {(openAll || openIndex === index) && (
              <div className="">
                {item.childList.map((child, idx) => (
                  <div key={idx} className={`${styles["group"]} px-4 py-2`}>
                    <Image
                      src={`/assets/images/icon-course-video.png`}
                      width={14}
                      height={14}
                      alt="video icon"
                    />
                    <p className="text-white m-0">{child.child}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DropDown;
