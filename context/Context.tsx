import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState, useContext, useEffect } from "react";
import { Point } from "../types/types";

export interface ContextProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  user: User;
  setUser: (user: User) => void;
  currentPoint: Point;
  setCurrentPoint: (point: Point) => void;
}

export const Context = React.createContext<ContextProps>({
  isLoading: true,
  setIsLoading: () => {},
  user: {} as User,
  setUser: () => {},
  currentPoint: {} as Point,
  setCurrentPoint: () => {},
});

export interface ContextProviderProps {
  children: React.ReactNode;
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>({} as User);
  const [currentPoint, setCurrentPoint] = useState<Point>({} as Point);
  return (
    <Context.Provider
      value={{
        isLoading: isLoading,
        setIsLoading: setIsLoading,
        user: user,
        setUser: setUser,
        currentPoint: currentPoint,
        setCurrentPoint: setCurrentPoint,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCtx = () => useContext(Context);
