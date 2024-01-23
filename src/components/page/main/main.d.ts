
export interface FormInput {
    name: string;
    type: string;
    value?: any;
    options?: never[];
    dataType?: string;
    min?: number;
    max?: number;
    width?: number | string;
    leftButton?: { id: string, name: string }
    noTable?: true;
    noInput?: true;
    placeholder?: string;
}

export interface IsubQuery {
    name: string;
    title: string;
    option: {
        key: string;
        value: string;
    }[];
}[]