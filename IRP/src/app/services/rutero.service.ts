import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Rutero } from '../models/Rutero';
import { HttpClient } from '@angular/common/http';
import { AlertasService } from './alertas.service';
import { PlanificacionEntregasService } from './planificacion-entregas.service';

@Injectable({
  providedIn: 'root'
})
export class RuteroService {

ruteroArray: Rutero[]=[];
rutertoPostArray: Rutero[]=[];
url = null;

  constructor(
    public http: HttpClient,
    public alertasService: AlertasService,
    public planificacionEntregasService: PlanificacionEntregasService
  ) { }


getRuteroURL(api, id){
let test : string = '';

if(!environment.prdMode){
  test = environment.TestURL;
}

const URL = environment.preURL + test  + environment.postURL +  api + id;

this.url = URL;
return URL;


}

private getRutero(id){

  const URL = this.getRuteroURL(environment.ruteroURL,id);

  console.log(URL, 'POST rutero  URL')
  return this.http.get<Rutero[]>(URL);

}

syncRutero(id){
return this.getRutero(id).toPromise();

}




private postRutero(rutero){
 const URL = this.getRuteroURL(environment.ruteroURL,'');

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


insertarPostRutero(){

  this.alertasService.presentaLoading('Insertando Rutero')
  console.log(this.rutertoPostArray, 'this.rutertoPostArray')
  this.postRutero(this.rutertoPostArray).subscribe(

    resp => {
      this.alertasService.loadingDissmiss();
      console.log(resp);
  
      this.rutertoPostArray = []
  
    }, error =>{
      this.alertasService.loadingDissmiss();
      let errorObject = {
        titulo: 'Insertar rutero',
        fecha: new Date(),
        metodo:'POST',
        url:error.url,
        message:error.message,
        rutaError:'app/services/rutero-service.ts',
        json:JSON.stringify(this.rutertoPostArray)
      }
      this.planificacionEntregasService.errorArray.push(errorObject)
      console.log(error)
     
    }
  )

}



}
