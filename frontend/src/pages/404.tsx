import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Header from "@/components/Header";
import Popupchat from "@/components/Popupchat";
import Appfooter from "@/components/Appfooter";

const Custom404 = () => {
  const tError = useTranslations("Error");
  const tMenu = useTranslations("NavBar");
  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: "150px" }}
      >
        <Image
          src="/assets/images/404.png"
          width={200}
          height={200}
          alt="not found"
        />
        <h1 className="text-center text-grey-600 font-xs mt-3">
          {/* {tError("not_found")} */}
          The page you are looking for isn&apos;t available.
        </h1>
        <Link
          href="/"
          className="main-btn text-white text-center mt-3"
          style={{ width: "200px" }}
        >
          {/* {tMenu("home_page")} */}
          Home Page
        </Link>
      </div>
    </>
  );
};

export default Custom404;

Custom404.getLayout = function getLayout(page: any) {
  return (
    <>
      <Header isOnboarding={true} />
      {page}
      <Popupchat />
      <Appfooter />
    </>
  );
};
