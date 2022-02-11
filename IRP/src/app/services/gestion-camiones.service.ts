import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camiones } from '../models/camiones';
import { environment } from 'src/environments/environment';
import { GuiaEntrega } from '../models/guiaEntrega';

@Injectable({
  providedIn: 'root'
})
export class GestionCamionesService {
  camiones: Camiones[]=[];



  constructor(private http: HttpClient) { }

  getIRPURL( api: string,id: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +  environment.postURL + api + id;
console.log(URL);
    return URL;
  }
  private getCamiones( ){
    const URL = this.getIRPURL( environment.camionesURL,'');
    return this.http.get<Camiones[]>( URL );
  }

  syncCamiones(){
   
    this.getCamiones().subscribe(
      resp =>{
        this.camiones = resp.slice(0);


        console.log(this.camiones, 'camiones')

      }

    );
  }
}
