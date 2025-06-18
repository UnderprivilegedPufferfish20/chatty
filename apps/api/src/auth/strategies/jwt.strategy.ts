import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportSerializer, PassportStrategy } from "@nestjs/passport";
import jwtConfig from "src/auth/config/jwt.config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJwtPayload } from "src/types/jwtPayload";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    @Inject(jwtConfig.KEY)
    private jwtconfiguration: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtconfiguration.secret!,
      ignoreExpiration: false!
    })
  }

  async validate(payload: AuthJwtPayload) {
      const userId = payload.sub

      const user = await this.userService.getUserById(userId)

      if (!user) throw new UnauthorizedException('jwtStrategy - userId doesnt exist')

      const currentUser = {id:user.id}

      return currentUser
  }
}