import { CircularProgress, CircularProgressTypeMap } from "@mui/joy";
import { FC } from 'react';

interface ILoading {
    className?: string | undefined;
}

const CircleLoading: FC<ILoading> = ({ className }) => {
    return (
        <div className={`flex justify-center items-center w-full h-screen ${className}`}>
            <CircularProgress />
        </div>
    );
}

export default CircleLoading;
