import { Dispatch, ReactNode } from "react";

type StudentType = {
    [x: string]: any;
    id: number,
    firstName: string;
    lastName: string;
    STLEV: string;
    birthDate: string;
    gender: string;
    CollegeName: string;
    FSName: string;
    semesterName: string;
    userId: number;
    term: number,
}

type teacherType = {
    id: number;
    TETITLE: string;
    graduationYear: string;
    TELEV: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    CollegeName: string;
    FSName: string;
}

type semesterType = {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
}

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
    student: StudentType;
    setChange: Dispatch<SetStateAction<boolean>>
    teacher: teacherType;
    semester: semesterType;
    setSemester: Dispatch<any>;
    setStudents:any
}

export interface UserProviderProps {
    children: ReactNode;
}
