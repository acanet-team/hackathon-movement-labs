import React from "react";
import styles from "@/styles/modules/modal.module.scss";
import { useTranslations } from "next-intl";

interface AlertModalProps {
  message: string;
  onCancel: () => void;
  onOk: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, onCancel, onOk }) => {
  const tModal = useTranslations("Modal");
  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <p className="fs-4 mb-4">{message}</p>
        <div className={styles["button-group"]}>
          <button onClick={onCancel} className={styles["cancel-button"]}>
            {tModal("modal_no")}
          </button>
          <button onClick={onOk} className={styles["ok-button"]}>
            {tModal("modal_yes")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AlertModal);
