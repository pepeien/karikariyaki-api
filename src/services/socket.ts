import { Socket } from "socket.io";

// Types
import { InHouseError } from "@types";
import { OrderErrors } from "@models";

// Sockets
import { RejiSocket, PrompterSocket, ClientSocket } from "@sockets";

// Services
import { OrderService } from "./models/order";
import { ResponseService } from "./response";
import { Operator } from "karikarihelper";

export class SocketService {
    public static leaveRooms(socket: Socket, roomPrefix: string) {
        Array.from(socket.rooms)
            .filter((room) => room.includes(roomPrefix))
            .forEach((room) => {
                socket.leave(room);
            });
    }

    public static async refreshOrders(eventId: string, operator: Operator) {
        const eventOrders = await OrderService.query(operator, {
            eventId: eventId,
            realmId: operator.realm._id,
        });

        RejiSocket.namespace
            .to(`event/${eventId}/${operator.realm._id}`)
            .emit(
                "orders:refresh",
                ResponseService.generateSucessfulResponse(eventOrders)
            );
        PrompterSocket.namespace
            .to(`event/${eventId}/${operator.realm._id}`)
            .emit(
                "orders:refresh",
                ResponseService.generateSucessfulResponse(eventOrders)
            );
    }

    public static async refreshOrder(id: string) {
        const foundOrder = await OrderService.queryById(id);

        if (!foundOrder) {
            throw new InHouseError(OrderErrors.NOT_FOUND);
        }

        ClientSocket.namespace
            .to(
                `event/${foundOrder.event._id.toString()}/${foundOrder.realm._id.toString()}/${foundOrder._id.toString()}`
            )
            .emit(
                "order:refresh",
                ResponseService.generateSucessfulResponse(foundOrder)
            );
    }
}
