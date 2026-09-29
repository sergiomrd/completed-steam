import { OwnedGamesResult } from '../models/owned-games-result.model';
import { PlayerProfile } from '../../../user/domain';

export interface ISteamService {
  getOwnedGames(
    steamId: string,
    showAppInfo?: boolean,
    showFreeGames?: boolean
  ): Promise<OwnedGamesResult>;

  getPlayerSummary(steamId: string): Promise<PlayerProfile | null>;

  resolveVanityUrl(vanityUrl: string): Promise<string | null>;
}

export const STEAM_SERVICE_TOKEN = Symbol('ISteamService');
