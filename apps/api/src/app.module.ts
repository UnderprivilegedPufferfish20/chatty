import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot({isGlobal:true})],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
