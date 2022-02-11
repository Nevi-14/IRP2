import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RutaFacturas } from '../models/rutaFacturas';
import { LoadingController } from '@ionic/angular';
import { RutasPageModule } from '../pages/rutas/rutas.module';
import { DataTableService } from './data-table.service';

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
  constructor(private http: HttpClient, private loadingCtrl: LoadingController, public datatableService: DataTableService) { }

  async presentaLoading( mensaje: string ){
    this.loading = await this.loadingCtrl.create({
      message: mensaje,
    });
    await this.loading.present();
  }

   loadingDissmiss(){
    this.loading.dismiss();
  }




  formatoFecha(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}




  getIrpUrl(api: string, id: string, fecha: string){


    let test = '';
    if(!environment.prdMode){
      test = environment.TestURL;
    }

    const URL = environment.preURL + test  + environment.postURL + api+ environment.rutaParam + id + environment.entregaParam + fecha;
    console.log(URL);
    return URL;

  }



 
  getRutaFacturas(ruta: string, fecha:string){
    const URL = this.getIrpUrl(environment.rutaFacturasURL,ruta, fecha);
    return this.http.get<RutaFacturas[]>(URL);
  }


  paginate(array, page_size, page_number) {
    this.paginationArray = [];
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    console.log( array.slice((page_number - 1) * page_size, page_number * page_size), ' pagination')
    this.paginationArray = array.slice((page_number - 1) * page_size, page_number * page_size);
 
  }
  

syncRutaFacturas(ruta:string, fecha:string){

  
  this.getRutaFacturas(ruta, fecha).subscribe(
    resp =>{
      this.rutaFacturasArray = resp;
      this.totalBultosFactura = 0;
      this.pesoTotalBultosFactura = 0;
      this.rutaFacturasArray.forEach(factura =>{


        console.log(typeof( Number(factura.RUBRO1)), Number(factura.RUBRO1)  + factura.TOTAL_PESO_NETO , 'rubri1',typeof( factura.TOTAL_PESO_NETO),'pepso t')

        this.pesoTotalBultosFactura +=factura.TOTAL_PESO_NETO;
        this.totalBultosFactura += Number(factura.RUBRO1);
        const timeStamp = Math.floor(Date.now() / 1000);

        const consecutivo = factura.FACTURA + timeStamp;
        factura.CONSECUTIVO = consecutivo
        
      })

      console.log(this.pesoTotalBultosFactura, 'peso bultos')
      console.log(this.totalBultosFactura, 'total bultos')
      this.datatableService.paginacion( this.rutaFacturasArray, this.datatableService.resultsCount, this.datatableService.page)
    }
  )


 
}






}
