import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { Module, HttpModule } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [UserController, GameController],
  providers: [UserService, GameService]
})
export class AppModule {}
