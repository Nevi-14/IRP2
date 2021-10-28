import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Cantones } from '../models/cantones';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CantonesService {
  cantones: Cantones[]=[];

  constructor(private http: HttpClient) { }

  getIRPURL( api: string,provincia: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +environment.postURL + api + provincia;
console.log(URL);
    return URL;
  }
  private getCantones(provincia){
    const URL = this.getIRPURL( environment.cantonesURL,provincia);
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
