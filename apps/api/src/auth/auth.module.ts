import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from 'src/auth/config/google-oauth.config';
import { UserService } from 'src/user/user.service';
import { GoogleStrategy } from './strategies/google.strategy';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshConfig from 'src/auth/config/refresh.config';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    ConfigModule.forFeature(googleOauthConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(refreshConfig.asProvider()),
    ConfigModule.forFeature(refreshConfig),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
