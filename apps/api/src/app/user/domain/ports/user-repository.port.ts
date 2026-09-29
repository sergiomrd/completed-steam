import { User } from '../models/user.model';

export interface IUserRepository {
  find(steamId: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User | null>;
}

export const USER_REPOSITORY_TOKEN = Symbol('IUserRepository');
