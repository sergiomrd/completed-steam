import { jwtConstants } from './auth/constants';
import { SteamStrategy } from './auth/strategies/steam.strategy';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { Module, HttpModule } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HttpModule],
  controllers: [UserController, GameController, AuthController],
  providers: [UserService, GameService, AuthService, SteamStrategy]
})
export class AppModule {}
