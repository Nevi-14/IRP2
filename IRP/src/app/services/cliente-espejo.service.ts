import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClienteEspejo } from '../models/clienteEspejo';
import { Rutas } from '../models/rutas';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ClienteEspejoService {
  clienteEspejo: ClienteEspejo;
  ClienteEspejoArray: ClienteEspejo[]=[];
  constructor(private http: HttpClient,private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }
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
      this.message('IRP','Las rutas se guardaron con exito');
      }, error => {
        console.log('ruta', ruta);
        this.message('IRP','Error guardados las rutas');
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

  async  message(header,message){
    
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

}
}
