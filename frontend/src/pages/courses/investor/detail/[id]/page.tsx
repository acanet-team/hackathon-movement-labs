import DetailCourse from "@/components/course/DetailCourse";
import React, { Fragment } from "react";

export default function Detail({ params }: { params: { id: number } }) {
  return (
    <Fragment>
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <DetailCourse id={params.id} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
