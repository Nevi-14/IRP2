import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ClienteEspejo } from '../models/clienteEspejo';
import { Clientes } from '../models/clientes';
import { ClientesService } from './clientes.service';
import { GlobalService } from './global.service';
import { MapboxGLService } from './mapbox-gl.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteEspejoService {
  clienteEspejo: ClienteEspejo;
  ClienteEspejoArray: ClienteEspejo[]=[];
  constructor(private http: HttpClient,private loadingCtrl: LoadingController, private alertCtrl: AlertController, private clientes: ClientesService, private popOverCtrl: PopoverController, private global: GlobalService, public mapboxLgService: MapboxGLService) { }

  
rutas: Clientes[]=[];
  getIRPURL( api: string, id: string ){
    let test = '';
    if(!environment.prdMode){
      test = environment.TestURL;
    }
    const URL = environment.preURL+ test  + environment.postURL + api +id;
//alert(URL);
console.log(id)
    return URL;
  }
  loading: HTMLIonLoadingElement;

  
  private getRutas(ruta){

    const URL = this.getIRPURL( environment.clientesURL , ruta);
    console.log('URL',URL)
    return this.http.get<Clientes[]>( URL );
  }

  
  syncRutas(ruta){
   // this.presentaLoading('Cargando clientes')
    this.getRutas(ruta).subscribe(
      resp =>{


       // this.loadingDissmiss();
        this.clientes.rutasClientes = [];
        this.clientes.nuevosClientes = [];
        this.clientes.rutasClientes = resp.slice(0);

        console.log(   this.clientes.rutasClientes)
        this.mapboxLgService.createmapa(false,false);
  
       // this.mapa.crearMapa(mapa,arreglo, drag  );
     //   this.global.loadingDissmiss();
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
    console.log(URL, ' url cliente espejo pines')
    return this.http.post( URL, JSON.stringify(ruta), options );
  //return this.http.post( URL, JSON.stringify(this.clienteEspejo), options );
  }

  insertarClienteEspejo(ruta){

    console.log(ruta, 'rutaaaaaa insertada')
  //  this.presentaLoading('Guardando cambios')
  
   this.postClienteEspejo(ruta).subscribe(
      

      resp => {
        
       this.mapboxLgService.marcadores = [];
        this.mapboxLgService.createmapa(false,false);
        console.log('Rutas guardadas con exito', resp);
      //  this.depositos = [];
     // this.loadingDissmiss();
    // this.loadingDissmiss();
      this.message('IRP','Las rutas se guardaron con exito');
      }, error => {
        console.log('Rerror', error);

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
