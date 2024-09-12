import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/donateModal.module.scss";
import { useTranslations } from "next-intl";
import { FormHelperText, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

function DonateModal(props: { show: boolean; handleClose: () => void }) {
  const { show, handleClose } = props;
  const t = useTranslations("MyProfile");
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  useEffect(() => {
    const handleResize = () => {
      if (window) {
        setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (window) {
        return window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const validationSchema = Yup.object({
    amount: Yup.number()
      .required(t("donate_amount_missing"))
      .transform((originalValue, transformedValue) => {
        // Convert string to number before validation
        const numValue = Number(originalValue);
        return isNaN(numValue) ? 0 : numValue;
      })
      .min(0.01, t("donate_amount_missing")),
  });

  const formik = useFormik({
    initialValues: {
      amount: null,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      console.log("value", values.amount);
    },
  });

  return (
    <Modal
      id={styles["wallet-modal"]}
      fullscreen={fullscreen}
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      className={`${styles["customModal"]} nunito-font`}
    >
      <Modal.Header
        closeButton={fullscreen === "sm-down" ? false : true}
        className={styles["modal-header"]}
      >
        {fullscreen && (
          <i
            className={`${styles["modal-back__btn"]} bi bi-arrow-left h1 m-0`}
            onClick={handleClose}
          ></i>
        )}
        <i className="bi bi-wallet-fill h3 m-0 me-2"></i>
        <span className="fs-3 fw-bold">{t("donate_amount")}</span>
      </Modal.Header>
      <Modal.Body className={styles["modal-content"]}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            type="number"
            value={formik.values.amount}
            inputProps={{
              step: "0.01",
            }}
            placeholder={t("donate_input")}
            onBlur={(e) =>
              formik.setFieldValue(
                "amount",
                Number(Number(e.target.value).toFixed(2)),
              )
            }
            // onChange={(e) => formik.setFieldValue("feeNum", e.target.value)}
            onChange={(e) =>
              formik.setFieldValue("amount", Number(e.target.value))
            }
            InputProps={{
              style: {
                borderRadius: "5px",
              },
              className: `${formik.touched.amount && formik.errors.amount ? "border-danger" : ""}`,
            }}
            sx={{
              fieldset: { border: "2px solid rgb(241, 241, 241)" },
              width: "100%",
            }}
          />
          {formik.errors.amount ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {JSON.stringify(formik.errors.amount).replace(/^"|"$/g, "")}
            </FormHelperText>
          ) : null}
          <Modal.Footer className={styles["modal-footer"]}>
            <button
              type="submit"
              className="main-btn bg-current text-center text-white fw-600 rounded-3 p-3 w150 border-0 my-3 ms-auto"
            >
              Save
            </button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default DonateModal;
