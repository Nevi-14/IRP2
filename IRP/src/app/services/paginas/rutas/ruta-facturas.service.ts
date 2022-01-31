import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RutaFacturas } from '../../../models/rutaFacturas';

@Injectable({
  providedIn: 'root'
})
export class RutaFacturasService {
  totalBultosFactura: number = 0;
  pesoTotalBultosFactura: number = 0;
  rutaFacturasArray: RutaFacturas[]=[];
  constructor(private http: HttpClient) { }




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




  getIrpUrl(api: string, id: string, fecha: Date){


    let test = '';
    if(!environment.prdMode){
      test = environment.TestURL;
    }

    const URL = environment.preURL + test  + environment.postURL + api+ environment.rutaParam + id + environment.entregaParam + fecha;
    console.log(URL);
    return URL;

  }



 
  getRutaFacturas(ruta: string, fecha:Date){
    const URL = this.getIrpUrl(environment.rutaFacturasURL,ruta, fecha);
    return this.http.get<RutaFacturas[]>(URL);
  }




syncRutaFacturas(ruta:string, fecha:Date){

  
 const data =  this.getRutaFacturas(ruta, fecha).subscribe(
    resp =>{
      this.rutaFacturasArray = resp;
      resp.slice(0).forEach(factura =>{
        console.log(typeof( Number(factura.RUBRO1)), Number(factura.RUBRO1)  + factura.TOTAL_PESO_NETO , 'rubri1',typeof( factura.TOTAL_PESO_NETO),'pepso t')

        this.pesoTotalBultosFactura +=factura.TOTAL_PESO_NETO;
        this.totalBultosFactura += Number(factura.RUBRO1);
        
      })

      console.log(this.pesoTotalBultosFactura, 'peso bultos')
      console.log(this.totalBultosFactura, 'total bultos')
    }
  )


 
}






}
