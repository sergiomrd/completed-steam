import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from './database.module';
import {
  SteamApiAdapter,
  STEAM_SERVICE_TOKEN,
  ISteamService,
  HandleSteamCallbackUseCase,
  SteamStrategy,
  AuthController
} from '../steam';
import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
  GetUserProfileUseCase,
  CreateOrUpdateUserUseCase,
  FindUserUseCase,
  UserController
} from '../user';
import {
  ENCRYPTION_SERVICE_TOKEN,
  IEncryptionService
} from '../security';
import {
  GetOwnedGamesUseCase,
  SearchGamesUseCase,
  GameController
} from '../game';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [UserController, GameController, AuthController],
  providers: [
    SteamStrategy,
    SteamApiAdapter,
    {
      provide: STEAM_SERVICE_TOKEN,
      useExisting: SteamApiAdapter
    },
    {
      provide: GetOwnedGamesUseCase,
      useFactory: (
        steamService: ISteamService,
        userRepo: IUserRepository,
        crypto: IEncryptionService
      ) => new GetOwnedGamesUseCase(steamService, userRepo, crypto),
      inject: [STEAM_SERVICE_TOKEN, USER_REPOSITORY_TOKEN, ENCRYPTION_SERVICE_TOKEN]
    },
    {
      provide: SearchGamesUseCase,
      useFactory: (
        steamService: ISteamService,
        userRepo: IUserRepository,
        crypto: IEncryptionService
      ) => new SearchGamesUseCase(steamService, userRepo, crypto),
      inject: [STEAM_SERVICE_TOKEN, USER_REPOSITORY_TOKEN, ENCRYPTION_SERVICE_TOKEN]
    },
    {
      provide: GetUserProfileUseCase,
      useFactory: (
        userRepo: IUserRepository,
        steamService: ISteamService,
        crypto: IEncryptionService
      ) => new GetUserProfileUseCase(userRepo, steamService, crypto),
      inject: [USER_REPOSITORY_TOKEN, STEAM_SERVICE_TOKEN, ENCRYPTION_SERVICE_TOKEN]
    },
    {
      provide: CreateOrUpdateUserUseCase,
      useFactory: (
        userRepo: IUserRepository,
        crypto: IEncryptionService
      ) => new CreateOrUpdateUserUseCase(userRepo, crypto),
      inject: [USER_REPOSITORY_TOKEN, ENCRYPTION_SERVICE_TOKEN]
    },
    {
      provide: HandleSteamCallbackUseCase,
      useFactory: (
        userRepo: IUserRepository,
        crypto: IEncryptionService
      ) => new HandleSteamCallbackUseCase(userRepo, crypto),
      inject: [USER_REPOSITORY_TOKEN, ENCRYPTION_SERVICE_TOKEN]
    },
    {
      provide: FindUserUseCase,
      useFactory: (
        userRepo: IUserRepository,
        crypto: IEncryptionService
      ) => new FindUserUseCase(userRepo, crypto),
      inject: [USER_REPOSITORY_TOKEN, ENCRYPTION_SERVICE_TOKEN]
    }
  ]
})
export class AppModule {}
