import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";

function ModalTemplate(props: {
  show: boolean;
  handleClose: () => void;
  handleShow: () => void;
}) {
  const { show, handleClose, handleShow } = props;
  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Modal
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
      </Modal.Header>
      <Modal.Body className={styles["modal-content"]}>
        {/* Content */}
      </Modal.Body>
      <Modal.Footer className={styles["modal-footer"]}>
        <Button
          variant="primary"
          onClick={handleClose}
          className="main-btn bg-current text-center text-white fw-600 rounded-3 p-3 w175 border-0 my-3 mx-auto"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalTemplate;
