import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { AlertasService } from './alertas.service';
import { PlanificacionEntregasService } from './planificacion-entregas.service';
import { RutaFacturasService } from './ruta-facturas.service';

@Injectable({
  providedIn: 'root'
})
export class ActualizarFacturasService {

actualizaFacturasArray:ActualizaFacturaGuia[]=[];
url = null;

  constructor(
    
    private http: HttpClient,
    public alertasService: AlertasService,
    public rutasFacturas: RutaFacturasService,
    public planificacionEntregasService: PlanificacionEntregasService
    
    
    
    ) { }

    limpiarDatos(){

      this.actualizaFacturasArray =[];
      this.url = null;
    }
  getIRPURL( api: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +environment.postURL + api ;
    this.url = URL
 console.log(URL, 'POST ACTUALIZAR FACTURAAS')
    return URL;


  }


  private postActualizarFactura (facturas){
    const URL = this.getIRPURL( environment.actualizaFacturasURL);
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };

    return this.http.post( URL, JSON.stringify(facturas) , options );
 
  }
  


  insertarFacturas(facturas){

    console.log(facturas, 'facturas post')

    

   return  this.postActualizarFactura(facturas).toPromise();

   // this.actualizaFacturasArray = [];


}



}
