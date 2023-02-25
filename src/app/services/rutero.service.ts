import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rutero } from '../models/Rutero';
import { HttpClient } from '@angular/common/http';
import { AlertasService } from './alertas.service';
import { PlanificacionEntregasService } from './planificacion-entregas.service';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class RuteroService {
ruteroArray: Rutero[]=[];
rutertoPostArray: Rutero[]=[];
rutertoPostArrayExistentes: Rutero[]=[];

  constructor(
    public http: HttpClient,
    public alertasService: AlertasService,
    public planificacionEntregasService: PlanificacionEntregasService,
    public configuracionesService: ConfiguracionesService
  ) { }

  limpiarDatos(){
    this.ruteroArray =[];
    this.rutertoPostArray =[];
    this.rutertoPostArrayExistentes =[];

  }

  getAPI( api: string ){
    let test: string = ''
    if ( !environment.prdMode ) test = environment.TestURL; 
    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api;
    this.configuracionesService.api = URL;
    return URL;
  }

private getRutero(idGuia:string){
  // GET
  // https://apiirp.di-apps.co.cr/api/Rutero/20230123CT01V3683
  let URL = this.getAPI(environment.ruteroURL);
      URL = URL + idGuia;
      console.log('getRutero',URL);
      console.log('idGuia',idGuia);
  return this.http.get<Rutero[]>(URL);
}
syncRutero(idGuia:string){
return this.getRutero(idGuia).toPromise();

}

private postRutero(rutero:Rutero[]){
  // POST
  // https://apiirp.di-apps.co.cr/api/Rutero/20230123CT01V3683
 const URL = this.getAPI(environment.ruteroURL);
  const options = {
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json',
      'Access-Control-Allow-Origin':'*'
    }
  };
  console.log('rutero:Rutero[]',rutero);
  console.log('postRutero',URL);
  return this.http.post(URL,JSON.stringify(rutero), options);
}

private putActualizarRutero(rutero:Rutero){
  // PUT
  // https://apiirp.di-apps.co.cr/api/Rutero/?ID=20230123CT01V3683&idCliente=1482
  let URL = this.getAPI(environment.ruteroURL);
  URL = URL+'?ID='+ rutero.idGuia +'&idCliente='+rutero.idCliente;
   const options = {
     headers: {
       'Content-Type':'application/json',
       'Accept':'application/json',
       'Access-Control-Allow-Origin':'*'
     }
   };
   console.log('rutero:Rutero',rutero);
   console.log('putActualizarRutero',URL);
   return this.http.put(URL,JSON.stringify(rutero), options);
 }

 putRuteroToPromise(rutero:Rutero){
  return  this.putActualizarRutero(rutero).toPromise();
 }

putRutero(){
  this.rutertoPostArrayExistentes.forEach(rutero =>{
    this.putActualizarRutero(rutero).subscribe(
      resp => {
        console.log(resp, ' rutero actualizado'); 
      }, error =>{
        this.alertasService.loadingDissmiss();
        console.log('error',error)      
      }
    )

  })
  this.rutertoPostArrayExistentes = []

}


insertarPostRutero(rutero:Rutero[]){
if(rutero.length > 0){ 
 return this.postRutero(rutero).toPromise();
}
}

}
