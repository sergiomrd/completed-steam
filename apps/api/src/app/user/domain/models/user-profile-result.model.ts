import { User } from './user.model';
import { PlayerProfile } from './player-profile.model';

export interface UserProfileResult {
  user: User | null;
  profile: PlayerProfile | null;
}
