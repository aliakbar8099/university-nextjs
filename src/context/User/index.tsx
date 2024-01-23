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
    const [student, setStudents] = useState<any>(null);
    const [teacher, setTeacher] = useState<any>(null);
    const [semester, setSemester] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [change, setChange] = useState<Date>(new Date());
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
    }, [change])

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

            performGet("/users/me").then(resUser => {
                setUser(resUser.responseData);

                switch (resUser.responseData.role) {
                    case "student":
                        performGet(`/students?userId=${resUser.responseData.id}`).then(res => {
                            setStudents(res.responseData[0])
                            performGet(`/students/term/${resUser.responseData.id}`).then(response => {
                                setStudents({ ...res.responseData[0], term: response.responseData.term })
                                setIsLoading(false)
                            })
                        })
                        break;
                    case "teacher":
                        performGet(`/teachers?userId=${resUser.responseData.id}`).then(res => {
                            setTeacher(res.responseData[0])
                            setIsLoading(false)
                        })
                        break;
                    default:
                        setIsLoading(false)
                        break;
                }

                performGet(`/semester`).then(res => {
                    setSemester(res.responseData.reverse()[0])
                })

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
        <UserContext.Provider value={
            {
                user,
                login,
                logout,
                isLoading,
                isLoadingLogout,
                student,
                setChange,
                teacher,
                semester
            }
        }>
            {children}
        </UserContext.Provider>
    );
};
