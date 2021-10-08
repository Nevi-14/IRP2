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

  getIRPURL( api: string,id: string ){
    const URL = environment.preURL  + environment.postURL + api + id;
console.log(URL);
    return URL;
  }
  private getCantones( ){
    const URL = this.getIRPURL( environment.cantonesURL,'1');
    return this.http.get<Cantones[]>( URL );
  }

  syncCantones(){
    this.getCantones().subscribe(
      resp =>{
        this.cantones = resp.slice(0);
       console.log(this.cantones)
      }

    );
  }
}
