import { ONBOARDING_STEP } from "@/api/auth/auth.model";
import { useLoading } from "@/context/Loading/context";
import useAuthStore from "@/store/auth";
import type { NextPageContext } from "next";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { NextPageWithLayout } from "./_app";
import { guestLogin } from "@/api/auth";
import { useGuestToken } from "@/context/guestToken";

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter();
  const t = useTranslations("SignIn");
  const [curTheme, setCurTheme] = useState("theme-light");
  const { data: session, update } = useSession() as any;
  const { showLoading } = useLoading();
  // Zustand store
  const { createProfile, login, checkOnboarding } = useAuthStore(
    (state) => state,
  );
  const { guestToken, setGuestToken } = useGuestToken() || {};

  useEffect(() => {
    const handleStorageChange = () => {
      const theme = localStorage.getItem("theme") || "theme-light";
      setCurTheme(theme);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (session) {
      // Navigation
      const onboardingStep = session.user["onboarding_data"]?.step;
      if (onboardingStep !== ONBOARDING_STEP.COMPLETE) {
        router.push("/onboarding");
      } else {
        router.push("/");
      }
    }
  }, [session]);

  const onSignInAsGuestHandler = async () => {
    // signIn();
  };
  return (
    <div className="main-wrap">
      {/* <Session /> */}
      <div className="nav-header border-0 bg-transparent shadow-none">
        <div className="nav-top w-100">
          <Link href="/" className="me-auto">
            <span
              id="site-logo"
              className="d-inline-block fredoka-font ls-3 fw-600 font-xxl logo-text mb-0 text-current"
            >
              <Image
                src={
                  curTheme === "theme-dark"
                    ? "/assets/images/logo/logo-horizontal-white.png"
                    : "/assets/images/logo/logo-horizontal-dark.png"
                }
                width={220}
                height={60}
                style={{ width: "auto", height: "60px" }}
                alt="logo"
              />
            </span>
          </Link>
          <button
            className="nav-menu me-0 ms-auto"
            title="Menu"
            type="button"
            aria-label="Menu"
          />
        </div>
      </div>
      <div className="row">
        <div
          className="col-xl-5 d-none d-xl-block vh-100 bg-image-cover bg-no-repeat p-0"
          style={{
            backgroundImage: `url("../assets/images/login-bg.jpg")`,
          }}
        />
        <div className="col-xl-7 vh-100 align-items-center d-flex rounded-3 overflow-hidden bg-white">
          <div className="card login-card me-auto ms-auto border-0 shadow-none">
            <div className="card-body rounded-0 text-left">
              <h2 className="fw-700 display1-size display2-md-size mb-3">
                {t("sign_in_with")} <br />
                {t("your_social_account")}
              </h2>
              <div className="col-sm-12 mt-2 p-0 text-center">
                <div className="form-group mb-1">
                  <button
                    type="button"
                    aria-label="Sign in with Google"
                    title="Sign in with Google"
                    className="form-control style2-input fw-600 bg-twiiter border-0 p-0 text-left text-white "
                    onClick={() => {
                      showLoading();
                      signIn("google", { callbackUrl: "/" });
                    }}
                  >
                    <Image
                      width={40}
                      height={40}
                      src="/assets/images/icon-1.png"
                      alt="icon"
                      className="w40 mb-1 me-5 ms-2"
                    />{" "}
                    {t("sign_in_with_google")}
                  </button>
                </div>
                <div className="form-group mb-1">
                  <button
                    type="button"
                    aria-label="Sign in with Facebook"
                    title="Sign in with Facebook"
                    className="form-control style2-input fw-600 bg-facebook border-0 p-0 text-left text-white "
                    onClick={() => {
                      showLoading();
                      signIn("facebook", { callbackUrl: "/" });
                    }}
                  >
                    <Image
                      src="/assets/images/icon-3.png"
                      alt="icon"
                      width={40}
                      height={40}
                      className="w40 mb-1 me-5 ms-2"
                    />{" "}
                    {t("sign_in_with_facebook")}
                  </button>
                </div>
              </div>
              <div
                onClick={onSignInAsGuestHandler}
                className="text-center mt-3 cursor-pointer"
              >
                Sign in as guest
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

LoginPage.getLayout = function getLayout(page: any) {
  return <div>{page}</div>;
};

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
