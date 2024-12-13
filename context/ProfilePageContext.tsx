import { User } from "@/types/supabase.tables";
import React, { createContext, useContext } from "react";

type ProfilePageContextProps = {
  user: User;
};

const ProfilePageContext = createContext<ProfilePageContextProps | undefined>(
  undefined
);

export const useProfileCtx = () => useContext(ProfilePageContext)!;

export const ProfilePageContextProvider = ({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) => (
  <ProfilePageContext.Provider value={{ user }}>
    {children}
  </ProfilePageContext.Provider>
);
