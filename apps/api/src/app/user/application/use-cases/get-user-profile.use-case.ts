import { IUserRepository, UserProfileResult } from '../../domain';
import { ISteamService } from '../../../steam/domain';
import { IEncryptionService } from '../../../security/domain';

export class GetUserProfileUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly steamService: ISteamService,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(encryptedSteamId: string): Promise<UserProfileResult> {
    const rawSteamId = this.encryptionService.decrypt(encryptedSteamId);
    const steamId = rawSteamId || encryptedSteamId;

    const [user, profile] = await Promise.all([
      this.userRepository.find(steamId),
      this.steamService.getPlayerSummary(steamId)
    ]);

    return { user, profile };
  }
}
