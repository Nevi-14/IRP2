import { Pipe, PipeTransform } from '@angular/core';
import { ClientesService } from '../services/clientes.service';

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

   console.log(typeof(texto), ' typeof')
   // todas las busquedas de javascript son case sentisive
   if(typeof(texto) != 'boolean' ){
    texto = texto.toLocaleLowerCase();

     //  return null;
 return arreglo.filter(
  //  item=> item.title.toLocaleLowerCase().includes(texto)
  item=> item[columna].toLocaleLowerCase().includes(texto) 
  );


   }else{

    texto = texto

     //  return null;
 return arreglo.filter(
  //  item=> item.title.toLocaleLowerCase().includes(texto)
  item=> item[columna] == texto
  );
   }




 }

}
