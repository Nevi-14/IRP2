import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroClientes'
})
export class FiltroClientesPipe implements PipeTransform {

  transform(arreglo: any[],texto: string ='', columna: string = 'NOMBRE' ): any[] {
    console.log(texto)
    if(texto=== ''){
      return arreglo;
    }
    texto.toLocaleLowerCase();
    return arreglo.filter(
 item=> item[columna].toLocaleLowerCase().includes(texto)
    );
   }

}
