// GuestTokenContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface GuestTokenContextType {
  guestToken: string | null;
  setGuestToken: (token: string) => void;
}

const GuestTokenContext = createContext<GuestTokenContextType | null>(null);

export const GuestTokenProvider = ({ children }: { children: ReactNode }) => {
  const [guestToken, setGuestToken] = useState<string | null>(null);

  return (
    <GuestTokenContext.Provider value={{ guestToken, setGuestToken }}>
      {children}
    </GuestTokenContext.Provider>
  );
};

export const useGuestToken = () => {
  return useContext(GuestTokenContext);
};
