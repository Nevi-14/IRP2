import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatatableService {
  dataTableArray:any []=[];
  page = 0;
  totalPages:number = 0;
  totalElements:number = 0;
  totalGroupElements:number = 0;
  constructor() { }


  paginarArreglo (arr, size) {

    return arr.reduce((acc, val, i) => {

      let idx = Math.floor(i / size)
      let page = acc[idx] || (acc[idx] = [])
      page.push(val)
      return acc
    }, [])
  }

 
  async generarDataTable(arr, size){

  this.dataTableArray = this.paginarArreglo(arr, size);

  return this.dataTableArray;

  console.log(this.dataTableArray, 'datatble')

  }

  async agruparElementos(arr:any[], groupBy , objectElements?:any[]){

    let grupos = {};

    arr.forEach(item =>{

      let object:any  = { 

      }

if(objectElements.length > 0){

  objectElements.forEach(objectPoperty =>{

    if(objectPoperty.default){

      object[objectPoperty.name] = item

    }else{

      object[objectPoperty.name]  = '';

    }



  });

}

 const group = item[groupBy];
 // EN CASO DE NO ENCONTRAR EL ELEMENTO AGRUPADO DEVUELVE UN ARREGLO VACIO
 if(!grupos[group]) grupos[group] =[]; 
 // DE LO CONTARIO AGREGAR UN NUEVO ELEMENTO  
    grupos[group].push( object )

    });
// DEVUELVE EL OBJETO EN FORMA DE ARREGLO
    return Object.values(grupos)

  }

// NOS PERMITE PASAR A LA SIGUIENTE PAGINA

prev(page){

 this.page =  page <= 0 ? 0: page -1;
 this.dataTableArray[this.page]


   }
 
// NOS PERMITE PASAR A LA SIGUIENTE PAGINA

 next(page){

 this.page =  page+1 == this.dataTableArray.length ?  this.dataTableArray.length -1 : page+1;
 this.dataTableArray[this.page]


   }



}
