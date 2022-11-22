import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FacturaLineasEspejo } from '../models/FacturaLineasEspejo';
import { environment } from 'src/environments/environment';
import { Manifiesto } from '../models/manieifiesto';

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
console.log('url', URL)
return URL;


}

getURLAPI(api){
  
  let test : string = '';
  
  if(!environment.prdMode){
    test = environment.TestURL;
  }
  
  const URL = environment.preURL + test  + environment.postURL +  api;
  console.log('url', URL)
  return URL;
  
  
  }


private getActualizaFacLin(id){

  const URL = this.getURL(environment.actualizaFacLinUrl,id);
  return this.http.get<FacturaLineasEspejo[]>(URL);

}

private getManifiesto(id){

  const URL = this.getURL(environment.manifiestoURL,id);
  return this.http.get<Manifiesto[]>(URL);

}

private getActualizaFacLinGuia(id){

  let URL = this.getURLAPI(environment.actualizaFacLinUrl);

  URL = URL + environment.idParam + id;
  console.log('URL', URL)
  return this.http.get<FacturaLineasEspejo[]>(URL);

}

syncGetActualizaFacLin(id){
return  this.getActualizaFacLinGuia(id).toPromise();
}
syncGetManifiesto(id){

  return  this.getManifiesto(id).toPromise();
  }
syncFacturasToPromise(id){

return  this.getActualizaFacLin(id).toPromise();
}
syncActualizaFacLin(id, idCliente){

  this.facturaLineasEspejoArray = [];

this.getActualizaFacLin(id).subscribe(

resp => {

  resp.forEach(element => {
    
    if(element.idCliente == idCliente ){

       this.facturaLineasEspejoArray.push(element)

    }
  });

   console.log(resp)
   //alert(resp)
}, error => {

  console.log(error)
}

);

}

}
