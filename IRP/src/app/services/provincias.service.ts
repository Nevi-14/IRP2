import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Provincias } from '../models/provicias';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {
  provincias: Provincias[]=[];

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
  private getProvincias( ){
    const URL = this.getIRPURL( environment.provinciasURL,'');
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
