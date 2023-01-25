import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Zonas } from '../models/zonas';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class ZonasService {
  zonas: Zonas[]=[];
  zona = {
    ZONA: '', 
    NOMBRE: ''
  }
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
  private getZonas( ){
    const URL = this.getURL( environment.zonasURL,'');
    return this.http.get<Zonas[]>( URL );
  }

  syncZonas(){
   
    this.getZonas().subscribe(
      resp =>{
        this.zonas = resp.slice(0);
        console.log('zonas', this.zonas);

      }

    );
  }
}
