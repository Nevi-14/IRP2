import { Injectable } from '@angular/core';
import { GuiaEntrega } from '../models/guiaEntrega';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuiasService {

  guiasArray: GuiaEntrega[]=[];


  constructor(private http: HttpClient) { }

  getIRPURL( api: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +environment.postURL + api ;

    return URL;


  }

  private postActualizarGuias (guia){
    const URL = this.getIRPURL( environment.guiasURL );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };

    return this.http.post( URL, JSON.stringify(guia), options );
 
  }
  cargarArraygoFacturas(guias){
    this.guiasArray = [];
    this.guiasArray = guias;
  
    console.log(guias, 'facturas array load')
  
    }

  insertarGuias(){


 this.guiasArray.forEach( guia =>{

  console.log(  console.log(guia), ' object  actualziar guias')
  this.postActualizarGuias( guia).subscribe(
    resp => {

     console.log('completed')

    }, error => {

      console.log('error')
      
    }
  )
})
  }


  

}
