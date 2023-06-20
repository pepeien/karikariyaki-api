export class InHouseError extends Error {
    public code: number;

    constructor(message: string, code = 500) {
        super(message);

        this.name = "InHouseError";
        this.code = code;
    }
}
