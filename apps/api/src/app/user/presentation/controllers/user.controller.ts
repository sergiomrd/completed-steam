import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Logger
} from '@nestjs/common';
import {
  GetUserProfileUseCase,
  CreateOrUpdateUserUseCase,
  FindUserUseCase
} from '../../application';
import { UserDto } from '@completed-steam/api-interfaces';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly createOrUpdateUserUseCase: CreateOrUpdateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase
  ) {}

  @Get()
  async getUserInSteam(@Query('id') id: string) {
    this.logger.log(`Fetching steam profile for id: ${id}`);
    const result = await this.getUserProfileUseCase.execute(id);
    return result.profile;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    this.logger.log(`Fetching user by id: ${id}`);
    return this.findUserUseCase.execute(id);
  }

  @Post('create')
  async create(@Body() createUserDto: { body: UserDto } | UserDto) {
    const payload = (createUserDto as any).body || createUserDto;
    this.logger.log(`Creating user: ${payload.steamid}`);
    return this.createOrUpdateUserUseCase.execute({
      encryptedSteamId: payload.steamid,
      completedGames: payload.completedGames || []
    });
  }

  @Put('update')
  async update(@Body() updateUserDto: { body: UserDto } | UserDto) {
    const payload = (updateUserDto as any).body || updateUserDto;
    this.logger.log(`Updating user: ${payload.steamid}`);
    return this.createOrUpdateUserUseCase.execute({
      encryptedSteamId: payload.steamid,
      completedGames: payload.completedGames || []
    });
  }
}
