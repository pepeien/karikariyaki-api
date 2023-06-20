import mongoose from "mongoose";

// Services
import { DateService } from "@services";

const dbURI = `mongodb://${
    process.env.DATABASE_HOST.trim().length > 0 &&
    process.env.DATABASE_PORT.trim().length > 0 &&
    process.env.DATABASE_TABLE.trim().length > 0
        ? `${process.env.DATABASE_HOST.trim()}:${process.env.DATABASE_PORT.trim()}/${process.env.DATABASE_TABLE.trim()}`
        : "127.0.0.1:27017/karikariyaki"
}`;

let connection = mongoose.connect(dbURI, {
    minPoolSize: Number(process.env.DATABASE_MIN_POOL_SIZE) ?? 5,
    maxPoolSize: Number(process.env.DATABASE_MAX_POOL_SIZE) ?? 15,
});

export class DatabaseService {
    public static getConnection() {
        if (mongoose.connection.readyState === 0) {
            connection = mongoose.connect(dbURI, {
                minPoolSize: Number(process.env.DATABASE_MIN_POOL_SIZE) ?? 5,
                maxPoolSize: Number(process.env.DATABASE_MAX_POOL_SIZE) ?? 15,
            });
        }

        return connection;
    }

    public static generateBroadQuery(value: string) {
        return {
            $regex: value.trim(),
            $options: "i",
        };
    }

    public static generateExactInsensitiveQuery(value: string) {
        return {
            $regex: `^${value.trim()}$`,
            $options: "i",
        };
    }

    public static generateStandarizedDateQuery(value: Date) {
        return {
            $eq: DateService.standarizeCurrentDate(value).toString(),
        };
    }
}
