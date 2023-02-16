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
url = null;

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

private getRutero(id){

  const URL = this.getURL(environment.ruteroURL,id);

  console.log(URL, 'GET rutero  URL')
  return this.http.get<Rutero[]>(URL);

}

syncRutero(id){
return this.getRutero(id).toPromise();

}




private postRutero(rutero){
 const URL = this.getURL(environment.ruteroURL);

  const options = {
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json',
      'Access-Control-Allow-Origin':'*'
    }
  };
  console.log(URL,'URL')
console.log(JSON.stringify(rutero), 'JSON.stringify(rutero)')
  return this.http.post(URL,JSON.stringify(rutero), options);

}

private putActualizarRutero(rutero:Rutero){
  let URL = this.getURL(environment.ruteroURL);
  URL = URL+'?ID='+ rutero.idGuia +'&idCliente='+rutero.idCliente;
 
   const options = {
     headers: {
       'Content-Type':'application/json',
       'Accept':'application/json',
       'Access-Control-Allow-Origin':'*'
     }
   };
   console.log(URL,'URL')
 console.log(JSON.stringify(rutero), 'JSON.stringify(rutero) put rutero')
   return this.http.put(URL,JSON.stringify(rutero), options);
 
 }

 putRuteroToPromise(rutero){

  return  this.putActualizarRutero(rutero).toPromise();
 }
putRutero(){


  this.rutertoPostArrayExistentes.forEach(rutero =>{
    this.putActualizarRutero(rutero).subscribe(

      resp => {
      
        console.log(resp, ' rutero actualizado');
    
       
      }, error =>{
        this.alertasService.loadingDissmiss();
        let errorObject = {
          titulo: 'actualizar rutero',
          fecha: new Date(),
          metodo:'PUT',
          url:error.url,
          message:error.message,
          rutaError:'app/services/rutero-service.ts',
          json:JSON.stringify(this.rutertoPostArray)
        }
        this.planificacionEntregasService.errorArray.push(errorObject)
        console.log(error, ' error actualizando rutero', rutero)
       
      }
    )

  })
  this.rutertoPostArrayExistentes = []

}



insertarPostRutero(postRutero){
  console.log(postRutero, 'postRutero')


 //this.alertasService.presentaLoading('Insertando Rutero')
if(postRutero.length > 0){
  
 return this.postRutero(postRutero).toPromise();
}

}



}
