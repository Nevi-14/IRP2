import { Injectable } from '@angular/core';
import { Clientes } from '../models/clientes';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ZonasService } from './zonas.service';
import { RutasService } from './rutas.service';
import { LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  loading: HTMLIonLoadingElement;
clientes: Clientes[]=[];
clientesRutas = [];
isChecked = false;
clientesArray = [];


rutasClientes: Clientes[]=[];
  constructor(private http: HttpClient, private zonas: ZonasService, private rutas: RutasService,private loadingCtrl: LoadingController) { }


  getIRPURL( api: string, provincia: string , canton:string , distrito: string ,id: string ){

    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }
    const URL = environment.preURL  + test + environment.postURL + api + environment.provinciaID+provincia+ environment.cantonID+canton+ environment.distritoID+distrito+ id;
console.log(URL)
    return URL;
  }


//









  private getClientes(provincia, canton, distrito  ){
    this.clientes = [];
    const URL = this.getIRPURL( environment.clientesURL, provincia,canton,distrito,'');
    return this.http.get<Clientes[]>( URL );
  }

  syncClientes(provincia, canton, distrito ){
    this.getClientes(provincia, canton, distrito).subscribe(
      resp =>{
        this.clientes = resp
       console.log(this.clientes)
       this.syncClientesArray();
      }

    );
  }

  syncClientesArray(){
    this.clientesArray = [];
    this.isChecked = false;
    for(let i = 0; i < this.clientes.length; i++){
      const objectElement = {
        Fecha: new Date().toISOString(),
        Zona: this.zonas.zona.ZONA,
        Ruta: this.rutas.ruta.RUTA,
        Usuario: 'IRP',
        TRADE_CLIENTE: this.clientes[i].TRADE_CLIENTE,
        NOMBRE:this.clientes[i].NOMBRE,
        cliente:this.clientes[i],
        select:this.isChecked
      }
    this.clientesArray.push(objectElement)
    console.log('cleintes array',this.clientesArray);
    this.loadingDissmiss()
    }
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


