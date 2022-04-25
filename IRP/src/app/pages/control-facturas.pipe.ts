import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'controlFacturas'
})
export class ControlFacturasPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
