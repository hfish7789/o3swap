import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortAddress',
})
export class ShortAddressPipe implements PipeTransform {
  transform(value: any, len: number): any {
    if (!value || typeof value !== 'string') {
      return value;
    }
    return value.slice(0, len) + '...' + value.slice(-1 * len);
  }
}
