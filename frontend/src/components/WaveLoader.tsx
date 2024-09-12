import React from "react";
import styles from "@/styles/modules/waveLoader.module.scss";

export default function DotLoad() {
  return (
    <div
      className="card w-100 text-center shadow-xss rounded-3 border-0 p-4 my-4"
      id={styles.load}
    >
      <div className="snippet my-2 ms-auto me-auto" data-title=".dot-typing">
        <div className="stage">
          <div className="dot-typing"></div>
        </div>
      </div>
    </div>
  );
}
