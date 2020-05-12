import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bgImage'
})
export class BackgroundImagePipe implements PipeTransform {
    /**
     * returns the string image url as CSS background url
     * @param value Image URL
     */
  transform(value: string): string {
    if (value) {
      return `url(${value})`;
    }
    return '';
  }
}
