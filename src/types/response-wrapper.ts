export interface InHouseResponse {
    code: number;
    wasSuccessful: boolean;
    description?: string;
}

export interface ResponseWrapper<T> extends Omit<InHouseResponse, "code"> {
    result?: T;
}
