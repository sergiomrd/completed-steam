import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Pipe({
  name: 'validUrl',
  standalone: true
})
export class ValidUrlPipe implements PipeTransform {
  private readonly http = inject(HttpClient);

  async transform(url: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.get(url));
      return true;
    } catch {
      return false;
    }
  }
}
