import { EncryptService } from './../services/encrypt.service';
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
  Post,
  Logger,
  Req
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SteamAuthGuard } from '../auth/guards/steam-auth.guard';
import { environment } from '../../environments/environment';
import { DatabaseService } from '../services/database.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly encryptService: EncryptService,
    private databaseService: DatabaseService
  ) {}

  @Get('steam')
  @UseGuards(SteamAuthGuard)
  steamLogin() {}

  @Get('steam/callback')
  @UseGuards(SteamAuthGuard)
  async steamLoginCallback(@Request() req, @Res() res) {
    this.logger.debug('***********************************************');
    this.logger.log('Entering callback');

    let id = this.encryptService.encrypt(req.user.id);

    this.logger.log(`Checking for user with id: ${req.user.id}`);
    let user = await this.databaseService.find(id);

    this.logger.log(`${user ? 'User found' : 'Not user found'} with id ${req.user.id}`);
    if (!user) {
      this.logger.warn(`Creating new user with id: ${req.user.id}`);

      const newUser = await this.databaseService.create({
        steamid: req.user.id,
        completedGames: [],
        creationDate: new Date().toISOString(),
        modificationDate: new Date().toISOString()
      });

      this.logger.log(`${newUser? 'User created' : 'User not created'}`);
    }

    this.logger.log(
      `Exiting callback: Redirecting to ${environment.FRONTEND_URL}main/${id}`
    );
    res.redirect(`${environment.FRONTEND_URL}main/${id}`); 
  }
}
