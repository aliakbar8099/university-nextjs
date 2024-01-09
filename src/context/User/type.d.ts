import { ReactNode } from "react";

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    nationalCode: string,
    phoneNumber: string,
    birthDate: string,
    gender: string,
    password: string,
    role: string
}

export interface UserContextType {
    user: User | null;
    login: (userData?: User) => void;
    logout: () => void;
    isLoading: boolean;
    isLoadingLogout: boolean;
}

export interface UserProviderProps {
    children: ReactNode;
}
