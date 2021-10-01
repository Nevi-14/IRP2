import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroClientes'
})
export class FiltroClientesPipe implements PipeTransform {

  transform(arreglo: any[],texto: string ='', columna: string = 'nombre' ): any[] {
    if(texto=== ''){
      return arreglo;
    }
    texto.toLocaleLowerCase();
    return arreglo.filter(
 item=> item[columna].toLocaleLowerCase().includes(texto)
    );
   }

}
