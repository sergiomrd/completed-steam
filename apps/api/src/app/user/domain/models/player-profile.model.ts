export interface PlayerProfile {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  communityvisibilitystate?: number;
  profilestate?: number;
  lastlogoff?: number;
}
