import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PlayerSummaries, UserDto } from '@completed-steam/api-interfaces';
import { User } from '../../domain';
import { environment } from '../../../../environments/environment';
import type { IUserApiPort } from '../ports/user-api.port';

@Injectable({
  providedIn: 'root'
})
export class HttpUserApiAdapter implements IUserApiPort {
  private readonly http = inject(HttpClient);

  async findUser(encryptedId: string): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<User>(`${environment.API}api/user/${encryptedId}`)
      );
      return response || null;
    } catch {
      return null;
    }
  }

  async createUser(dto: UserDto): Promise<any> {
    return firstValueFrom(
      this.http.post(`${environment.API}api/user/create`, { body: dto })
    );
  }

  async updateUser(dto: UserDto): Promise<any> {
    return firstValueFrom(
      this.http.put(`${environment.API}api/user/update`, { body: dto })
    );
  }

  async getPlayerSummary(encryptedId: string): Promise<PlayerSummaries | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ players?: PlayerSummaries[] }>(`${environment.API}api/user`, {
          params: { id: encryptedId }
        })
      );
      if (response && response.players && response.players.length > 0) {
        return response.players[0];
      }
      return null;
    } catch {
      return null;
    }
  }
}
