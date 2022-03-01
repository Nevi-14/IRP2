import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {


  // busqueda

textoBuscar = '';

  //   GUARDA TODOS LOS REGISTROS EN UN ARREGLO
  data = [];
  // GUARDA LOS ELEMENTOS A MOSTRAR POR VISTA
  dataArrayToShow = [];
  
// DATATABLE VARIABLES


//  PAGINA INICIAL
page = 0;
//  TOTAL RESULTADOS POR PAGINA
resultsCount = 5;
//  TOTAL de paginas
totalPages = 0;

bulkEdit = false;
sortDirection = 0;
sortKey = null;


edit = {};
// END DATATABLE


  constructor() { }


   getPageStart(pageSize, pageNr) {
    return pageSize * pageNr;
  };
  
   getPageLabel(total, pageSize, pageNr) {
    const start = Math.max(
      this.getPageStart(pageSize, pageNr),
      0
    );
    const end = Math.min(
      this.getPageStart(pageSize, pageNr + 1),
      total
    );
    console.log({
      inicio:start ,
      fin : end -1 
    })
    return {
      inicio:start ,
      fin : end -1
    }
  }



transform(arreglo: any[],
  columna: string = ''): any[] {
 let   texto = this.textoBuscar;
    console.log(texto,columna)
 if(texto === ''){
  this.paginacion(this.data, this.resultsCount , 0)
  return
 }
 if(!arreglo){
   return arreglo;
 }
 // todas las busquedas de javascript son case sentisive
texto = texto.toLocaleLowerCase();
//  return null;
const arregloRetorno = arreglo.filter(
//  item=> item.title.toLocaleLowerCase().includes(texto)
item=> item[columna].toLocaleLowerCase().includes(texto) 
);

console.log(arregloRetorno,'retorno')
this.paginacionBusqueda(arregloRetorno, arregloRetorno.length , 0)

}

  // buscar
  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
     this.transform(this.data , 'NOMBRE_CLIENTE')
   }

  sortBy(key){

    this.sortKey = key;
    this.sortDirection++;
    this.sort();
    
    
      }
    
    
      sort(){
        if(this.sortDirection == 1){
          this.data =   this.data.sort((a,b)=>{
            const valA = a[this.sortKey];
            const valB = b[this.sortKey];
            return valA.localeCompare(valB)
          })
    
        }else if (this.sortDirection == 2){
          this.data =   this.data.sort((a,b)=>{
            const valA = a[this.sortKey];
            const valB = b[this.sortKey];
            return valB.localeCompare(valA)
          });
        }else{
          this.sortDirection = 0;
          this.sortKey = null;
        }
    
      }
    
      toggleBulkEdit(){
        this.bulkEdit = !this.bulkEdit;
        this.edit = {};
        this.loadData();
        
      }
    
      bulkDelete(){
    
        console.log('this.edit', this.edit)
    
        const toDelete = Object.keys(this.edit);
  
        const reallyDelete = toDelete.filter(index => this.edit[index]).map(key => +key);
    
        while(reallyDelete.length){
          this.data.splice(reallyDelete.pop(), 1);
        }
        this.toggleBulkEdit();
      }
    
    
    
    
      removeRow(index){
    // REMOVE ROW FROM LIST
       // this.rutaFacturas.rutaFacturasArray.splice(index,1);
        this.data.splice(index, 1);
        this.dataArrayToShow.splice(index, 1);
        this.loadData();

      }
    
    
    
    
    nextPage(){
      this.page++;
      this.loadData();
    }
    prevPage(){
      this.page--;
      this.loadData();
    }
    goFirst(){
      this.page = 0;
      this.loadData();
    }
    
    
    goLast(){
      this.page = this.totalPages -1;
    this.loadData();
    /**
     *   this.datableService.page = this.datableService.totalPages -1;
this.loadData();
     */
    }
    
    paginacionBusqueda(array, page_size, page_number){

      const size = page_size;
      this.dataArrayToShow = [];
      const pages = Array.from(
        //elementos por pagina
        { length: Math.ceil(array.length / size) },
        (_, i) => this.getPageLabel(array.length, size, i)
      )
      this.totalPages = pages.length;

      for (let i = pages[page_number].inicio ; i < pages[page_number].fin ; i++ ){
       
        this.dataArrayToShow.push(array[i])
      }
     
          }








        
    paginacion(array, page_size, page_number){


//const elementosPorPagina = Array.from({ length: array.length }, (_, i) => `Item ${i + 1}`);
const size = array.length > page_size ? page_size : array.length;
console.log(size, 'sizeeeeee')
this.data = [];
this.data = array;


console.log(this.data, 'data aarrya')
const pages = Array.from(
  
  //elementos por pagina
  { length: Math.ceil(array.length / size) },
  (_, i) => this.getPageLabel(array.length, size, i)
)
const paginaInicial = 1;
this.totalPages = pages.length;

this.dataArrayToShow = [];

if(array.length >0){
  for (let i = pages[page_number].inicio ; i <= pages[page_number].fin ; i++ ){

    this.dataArrayToShow.push(this.data[i])
  }

}



    }
    
    loadData(){
    
this.paginacion(this.data, this.resultsCount, this.page)
    

      
    }







}
