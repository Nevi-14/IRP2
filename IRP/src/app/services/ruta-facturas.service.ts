import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RutaFacturas } from '../models/rutaFacturas';
import { DataTableService } from './data-table.service';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class RutaFacturasService {

  loading: HTMLIonLoadingElement;

  // control perso facturas
  totalBultosFactura: number = 0;
  pesoTotalBultosFactura: number = 0;

  //

  rutaFacturasArray: RutaFacturas[]=[];

  paginationArray:RutaFacturas[]=[];


  constructor(
    
    private http: HttpClient,  
    public datatableService: DataTableService,
    public alertasService: AlertasService
    
    
    
    ) { }










  getIrpUrl(api: string, id: string, fecha: string){


    let test = '';
    if(!environment.prdMode){

      test = environment.TestURL;
      
    }

    const URL = environment.preURL + test  + environment.postURL + api+ environment.rutaParam + id + environment.entregaParam + fecha;



    return URL;

  }



 
  getRutaFacturas(ruta: string, fecha:string){

    const URL = this.getIrpUrl(environment.rutaFacturasURL,ruta, fecha);

    return this.http.get<RutaFacturas[]>(URL);

  }



  

syncRutaFacturas(ruta:string, fecha:string){

  this.alertasService.presentaLoading('Cargando facturas');

  this.getRutaFacturas(ruta, fecha).subscribe(
    resp =>{
      this.rutaFacturasArray = resp;
      this.totalBultosFactura = 0;
      this.pesoTotalBultosFactura = 0;
      this.rutaFacturasArray.forEach(factura =>{


        console.log(typeof( Number(factura.RUBRO1)), Number(factura.RUBRO1)  + factura.TOTAL_PESO_NETO , 'rubri1',typeof( factura.TOTAL_PESO_NETO),'pepso t')

        this.pesoTotalBultosFactura +=factura.TOTAL_PESO_NETO;
        this.totalBultosFactura += Number(factura.RUBRO1);

        
      })

      this.alertasService.loadingDissmiss();

      this.alertasService.message('PLANIFICACIONDE ENTREGAS', 'Un total de ' + resp.length +' facturas se agregaron al sistema')
       
      console.log(this.pesoTotalBultosFactura, 'peso bultos')
      console.log(this.totalBultosFactura, 'total bultos')
      this.datatableService.paginacion( this.rutaFacturasArray, this.datatableService.resultsCount, this.datatableService.page)
    }
  )


 
}






}
