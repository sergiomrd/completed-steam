import { Controller, Get, Param, Query, UseGuards, Request, Res, Post, Logger, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SteamAuthGuard } from '../auth/guards/steam-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}


  @Get('steam')
  @UseGuards(SteamAuthGuard)
  steamLogin(){}

  @Get('steam/callback')
  @UseGuards(SteamAuthGuard)
  async steamLoginCallback(@Request() req, @Res() res)
  {
    console.log(req.user.id)
    this.authService.setUserInfo(req.user);
    res.redirect('http://localhost:4200/');
  }

  @Get('profile')
  getProfile() {
    return this.authService.login();
  }
}
