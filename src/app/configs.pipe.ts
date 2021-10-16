import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'configs'
})
export class ConfigsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
