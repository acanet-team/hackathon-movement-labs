import Header from "@/components/Header";
import Brokers from "@/components/onboard/Brokers";
import CreateProfile from "@/components/onboard/CreateProfile";
import Interests from "@/components/onboard/Interests";
import classNames from "classnames";
import type { NextPageContext } from "next";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import styles from "../styles/modules/onboard.module.scss";
import type { NextPageWithLayout } from "./_app";

const Onboarding: NextPageWithLayout = () => {
  /* eslint-disable react-hooks/rules-of-hooks */
  const numSteps = 3;
  const [curstep, setCurStep] = useState<number>(0);
  const { data: session } = useSession();

  const onClickNextStep = useCallback(() => {
    setCurStep((step) => step + 1);
    if (curstep > numSteps) {
      setCurStep(1);
    }
  }, [curstep]);

  useEffect(() => {
    if (session && curstep === 0) {
      const onboardingStep = session.user["onboarding_data"]?.step;
      // Set the onboarding step
      if (onboardingStep) {
        if (onboardingStep === "create_profile") {
          setCurStep(1);
        } else if (onboardingStep === "select_interest_topic") {
          setCurStep(2);
        }
      }
    }
  }, [session]);

  useEffect(() => {
    /* eslint-disable react-hooks/rules-of-hooks */
    const stepDivs = document.querySelectorAll(`.${styles.step}`);

    // const handleCLick = function (e: any) {
    //   const clickedTab = (e.target as HTMLElement).closest(
    //     `.${styles["step"]}`,
    //   ) as HTMLElement;
    //   // Find tab number and update curPage
    //   const clickedTabNum = Number(clickedTab?.dataset.tab);
    //   // if (clickedTab && curstep + 1 > clickedTabNum) {
    //   setCurStep(clickedTabNum);
    //   // }
    // };

    stepDivs.forEach((stepDiv, index) => {
      // Hightlight chosen tab
      let stepNum = index + 1;
      if (stepNum === curstep) {
        stepDiv.classList.add(`${styles["editing"]}`);
      } else {
        stepDiv.classList.remove(`${styles["editing"]}`);
      }
      if (stepNum < curstep) {
        stepDiv.classList.remove(`${styles["editing"]}`);
        stepDiv.classList.add(`${styles["done"]}`);
      } else {
        stepDiv.classList.remove(`${styles["done"]}`);
      }

      // stepDiv.addEventListener("click", handleCLick as EventListener);

      // Reveal corresponding content
      const contentContainer = document.querySelectorAll(
        `.${styles["tab-content__container"]}`,
      );
      contentContainer.forEach((content) =>
        content.classList.remove(`${styles["content-active"]}`),
      );
      document
        .querySelector(`.tab-content__container--${curstep}`)
        ?.classList.add(`${styles["content-active"]}`);
    });

    // return () => {
    //   stepDivs.forEach((stepDiv) =>
    //     stepDiv.removeEventListener("click", handleCLick as EventListener),
    //   );
    // };
  }, [curstep]);

  return (
    <>
      <div className={styles["stepper-horizontal"]} id={styles["stepper1"]}>
        <div
          className={classNames(styles["step"], styles["editing"], "step-1")}
          data-tab="1"
        >
          <div className={styles["step-circle"]}>
            <span>1</span>
          </div>
          <div className={styles["step-title"]}>Create your profile</div>
          <div className={styles["step-bar-left"]}></div>
          <div className={styles["step-bar-right"]}></div>
        </div>
        <div className={classNames(styles["step"], "step-2")} data-tab="2">
          <div className={styles["step-circle"]}>
            <span>2</span>
          </div>
          <div className={styles["step-title"]}>Select topics</div>
          <div className={styles["step-bar-left"]}></div>
          <div className={styles["step-bar-right"]}></div>
        </div>
        <div className={classNames(styles["step"], "step-3")} data-tab="3">
          <div className={styles["step-circle"]}>
            <span>3</span>
          </div>
          <div className={styles["step-title"]}>Follow brokers</div>
          <div className={styles["step-optional"]}>Optional</div>
          <div className={styles["step-bar-left"]}></div>
          <div className={styles["step-bar-right"]}></div>
        </div>
      </div>

      <div className="tab-content">
        <div
          className={classNames(
            styles["active-tab"],
            styles["tab-content__container"],
            "tab-content__container--1",
          )}
        >
          {curstep === 1 && <CreateProfile onNextHandler={onClickNextStep} />}
        </div>
        <div
          className={classNames(
            "tab-content__container--2",
            styles["tab-content__container"],
            styles["interest-tab-content__container"],
          )}
        >
          {curstep === 2 && <Interests onNextHandler={onClickNextStep} />}
        </div>
        <div
          className={classNames(
            "tab-content__container--3",
            styles["tab-content__container"],
          )}
        >
          {curstep === 3 && <Brokers onNextHandler={onClickNextStep} />}
        </div>
      </div>
    </>
  );
};

Onboarding.getLayout = function getLayout(page: any) {
  return (
    <div className="container-fluid px-lg-5 px-sm-3">
      <Header isOnboarding={true} />
      {page}
    </div>
  );
};

export default Onboarding;

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
