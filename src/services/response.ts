// Types
import { ResponseWrapper } from "@types";

export class ResponseService {
    public static generateSucessfulResponse<T>(result?: T): ResponseWrapper<T> {
        return {
            wasSuccessful: true,
            result: result,
        };
    }

    public static generateFailedResponse(
        description: string
    ): ResponseWrapper<void> {
        return {
            wasSuccessful: false,
            description: description,
        };
    }
}
