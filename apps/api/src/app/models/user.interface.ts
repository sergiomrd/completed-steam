import { Game } from './game.interface';
export interface VanityUserResponse {
    steamid: string,
    success: number
}

export interface OwnedGamesResponse {
    game_count: number,
    games: Game[]
}
