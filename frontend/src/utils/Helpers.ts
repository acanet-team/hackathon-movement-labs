import { AppConfig } from "./AppConfig";

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === AppConfig.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};

export const removePropertiesEmpty = (object: any) => {
  const objectToProcess = { ...object };
  for (const key of Object.keys(objectToProcess)) {
    if (objectToProcess[key] === "") {
      delete objectToProcess[key];
    }
  }
  return objectToProcess;
};

export const cleanPath = (path: string) => {
  if (path.includes("https://lh3.googleusercontent.com")) {
    return path.replace("https://acanet-v1-public-test.s3.amazonaws.com/", "");
  } else if (path.includes("platform-lookaside.fbsbx.com")) {
    return "/assets/images/user.png";
  } else {
    return path;
  }
};
