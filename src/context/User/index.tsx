"use client"
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, UserContextType, UserProviderProps } from './type.d';
import { performDelete, performGet } from '@/services/Instance/fetch.service';
import { usePathname, useRouter } from 'next/navigation';
import { useUI } from '../UI';


const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const { closeModal } = useUI();
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true)
        if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")) {
            login()
        } else {
            if (pathname == "/login") {
                router.push("/login")
            } else if (pathname == "/register") {
                router.push("/register")
            } else {
                router.push("/login")
            }
            setIsLoading(false)
        }
    }, [])

    const login = (userData?: User) => {
        if (pathname == "/login") {
            router.push("/")
        }
        if (pathname == "/register") {
            router.push("/")
        }
        if (userData) {
            setUser(userData)
        } else {
            setIsLoading(true)
            performGet("/users/me").then(res => {
                setUser(res.responseData);
                setIsLoading(false)
            })
        }
    };

    const logout = () => {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
            setIsLoading(true)
            setIsLoadingLogout(true)
            performDelete("/auth/logout", { refreshToken }).then(() => {
                setIsLoadingLogout(false)
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                router.push("/login")
                closeModal()
            })
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isLoading, isLoadingLogout }}>
            {children}
        </UserContext.Provider>
    );
};
