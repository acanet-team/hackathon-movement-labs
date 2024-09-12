import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import type {
  BrokerProfile,
  InterestTopics,
  Skill,
  User,
} from "@/api/profile/model";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { updateOtherProfile } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import WaveLoader from "../WaveLoader";
import { Autocomplete, TextField } from "@mui/material";
import { getRegionRequest } from "@/api/onboard";
import type { AllProfileResponse } from "@/api/model";
import { useTranslations } from "next-intl";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface ModalEditOtherProps {
  title: string;
  show: boolean;
  handleClose: () => void;
  dataUser: User;
  dataBrokerProfile: BrokerProfile;
  listInterestTopics: InterestTopics[];
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  setInterestTopics: React.Dispatch<React.SetStateAction<InterestTopics[]>>;
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const ModalEditOtherInfo: React.FC<ModalEditOtherProps> = ({
  show,
  handleClose,
  title,
  dataUser,
  dataBrokerProfile,
  listInterestTopics,
  setLocation,
  setInterestTopics,
  setSkills,
}) => {
  const t = useTranslations("MyProfile");
  const [formData, setFormData] = useState({
    location: dataBrokerProfile.location || "",
    selectedServiceIds: dataBrokerProfile.skills.map(
      (skill) => skill.interestTopic.id,
    ),
    selectedTopicIds: dataBrokerProfile.interestTopics.map((topic) => topic.id),
  });

  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChangeSelectTopic = (event: SelectChangeEvent<string[]>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedTopicIds: event.target.value as string[],
    }));
  };

  const handleChangeSelectService = (event: SelectChangeEvent<string[]>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedServiceIds: event.target.value as string[],
    }));
  };

  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    const getRegions = async () => {
      try {
        const response = await getRegionRequest();
        const regions = response.data.value.map((obj) => obj.name);
        setRegions(regions);
        return response;
      } catch (err) {
        console.log(err);
        return {
          status: 500,
          message: "can't fetch regions",
          data: { key: "regions", value: [], type: "json" },
        };
      }
    };
    getRegions();
  }, []);

  const submitOtherInfo = async () => {
    setIsLoading(true);
    try {
      const formDt = new FormData();
      formDt.append("interestTopicIds", formData.selectedTopicIds.join(","));
      if (formData.selectedServiceIds || formData.location) {
        const brokerProfies = {
          skills: formData.selectedServiceIds,
          location: formData.location,
        };
        formDt.append("brokerProfile", JSON.stringify(brokerProfies));
      }
      const res: AllProfileResponse = await updateOtherProfile(formDt);
      setLocation(formData.location);
      setInterestTopics(
        formData.selectedTopicIds
          .map((id) => listInterestTopics.find((topic) => topic.id === id))
          .filter((topic) => topic !== undefined),
      );
      if (res?.data?.brokerProfile) {
        setSkills(res.data.brokerProfile.skills);
      }
      console.log("kkkkkk", res);
      throwToast("Updated successfully", "success");
      handleClose();
    } catch (error) {
      throwToast("Error updating", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
          <Modal.Title>
            <h1 className="m-0 fw-bold">{title}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles["modal-content"]}>
          <form className="p-1">
            <p className="m-0 py-1 fw-600 font-xs">{t("interestTopic")}</p>
            <FormControl className="w-100">
              <Select
                multiple
                displayEmpty
                value={formData.selectedTopicIds}
                onChange={handleChangeSelectTopic}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return (
                      <em>
                        {t("select")} {t("interestTopic")}
                      </em>
                    );
                  }
                  return selected
                    .map(
                      (id) =>
                        listInterestTopics.find((topic) => topic.id === id)
                          ?.topicName,
                    )
                    .filter((name) => name !== undefined)
                    .join(", ");
                }}
                MenuProps={MenuProps}
              >
                {listInterestTopics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.topicName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <p className="m-0 py-1 fw-600 font-xs">{t("servicesOffer")}</p>
            <FormControl className="w-100">
              <Select
                multiple
                displayEmpty
                value={formData.selectedServiceIds}
                onChange={handleChangeSelectService}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return (
                      <em>
                        {t("select")} {t("servicesOffer")}
                      </em>
                    );
                  }
                  return selected
                    .map(
                      (id) =>
                        listInterestTopics.find((topic) => topic.id === id)
                          ?.topicName,
                    )
                    .filter((name) => name !== undefined)
                    .join(", ");
                }}
                MenuProps={MenuProps}
              >
                {listInterestTopics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.topicName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <p className="m-0 py-1 fw-600 font-xs">{t("location")}</p>
            <Autocomplete
              disablePortal
              options={regions}
              className="w-100"
              freeSolo
              value={formData.location}
              onChange={(event, newValue) => {
                setFormData((prev) => ({ ...prev, location: newValue }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter the location"
                  value={formData.location}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }));
                  }}
                />
              )}
            />
            <p className="m-0 py-1 fw-600 font-xs">{t("Email")}</p>
            <input
              className="px-2"
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                height: "56px",
              }}
              value={dataUser.email}
              name="email"
              disabled
            />
          </form>
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}>
          <Button
            variant="primary"
            onClick={submitOtherInfo}
            className="main-btn bg-current text-center text-white fw-600 rounded-xxl p-3 w175 border-0 my-3 mx-auto"
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading && <WaveLoader />}
    </>
  );
};

export default ModalEditOtherInfo;
