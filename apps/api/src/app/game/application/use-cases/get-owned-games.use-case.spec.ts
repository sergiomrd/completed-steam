import { GetOwnedGamesUseCase } from './get-owned-games.use-case';
import { Filters } from '../../domain';
import { ISteamService } from '../../../steam/domain';
import { IUserRepository } from '../../../user/domain';
import { IEncryptionService } from '../../../security/domain';

describe('GetOwnedGamesUseCase', () => {
  let useCase: GetOwnedGamesUseCase;
  let mockSteamService: jest.Mocked<ISteamService>;
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockEncryptionService: jest.Mocked<IEncryptionService>;

  beforeEach(() => {
    mockSteamService = {
      getOwnedGames: jest.fn().mockResolvedValue({
        game_count: 2,
        games: [
          { appid: 10, name: 'Game A', playtime_forever: 100, img_icon_url: '', img_logo_url: '', has_community_visible_stats: true },
          { appid: 20, name: 'Game B', playtime_forever: 200, img_icon_url: '', img_logo_url: '', has_community_visible_stats: true }
        ]
      }),
      getPlayerSummary: jest.fn(),
      resolveVanityUrl: jest.fn()
    };

    mockUserRepo = {
      find: jest.fn().mockResolvedValue({
        steamid: '76561198000',
        completedGames: ['10']
      }),
      create: jest.fn(),
      update: jest.fn()
    };

    mockEncryptionService = {
      encrypt: jest.fn((val: string) => `enc_${val}`),
      decrypt: jest.fn((val: string) => val.replace('enc_', ''))
    };

    useCase = new GetOwnedGamesUseCase(
      mockSteamService,
      mockUserRepo,
      mockEncryptionService
    );
  });

  it('should return all games with completion marked', async () => {
    const result = await useCase.execute({
      encryptedSteamId: 'enc_76561198000',
      filter: Filters.All
    });

    expect(result.game_count).toBe(2);
    expect(result.games.length).toBe(2);
  });

  it('should filter completed games correctly', async () => {
    const result = await useCase.execute({
      encryptedSteamId: 'enc_76561198000',
      filter: Filters.Completed
    });

    expect(result.games.length).toBe(1);
    expect(result.games[0].appid).toBe(10);
    expect(result.games[0].completed).toBe(true);
  });
});
