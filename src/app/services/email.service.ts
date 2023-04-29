import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface email {
  toEmail:string,
  file:string,
  subject:string,
  body:string
}
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    public http:HttpClient,
    
    ) { }


  getAPI(api:string){

    let test = "";
    if(!environment.prdMode) test = environment.TestURL;
    const URL = environment.preURL + test + environment.postURL + api;
    return URL;
  }

  private postEmailApi (email:email){
    const URL =  this.getAPI(environment.postEmail);
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
   console.log('URL post lineas: ', URL);
   console.log('JSON Lineas:', JSON.stringify(email));
    return this.http.post( URL, JSON.stringify(email), options );
  }
  
  syncPostEmailToPromise(email:email){
  
  return this.postEmailApi(email).toPromise();
    
  }

  

}
