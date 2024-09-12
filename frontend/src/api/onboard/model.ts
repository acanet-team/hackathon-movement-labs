export interface IMe {
  user: IUserInfo;
  userProfile?: UserProfile;
  brokerProfile?: BrokerProfile;
  referBy?: IUserInfo;
}

export interface IUser {
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
}

interface BrokerProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: IUser;
  schoolName: string[];
  companyName: string[];
  socialMedia: string[];
}

interface UserProfile {
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
}

interface AdditionalData {}

export interface Role {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface Photo {
  id: string;
  path: string;
  mimetype: string;
  isPublic: boolean;
  isDeleted: boolean;
  ownerId: number;
  courseId: number;
  category: string;
}
export interface IUserInfo {
  id: number | null;
  userId: number;
  email: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  photo: Photo;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isBroker: boolean;
  isProfile: boolean;
  image?: string;
  wallet_address: string | null;
}
export interface IUserSession {
  user?: IUserInfo;
  expires: string;
  token: string;
}
