export type IMe = {
  user: IUserInfo;
  userProfile?: UserProfile;
  brokerProfile?: BrokerProfile;
  referBy?: IUserInfo;
};

export type IUser = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
  isBroker: boolean;
  isProfile: boolean;
  socialId: string;
  photoUrl: string;
  brokerProfileId: string;
  followersCount: number;
  followingsCount: number;
  rating: number;
  coursesEnrolledCount: number;
  role: Role;
  rank: string;
  followed: boolean;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type ICommunityForm = {
  name: string;
  description: string;
  hasFee: boolean;
  feeNum: number;
};

type BrokerProfile = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: IUser;
  schoolName: string[];
  companyName: string[];
  socialMedia: string[];
};

type UserProfile = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: IUser;
  nickName: string;
  birthDate: string;
  gender: string;
  location: string;
  shortDesc: string;
  additionalData: AdditionalData;
  brokerProfile: AdditionalData;
};

type AdditionalData = {};

export type Role = {
  id: number;
  name: string;
};

export type Status = {
  id: number;
  name: string;
};

export type Photo = {
  id: string;
  path: string;
  mimetype: string;
  isPublic: boolean;
  isDeleted: boolean;
  ownerId: number;
  courseId: number;
  category: string;
};
export type IUserInfo = {
  id: number | null;
  email: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  photo: Photo;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isBroker: boolean;
  isProfile: boolean;
  image?: string;
};
export type IUserSession = {
  user?: IUserInfo;
  expires: string;
  token: string;
};

export type ResponseDto<T> = {
  status: number;
  message: string;
  data: {
    data?: T[];
    docs?: T[];
    meta: {
      page: number;
      take: number;
      total: number;
      totalPage: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
};

export type Post = {
  id: string;
  content: string;
  favoriteCount: number;
  commentCount: number;
  assets: Photo[];
  createBy: IUserInfo;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};
