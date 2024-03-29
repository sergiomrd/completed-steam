import { Document } from 'mongoose';
import { Game } from './game.interface';
export interface VanityUserResponse {
    steamid: string,
    success: number
}

export interface OwnedGamesResponse {
    game_count: number,
    games: Game[]
}

export interface PlayerSummaries {
    steamid: string,
    communityvisibilitystate: number,
    profilestate: number,
    personaname: string,
    lastlogoff: number,
    profileurl: string,
    avatar: string,
    avatarmedium:string,
    avatarfull:string,
}

export interface User extends Document {
    id: string;
    steamid: string;
    completedGames: string[];
    creationDate: string,
    modificationDate: string
}

