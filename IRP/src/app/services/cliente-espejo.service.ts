import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClienteEspejo } from '../models/clienteEspejo';

@Injectable({
  providedIn: 'root'
})
export class ClienteEspejoService {
  clienteEspejo: ClienteEspejo;
  ClienteEspejoArray: ClienteEspejo[]=[];
  constructor(private http: HttpClient) { }

  getIRPURL( api: string ){
    const URL = environment.preURL  + environment.postURL + api ;
console.log(URL);
    return URL;
  }
  

  private postEncaLiquid (){
    const URL = this.getIRPURL( environment.postCLienteEspejoURL );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(this.clienteEspejo));
    return this.http.post( URL, JSON.stringify(this.clienteEspejo), options );
  }

  insertarpostEncaLiquid(){
    this.postEncaLiquid().subscribe(
      resp => {
        console.log('Rutas guardadas con exito', resp);
      //  this.depositos = [];
      }, error => {
        console.log('Error guardados las rutas');
      }
    )
  }

}
