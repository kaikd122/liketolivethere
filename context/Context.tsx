import { User } from '@prisma/client'
import { useSession } from 'next-auth/react';
import React, {useState, useContext, useEffect} from 'react'

export interface ContextProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    user: User;
    setUser: (user: User) => void;
}


export const Context = React.createContext<ContextProps>({
    isLoading: true,
    setIsLoading: ()=>{},
    user: {} as User,
    setUser: ()=>{}
});

export interface ContextProviderProps {
    children: React.ReactNode
}

export const ContextProvider = ({children}: ContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>({} as User)
  return (
      <Context.Provider value={{isLoading: isLoading, setIsLoading: setIsLoading, user: user, setUser: setUser}}>
            {children}
      </Context.Provider>
  )
}

export const useCtx = () => useContext(Context)