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
  dataFiltro = [];


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
    console.log ( {
      inicio:start ,
      fin : end -1 == 0 ? 1 : end -1
    })
    return {
      inicio:start ,
      fin : end -1 == 0 ? 1 : end -1
    }
  }


  transform(arreglo: any[],
    texto: string = '',
    columna: string = ''): any[] {
      console.log(texto,columna, arreglo)
   if(texto === '' || !arreglo){
     console.log('cargando datos')
     this.paginacion(this.data, this.resultsCount  , 0 , false)

  return;
   }

   // todas las busquedas de javascript son case sentisive
texto = texto.toLocaleLowerCase();
 //  return null;
 let retornArray = arreglo.filter(
 //  item=> item.title.toLocaleLowerCase().includes(texto)
 item=> item[columna].toLocaleLowerCase().includes(texto) 

 );
 this.paginacion(retornArray, retornArray.length == 0 ? retornArray.length +1  : retornArray.length , 0, true)

 }


  // buscar
  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
     console.log(this.data, 'data arreglo')
     this.transform(this.dataFiltro , this.textoBuscar, 'NOMBRE_CLIENTE')
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
        console.log(toDelete)
        const reallyDelete = toDelete.filter(index => this.edit[index]).map(key => +key);
        console.log(reallyDelete);
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
    
    
    paginacion(array, page_size, page_number, filtrar){


// toda pagina inicia desde 0

//const elementosPorPagina = Array.from({ length: array.length }, (_, i) => `Item ${i + 1}`);

console.log(array,page_size,page_number)
const size = page_size+1;
if(!filtrar){
  this.data = []
  this.data = array;
}

this.dataFiltro = [];
this.dataFiltro = array;
const pages = Array.from(
  
  //elementos por pagina
  { length: Math.ceil(array.length / size) },
  (_, i) => this.getPageLabel(array.length, size, i)
)
const paginaInicial = 1;
this.totalPages = pages.length;

this.dataArrayToShow = [];

for (let i = pages[page_number].inicio ; i < pages[page_number].fin  ; i++ ){
  console.log('oush', this.data[i], array, pages[page_number].inicio, pages[page_number].fin)
  this.dataArrayToShow.push(this.data[i])
}

console.log(this.dataArrayToShow, 'show')

console.log(this.data, ' data array', pages[page_number].inicio , pages[page_number].fin)
    }
    
    loadData(){
    
this.paginacion(this.data, this.resultsCount, this.page, false)
    

      
    }







}
