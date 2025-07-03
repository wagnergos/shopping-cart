"use client";

import { createContext, useContext, useState, use, ReactNode } from "react";
import { updateUserType } from "@/lib/mock-api";

type User = {
  isVip: boolean;
};

type UserContextType = {
  user: User;
  toggleUserType: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<User>;
}) {
  const initialState = use(userPromise);
  const [user, setUser] = useState<User>(initialState);

  const toggleUserType = async () => {
    const newIsVip = !user.isVip;

    setUser((prev) => ({
      ...prev,
      isVip: newIsVip,
    }));

    await updateUserType(newIsVip);
  };

  return (
    <UserContext.Provider value={{ user, toggleUserType }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
