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
        const wasAppendedByMongoose =
            description.includes("validation failed:");

        if (wasAppendedByMongoose === false) {
            return {
                wasSuccessful: false,
                description: [description],
            };
        }

        return {
            wasSuccessful: false,
            description: ResponseService._parseDescription(description),
        };
    }

    private static _parseDescription(description: string): string[] {
        const inHouseErrorDescriptionPrefix = "ERROR";

        const parsedDescription: string[] = [];

        const splittedDescription = description.split(":");

        for (const descriptionBlock of splittedDescription) {
            const trimmedDescriptionBlock = descriptionBlock.trim();
            const splittedDescriptionBlock = trimmedDescriptionBlock.split(",");

            if (
                splittedDescriptionBlock.length === 1 &&
                trimmedDescriptionBlock.startsWith(
                    inHouseErrorDescriptionPrefix
                ) === false
            ) {
                continue;
            }

            for (const deepDescriptionBlock of splittedDescriptionBlock) {
                const trimmedDeepDescriptionBlock = deepDescriptionBlock.trim();

                if (
                    trimmedDeepDescriptionBlock.startsWith(
                        inHouseErrorDescriptionPrefix
                    ) === false
                ) {
                    continue;
                }

                parsedDescription.push(trimmedDeepDescriptionBlock);
            }
        }

        return parsedDescription;
    }
}
