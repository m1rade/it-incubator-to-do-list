type FieldErrorType = {
    error: string;
    field: string;
};

export type ServerResponseType<T = {}> = {
    data: T;
    messages: string[];
    fieldsErrors: FieldErrorType[];
    resultCode: number;
};
