import {Pipe, PipeTransform} from '@angular/core';
import {NumberUtil} from '../util/number.util';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {
  transform(value: number, precision: number = 0): number {
    return NumberUtil.round(value, precision);
  }
}
