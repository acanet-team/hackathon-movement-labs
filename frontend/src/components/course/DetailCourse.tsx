"use client";
import { coursesList } from "@/fakeData/data-investor-course";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/modules/courses.module.scss";
import DropDown from "../DropDown";
import Rating from "../Ratings";
import RichTextView from "../RichTextView";

interface Course {
  id: number;
  nameCourse: string;
  author: string;
  imgCourse: string;
  imgAuthor: string;
  price: number;
  discount?: number;
  dateUpdate: string;
  followers: string;
  ratings: number;
  description: string;
  reasonList: { reason: string }[];
  couseContent: {
    label: string;
    course_duration: number;
    childList: { child: string }[];
  }[];
  content: string;
}

interface Props {
  id: number;
}

export default function DetailCourse({ id }: Props) {
  const [course, setCourse] = useState<Course | null>(null);
  const numericId = Number(id);

  useEffect(() => {
    const findCourse = coursesList.find((data) => data.id === numericId);
    setCourse(findCourse || null);
  }, [numericId]);

  const totalLectures =
    course?.couseContent?.reduce(
      (acc, item) => acc + item.childList.length,
      0,
    ) || 0;

  const totalCourseDuration =
    course?.couseContent?.reduce(
      (acc, item) => acc + item.course_duration,
      0,
    ) || 0;

  return (
    <>
      <div className="row">
        <div className="col-8">
          <div>
            <h1 className="fw700 font-xxl ">{course?.nameCourse}</h1>
            <p className="m-0 text-white font-sm fw400 mb-2">
              {course?.description}
            </p>
          </div>
          <div className="mb-4">
            <div className={styles["group"]}>
              <div className="bg-red-gradiant px-2 py-1 text-white font-xssss">
                Best seller
              </div>
              <p className="m-0 font-xsss text-white">4.7</p>
              <Rating rating={4.7} size={12} />
              <p className="m-0 font-xsss text-blue">
                ({course?.ratings} ratings)
              </p>
            </div>
            <div className={styles["group"]}>
              <p className="m-0 font-xsss text-white">Created by</p>
              <Image
                src={course?.imgAuthor ?? ""}
                alt={course?.author ?? ""}
                width={24}
                height={24}
              />
              <div>
                <div className={styles["group"]}>
                  <div className={styles["group-child"]}>
                    <p className="font-xsss m-0 text-white">{course?.author}</p>
                  </div>
                  <div className={styles["group-child"]}>
                    <p className="font-xssss m-0 fw-700 text-white">
                      {course?.followers}
                    </p>
                    <p className="font-xssss m-0 fw-200 text-white">
                      followers
                    </p>
                  </div>
                  <div className={styles["group-child"]}>
                    <p className="font-xssss m-0 fw-700 text-white">4.8/5</p>
                    <p className="font-xssss m-0 fw-200 text-white">ratings</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["group"]}>
              <p className="font-xssss m-0 text-white">Last update</p>
              <p className="font-xssss m-0 text-white">{course?.dateUpdate}</p>
            </div>
          </div>
          <div className="mb-5">
            <h1 className="mb-3">What you&apos;ll learn</h1>
            <div className={`${styles["bgCard"]} card px-4 py-3 `}>
              <div className="row">
                {course?.reasonList?.map((reasonList, index) => (
                  <div key={index} className="col-6">
                    <div className={styles["group"]}>
                      <Image
                        src="/assets/images/icon-check-02.png"
                        width={24}
                        height={24}
                        alt="icon-check"
                      />
                      <p className="text-xss m-0 text-white">
                        {reasonList.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-5">
            <h1>Course content</h1>
            <DropDown
              data={course?.couseContent}
              totalLectures={totalLectures}
              totalCourseDuration={totalCourseDuration}
            />
          </div>
          <div className="mb-5">
            <h1 className="mb-3">Description</h1>
            <div className={`${styles["bgCard"]} card px-4 py-3 `}>
              <RichTextView text={course?.content || ""} />
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className={`${styles["bgCard"]} card`}>
            <Image
              src={course?.imgCourse ?? ""}
              alt={course?.nameCourse ?? ""}
              width={300}
              height={190}
              className="w__100 object-cover"
            />
            <div className="p-3">
              <div className={`${styles["group-price-ba"]}`}>
                <p className="font-xxl fw-700 m-0 text-white">
                  ${" "}
                  {course?.discount
                    ? `${course.discount * course?.price}`
                    : `${course?.price}`}
                </p>
                <p
                  className="font-xs fw-400 m-0 text-white "
                  style={{ textDecoration: "line-through" }}
                >
                  ${course?.price}
                </p>
              </div>
              <p className="font-xss fw-400 m-0 text-white">
                {course?.discount ? `${course.discount * 100}% off` : ""}
              </p>
              <div className={styles["group"]}>
                <Image
                  src="/assets/images/icon-alarm.png"
                  width={18}
                  height={18}
                  alt="icon-alarm"
                />
                <div className={`${styles["time-discount"]} font-xss fw-400`}>
                  2 days left at this price!
                </div>
              </div>
              <button className="bg-current text-center rounded-3 py-1 w__100 border-0 d-inline-block mt-4">
                <p className="m-0">Buy now</p>
              </button>
              <p
                className="font-xsssss fw-400 m-0 text-white mb-3"
                style={{ textAlign: "center" }}
              >
                30-Day Money-Back Guarantee
              </p>
              <div>
                <p className="font-xss fw-600 m-0 text-white">
                  This course includes:
                </p>
                <div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={`/assets/images/icon-course-video.png`}
                    />
                    <p className="font-xsss fw-600 m-0 text-white">
                      {(totalCourseDuration / 60).toFixed(1)} hours on-demand
                      video
                    </p>
                  </div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={`/assets/images/icon-square.png`}
                    />
                    <p className="font-xsss fw-600 m-0 text-white">
                      {totalLectures} articles
                    </p>
                  </div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={`/assets/images/icon-down.png`}
                    />
                    <p className="font-xsss fw-600 m-0 text-white">
                      3 downloadable resources
                    </p>
                  </div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={`/assets/images/icon-iphone.png`}
                    />
                    <p className="font-xsss fw-600 m-0 text-white">
                      Access on mobile and TV
                    </p>
                  </div>
                  <div className={styles["group"]}>
                    <Image
                      width={15}
                      height={15}
                      alt="icon"
                      src={`/assets/images/icon-certificate.png`}
                    />
                    <p className="font-xsss fw-600 m-0 text-white">
                      Certificate of completion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
