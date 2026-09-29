export interface Message {
  message: string;
}

export interface UserDto {
  steamid: string;
  completedGames: string[];
  creationDate?: string;
  modificationDate?: string;
}

export interface VanityUserResponse {
  steamid: string;
  success: number;
}

export interface GameBackgroundDto {
  type?: number;
  url?: string;
}

export interface GameDto {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  img_logo_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever?: number;
  playtime_mac_forever?: number;
  playtime_linux_forever?: number;
  completed?: boolean;
  background?: GameBackgroundDto;
  playtime_2_weeks?: number;
}

export type Game = GameDto;

export interface OwnedGamesResponse {
  game_count: number;
  games: GameDto[];
}

export interface PlayerSummaries {
  steamid: string;
  communityvisibilitystate?: number;
  profilestate?: number;
  personaname: string;
  lastlogoff?: number;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
}
