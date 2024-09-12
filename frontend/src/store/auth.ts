import { create } from "zustand";
import { getMe } from "@/api/auth";
import { logOut } from "@/api/auth";

export interface IUserSessionStore {
  session: {
    token: string | null;
    user: {
      id: number | null;
      email: string | null;
      provider: string | null;
      socialId: string | null;
      firstName: string | null;
      lastName: string | null;
      photo: {
        isPublic: boolean | null;
        isDeleted: boolean | null;
        id: string | null;
        path: string | null;
        mimetype: string | null;
        ownerId: number | null;
      };
      role: {
        id: number | null;
        name: string | null;
        __entity: string | null;
      };
      status: {
        id: number | null;
        name: string | null;
        __entity: string | null;
      };
      onboarding_data: object | null;
      createdAt: string | null;
      updatedAt: string | null;
      deletedAt: string | null;
    };
    userProfile: {
      id: string | null;
      createdAt: string | null;
      updatedAt: string | null;
      deletedAt: string | null;
      nickName: string | null;
      birthDate: string | null;
      gender: string | null;
      location: string | null;
      shortDesc: string | null;
      additionalData: object | null;
      brokerProfile: object | null;
    };
  };
  checkOnboarding: () => string;
  login: (session: any) => void;
  createProfile: (session: any) => void;
  updateProfile: (values: any) => void;
  logout: () => void;
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const useAuthStore = create<IUserSessionStore>((set) => ({
  session: {
    token: null,
    user: {
      id: null,
      email: null,
      provider: null,
      socialId: null,
      firstName: null,
      lastName: null,
      photo: {
        isPublic: null,
        isDeleted: null,
        id: null,
        path: null,
        mimetype: null,
        ownerId: null,
      },
      role: {
        id: null,
        name: null,
        __entity: null,
      },
      status: {
        id: null,
        name: null,
        __entity: null,
      },
      onboarding_data: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    },
    userProfile: {
      id: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      nickName: null,
      birthDate: null,
      gender: null,
      location: null,
      shortDesc: null,
      additionalData: null,
      brokerProfile: null,
    },
  },
  login: async (session: any) => {
    try {
      const res = await getMe();
      localStorage.setItem("userInfo", JSON.stringify(res));
      // set((state) => ({
      //   ...state,
      //   session: {
      //     ...state.session,
      //     token: session.token,
      //     user: {
      //       ...state.session.user,
      //       id: res?.user.id,
      //       email: res?.user.email,
      //       photo: {
      //         ...state.session.user.photo,
      //         path: session?.user.image || res?.user?.photo?.path,
      //       },
      //       firstName: res?.user.firstName,
      //       lastName: res?.user.lastName,
      //       createdAt: res?.user.createdAt,
      //       role: { ...state.session.user.role, name: res?.user.role.name },
      //       status: {
      //         ...state.session.user.status,
      //         name: res?.user.status.name,
      //       },
      //     },
      //     userProfile: {
      //       ...state.session.userProfile,
      //     },
      //   },
      // }));
    } catch (err) {
      console.log(err);
    }
  },
  createProfile: async (session: any) => {
    // const res = await getMe();
    // localStorage.setItem("userInfo", JSON.stringify(res));
    // set((state) => {
    //   const updatedState = {
    //     ...state,
    //     session: {
    //       ...state.session,
    //       token: session.token,
    //       user: {
    //         ...state.session.user,
    //         id: session.user.id || res.user.id,
    //         email: session.user.email || res.user.email,
    //         photo: {
    //           ...state.session.user.photo,
    //           path:
    //             session.user?.image ||
    //             session.user?.photo.path ||
    //             res.user?.photo.path,
    //         },
    //         firstName: session.user.firstName || res.user.firstName,
    //         lastName: session.user.lastName || res.user.lastName,
    //         createdAt: session.user.createdAt || res.user.createdAt,
    //         role: {
    //           ...state.session.user.role,
    //           name: session.user.role?.name || res.user.role?.name,
    //         },
    //         status: {
    //           ...state.session.user.status,
    //           name: session.user.status?.name || res.user.status?.name,
    //         },
    //       },
    //       userProfile: {
    //         ...state.session.userProfile,
    //       },
    //     },
    //   };
    //   localStorage.setItem("userInfo", JSON.stringify(state));
    //   return updatedState;
    // });
  },
  updateProfile: async (values: any) => {
    // const res = await getMe();
    // localStorage.setItem("userInfo", JSON.stringify(res));
    // set((state) => {
    //   const updatedState = {
    //     ...state,
    //     session: {
    //       ...state.session,
    //       user: {
    //         ...state.session.user,
    //         nickName: values.nickName || res.userProfile?.nickName,
    //         location: values.location || res.userProfile?.location,
    //       },
    //     },
    //   };
    //   localStorage.setItem("userInfo", JSON.stringify(state));
    //   return updatedState;
    // });
  },

  logout: async () => {
    try {
      // Calling APIs
      logOut();
      localStorage.removeItem("userInfo");
      localStorage.removeItem("theme");
      // localStorage.removeItem("onboarding_step");
    } catch (err) {
      console.log(err);
    }
  },
  checkOnboarding: () => {
    // Continue onboarding
    const onboardingStep = localStorage.getItem("onboarding_step");
    if (onboardingStep) {
      const isOnboarding =
        onboardingStep === "create_profile" ||
        onboardingStep === "select_interest_topic";
      const redirectPath = isOnboarding ? "/onboarding" : "/";
      return redirectPath;
    } else {
      return "/";
    }
  },
}));

export default useAuthStore;
