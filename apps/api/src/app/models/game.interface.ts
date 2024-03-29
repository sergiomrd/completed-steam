export interface Game {
  appid: number,
  name: string,
  playtime_forever: number,
  img_icon_url: string
  img_logo_url: string,
  has_community_visible_stats: boolean,
  playtime_windows_forever: number,
  playtime_mac_forever: number,
  playtime_linux_forever: number,
  completed?: boolean;
  background?: GameBackground;
  playtime_2_weeks?: number,
}

export interface GameBackground {
  type?: number,
  url?: string
}
