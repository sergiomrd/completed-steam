import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ISteamService, OwnedGamesResult } from '../../domain';
import { PlayerProfile } from '../../../user/domain';
import { Game } from '../../../game/domain';

@Injectable()
export class SteamApiAdapter implements ISteamService {
  private readonly logger = new Logger(SteamApiAdapter.name);
  private readonly apiKey: string;
  private readonly imageTypes = [
    'library_600x900.jpg',
    'library_hero.jpg',
    'header.jpg',
    'logo.png'
  ];

  constructor(
    private readonly httpService: HttpService,
    apiKey?: string
  ) {
    this.apiKey = apiKey || process.env.WEB_API || '67A6277297B21A7165425770B8CF1F66';
  }

  async getOwnedGames(
    steamId: string,
    showAppInfo: boolean = true,
    showFreeGames: boolean = true
  ): Promise<OwnedGamesResult> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1',
          {
            params: {
              key: this.apiKey,
              steamid: steamId,
              include_appinfo: showAppInfo,
              include_played_free_games: showFreeGames
            }
          }
        )
      );

      const data = response.data?.response;
      if (!data || !data.games) {
        return { game_count: 0, games: [] };
      }

      const games: Game[] = data.games.map((g: any) => ({
        appid: g.appid,
        name: g.name,
        playtime_forever: g.playtime_forever,
        img_icon_url: g.img_icon_url,
        img_logo_url: g.img_logo_url,
        has_community_visible_stats: g.has_community_visible_stats,
        playtime_windows_forever: g.playtime_windows_forever,
        playtime_mac_forever: g.playtime_mac_forever,
        playtime_linux_forever: g.playtime_linux_forever,
        playtime_2_weeks: g.playtime_2_weeks
      }));

      // Enrich first batch of games with background image paths
      games.forEach(g => {
        g.background = {
          type: 0,
          url: `https://steamcdn-a.akamaihd.net/steam/apps/${g.appid}/library_600x900.jpg`
        };
      });

      return {
        game_count: data.game_count || games.length,
        games
      };
    } catch (error: any) {
      this.logger.error(`Error fetching owned games for ${steamId}: ${error.message}`);
      return { game_count: 0, games: [] };
    }
  }

  async getPlayerSummary(steamId: string): Promise<PlayerProfile | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/',
          {
            params: {
              key: this.apiKey,
              steamids: steamId
            }
          }
        )
      );

      const players = response.data?.response?.players;
      if (!players || players.length === 0) return null;

      const p = players[0];
      return {
        steamid: p.steamid,
        personaname: p.personaname,
        profileurl: p.profileurl,
        avatar: p.avatar,
        avatarmedium: p.avatarmedium,
        avatarfull: p.avatarfull,
        communityvisibilitystate: p.communityvisibilitystate,
        profilestate: p.profilestate,
        lastlogoff: p.lastlogoff
      };
    } catch (error: any) {
      this.logger.error(`Error fetching player summary for ${steamId}: ${error.message}`);
      return null;
    }
  }

  async resolveVanityUrl(vanityUrl: string): Promise<string | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/',
          {
            params: {
              key: this.apiKey,
              vanityurl: vanityUrl
            }
          }
        )
      );
      const data = response.data?.response;
      if (data && data.success === 1) {
        return data.steamid;
      }
      return null;
    } catch (error: any) {
      this.logger.error(`Error resolving vanity URL ${vanityUrl}: ${error.message}`);
      return null;
    }
  }
}

// Backwards-compatible alias
export const SteamApiClient = SteamApiAdapter;
export type SteamApiClient = SteamApiAdapter;
