import {
  HandleSteamCallbackRequest,
  HandleSteamCallbackResponse
} from '../../domain';
import { IUserRepository } from '../../../user/domain';
import { IEncryptionService } from '../../../security/domain';

export class HandleSteamCallbackUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptionService: IEncryptionService
  ) {}

  async execute(request: HandleSteamCallbackRequest): Promise<HandleSteamCallbackResponse> {
    const { steamId } = request;
    const encryptedId = this.encryptionService.encrypt(steamId);

    const existingUser = await this.userRepository.find(steamId);
    let isNewUser = false;

    if (!existingUser) {
      const now = new Date().toISOString();
      await this.userRepository.create({
        steamid: steamId,
        completedGames: [],
        creationDate: now,
        modificationDate: now
      });
      isNewUser = true;
    }

    return { encryptedId, isNewUser };
  }
}
