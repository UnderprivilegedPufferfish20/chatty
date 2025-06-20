import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { FriendsService } from 'src/friends/friends.service';
import { NotFoundException } from '@nestjs/common';

@WebSocketGateway({
  namespace: "chat",
  cors: {
    origin: "http://localhost:3000"
  },
  transports: ['websocket']
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private idsOnline = new Set<string>()

  constructor(
    private jwtService: JwtService,
    private readonly chatsService: ChatService,
    private readonly userService: UserService,
    private readonly friendsService: FriendsService
  ) {}

  afterInit() {
    this.server.use(async (socket: Socket, next) => {
      console.log("trying to connect...")
      const token = socket.handshake.auth.token;
      
      if (!token) {
        console.log("Didn't provide token")
        return next(new WsException('Missing authentication token'));
      }

      // Verify JWT token using your existing passport/JWT service
      const decoded = this.jwtService.verify(token); // or however you verify JWTs
      const userId = decoded.sub // depends on your 

      if (!userId) {
        return next(new WsException('Missing id or friendId'));
      }
      
      try {
        const user = await this.userService.getUser({ id: userId })
        if (!user) return next(new WsException("User does not exist or incorrect jwt"));

        socket.data.user = user

        next();
      } catch (err) {
        return next(new WsException('Invalid token'));
      }
    });
  }

  @SubscribeMessage('request_online_status')
  handleRequestOnlineStatus(@ConnectedSocket() socket: Socket) {
    socket.emit('user_online_status_change', {
      idsOnline: Array.from(this.idsOnline)
    });
  }

  handleConnection(
    @ConnectedSocket() socket: Socket
  ) {
    console.log(`User with ID of ${socket.data.user.id} is online.`)

    this.idsOnline.add(socket.data.user.id)

    this.server.emit('user_online_status_change', { 
      idsOnline: Array.from(this.idsOnline) 
    });
  }

  handleDisconnect(socket: Socket) {
    console.log(`User ${socket.data.user.id} has logged off`)

    this.idsOnline.delete(socket.data.user.id)

    this.server.emit('user_online_status_change', { 
      idsOnline: Array.from(this.idsOnline) 
    });
  }


  @SubscribeMessage('sendChat')
  async handleSendChat(
    @MessageBody() data: { message:string, attachment?: Buffer, friendId: string }, 
    @ConnectedSocket() socket: Socket
  ) {
    console.log(`User ${socket.data.user.id} said "${data.message}" to ${data.friendId}`)

    const friendRel = await this.friendsService.findOne({ personOneID: socket.data.user.id, personTwoID: data.friendId })
    if (!friendRel) throw new NotFoundException(`User ${socket.data.user.id} joined chat room with ${data.friendId}, but they aern't friends`);

    const chat = await this.chatsService.createChat({
      friendRelId: friendRel.id,
      message: data.message,
      attachment: data.attachment,
      senderId: socket.data.user.id,
      receiverId: friendRel.friendId === socket.data.user.id ? friendRel.userId : friendRel.friendId
    })
    this.server.emit('new_message', { to: data.friendId, from: socket.data.user.id, message: chat })


  }


  @SubscribeMessage('markAsSeen')
  async handleMarkAsSeen(
    @MessageBody() data: { friendId: string }, 
    @ConnectedSocket() socket: Socket
  ) {
    const friendRel = await this.friendsService.findOne({ personOneID: socket.data.user.id, personTwoID: data.friendId })
    if (!friendRel) throw new NotFoundException(`User ${socket.data.user.id} joined chat room with ${data.friendId}, but they aern't friends`);

    await this.chatsService.markAsSeen(
      friendRel.id,
      friendRel.friendId === socket.data.user.id ? friendRel.userId : friendRel.friendId
    )

  }
}
