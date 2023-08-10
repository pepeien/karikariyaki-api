// Services
import { StringService } from '@services';

export class RequestService {
    public static isValidQueryParam(value: any) {
        return (
            value !== null &&
            value !== undefined &&
            typeof value == 'string' &&
            value.trim().length > 0
        );
    }

    public static queryParamToBoolean(value: any) {
        return RequestService.isValidQueryParam(value)
            ? StringService.toBoolean(value as string)
            : undefined;
    }

    public static queryParamToString(value: any) {
        return RequestService.isValidQueryParam(value) ? (value as string).trim() : undefined;
    }

    public static queryParamToStrings(value: any) {
        if (!value || (typeof value !== 'object' && !value.length)) {
            return undefined;
        }

        const queryParamsList = value as string[];

        const result: string[] = [];

        queryParamsList.forEach((queryParam) => {
            result.push(queryParam.trim());
        });

        return result;
    }

    public static queryParamToDate(value: any) {
        return RequestService.isValidQueryParam(value)
            ? new Date((value as string).trim())
            : undefined;
    }
}
