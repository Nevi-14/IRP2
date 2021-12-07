import { Pipe, PipeTransform } from '@angular/core';
import { ClientesService } from '../services/paginas/clientes/clientes.service';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {
  constructor(public clientes: ClientesService){}
  transform(arreglo: any[],
    texto: string = '',
    columna: string = ''): any[] {
      console.log(texto,columna)
   if(texto === ''){
     return arreglo;
   }
   if(!arreglo){
     return arreglo;
   }
   // todas las busquedas de javascript son case sentisive
texto = texto.toLocaleLowerCase();
 //  return null;
 return arreglo.filter(
 //  item=> item.title.toLocaleLowerCase().includes(texto)
 item=> item[columna].toLocaleLowerCase().includes(texto) 
 );


 }

}
