import { Injectable } from '@angular/core';
import { Distritos } from '../models/distritos';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DistritosService {
  distritos: Distritos[]=[];

  constructor(private http: HttpClient) { }

  getIRPURL( api: string, provincia: string, canton: string ,id: string ){
    const URL = environment.preURL  + environment.postURL + api + environment.provinciaID +provincia+ environment.cantonID + canton + id;
console.log(URL);
    return URL;
  }
  private getDistritos( ){
    const URL = this.getIRPURL( environment.distritosURL,'4','01','');
    return this.http.get<Distritos[]>( URL );
  }

  syncDistritos(){
    this.getDistritos().subscribe(
      resp =>{
        this.distritos = resp.slice(0);
       console.log(this.distritos)
      }

    );
  }
}
