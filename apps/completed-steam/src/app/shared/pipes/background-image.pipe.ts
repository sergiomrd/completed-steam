import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bgImage',
  standalone: true
})
export class BackgroundImagePipe implements PipeTransform {
  /**
   * returns the string image url as CSS background url
   * @param value Image URL
   */
  transform(value: string | undefined | null): string {
    if (value) {
      return `url(${value})`;
    }
    return '';
  }
}
