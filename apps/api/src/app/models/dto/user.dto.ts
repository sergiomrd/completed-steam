export class UserDto {
    steamid: string;
    readonly completedGames: string[];
    readonly creationDate?: string;
    readonly modificationDate?: string;
}