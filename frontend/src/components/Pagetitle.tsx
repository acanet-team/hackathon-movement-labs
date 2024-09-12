import React from "react";
import styles from "@/styles/modules/pageTitle.module.scss";
import Link from "next/link";

export default function Pagetitle(props: {
  title: string;
  intro: string;
  isSearch: boolean;
}) {
  // const t = useTranslations('BrokerList');
  return (
    <div id={styles["header-title"]} className="card w-100 border-0">
      <h2 className="fw-700 mb-2 mt-0 font-md fs-1 text-grey-900 d-flex align-items-center">
        <div
          className={`page-title fs-1 text-white fw-800 ${styles["page-title"]}`}
        >
          {props.title}
        </div>
        {props.isSearch && (
          <div>
            <form action="#" className="pt-0 pb-0 ms-auto">
              <div className="search-form-2 ms-2">
                <i className="ti-search font-xss"></i>
                <input
                  type="text"
                  className={`${styles["page-title__search"]} form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0`}
                  placeholder="Search here."
                />
              </div>
            </form>
            <Link
              href="/"
              className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"
            >
              <i className="feather-filter font-xss text-grey-500"></i>
            </Link>
          </div>
        )}
      </h2>
      <div className={`page-intro ${styles["page-intro"]}`}>{props.intro}</div>
    </div>
  );
}
