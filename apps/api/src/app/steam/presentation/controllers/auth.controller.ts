import {
  Controller,
  Get,
  UseGuards,
  Request,
  Res,
  Logger
} from '@nestjs/common';
import { Response } from 'express';
import { SteamAuthGuard } from '../guards/steam-auth.guard';
import { environment } from '../../../../environments/environment';
import { HandleSteamCallbackUseCase } from '../../application';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly handleSteamCallbackUseCase: HandleSteamCallbackUseCase
  ) {}

  @Get('steam')
  @UseGuards(SteamAuthGuard)
  steamLogin() {
    // Initiates the Steam OpenID redirect
  }

  @Get('steam/callback')
  @UseGuards(SteamAuthGuard)
  async steamLoginCallback(@Request() req: any, @Res() res: Response) {
    this.logger.log('Entering Steam auth callback');
    const steamId = req.user?.id;

    if (!steamId) {
      this.logger.error('No Steam ID returned in profile');
      return res.redirect(`${environment.FRONTEND_URL}login?error=no_steam_id`);
    }

    const result = await this.handleSteamCallbackUseCase.execute({ steamId });

    if (result.isNewUser) {
      this.logger.log(`Created new user entry for: ${steamId}`);
    }

    const targetUrl = `${environment.FRONTEND_URL}main/${result.encryptedId}`;
    this.logger.log(`Redirecting to: ${targetUrl}`);
    return res.redirect(targetUrl);
  }
}
