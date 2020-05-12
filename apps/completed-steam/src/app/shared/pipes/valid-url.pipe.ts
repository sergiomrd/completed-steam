import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'validUrl'
})
export class ValidUrlPipe implements PipeTransform {
    /**
     * returns the string image url as CSS background url
     * @param value Image URL
     */
  constructor(private http: HttpClient){}

  async transform(url: string): Promise<any> {
    await this.http.get(url).pipe(map(res => {
      if(res) {
        return true;
      }

      return false;
    }));

  }
}
