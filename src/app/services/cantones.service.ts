import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Cantones } from '../models/cantones';
import { HttpClient } from '@angular/common/http';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class CantonesService {
  cantones: Cantones[]=[];

  constructor(
    private http: HttpClient,
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
  private getCantones(provincia){
    const URL = this.getURL( environment.cantonesURL,provincia);
    return this.http.get<Cantones[]>( URL );
  }

  syncCantones(provincia){
    this.getCantones(provincia).subscribe(
      resp =>{
        this.cantones = resp.slice(0);
       console.log(this.cantones)
      }

    );
  }
}
