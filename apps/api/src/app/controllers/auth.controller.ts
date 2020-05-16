import { EncryptService } from './../services/encrypt.service';
import { Controller, Get, Param, Query, UseGuards, Request, Res, Post, Logger, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SteamAuthGuard } from '../auth/guards/steam-auth.guard';
import { environment } from '../../environments/environment';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService, private readonly encryptService: EncryptService) {}


  @Get('steam')
  @UseGuards(SteamAuthGuard)
  steamLogin(){}

  @Get('steam/callback')
  @UseGuards(SteamAuthGuard)
  async steamLoginCallback(@Request() req, @Res() res)
  {
    let id = this.encryptService.encrypt(req.user.id);
    console.log(id);
    id = id.toString().replace(/\+/g, "xd").replace(/\//g, "dx");
    console.log(id);
    res.redirect(`${environment.FRONTEND_URL}main/${id}`);
  }
}
