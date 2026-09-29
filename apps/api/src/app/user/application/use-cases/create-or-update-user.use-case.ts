import { User, IUserRepository, SaveUserCommand } from '../../domain';
import { IEncryptionService } from '../../../security/domain';

export class CreateOrUpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(command: SaveUserCommand): Promise<User> {
    const rawSteamId = this.encryptionService.decrypt(command.encryptedSteamId);
    const steamId = rawSteamId || command.encryptedSteamId;

    const existingUser = await this.userRepository.find(steamId);

    if (existingUser) {
      existingUser.completedGames = [...command.completedGames];
      existingUser.modificationDate = new Date().toISOString();
      await this.userRepository.update(existingUser);
      return existingUser;
    } else {
      const now = new Date().toISOString();
      return this.userRepository.create({
        steamid: steamId,
        completedGames: [...command.completedGames],
        creationDate: now,
        modificationDate: now
      });
    }
  }
}
