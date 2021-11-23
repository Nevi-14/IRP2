import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroClientes'
})
export class FiltroClientesPipe implements PipeTransform {

  transform(arreglo: any[],texto: any , columna: string = 'NOMBRE' ): any[] {

  
    if(texto=== ''){
      return arreglo;
    }
    texto.toLocaleLowerCase();
    return arreglo.filter(
 item=> item[columna].toLocaleLowerCase().includes(texto)
    );
   }

}
