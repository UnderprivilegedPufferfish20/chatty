import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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

  private async generateUniqueName(profile:any) {
    let iter = 0;
    while (iter <= 100) {
      const base = profile.firstName.toLowerCase() + (profile.lastName ? profile.lastName.toLowerCase()[0] : profile.email.split('@')[1])
      const extra = Array.from({length: 6}, () =>
        "0123456789!"[Math.floor(Math.random() * 10)]
      ).join('');

      const name = base + extra

      const testIfUnique = await prisma.user.findUnique({ where: { name } });

      if (!testIfUnique) {
        return name;
      }
      iter++;
    }
    throw new InternalServerErrorException("Could not generate unique name");
  }

  async handleGoogleLogin(profile:any) {

    let user = await this.userService.getUser({email: profile.email});

    if (!user) {
      const name = await this.generateUniqueName(profile)
      user = await this.userService.createUser({
        email: profile.email,
        name,
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
    const user = await this.userService.getUser({id: userId})

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
