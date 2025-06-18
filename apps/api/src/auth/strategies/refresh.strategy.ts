import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthJwtPayload } from "src/types/jwtPayload";
import { AuthService } from "../auth.service";
import refreshConfig from "src/auth/config/refresh.config";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy,'refresh-jwt') {
  constructor (
    @Inject(refreshConfig.KEY)
    private jwtconfiguration: ConfigType<typeof refreshConfig>,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtconfiguration.secret!,
      ignoreExpiration: false!
    })
  }

  async validate(payload: AuthJwtPayload) {
      const userId = payload.sub

      return this.authService.validateRefreshToken(userId)
  }
}