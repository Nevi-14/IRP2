import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { LoadingController, ModalController } from '@ionic/angular';
import { Clientes } from 'src/app/models/clientes';
import { environment } from 'src/environments/environment';
import { DetalleClientesPage } from 'src/app/pages/detalle-clientes/detalle-clientes.page';
import { ZonasService } from './zonas.service';
import { RutasService } from './rutas.service';
import { ClienteFacturaPage } from '../pages/cliente-factura/cliente-factura.page';
import { ClientesCierre } from '../models/clientesCierre';
import { ConfiguracionesService } from './configuraciones.service';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  loading: HTMLIonLoadingElement;
clientes: Clientes[]=[];
clientesRutas = [];
isChecked = false;
clientesArray = [];

//clientes actuales

rutasClientes: Clientes[]=[];
nuevosClientes: Clientes[]=[];



  constructor(
    
    private http: HttpClient,
     private zonas: ZonasService,
      private rutas: RutasService,
      private loadingCtrl: LoadingController,
       private modalCtrl: ModalController,
       public configuracionesService : ConfiguracionesService
       
       ) { }



  getURL( api: string,identifier?: string ){

    let id = identifier ? identifier : "";
    let test: string = ''
   
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api + id;
    this.configuracionesService.api = URL;

    return URL;

  }




  
  private getClientesCierre(fecha){

    const URL = this.getURL( environment.clientesClierre , fecha);
    console.log('URL',URL)
    return this.http.get<ClientesCierre[]>( URL );

  }

  





syncGetClientesCierre(fecha){

  return this.getClientesCierre(fecha).toPromise()

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



  

  async detalleClientes(cliente){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'large-modal',
      componentProps:{
        detalleCliente: cliente
      }
    });
    return await modal.present();
  }

  async mostrarClienteFactura(cliente) {
    //  alert(cliente.NOMBRE)
       const modal = await this.modalCtrl.create({
         component: ClienteFacturaPage,
         cssClass: 'large-modal',
         componentProps: {
           cliente: cliente
         }
       });
       return await modal.present();
     }



  

}


