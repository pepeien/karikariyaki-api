import cookie from 'cookie';

// Socket
import { io } from '../setup';

// Routes
import {
    createEvent,
    createOrder,
    deleteOrder,
    editOrder,
    joinEvent,
    joinEvents,
    leaveEvent,
    leaveEvents,
} from './routes';

// Services
import { JWTService, OperatorService } from '@services';

export class RejiSocket {
    public static namespace = io.of('karikariyaki/ws/reji');

    public static setup() {
        RejiSocket.namespace.on('connection', async (socket) => {
            const rawCookies = socket.handshake.headers.cookie;

            if (!rawCookies) {
                return;
            }

            const parsedCookies = cookie.parse(rawCookies);

            const accessToken = parsedCookies[process.env['COOKIE_NAME']];

            if (!accessToken) {
                return;
            }

            const decodedAccessToken = JWTService.decodeAccessToken(accessToken);

            if (!decodedAccessToken || !decodedAccessToken.userName) {
                return;
            }

            const loggedOperator = await OperatorService.queryByUserName(
                decodedAccessToken.userName,
            );

            if (!loggedOperator) {
                return;
            }

            socket.data.operator = loggedOperator;

            /**
             * Events
             */
            joinEvents(socket);
            leaveEvents(socket);

            /**
             * Event
             */
            createEvent(socket);
            joinEvent(socket);
            leaveEvent(socket);

            /**
             * Order
             */
            createOrder(socket);
            deleteOrder(socket);
            editOrder(socket);
        });
    }
}
