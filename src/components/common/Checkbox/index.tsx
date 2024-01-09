import { ClassAttributes, FC, InputHTMLAttributes, JSX } from "react";
const Checkbox = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLInputElement> & InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <div className="flex justify-center items-center">
                <input {...props} className="dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-4 h-4" type="checkbox" />
        </div>

    );
}

export default Checkbox;