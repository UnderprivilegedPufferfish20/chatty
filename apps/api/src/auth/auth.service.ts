import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import prisma from '../../../../packages/db/index'
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from 'src/types/jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import refreshConfig from 'src/auth/config/refresh.config';

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY) private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>
  ) {}

  async handleGoogleLogin(profile:any) {

    let user = await this.userService.getUserByEmail(profile.email);

    if (!user) {
      user = await this.userService.createUser({
        email: profile.email,
        name: profile.firstName.toLowerCase() + profile.lastName.toLowerCase()[0] + '123',
        pfpURL: profile.picture,
      });
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id)

    return {
      user: {
        id: user.id,
        name: user.name
      },
      accessToken,
      refreshToken
    };
  }

  async generateTokens(userId:string) {
    const payload: AuthJwtPayload = { sub: userId }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig)
    ])

    return {
      accessToken,
      refreshToken
    }
  }


  async validateRefreshToken(userId: string) {
    const user = await this.userService.getUserById(userId)

    if (!user) throw new UnauthorizedException('User not found')


    const currentUser = {id: user.id}
    return currentUser
  }

  async refreshToken(userId: string, nane: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId)

    return {
      id: userId,
      name: nane,
      accessToken,
      refreshToken
    }
  }

}
