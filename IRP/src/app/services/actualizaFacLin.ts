import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FacturaLineasEspejo } from '../models/FacturaLineasEspejo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActualizaFacLinService {

  facturaLineasEspejoArray : FacturaLineasEspejo[]=[];
  constructor(
    public http: HttpClient
  ) { }


getURL(api, id){
let test : string = '';

if(!environment.prdMode){
  test = environment.TestURL;
}

const URL = environment.preURL + test  + environment.postURL +  api + id;

return URL;


}

private getActualizaFacLin(id){

  const URL = this.getURL(environment.actualizaFacLinUrl,id);
  return this.http.get<FacturaLineasEspejo[]>(URL);

}

syncActualizaFacLin(id){
this.getActualizaFacLin(id).subscribe(
resp => {

  this.facturaLineasEspejoArray = resp;
   console.log(resp)
   //alert(resp)
}, error => {

  console.log(error)
}

);

}

}
