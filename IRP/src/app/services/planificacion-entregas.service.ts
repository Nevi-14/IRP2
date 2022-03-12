import { Injectable } from '@angular/core';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { AlertasService } from './alertas.service';
import { HttpClient } from '@angular/common/http';
import { DataTableService } from './data-table.service';
import { environment } from 'src/environments/environment';


interface facturaGuia{
  cliente:string,
  idGuia: string,
  factura: PlanificacionEntregas
}
interface factura{

  id: string,
  cliente:string,
  direccion:string,
  volumenTotal: number,
  pesoTotal:number,
  bultosTotales:number,
  camion:string,
  facturas: facturaGuia[]

}
@Injectable({
  providedIn: 'root'
})
export class PlanificacionEntregasService {


 rutaFacturasArray: PlanificacionEntregas[]=[];
 paginationArray:PlanificacionEntregas[]=[];
 planificacionEntregaArray :  factura[]=[];
 fecha: string;
 pesoTotal: number = 0;
 bultosTotales: number = 0;
 clientesTotales: number = 0;
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
 
  this.rutaFacturasArray = [];
  this.fecha = fecha;

  this.alertasService.presentaLoading('Cargando facturas');

  this.getPlanificacionEntregas(ruta, fecha).subscribe(
    resp =>{
      this.alertasService.loadingDissmiss();

      this.rutaFacturasArray = resp;
     // this.rutaFacturasArray = resp;
      this.bultosTotales = 0;
      this.pesoTotal = 0;
      this.planificacionEntregaArray = []

     for( let i = 0 ;  i < this.rutaFacturasArray.length; i++){

        const  facturaCliente = {

          id: this.rutaFacturasArray[i].CLIENTE_ORIGEN,
          cliente:this.rutaFacturasArray[i].NOMBRE_CLIENTE,
          direccion:this.rutaFacturasArray[i].DIRECCION_FACTURA,
          volumenTotal: this.rutaFacturasArray[i].TOTAL_VOLUMEN,
          pesoTotal:this.rutaFacturasArray[i].TOTAL_PESO_NETO,
          bultosTotales: Number(this.rutaFacturasArray[i].RUBRO1),
          camion:'',
          facturas: [
            
          ]
      
        }
     
        facturaCliente.facturas.push({cliente:facturaCliente.cliente,idGuia:null, factura:this.rutaFacturasArray[i]});

        this.agruparPorClientes(this.rutaFacturasArray[i].CLIENTE_ORIGEN,facturaCliente);


      }

      this.rutaFacturasArray.forEach(factura =>{


  
        
        this.bultosTotales +=factura.TOTAL_PESO_NETO;
        this.pesoTotal += Number(factura.RUBRO1);
        this.clientesTotales = this.planificacionEntregaArray.length;

        
      })




      this.alertasService.message('PLANIFICACIONDE ENTREGAS', 'Un total de ' + this.planificacionEntregaArray.length +' clientes se agregaron al sistema')

      this.datatableService.paginacion( this.planificacionEntregaArray, this.datatableService.resultsCount, this.datatableService.page)
    }, error  => {
      this.alertasService.loadingDissmiss();
      let errorObject = {
        titulo: 'Sincronizar Facturas Clientes',
        metodo:'GET',
        url:error.url,
        message:error.message,
        rutaError:'app/services/planificacion-entregas.ts',
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

borrarIdGuiaFactura(cienteId: string , facturaId:string){

 
 for(let i = 0; i < this.datatableService.data.length; i++){

  if(cienteId == this.datatableService.data[i].id ){

    this.datatableService.data[i].facturas.forEach(factura =>{

      if(factura.factura.FACTURA ==  facturaId){
        factura.idGuia = '';

      }
    })
  }
 }

}



}
