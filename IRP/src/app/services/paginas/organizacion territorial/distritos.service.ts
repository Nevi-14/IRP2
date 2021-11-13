import { Injectable } from '@angular/core';
import { Distritos } from '../../../models/distritos';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DistritosService {
  distritos: Distritos[]=[];

  constructor(private http: HttpClient) { }

  getIRPURL( api: string, provincia: string, canton: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test + environment.postURL + api + environment.provinciaID +provincia+ environment.cantonID + canton;
console.log(URL);
    return URL;
  }
  private getDistritos(provincia,canton){
    const URL = this.getIRPURL( environment.distritosURL,provincia,canton);
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
