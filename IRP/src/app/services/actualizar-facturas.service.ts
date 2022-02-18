import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';

@Injectable({
  providedIn: 'root'
})
export class ActualizarFacturasService {

actualizaFacturasArray:ActualizaFacturaGuia[]=[];


  constructor(private http: HttpClient) { }

  getIRPURL( api: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +environment.postURL + api ;

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

  this.postActualizarFactura(this.actualizaFacturasArray).subscribe(

    resp => {
      console.log(JSON.stringify(this.actualizaFacturasArray), ' lista facturas json completed ')
      console.log('completed')
    }, error => {
      console.log(JSON.stringify(this.actualizaFacturasArray), ' lista facturas json  error')
      console.log('error')
  }

  )


}



}
