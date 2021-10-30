import { Pipe, PipeTransform } from '@angular/core';
import { RutasService } from '../services/rutas.service';

@Pipe({
  name: 'rutas'
})
export class RutasPipe implements PipeTransform {
  constructor(private rutas: RutasService) { }
  transform(value: any): any {

    const ruta = this.rutas.rutas.find( d => d.RUTA === value );
    if ( ruta !== undefined){
      return ruta.DESCRIPCION;
    } else {
      return '';
    }
  }
}
