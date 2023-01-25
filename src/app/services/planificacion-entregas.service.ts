import { Injectable } from '@angular/core';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { AlertasService } from './alertas.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfiguracionesService } from './configuraciones.service';

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
   public alertasService: AlertasService,
   public configuracionesService: ConfiguracionesService
   
   
   
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

    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api+ environment.rutaParam + id + environment.entregaParam + fecha;

    this.configuracionesService.api = URL;

    return URL;

  }
   getPlanificacionEntregas(ruta: string, fecha:string){

    const URL = this.getURL(environment.rutaFacturasURL,ruta, fecha);


    return this.http.get<PlanificacionEntregas[]>(URL);

  }



  

syncRutaFacturas(ruta:string, fecha:string){
 

 return  this.getPlanificacionEntregas(ruta, fecha).toPromise();

}







}
