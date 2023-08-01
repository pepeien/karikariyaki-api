import { Types } from 'mongoose';

export class StringService {
    public static isStringInsideBoundaries(value: string, minSize: number, maxSize: number) {
        if (!value) {
            return false;
        }

        const trimmedValue = value.trim();

        return trimmedValue.length >= minSize && trimmedValue.length <= maxSize;
    }

    public static toBoolean(value: string) {
        return value.trim() === 'true' ? true : value.trim() === 'false' ? false : null;
    }

    public static toCamelCase(value: string) {
        const map = {
            a: 'á|à|ã|â|À|Á|Ã|Â',
            e: 'é|è|ê|É|È|Ê',
            i: 'í|ì|î|Í|Ì|Î',
            o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
            u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
            c: 'ç|Ç',
            n: 'ñ|Ñ',
        };

        for (const pattern in map) {
            value = value.replace(new RegExp(pattern, 'g'), pattern);
        }

        return value
            .replace(/([-_][a-z]|[A-Z]|)/g, (word, index) => {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/[^a-zA-Z]/g, '');
    }

    public static toObjectId(value: string) {
        if (!value) {
            return null;
        }

        return new Types.ObjectId(value);
    }

    public static toObjectIds(values: string[]) {
        if (!values) {
            return null;
        }

        const convertedValues: Types.ObjectId[] = [];

        values.forEach((currentValue) => {
            convertedValues.push(new Types.ObjectId(currentValue));
        });

        return convertedValues;
    }

    public static toString(value: Types.ObjectId) {
        if (!value) {
            return null;
        }

        return value.toString();
    }

    public static toStrings(values: Types.ObjectId[]) {
        if (!values) {
            return null;
        }

        const convertedValues: string[] = [];

        values.forEach((currentValue) => {
            convertedValues.push(currentValue.toString());
        });

        return convertedValues;
    }

    public static removeLeadingAndTrailingSlashes(value: string) {
        if (!value) {
            return null;
        }

        const rasterizedRoute = value.trim().toLowerCase().replace(/^\/+/g, '');

        return rasterizedRoute.replace(/\/+$/, '');
    }
}
