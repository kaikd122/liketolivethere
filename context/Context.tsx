import { User } from '@prisma/client'
import React, {useState, useContext} from 'react'

export interface ContextProps {
    user: User;
    setUser: (user: User) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}


export const Context = React.createContext<ContextProps>({
    isLoading: true,
    setIsLoading: ()=>{},
    user: {email: "", id: "", username: ""},
    setUser: ()=> {}
});

export interface ContextProviderProps {
    children: React.ReactNode
}

export const ContextProvider = ({children}: ContextProviderProps) => {
    const [user, setUser] = useState<User>({email: "", id: "", username: ""});
  const [isLoading, setIsLoading] = useState(true);
  return (
      <Context.Provider value={{isLoading: isLoading, setIsLoading: setIsLoading, setUser: setUser, user: user}}>
            {children}
      </Context.Provider>
  )
}

export const useCtx = () => useContext(Context)