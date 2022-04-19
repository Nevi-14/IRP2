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
url = null;

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
    this.postActualizarFactura(facturas).subscribe(

      resp => {
        console.log(facturas, 'completed')
  
        this.rutasFacturas.rutaFacturasArray = []
        
        this.rutasFacturas.pesoTotalBultosFactura =0
        this.rutasFacturas.pesoTotalBultosFactura =0
        this.rutasFacturas.rutaFacturasArray = []
        this.datatableService.dataArrayToShow = [];
        this.datatableService.data = [];
        this.planificacionEntregasService.bultosTotales = 0;
        this.planificacionEntregasService.clientesTotales = 0;
        this.planificacionEntregasService.fecha = null;
        this.planificacionEntregasService.pesoTotal = 0;
        this.planificacionEntregasService.rutaFacturasArray = [];
     



      }, error => {
      //  this.alertasService.loadingDissmiss();
      // nombre controlador
        let errorObject = {
          titulo: 'Insertar Facturas',
          metodo:'POST',
          url:error.url,
          message:error.message,
          rutaError:'app/services/actualiza-clientes-factura.ts',
          json:JSON.stringify(this.actualizaFacturasArray)
        }
        this.planificacionEntregasService.errorArray.push(errorObject)
        console.log(JSON.stringify(this.actualizaFacturasArray), ' lista facturas json  error')
       ;
        
    }
      )

   // this.actualizaFacturasArray = [];


}



}
