import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfiguracionesService } from './configuraciones.service';
import { AlertasService } from './alertas.service';
import { environment } from 'src/environments/environment';
import { ActualizaClientes } from '../models/actualizaClientes';

@Injectable({
  providedIn: 'root'
})
export class ActualizaClientesService {

  constructor(
    private http: HttpClient,
    public configuracionesService : ConfiguracionesService,
    public alertasService: AlertasService
    
    ) { }

getAPI( api: string ){
 let test: string = ''
 if ( !environment.prdMode )  test = environment.TestURL;
 let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api;
 return URL;
}
 
 private getActualizaClientes(){
  let URL = this.getAPI( environment.getActualizaClientes);
      console.log('getActualizaClientes',URL)
   return this.http.get<ActualizaClientes[]>( URL );
 }

 private postActualizaCliente (actualizaCliente:ActualizaClientes){
   const URL = this.getAPI( environment.postActualizaClientes );
   const options = {
     headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json',
         'Access-Control-Allow-Origin': '*'
     }     
   };
console.log('actualizaCliente',actualizaCliente);
console.log('postActualizaCliente', URL);
   return this.http.post( URL, JSON.stringify(actualizaCliente), options );
 }

 private putActualizaCliente (actualizaCliente:ActualizaClientes){
  const URL = this.getAPI( environment.putActualizaClientes );
  const options = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }     
  };
console.log('actualizaCliente',actualizaCliente);
console.log('putActualizaCliente', URL);
  return this.http.put( URL, JSON.stringify(actualizaCliente), options );
}

     private deleteActualizaCliente(id: string) {
      let URL = this.getAPI(environment.deleteActualizaClientes);
      URL = URL + id
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
  
      };
      return this.http.delete(URL, options);
  }

syncGetActualizaClientes(){
  return this.getActualizaClientes().toPromise();
}

syncPostActualizaClientes(actualizaCliente:ActualizaClientes){
  return this.postActualizaCliente(actualizaCliente).toPromise();
}

syncPutActualizaClientes(actualizaCliente:ActualizaClientes){
  return this.putActualizaCliente(actualizaCliente).toPromise();
}

syncDeleteActualizaClientes(id:string){
  return this.deleteActualizaCliente(id).toPromise();
}



}


