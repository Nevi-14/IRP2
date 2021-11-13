import { Pipe, PipeTransform } from '@angular/core';
import { ClientesService } from '../services/paginas/clientes/clientes.service';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {
  constructor(){}
  transform(arreglo: any[],
    texto: string = '',
    columna: string = ''): any[] {

   if(texto === ''){
     return arreglo;
   }

   if(!arreglo){
     return arreglo;
   }
   // todas las busquedas de javascript son case sentisive
texto = texto.toLocaleLowerCase();
//alert(texto)
 //  return null;
  let filteredArrayLength = arreglo.filter(
  (element) =>{

      element[columna].toLocaleLowerCase().includes(texto) 
  }

 );
console.log('length' , filteredArrayLength.length)


Array.length === filteredArrayLength.length;

return arreglo;

 }

}
