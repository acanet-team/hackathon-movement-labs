export interface User {
  id: number;
  email: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  photo: {
    id: string;
    path: string;
    mimetype: string;
    isPublic: boolean;
    isDeleted: boolean;
    ownerId: number;
    courseId: number;
    category: string;
    post_id: string;
  };
  profileCoverPhoto: {
    id: string;
    path: string;
    mimetype: string;
    isPublic: boolean;
    isDeleted: boolean;
    ownerId: number;
    courseId: number;
    category: string;
    post_id: string;
  };
  role: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  onboarding_data: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isFirstLogin: boolean;
  isBroker: boolean;
  referBy: string;
  refCode: string;
  phone: string;
  userInterestTopicRelations: string[];
  whiteList: {};
  wallet_address: string | null;
}

export interface UserProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: User;
  nickName: string;
  birthDate: string;
  gender: string;
  location: string;
  shortDesc: string;
  additionalData: {};
  brokerProfile: BrokerProfile | null;
}

export interface BrokerProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: User;
  school: School[];
  rank: {
    id: string;
    name: string;
  };
  licenses: License[];
  company: Company[];
  socialMedia: SocialMedia[];
  skills: Skill[];
  servicesOffer: Service[];
  summary: string | null;
  location: string | null;
  about: string;
  interestTopics: InterestTopics[];
}

export interface School {
  id: string;
  logo: string;
  name: string;
  startDate: string;
  endDate: string;
  isGraduated: boolean;
  major: string;
  location: string;
  description: string;
  degree: string;
}

export interface License {
  id: string;
  credentialID: string;
  logo: string;
  licenseType: string;
  licenseState: string;
  licenseIssuer: string;
  licenseStatus: string;
  licenseIssueDate: string;
  licenseExpirationDate: string;
  shortDesc: string;
  additionalData: {};
}

export interface Company {
  id: string;
  logo: string;
  name: string;
  startDate: string;
  endDate: string;
  isWorking: boolean;
  position: string;
  location: string;
  description: string;
  workingType: string;
}

export interface SocialMedia {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  name: string;
  mediaUrl: string;
}

export interface Skill {
  id: string;
  interestTopic: InterestTopics;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Service {
  id: string;
  topicName: string;
}
export interface InterestTopics {
  id: string;
  topicName: string;
}

export interface SSI {
  company: Company;
}

export interface FormDtCompany {
  id?: string;
  logo: string;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  isWorking: boolean;
  position: string;
  location: string;
  description: string;
  workingType: string;
}

export interface FormDtSchool {
  id?: string;
  name: string;
  logo: string;
  startDate: string | Date;
  endDate: string | Date;
  isGraduated: boolean;
  major: string;
  degree: string;
  description: string;
}

export interface FormDtLicense {
  id?: string;
  logo: File | string;
  licenseType: string;
  licenseIssuer: string;
  licenseState: string;
  licenseIssueDate: string | Date;
  licenseStatus: string;
  licenseExpirationDate: string | Date;
  credentialID: string;
}
