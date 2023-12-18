import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(Number(process.env.SOCKET_PORT), { cors: true })
export class ChatGatewayService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  onlineUsers = [];

  @WebSocketServer()
  server: Server;

  afterInit() {
    try {
      console.log('Socket Initialized');
    } catch (error) {
      console.error('error:', error);
      throw error;
    }
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;
    console.log(`Client id: ${client.id} connected`);
    console.log(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client id:${client.id} disconnected`);

    this.onlineUsers = this.onlineUsers.filter(
      (user) => user.socket_id !== client.id,
    );

    console.log('on disconnect', this.onlineUsers);

    this.server.emit('getOnlineUsers', this.onlineUsers);
  }

  @SubscribeMessage('add-new-user')
  handleUser(client: any, data: any) {
    // console.log('event name: add-new-user');

    // console.log('new user with id ', client.id);
    // console.log('data', data);

    if (data.user_id) {
      !this.onlineUsers.some((user) => user.user_id === data.user_id) &&
        this.onlineUsers.push({
          user_id: data.user_id,
          socket_id: client.id,
        });
    }

    console.log('on connect getOnlineUsers list::', this.onlineUsers);
    this.server.emit('getOnlineUsers', this.onlineUsers);
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(client: any, message: any) {
    console.log('private message client.id,', client.id);
    console.log('data', message);

    // check the receiver id is available in the onlineUser list
    const user = this.onlineUsers.find(
      (user) => user.user_id === message.recipient_id,
    );
    if (user) {
      this.server.to(user.socket_id).emit('getMessage', message);
    }
  }
}
