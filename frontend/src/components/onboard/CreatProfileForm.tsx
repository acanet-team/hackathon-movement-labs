import type { IUser } from "@/api/auth/auth.model";
import { createProfileRequest } from "@/api/onboard";
import { useLoading } from "@/context/Loading/context";
import styles from "@/styles/modules/createProfile.module.scss";
import { FormControl, FormHelperText } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { throwToast } from "@/utils/throw-toast";
import { useTranslations } from "next-intl";

export default function CreateProfileForm(props: {
  regions: any[];
  onNext: () => void;
}) {
  const { data: session, update: updateSession } = useSession();
  const { showLoading, hideLoading } = useLoading();
  const [userInfo, setUserInfo] = useState<IUser>({} as IUser);
  const t = useTranslations("CreateProfile");
  const tOnboard = useTranslations("Onboard");

  useEffect(() => {
    if (session) {
      setUserInfo({
        ...session.user,
        fullName: `${session?.user?.lastName} ${session?.user?.firstName}`,
        avatar: session.user.photo?.path || "/assets/images/user.png",
      });
    }
  }, [session]);

  const errorFieldMap: { [key: string]: string } = {
    ER1018: "nickName",
    ER3013: "isBroker",
    ER1010: "nickName",
  };

  const formik = useFormik({
    initialValues: {
      nickName: userInfo.nickName,
      location: userInfo.location,
      isBroker: userInfo.isBroker,
      email: userInfo.email,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      nickName: Yup.string()
        .required(t("error_missing_nickname"))
        .min(8, () => t("error_invalid_nickname"))
        .max(20, () => t("error_invalid_nickname")),
      location: Yup.string().required(t("error_location")),
      isBroker: Yup.bool().required(t("error_user_type")),
      email: Yup.string()
        .required(t("error_missing_email"))
        .email(t("error_invalid_email")),
    }),
    onSubmit: async (values, { setFieldError }) => {
      const profileValues = {
        nickName: values.nickName?.toLowerCase().trim(),
        location: values.location?.toLowerCase().trim(),
        email: values.email?.toLowerCase().trim(),
        isBroker: values.isBroker === true ? true : false,
        isOnboarding: true,
      };

      try {
        showLoading();
        await createProfileRequest(profileValues);
        const successMessage = "Your profile has been updated.";
        throwToast(successMessage, "success");
        // Save data in auth store
        // updateProfile(values);
        // Continue the onboarding process
        localStorage.setItem("onboarding_step", "create_profile");
        props.onNext();
      } catch (err) {
        const errorCode = err.code || err.statusCode;
        const errorMsg = err.message || "Something goes wrong.";
        const field = errorFieldMap[errorCode];
        if (field) {
          setFieldError(field, errorMsg);
          throwToast(errorMsg, "error");
        }
      } finally {
        hideLoading();
      }
    },
  });

  return (
    <>
      <div className="card-body p-lg-5 p-4 w-100 border-0 ">
        <div className="row justify-content-center">
          <div className="col-lg-4 text-center">
            <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
              <Image
                src={userInfo.avatar}
                width={50}
                height={50}
                objectFit="cover"
                alt="avatar"
                className="shadow-sm rounded-circle"
              />
            </figure>
            <h2 className="fw-700 font-sm text-grey-900 mt-3">
              {userInfo.fullName}
            </h2>
            {/* <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4">
              Brooklyn
            </h4> */}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <label className="fw-600 mb-1" htmlFor="nickName">
            Nickname
          </label>
          <input
            className={`${formik.touched.nickName && formik.errors.nickName ? " border-danger" : ""} form-control`}
            name="nickName"
            id="nickName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nickName}
          />
          {formik.touched.nickName && formik.errors.nickName ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {formik.errors.nickName}
            </FormHelperText>
          ) : null}

          {/* eslint-disable-next-line */}
          <label className="fw-600 mt-3 mb-1">{t('region')}</label>
          <FormControl
            fullWidth
            id="location"
            error={formik.touched.location && Boolean(formik.errors.location)}
          >
            <Autocomplete
              id="location"
              options={props.regions}
              value={formik.values.location}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement>,
                newValue: string | null,
              ) => formik.setFieldValue("location", newValue)}
              onBlur={formik.handleBlur}
              sx={{
                "& fieldset": {
                  border: "2px #eee solid",
                  borderRadius: "5px",
                },
                "& .MuiOutlinedInput-root": {
                  padding: 0,
                },
                "& .MuiInputBase-input": {
                  padding: "6px 12px !important",
                  fontSize: "16px",
                  color: "rgba(17, 17, 17, 0.7843137255)",
                  height: "50px",
                  boxSizing: "border-box",
                },
                "& .MuiSelect-icon": {
                  color: "#ddd",
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={
                    formik.touched.location && Boolean(formik.errors.location)
                  }
                />
              )}
            />

            {formik.touched.location && (
              <FormHelperText sx={{ color: "error.main", marginLeft: "0" }}>
                {formik.errors.location}
              </FormHelperText>
            )}
          </FormControl>

          {/* eslint-disable-next-line */}
          <label className="fw-600 mt-3 mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            className={`${formik.touched.email && formik.errors.email ? " border-danger" : ""} form-control`}
            name="email"
            id="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {formik.errors.email}
            </FormHelperText>
          ) : null}

          {/* eslint-disable-next-line */}
          <label className="fw-600 mt-3 mb-3">{t("user_type")}</label>
          <div
            id={styles["profile-radio"]}
            className="profile-radio-btn mx-auto"
          >
            <div className="w-100">
              <input
                type="radio"
                name="isBroker"
                id="investor"
                value="false"
                defaultChecked
                onChange={(e) => formik.setFieldValue("isBroker", false)}
              />
              <label htmlFor="investor">
                <i className="bi bi-person h2 m-0"></i>
                {t("investor")}
              </label>
            </div>
            <div className="w-100">
              <input
                type="radio"
                name="isBroker"
                id="broker"
                value="true"
                onChange={(e) => formik.setFieldValue("isBroker", true)}
              />
              <label htmlFor="broker">
                <i className="bi bi-person-check h2 m-0"></i>
                {t("broker")}
              </label>
            </div>
          </div>
          {formik.errors.isBroker ? (
            <FormHelperText sx={{ color: "error.main" }}>
              {JSON.stringify(formik.errors.isBroker).replace(/^"|"$/g, "")}
            </FormHelperText>
          ) : null}

          <button
            type="submit"
            id={styles["profile-btn"]}
            className="main-btn bg-current text-center text-white fw-600 p-3 w175 border-0 d-inline-block mt-5"
          >
            {tOnboard("continue")}
          </button>
        </form>
      </div>
    </>
  );
}
