import { Injectable } from '@angular/core';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { AlertasService } from './alertas.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatatableService } from './datatable.service';

interface facturas {
idFactura:string,
cliente:string,
factura: PlanificacionEntregas;
idGuia:  string

}

interface clientesFacturas{

  id: number,
  cliente:string,
  direccion:string,
  incluir: boolean,
  facturas: facturas[],
  volumenTotal: number,
  pesoTotal:number,
  bultosTotales:number


}
@Injectable({
  providedIn: 'root'
})
export class PlanificacionEntregasService {


 rutaFacturasArray: PlanificacionEntregas[]=[];
 errorArray =[]
 constructor(
   
   private http: HttpClient,  
   public datatableService: DatatableService,
   public alertasService: AlertasService
   
   
   
   ) { }


   limpiarDatos(){

    this.rutaFacturasArray =[];

    this.errorArray =[]

   }

   getURL(api: string, id: string, fecha: string){


    let test = '';
    if(!environment.prdMode){

      test = environment.TestURL;
      
    }

    const URL = environment.preURL + test  + environment.postURL + api+ environment.rutaParam + id + environment.entregaParam + fecha;

  console.log(URL)

    return URL;

  }
   getPlanificacionEntregas(ruta: string, fecha:string){

    const URL = this.getURL(environment.rutaFacturasURL,ruta, fecha);


    return this.http.get<PlanificacionEntregas[]>(URL);

  }



  

syncRutaFacturas(ruta:string, fecha:string){
 

 return  this.getPlanificacionEntregas(ruta, fecha).toPromise();

}




borrarIdGuiaFacturas(){

  


  this.datatableService.dataTableArray.forEach(cliente =>{

    for(let i =0; i < cliente.length; i++){

      for( let j = 0; j < cliente[i].length; j++){
        cliente[i][j].factura.TIPO_DOCUMENTO = 'F';
        cliente[i][j].idGuia = '';
      }
  
    };
  
  });
 
 }

borrarIdGuiaFactura(idGuia){

  this.datatableService.dataTableArray.forEach(cliente =>{

    for(let i =0; i < cliente.length; i++){

      for( let j = 0; j < cliente[i].length; j++){
       
        if( cliente[i][j].idGuia == idGuia){
          cliente[i][j].idGuia = '';
         }
      }
  
    };
  
  });
  


}



}
