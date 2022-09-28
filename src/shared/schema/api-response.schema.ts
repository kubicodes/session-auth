export interface ErrorApiResponse {
    message: string;
}

export enum HttpStatusCodes {
    SUCCESS = 200,
    INTERNAL_SERVER_ERROR = 500,
}
