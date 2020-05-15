import { DatabaseModule } from './database.module';
import { SteamStrategy } from '../auth/strategies/steam.strategy';
import { GameController } from '../controllers/game.controller';
import { GameService } from '../services/game.service';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { Module, HttpModule } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [UserController, GameController, AuthController],
  providers: [UserService, GameService, AuthService, SteamStrategy]
})
export class AppModule {}
