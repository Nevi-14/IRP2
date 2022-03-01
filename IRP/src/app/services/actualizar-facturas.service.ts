import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { AlertasService } from './alertas.service';
import { DataTableService } from './data-table.service';
import { PlanificacionEntregasService } from './planificacion-entregas.service';
import { RutaFacturasService } from './ruta-facturas.service';

@Injectable({
  providedIn: 'root'
})
export class ActualizarFacturasService {

actualizaFacturasArray:ActualizaFacturaGuia[]=[];


  constructor(
    
    private http: HttpClient,
    public alertasService: AlertasService,
    public datatableService: DataTableService,
    public rutasFacturas: RutaFacturasService,
    public planificacionEntregasService: PlanificacionEntregasService
    
    
    
    ) { }

  getIRPURL( api: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +environment.postURL + api ;
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
  


  insertarFacturas(){

    console.log(this.actualizaFacturasArray, 'this.actualizaFacturasArray insertar post')
this.alertasService.presentaLoading('Guardando facturas')
   this.postActualizarFactura(this.actualizaFacturasArray).subscribe(

    resp => {
 

      this.alertasService.loadingDissmiss();

      this.alertasService.message( 'PLANIFICACION DE ENTREGAS', 'Las facturas se guardaron con exito');

      this.rutasFacturas.rutaFacturasArray = []
      
      this.rutasFacturas.pesoTotalBultosFactura =0
      this.rutasFacturas.pesoTotalBultosFactura =0
      this.rutasFacturas.rutaFacturasArray = []
      this.datatableService.dataArrayToShow = [];
      this.datatableService.data = [];
      this.planificacionEntregasService.bultosTotales = null;
      this.planificacionEntregasService.clientesTotales = null;
      this.planificacionEntregasService.fecha = null;
      this.planificacionEntregasService.pesoTotal = null;
      this.planificacionEntregasService.rutaFacturasArray = [];
    }, error => {
      console.log(JSON.stringify(this.actualizaFacturasArray), ' lista facturas json  error')
      
  }
    )
  

    this.actualizaFacturasArray = [];


}



}
