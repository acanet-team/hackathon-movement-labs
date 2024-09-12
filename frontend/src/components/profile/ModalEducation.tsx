import React, { useCallback, useEffect, useState, type FC } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "@/styles/modules/modalTemplate.module.scss";
import Button from "react-bootstrap/Button";
import { DatePicker } from "@mui/x-date-pickers";
import ImageUpload from "@/components/ImageUpload";
import dayjs from "dayjs";
import type { FormDtSchool } from "@/api/profile/model";
import { createNewSchool, getFind, updateSchool } from "@/api/profile";
import { throwToast } from "@/utils/throw-toast";
import {
  Autocomplete,
  Box,
  MenuItem,
  Select,
  TextField,
  type SelectChangeEvent,
} from "@mui/material";
import { useFormik } from "formik";
import WaveLoader from "../WaveLoader";
import type { BaseArrayResponse, BaseResponse } from "@/api/model";
import { useTranslations } from "next-intl";

interface ModalEducationProp {
  title: string;
  show: boolean;
  handleClose: () => void;
  isEditing: boolean;
  formDt: FormDtSchool;
  setSchool: React.Dispatch<React.SetStateAction<FormDtSchool[]>>;
}

export const ModalEducation: React.FC<ModalEducationProp> = ({
  handleClose,
  show,
  title,
  isEditing,
  formDt,
  setSchool,
}) => {
  const t = useTranslations("MyProfile");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [formData, setFormData] = useState(formDt);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [education, setEducation] = useState<{ name: string; logo: string }[]>(
    [],
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name)
      newErrors.name = `${t("education")} ${t("name")} ${t("is required")}`;
    if (!formData.degree)
      newErrors.degree = `${t("degree")}  ${t("is required")}`;
    if (!formData.startDate)
      newErrors.startDate = `${t("startDate")} ${t("is required")}`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    },
    [formData],
  );

  const handleRadioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        isGraduated: e.target.value === "true",
      });
    },
    [formData],
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setFormData({
        ...formData,
        degree: event.target.value,
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        degree: "",
      }));
    },
    [formData],
  );

  const findEducation = async (keyword: string) => {
    setIsLoading(true);
    try {
      const res = await getFind("SCHOOL", keyword);
      setEducation(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAddSchool = useCallback(async () => {
    setIsLoading(true);
    try {
      if (validateForm()) {
        const school = {
          name: formData.name,
          logo: formData.logo,
          startDate: new Date(formData.startDate),
          endDate: formData.isGraduated
            ? new Date("")
            : new Date(formData.endDate),
          isGraduated: formData.isGraduated,
          major: formData.major,
          degree: formData.degree,
          description: formData.description,
        };
        const newSchool = {
          education: [school],
        };
        const res: BaseArrayResponse<FormDtSchool> =
          await createNewSchool(newSchool);
        if (res.data) {
          setSchool((prev) => {
            const newEducation: FormDtSchool = res.data[0] as FormDtSchool;
            return [newEducation, ...prev];
          });
        }
        handleClose();
      }
    } catch (error) {
      throwToast("Error creating education", "error");
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const submitEditSchool = useCallback(async () => {
    setIsLoading(true);
    try {
      if (validateForm()) {
        const school = {
          id: formData.id,
          name: formData.name,
          logo: formData.logo,
          startDate: new Date(formData.startDate),
          endDate: formData.isGraduated
            ? new Date("")
            : new Date(formData.endDate),
          isGraduated: formData.isGraduated,
          major: formData.major,
          degree: formData.degree,
          description: formData.description,
        };
        const newSchool = {
          education: [school],
        };
        await updateSchool(newSchool);
        setSchool((prev) =>
          prev.map((edu) => (edu.id === formDt.id ? school : edu)),
        );
        handleClose();
      }
    } catch (error) {
      throwToast("Error creating education", "error");
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
              {t("name")} {t("education")}
            </p>
            <Autocomplete
              inputValue={isEditing ? formData.name : undefined}
              disablePortal
              options={education}
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
                    label="Enter the school name"
                    value={formData.name}
                    onChange={(e) => {
                      findEducation(e.target.value);
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

            <div style={{ width: "100%" }}>
              <div>
                <p className="m-0 py-1 fw-600 font-xs">{t("degree")}</p>
                <Select
                  value={formData.degree}
                  onChange={handleSelectChange}
                  displayEmpty
                  style={{ width: "100%", height: "56px" }}
                >
                  <MenuItem value="" disabled>
                    {t("select")} {t("degree")}
                  </MenuItem>
                  <MenuItem value="INTERMEDIATE">{t("INTERMEDIATE")}</MenuItem>
                  <MenuItem value="ADVANCED">{t("ADVANCED")}</MenuItem>
                  <MenuItem value="ENGINEERING DEGREE">
                    {t("ENGINEERING DEGREE")}
                  </MenuItem>
                  <MenuItem value="BACHELOR's DEGREE">
                    {t("BACHELOR'S DEGREE")}
                  </MenuItem>
                  <MenuItem value="MASTER'S DEGREE">
                    {t("MASTER'S DEGREE")}
                  </MenuItem>
                  <MenuItem value="DOCTOR">{t("DOCTOR")}</MenuItem>
                  <MenuItem value="DEGREE">{t("DEGREE")}</MenuItem>
                  <MenuItem value="PHD">{t("PHD")}</MenuItem>
                  <MenuItem value="OTHER">{t("OTHER")}</MenuItem>
                </Select>
                {errors.degree && (
                  <p className="text-red font-xsss">{errors.degree}</p>
                )}
              </div>
              <div>
                <p className="m-0 py-1 fw-600 font-xs">{t("major")}</p>
                <input
                  className="px-2"
                  style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    height: "56px",
                  }}
                  value={formData.major}
                  onChange={handleChange}
                  name="major"
                  placeholder="Please enter your major name"
                />
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
                <p className="m-0 py-1 fw-600 font-xs">{t("is graduated")}</p>
                <div>
                  <input
                    className="isGraduated"
                    type="radio"
                    name="isGraduated"
                    id="true"
                    value="true"
                    checked={formData.isGraduated === true}
                    onChange={handleRadioChange}
                  />
                  <span className="m-2 py-1">{t("True")}</span>
                </div>
                <div>
                  <input
                    className="isGraduated"
                    type="radio"
                    name="isGraduated"
                    id="false"
                    value="false"
                    checked={formData.isGraduated === false}
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
              }}
            >
              <div
                style={{
                  width: "48.5%",
                }}
              >
                <p className="m-0 py-1 fw-600 font-xs ">{t("start year")}</p>
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
                  views={["year"]}
                />
                {errors.startDate && (
                  <p className="text-red font-xsss">{errors.startDate}</p>
                )}
              </div>
              {!formData.isGraduated && (
                <div style={{ width: "48.5%" }}>
                  <p className="m-0 py-1 fw-600 font-xs">{t("end year")}</p>
                  <DatePicker
                    className="w__100"
                    value={dayjs(formData.endDate)}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        endDate: date ? dayjs(date).format("DD-MM-YYYY") : "",
                      })
                    }
                    views={["year"]}
                  />
                </div>
              )}
            </div>
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
              isEditing ? () => submitEditSchool() : () => submitAddSchool()
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
