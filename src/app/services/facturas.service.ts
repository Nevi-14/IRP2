import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PlanificacionEntregas } from '../models/planificacionEntregas';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  constructor(
  public   http:HttpClient
  ) { }


  getURL(api, id){

    let test : string = '';
    
    if(!environment.prdMode){
      test = environment.TestURL;
    }
    
    const URL = environment.preURL + test  + environment.postURL +  api + id;
 
    return URL;
    
    
    }
  private getFactura(id){
    let URL = this.getURL( environment.facturasUrl,id);

    return this.http.get<PlanificacionEntregas[]>( URL );

  }

  syncGetFacturaToPromise(id){

  return  this.getFactura(id).toPromise();

  }


}
