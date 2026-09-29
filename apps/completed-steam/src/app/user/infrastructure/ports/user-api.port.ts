import { InjectionToken } from '@angular/core';
import { PlayerSummaries, UserDto } from '@completed-steam/api-interfaces';
import { User } from '../../domain';

export interface IUserApiPort {
  findUser(encryptedId: string): Promise<User | null>;
  createUser(dto: UserDto): Promise<any>;
  updateUser(dto: UserDto): Promise<any>;
  getPlayerSummary(encryptedId: string): Promise<PlayerSummaries | null>;
}

export const USER_API_PORT = new InjectionToken<IUserApiPort>('USER_API_PORT');
