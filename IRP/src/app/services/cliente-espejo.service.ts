import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClienteEspejo } from '../models/clienteEspejo';
import { Rutas } from '../models/rutas';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ClienteEspejoService {
  clienteEspejo: ClienteEspejo;
  ClienteEspejoArray: ClienteEspejo[]=[];
  constructor(private http: HttpClient,private loadingCtrl: LoadingController) { }
rutas: ClienteEspejo[]=[];
  getIRPURL( api: string, id: string ){
    const URL = environment.preURL  + environment.postURL + api +id;
console.log(URL);
console.log(id)
    return URL;
  }
  loading: HTMLIonLoadingElement;
  private getRutas(ruta){
    const URL = this.getIRPURL( environment.postCLienteEspejoURL , ruta);
    console.log('URL',URL)
    return this.http.get<ClienteEspejo[]>( URL );
  }

  syncRutas(ruta){
    this.getRutas(ruta).subscribe(
      resp =>{
        this.rutas = resp.slice(0);
       console.log(this.rutas)
      }

    );
  }
  

  private postClienteEspejo (ruta){
    const URL = this.getIRPURL( environment.postCLienteEspejoURL,'' );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
    console.log(JSON.stringify(this.clienteEspejo));
    return this.http.post( URL, JSON.stringify(ruta), options );
  //  return this.http.post( URL, JSON.stringify(this.clienteEspejo), options );
  }

  insertarClienteEspejo(ruta){
    this.postClienteEspejo(ruta).subscribe(
      
      resp => {
        console.log('Rutas guardadas con exito', resp);
      //  this.depositos = [];
      this.loadingDissmiss();
      }, error => {
        console.log('ruta', ruta);
        console.log('Error guardados las rutas');
      }
    )
  }


   async presentaLoading( mensaje: string ){
    this.loading = await this.loadingCtrl.create({
      message: mensaje,
    });
    await this.loading.present();
  }
   loadingDissmiss(){
    this.loading.dismiss();
  }
}
