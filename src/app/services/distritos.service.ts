import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Distritos } from '../models/distritos';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class DistritosService {
  distritos: Distritos[]=[];

  constructor(
    private http: HttpClient,
    public configuracionesService: ConfiguracionesService
    
    ) { }

 

  getURL( api: string, provincia: string, canton: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL+ api + environment.provinciaID +provincia+ environment.cantonID + canton;
    this.configuracionesService.api = URL;
    return URL;
  }
  private getDistritos(provincia,canton){
    const URL = this.getURL( environment.distritosURL,provincia,canton);
    return this.http.get<Distritos[]>( URL );
  }

  syncDistritos(provincia, canton){
    this.getDistritos(provincia, canton).subscribe(
      resp =>{
        this.distritos = resp.slice(0);
       console.log(this.distritos)
      }

    );
  }
}
