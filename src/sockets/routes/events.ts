import { Socket } from 'socket.io';

// Services
import { EventService, ResponseService, SocketService } from '@services';

const joinEvents = (socket: Socket) =>
    socket.on('events:join', async () => {
        let events = await EventService.query({}, false);

        events = await EventService.query({}, false);

        SocketService.leaveRooms(socket, 'event');

        socket.join('events');

        socket.emit('events:refresh', ResponseService.generateSucessfulResponse(events));
    });

const leaveEvents = (socket: Socket) =>
    socket.on('events:leave', () => {
        SocketService.leaveRooms(socket, 'event');

        socket.emit('events:refresh', ResponseService.generateSucessfulResponse(null));
    });

export { joinEvents, leaveEvents };
