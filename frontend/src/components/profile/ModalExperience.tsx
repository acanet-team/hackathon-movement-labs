import React, { useCallback, useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import {
  Select,
  MenuItem,
  type SelectChangeEvent,
  Autocomplete,
  TextField,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import type { BrokerProfile, FormDtCompany } from "@/api/profile/model";
import dayjs from "dayjs";
import {
  createNewExperiences,
  updateExperiences,
  getFind,
} from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import WaveLoader from "../WaveLoader";
import type { BaseArrayResponse } from "@/api/model";
import { useTranslations } from "next-intl";

interface ModalExperienceProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  isEditing: boolean;
  dataBrokerProfile: BrokerProfile;
  formDt: FormDtCompany;
  setCompany: React.Dispatch<React.SetStateAction<FormDtCompany[]>>;
  idUser: string;
}

export const ModalExperience: FC<ModalExperienceProp> = ({
  handleClose,
  isEditing,
  show,
  title,
  formDt,
  setCompany,
}) => {
  const [formData, setFormData] = useState(formDt);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const t = useTranslations("MyProfile");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [experience, setExperience] = useState<
    { name: string; logo: string }[]
  >([]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    },
    [formData],
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setFormData({
        ...formData,
        workingType: value,
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        workingType: "",
      }));
    },
    [formData],
  );

  const handleRadioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        isWorking: e.target.value === "true",
      });
    },
    [formData],
  );

  const [fullscreen, setFullscreen] = useState(
    window.innerWidth <= 768 ? "sm-down" : undefined,
  );

  useEffect(() => {
    const handleResize = () => {
      setFullscreen(window.innerWidth <= 768 ? "sm-down" : undefined);
    };

    if (window) {
      window.addEventListener("resize", handleResize);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const findCompany = async (keyword: string) => {
    setIsLoading(true);
    try {
      const res = await getFind("COMPANY", keyword);
      setExperience(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name)
      newErrors.name = `${t("company")} ${t("name")} ${t("is required")}`;
    if (!formData.workingType)
      newErrors.workingType = `${t("working type")}  ${t("is required")}`;
    if (!formData.startDate)
      newErrors.startDate = `${t("startDate")}  ${t("is required")}`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitAddExperience = useCallback(async () => {
    setIsLoading(true);
    try {
      if (validateForm()) {
        const experience = {
          logo: formData.logo,
          name: formData.name,
          startDate: new Date(formData.startDate),
          endDate: formData.isWorking
            ? new Date("")
            : new Date(formData.endDate),
          isWorking: formData.isWorking,
          position: formData.position,
          location: formData.location,
          description: formData.description,
          workingType: formData.workingType,
        };
        const newExperience = {
          company: [experience],
        };

        const res: BaseArrayResponse<FormDtCompany> =
          await createNewExperiences(newExperience);
        if (res.data) {
          setCompany((prevCompanies) => {
            const newExperience: FormDtCompany = res.data[0] as FormDtCompany;
            return [newExperience, ...prevCompanies];
          });
        }
        handleClose();
      }
    } catch (error) {
      throwToast("Error creating experience", "error");
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const submitEditExperience = useCallback(async () => {
    setIsLoading(true);
    try {
      if (validateForm()) {
        const experience = {
          id: formData.id,
          logo: formData.logo,
          name: formData.name,
          startDate: new Date(formData.startDate),
          endDate: formData.isWorking
            ? new Date("")
            : new Date(formData.endDate),
          isWorking: formData.isWorking,
          position: formData.position,
          location: formData.location,
          description: formData.description,
          workingType: formData.workingType,
        };
        const newExperience = {
          company: [experience],
        };

        await updateExperiences(newExperience);
        setCompany((prevCompanies) =>
          prevCompanies.map((comp) =>
            comp.id === formData.id ? experience : comp,
          ),
        );
        handleClose();
      }
    } catch (error) {
      throwToast("Error updating experience", "error");
    } finally {
      setIsLoading(false);
    }
  }, [formData]);
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
            <p className="m-0 py-1 fw-600 font-xs">
              {t("name")} {t("company")}{" "}
            </p>
            <Autocomplete
              inputValue={isEditing ? formData.name : undefined}
              disablePortal
              options={experience}
              className="w-100"
              getOptionLabel={(option) => {
                if (typeof option === "object" && "name" in option) {
                  return option.name;
                }
                return "";
              }}
              freeSolo
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setFormData({
                    ...formData,
                    name: newValue,
                    logo: "",
                  });
                } else if (newValue) {
                  setFormData({
                    ...formData,
                    name: newValue.name || "",
                    logo: newValue.logo || "",
                  });
                }
              }}
              onInputChange={(event, newInputValue) => {
                setFormData({
                  ...formData,
                  name: newInputValue,
                  logo: "",
                });
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    <img loading="lazy" width="20" src={option.logo} alt="" />
                    {option.name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <>
                  <TextField
                    {...params}
                    label="Enter the company name"
                    value={formData.name}
                    onChange={(e) => {
                      findCompany(e.target.value);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: "",
                      }));
                    }}
                  />
                </>
              )}
            />
            {errors.name && <p className="text-red font-xsss">{errors.name}</p>}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
              }}
            >
              <div style={{ width: "100%" }}>
                <p className="m-0 py-1 fw-600 font-xs">{t("job title")}</p>
                <input
                  className="px-2"
                  style={{
                    minWidth: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "56px",
                  }}
                  value={formData.position}
                  name="position"
                  onChange={handleChange}
                  placeholder="Please enter your industry name"
                />
              </div>
              <div style={{ width: "100%" }}>
                <p className="m-0 py-1 fw-600 font-xs">{t("working type")}</p>
                <Select
                  value={formData.workingType}
                  onChange={handleSelectChange}
                  displayEmpty
                  style={{ height: "56px", width: "100%" }}
                >
                  <MenuItem value="" disabled>
                    {t("select")} {t("working type")}
                  </MenuItem>
                  <MenuItem value="FULL_TIME">Full-Time</MenuItem>
                  <MenuItem value="PART_TIME">Part-Time</MenuItem>
                  <MenuItem value="CASUAL">Casual</MenuItem>
                  <MenuItem value="CONTRACT">Contractor</MenuItem>
                  <MenuItem value="SELF-EMPLOYED">Self-employed</MenuItem>
                </Select>
                {errors.workingType && (
                  <p className="text-red font-xsss">{errors.workingType}</p>
                )}
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <p className="m-0 py-1 fw-600 font-xs">{t("is working")}</p>
                <div>
                  <input
                    className=""
                    type="radio"
                    name="isWorking"
                    id="true"
                    value="true"
                    checked={formData.isWorking === true}
                    onChange={handleRadioChange}
                  />
                  <span className="m-2 py-1">{t("True")}</span>
                </div>
                <div>
                  <input
                    className="py-1"
                    type="radio"
                    name="isWorking"
                    id="false"
                    value="false"
                    checked={formData.isWorking === false}
                    onChange={handleRadioChange}
                  />
                  <span className="m-2">{t("False")}</span>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div
                style={{
                  width: "48.6%",
                }}
              >
                <p className="m-0 py-1 fw-600 font-xs">{t("startDate")}</p>
                <DatePicker
                  className="w__100"
                  value={dayjs(formData.startDate)}
                  onChange={(date) => {
                    const formattedDate = date ? dayjs(date).toISOString() : "";
                    setFormData({
                      ...formData,
                      startDate: formattedDate,
                    });
                    if (formattedDate) {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        startDate: "",
                      }));
                    }
                  }}
                  views={["day", "month", "year"]}
                />
                {errors.startDate && (
                  <p className="text-red font-xsss">{errors.startDate}</p>
                )}
              </div>
              {!formData.isWorking && (
                <div style={{ width: "48.6%" }}>
                  <p className="m-0 py-1 fw-600 font-xs">{t("endDate")}</p>
                  <DatePicker
                    className="w__100"
                    value={dayjs(formData.endDate)}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        endDate: date ? dayjs(date).format("DD-MM-YYYY") : "",
                      })
                    }
                    views={["day", "month", "year"]}
                  />
                </div>
              )}
            </div>
            <p className="m-0 py-1 fw-600 font-xs">{t("location")}</p>
            <input
              className="px-2"
              style={{
                width: "100%",
                height: "56px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              value={formData.location}
              name="location"
              onChange={handleChange}
              placeholder="Please enter your location"
            />

            <p className="m-0 py-1 fw-600 font-xs">{t("description")}</p>
            <textarea
              className="px-2"
              value={formData.description}
              name="description"
              onChange={handleChange}
              placeholder="Please enter your description"
              maxLength={1000}
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                height: "100px",
              }}
            />
          </form>
        </Modal.Body>
        <Modal.Footer className={styles["modal-footer"]}>
          <Button
            variant="primary"
            onClick={
              // () => console.log(formData)
              isEditing
                ? () => submitEditExperience()
                : () => submitAddExperience()
              // () => findCompany()
            }
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
