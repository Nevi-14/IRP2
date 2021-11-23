import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClienteEspejo } from '../../../models/clienteEspejo';
import { Rutas } from '../../../models/rutas';
import { AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { Clientes } from '../../../models/clientes';

import { ClientesService } from './clientes.service';
import { MapService } from '../../componentes/mapas/map.service';
import { MapaService } from '../../componentes/mapas/mapa.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteEspejoService {
  clienteEspejo: ClienteEspejo;
  ClienteEspejoArray: ClienteEspejo[]=[];
  constructor(private http: HttpClient,private loadingCtrl: LoadingController, private alertCtrl: AlertController, private clientes: ClientesService, private mapa: MapService, private popOverCtrl: PopoverController, private map: MapaService) { }

  
rutas: Clientes[]=[];
  getIRPURL( api: string, id: string ){
    let test: string = '';

    if ( !environment.prdMode ) {
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

  syncRutas(mapa, ruta){
    this.getRutas(ruta).subscribe(
      resp =>{
        this.clientes.rutasClientes = [];
        console.log(resp,'re')
        this.clientes.rutasClientes = resp.slice(0);

    if(mapa){
      this.map.leerMarcador([{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes}]);
      console.log(this.clientes.rutasClientes,'rutas consulta')
      this.map.crearMapa(mapa);
    }
   

     //  this.popOverCtrl.dismiss({
       // statement:true
      //});
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
