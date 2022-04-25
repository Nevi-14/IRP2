import { Injectable } from '@angular/core';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { AlertasService } from './alertas.service';
import { HttpClient } from '@angular/common/http';
import { DataTableService } from './data-table.service';
import { environment } from 'src/environments/environment';

interface facturas {
idFactura:string,
cliente:string,
factura: PlanificacionEntregas;
idGuia:  string

}

interface clientesFacturas{

  id: string,
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
 paginationArray:PlanificacionEntregas[]=[];
 planificacionEntregaArray :  clientesFacturas[]=[];
 fecha: string;
 totalFacturas: number = 0;
 pesoTotal: number = 0;
 volumenTotal: number = 0;
 bultosTotales: number = 0;
 totalClientes: number = 0;
 errorArray =[]
 constructor(
   
   private http: HttpClient,  
   public datatableService: DataTableService,
   public alertasService: AlertasService
   
   
   
   ) { }


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
 
  this.planificacionEntregaArray = [];
  this.fecha = fecha;

  this.alertasService.presentaLoading('Cargando facturas Ruta ' + ruta);

  this.getPlanificacionEntregas(ruta, fecha).subscribe(
    resp =>{

      console.log(resp, 'resp')


      if(resp.length == 0 ){

        this.alertasService.loadingDissmiss();
    
        return
      }
      



      let clienteFactura :clientesFacturas;
      
      this.totalFacturas = 0;
      this.pesoTotal = 0;
      this.bultosTotales = 0;
      this.volumenTotal = 0;
      this.totalFacturas = resp.length;
      this.totalClientes = 0;
   
      for ( let i = 0; i < resp.length; i++){

       
        this.pesoTotal +=  resp[i].TOTAL_PESO_NETO;
        this.bultosTotales += resp[i].TOTAL_UNIDADES;
        this.volumenTotal += resp[i].TOTAL_VOLUMEN;

        clienteFactura = {

          id: resp[i].CLIENTE_ORIGEN,
          cliente: resp[i].NOMBRE_CLIENTE,
          direccion: resp[i].DIRECCION_FACTURA,
          incluir: resp[i].LONGITUD  && resp[i].LATITUD ? true : false,
          facturas:  [],
          volumenTotal:  resp[i].TOTAL_VOLUMEN,
          pesoTotal: resp[i].TOTAL_PESO_NETO,
          bultosTotales: resp[i].TOTAL_UNIDADES
      
        
        }




let factura: facturas = {
  idFactura:resp[i].FACTURA,
  cliente: resp[i].NOMBRE_CLIENTE,
  idGuia:null,
  factura: resp[i]

}
  

clienteFactura.facturas.push(factura)

let index = this.planificacionEntregaArray.findIndex( factura => factura.id == clienteFactura.id)

if(index < 0){

  clienteFactura.volumenTotal += resp[i].TOTAL_VOLUMEN;
  clienteFactura.pesoTotal += resp[i].TOTAL_PESO_NETO;
  clienteFactura.bultosTotales += Number( resp[i].RUBRO1);

this.planificacionEntregaArray.push(clienteFactura)


}else{
  this.planificacionEntregaArray[index].facturas.push(factura)
this.planificacionEntregaArray[index].volumenTotal += resp[i].TOTAL_VOLUMEN;
this.planificacionEntregaArray[index].pesoTotal += resp[i].TOTAL_PESO_NETO;
this.planificacionEntregaArray[index].bultosTotales += Number( resp[i].RUBRO1);


}

if(i === resp.length -1  ){

  this.alertasService.loadingDissmiss();
      
  console.log(this.planificacionEntregaArray, 'this.planificacionEntregaArray ')
  this.totalClientes = 0;
  this.totalClientes = this.planificacionEntregaArray.length
}



      }


      


   this.datatableService.paginacion( this.planificacionEntregaArray, this.datatableService.resultsCount, this.datatableService.page)

   
    }, error  => {
      this.alertasService.loadingDissmiss();
      let errorObject = {
        titulo: 'Planificacion Entregas',
        metodo:'GET',
        url:error.url,
        message:error.message,
        rutaError:'http://api_irp.di-apps.co.cr/api/Facturas/?ruta='+ruta+'HE01&entrega='+this.fecha,
        json:JSON.stringify(this.planificacionEntregaArray)
      }
      this.alertasService.elementos.push(errorObject)
      
    }
  )


 
}


agruparPorClientes(identificador, factura){
const i = this.planificacionEntregaArray.findIndex(factura => factura.id === identificador);

if(i >=0){

  this.planificacionEntregaArray[i].facturas.push(factura.facturas[0])
  return 

}

 this.planificacionEntregaArray.push(factura);

}

borrarIdGuiaFacturas(){

  for(let i = 0; i < this.datatableService.data.length; i++){
 
    this.datatableService.data[i].facturas.forEach(factura =>{

      factura.idGuia = '';

    })
  }
 
 }

borrarIdGuiaFactura(idGuia){

 console.log(idGuia)
 for(let i = 0; i < this.datatableService.data.length; i++){

  this.datatableService.data[i].facturas.forEach(factura =>{
   if(factura.idGuia == idGuia){
    factura.idGuia = '';
   }
  })
 }

}



}
