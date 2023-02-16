import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FacturaLineasEspejo } from '../models/FacturaLineasEspejo';
import { environment } from 'src/environments/environment';
import { Manifiesto } from '../models/manieifiesto';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class ActualizaFacLinService {

  facturaLineasEspejoArray : FacturaLineasEspejo[]=[];
  constructor(
    public http: HttpClient,
    public configuracionesService: ConfiguracionesService
  ) { }


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
getURLAPI(api){
  
  let test : string = '';
  
  if(!environment.prdMode){
    test = environment.TestURL;
  }
  
  const URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL +  api;
  this.configuracionesService.api = URL;
  return URL;
  
  
  }


private getActualizaFacLin(id){

  const URL = this.getURL(environment.actualizaFacLinUrl,id);
  console.log('URL', URL)
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
