import { io } from "../setup";

// Routes
import { joinOrder } from "./routes";

export class ClientSocket {
    public static namespace = io.of("karikariyaki/ws/client");

    public static setup() {
        ClientSocket.namespace.on("connection", (socket) => {
            /**
             * Orders
             */
            joinOrder(socket);
        });
    }
}
