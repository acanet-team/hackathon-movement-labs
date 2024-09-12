"use client";
import { subscribeTopicsRequest } from "@/api/onboard";
import React, { useEffect, useRef, useState } from "react";
import { createGetAllTopicsRequest } from "@/api/onboard";
import styles from "@/styles/modules/interest.module.scss";
import { useTranslations } from "next-intl";
import DotWaveLoader from "../DotWaveLoader";
import Pagetitle from "../Pagetitle";
import { combineUniqueById } from "@/utils/combine-arrs";

interface Option {
  id: string;
  topicName: string;
}

export default function Interests(props: { onNextHandler: () => void }) {
  const tOnboard = useTranslations("Onboard");
  const list = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const TAKE = 20;
  const t = useTranslations("Interest");
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<Boolean>(false);

  const onSelectInterestHandler = () => {
    if (selectedOptions.length === 0) {
      return setError("Please choose at least 1 interest topic.");
    }
    try {
      subscribeTopicsRequest({
        interestTopicIds: selectedOptions,
        isOnboarding: true,
      });
      localStorage.setItem("onboarding_step", "select_interest_topic");
      props.onNextHandler();
    } catch (err) {
      console.log(err);
    }
  };

  const manipulateClasses = (e: any, addedClass: any, removedClass: any) => {
    e.target.classList.remove(removedClass);
    e.target.classList.add(addedClass);
  };

  const toggleSelection = (e: any, optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions((prevState) =>
        prevState.filter((id) => id !== optionId),
      );
      manipulateClasses(e, styles["btn-unselected"], styles["btn-selected"]);
    } else {
      setSelectedOptions((prevState) => [...prevState, optionId]);
      manipulateClasses(e, styles["btn-selected"], styles["btn-unselected"]);
    }
  };

  const fetchTopics = async (page: number, TAKE: number) => {
    try {
      setIsLoading(true);
      const response: any = await createGetAllTopicsRequest(page, TAKE);
      // console.log(response);
      setOptions((prevState: Option[]) => {
        const newOptions: Option[] = combineUniqueById(
          prevState,
          response.data.docs,
        ) as Option[];
        return newOptions;
      });
      setTotalPage(response.data.meta.totalPage);
      return response.data;
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Inifite scrolling
  const onScrollHandler = () => {
    if (list.current) {
      const { scrollTop, scrollHeight, clientHeight } = list.current;
      if (
        scrollTop + clientHeight >= scrollHeight &&
        !isLoading &&
        page < totalPage
      ) {
        setPage((prevState) => prevState + 1);
      }
    }
  };

  useEffect(() => {
    const currentList = list.current;
    if (currentList) {
      currentList.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (currentList) {
        currentList.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage, isLoading]);

  useEffect(() => {
    if (page === 1 && !hasFetchedInitialData) {
      fetchTopics(1, TAKE);
      setHasFetchedInitialData(true);
    } else if (page > 1) {
      fetchTopics(page, TAKE);
    }
  }, [page]);

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
    }
  }, []);

  return (
    <>
      <div id={styles.interest} className="right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="onboard-wrap">
              <div className="card w-100 border-0 bg-white shadow-md rounded-3 p-0 mb-4">
                <Pagetitle
                  title={t("interest_title")}
                  intro={t("interest_description")}
                  isSearch={false}
                />

                <div
                  ref={list}
                  id={styles["interest-container"]}
                  className="interest-options card-body p-lg-5 p-4 w-100 border-0 d-flex flex-wrap justify-content-center gap-lg-3 gap-2 mb-lg-3 mb-1"
                >
                  {options?.length > 0 &&
                    options.map((option) => (
                      <button
                        key={option.id}
                        onClick={(e) => toggleSelection(e, option.id)}
                        className="btn"
                      >
                        {option.topicName}
                      </button>
                    ))}
                  {isLoading && (
                    <div className="d-block w-100">
                      <DotWaveLoader />
                    </div>
                  )}
                </div>
                {error && (
                  <div className="mx-auto dark-error-text my-2">{error}</div>
                )}
                <div className="btn mt-2 mb-3 mx-auto">
                  <button
                    type="submit"
                    onClick={onSelectInterestHandler}
                    className="main-btn bg-current text-center text-white fw-600 px-2 py-3 w175 rounded-4 border-0 d-inline-block my-3 mx-auto"
                  >
                    {tOnboard("continue")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
