import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { FriendsModule } from './friends/friends.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot({isGlobal:true}), FriendsModule, ChatModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
