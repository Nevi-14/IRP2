import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { AlertasService } from './alertas.service';
import { PlanificacionEntregasService } from './planificacion-entregas.service';
import { RutaFacturasService } from './ruta-facturas.service';
import { ConfiguracionesService } from './configuraciones.service';

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
    public planificacionEntregasService: PlanificacionEntregasService,
    public configuracionesService: ConfiguracionesService
    
    
    
    ) { }

  limpiarDatos(){

    this.actualizaFacturasArray =[];
    this.url = null;
  }


  getURL( api: string,identifier?: string ){

    let id = identifier ? identifier : "";
    let test: string = ''
   
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api + id;
    this.configuracionesService.api = URL;

    return URL;

  }

  private postActualizarFactura (facturas){
    const URL = this.getURL( environment.actualizaFacturasURL);
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
