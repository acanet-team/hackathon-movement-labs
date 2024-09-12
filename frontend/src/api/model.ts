import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { IHttpOptions } from "./index";
import { IUser } from "./onboard/model";
import type { IBrokers } from "./newsfeed/model";
import type { BrokerProfile, SSI, User, UserProfile } from "./profile/model";

export type RequestConfig = AxiosRequestConfig & {
  isHandleError?: boolean; // is request need auto handle error or not?

  requestId?: string; // requestId passing to manual cancel request

  headers?: Record<string, string>; // some customHeaders

  isKeepRequest?: boolean; // is not auto cancel request after timeout?

  useShopToken?: boolean;
};

export type ApiErrorResponse<T> = AxiosResponse<T> & { message: string };

export type ApiRequestParams = {
  method: Method;
  config: RequestConfig;
};

// export type GetRequestParams = {
//   url: string;
//   params?: unknown;
//   config?: RequestConfig;
// };

// export type PostRequestParams = {
//   url: string;
//   body?: unknown;
//   options?: RequestConfig;
// };

export type GetRequestParams<T> = {
  url: string;
  params?: T;
  options?: Omit<IHttpOptions, "url" | "method" | "body" | "contentType">;
};

export type PostRequestParams<T> = {
  url: string;
  body?: T;
  options?: Omit<IHttpOptions, "url" | "method" | "body">;
};

export type CreateProfileParams = {
  nickName: string;
  region: string;
  email: string;
};

export type subcribeTopicsParam<T> = {
  interestTopicIds: T;
  isOnboarding: boolean;
};

export type BaseResponse<T> = {
  status: number;
  success?: boolean;
  message: string;
  data: T;
};
export type BaseArrayResponse<T> = {
  status: number;
  success?: boolean;
  message: string;
  data: T[];
};

export type BaseApiResponse<T> = Promise<T>;

export type AllBrokersResponse<T> = {
  code: number;
  message: string;
  success: boolean;
  data: {
    docs?: IBrokers[];
    data?: IBrokers[];
    meta: {
      page: number;
      totalPage: number;
    };
  };
};

export type topicsResponse = {
  data: [{ id: string; topicName: string }];
};

export type Regions = {
  status: number;
  message: string;
  data: {
    key: string;
    value: [
      {
        code: string;
        name: string;
      },
    ];
    type: string;
  };
};

export type AllProfileResponse = {
  status: number;
  message: string;
  data: {
    user: User;
    userProfile: UserProfile;
    brokerProfile: BrokerProfile;
    followersCount: number;
    followingsCount: number;
    ssi?: SSI[];
    // rating: string;
    // coursesEnrolledCount: string;
    followed: boolean;
  };
};

export type AllFindResponse = {
  status: number;
  message: string;
  data: [{ name: string; logo: string }];
};
export type shortDescParams = {
  about: string;
};
export type topicParam = {
  brokerProfile: {
    location: string;
    skills: string[];
  };
  interestTopics: string[];
};

export interface UpdateOtherProfileParams {
  brokerProfile: BrokerProfile;
  interestTopics: string[];
}
export type socialMediaParams = {
  socialMedia: {
    name: string;
    mediaUrl: string;
  }[];
};
export type experienceParams = {
  company: {
    id?: string | undefined;
    logo: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isWorking: boolean;
    position: string;
    location: string;
    description: string;
    workingType: string;
  }[];
};
export type educationParams = {
  education: {
    id?: string | undefined;
    name: string;
    logo: string;
    startDate: Date;
    endDate: Date;
    isGraduated: boolean;
    major: string;
    degree: string;
    description: string;
  }[];
};
export type licenseParams = {
  licenses: {
    id?: string | undefined;
    logo: string;
    licenseType: string;
    licenseIssuer: string;
    licenseState: string;
    licenseIssueDate: Date;
    licenseStatus: string;
    licenseExpirationDate: Date;
    credentialID: string;
  }[];
};
export interface Meta {
  page: number;
  take: number;
  total: number;
  totalPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
