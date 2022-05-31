import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';

@Pipe({
  name: 'transNumber',
})
export class TransNumberPipe implements PipeTransform {
  transform(value: any): any {
    if (!value || new BigNumber(value).isNaN()) {
      return value;
    }
    return new BigNumber(value).dp(8).toFormat();
  }
}
