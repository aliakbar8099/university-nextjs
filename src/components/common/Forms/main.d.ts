
export interface FormInput {
    name: string;
    type: string;
    value?: any;
    options?: any[];
    dataType?: string;
    min?: number;
    max?: number;
    width?: number | string;
    leftButton?: { id: string, name: string }
    noTable?: true;
    noInput?: true;
    placeholder?: string;
    disabled?:true;
    hidden?:true;
}

export interface IsubQuery {
    name: string;
    title: string;
    option: {
        key: string;
        value: string;
    }[];
}[]