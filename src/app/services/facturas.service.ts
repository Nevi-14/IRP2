import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  constructor(
  public   http:HttpClient,
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
  private getFactura(id){
    let URL = this.getURL( environment.facturasUrl,id);

    return this.http.get<PlanificacionEntregas[]>( URL );

  }

  syncGetFacturaToPromise(id){

  return  this.getFactura(id).toPromise();

  }


}
