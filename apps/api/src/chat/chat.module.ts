import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [UserModule, FriendsModule]
})
export class ChatModule {}
