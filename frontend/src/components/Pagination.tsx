import React from "react";
import styles from "@/styles/modules/paginatiton.module.scss";
import classes from "@/styles/modules/paginationTable.module.scss";
import { isTable } from "drizzle-orm";

export default function Pagination(props: {
  pageUpdateFn: any;
  page: number;
  totalPage: number;
  isTable: boolean;
}) {
  const { pageUpdateFn, page, totalPage, isTable } = { ...props };

  const maxPagesToShow = 5;
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPage, page + Math.floor(maxPagesToShow / 2));

  // Adjust if the total number of pages to show is less than maxPagesToShow
  if (endPage - startPage + 1 < maxPagesToShow) {
    if (startPage === 1) {
      endPage = Math.min(totalPage, startPage + maxPagesToShow - 1);
    } else if (endPage === totalPage) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  const onChoosePageHandler = (page: number) => {
    if (page >= 1 && page <= props.totalPage) {
      pageUpdateFn(page);
    }
  };
  const onNextPageHandler = () => {
    if (page < totalPage) {
      pageUpdateFn(page + 1);
    }
  };
  const onLastPageHandler = () => {
    pageUpdateFn(props.totalPage);
  };
  const onFirstPageHandler = () => {
    pageUpdateFn(1);
  };
  const onPrevPageHandler = () => {
    if (page > 1) {
      pageUpdateFn(page - 1);
    }
  };

  return (
    <div className="mt-5">
      <ul className={isTable ? classes["table-pagination"] : styles.pagination}>
        <button
          disabled={totalPage === 1 || page === 1 ? true : false}
          onClick={onFirstPageHandler}
        >
          «
        </button>
        <button
          disabled={totalPage === 1 || page === 1 ? true : false}
          onClick={onPrevPageHandler}
        >
          ‹
        </button>
        {pages.map((pageNumber) => (
          <li
            key={pageNumber}
            className={pageNumber === page ? "selected" : ""}
            onClick={() => onChoosePageHandler(pageNumber)}
          >
            {pageNumber}
          </li>
        ))}
        <button
          disabled={totalPage === 1 || page === totalPage ? true : false}
          onClick={onNextPageHandler}
        >
          ›
        </button>
        <button
          disabled={totalPage === 1 || page === totalPage ? true : false}
          onClick={onLastPageHandler}
        >
          »
        </button>
      </ul>
    </div>
  );
}
