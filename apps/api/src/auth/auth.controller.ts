import { Controller, Get, Post, Redirect, Req, Request, Res, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './guards/google.guard';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from './config/public';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = await this.authService.handleGoogleLogin(req.user)

    res.redirect(`http://localhost:3000/api/auth/google?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}&userId=${user.user.id}&name=${user.user.name}`)

  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name)
  }
}
