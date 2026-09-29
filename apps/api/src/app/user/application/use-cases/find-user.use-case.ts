import { User, IUserRepository } from '../../domain';
import { IEncryptionService } from '../../../security/domain';

export class FindUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(encryptedSteamId: string): Promise<User | null> {
    const rawSteamId = this.encryptionService.decrypt(encryptedSteamId);
    const steamId = rawSteamId || encryptedSteamId;

    return this.userRepository.find(steamId);
  }
}
