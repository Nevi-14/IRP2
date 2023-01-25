import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Provincias } from '../models/provicias';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {
  provincias: Provincias[]=[];

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


  private getProvincias( ){
    const URL = this.getURL( environment.provinciasURL);
    return this.http.get<Provincias[]>( URL );
  }

  syncProvincias(){
   
    this.getProvincias().subscribe(
      resp =>{
        this.provincias = resp.slice(0);

      }

    );
  }
}
