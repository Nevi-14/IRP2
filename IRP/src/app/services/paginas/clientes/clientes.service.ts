import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { LoadingController, ModalController } from '@ionic/angular';
import { Clientes } from 'src/app/models/clientes';
import { ZonasService } from '../organizacion territorial/zonas.service';
import { RutasService } from '../rutas/rutas.service';
import { environment } from 'src/environments/environment';
import { DetalleClientesPage } from 'src/app/pages/detalle-clientes/detalle-clientes.page';
import { ClienteFacturaPage } from '../../../pages/cliente-factura/cliente-factura.page';

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



  constructor(private http: HttpClient, private zonas: ZonasService, private rutas: RutasService,private loadingCtrl: LoadingController, private modalCtrl: ModalController) { }


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
      const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
      const objectElement = {
        color: color,
        Fecha: new Date().toISOString(),
        Zona: this.zonas.zona.ZONA,
        Ruta: this.rutas.ruta.RUTA,
        Usuario: 'IRP',
        TRADE_CLIENTE: this.clientes[i].TRADE_CLIENTE,
        NOMBRE:this.clientes[i].NOMBRE,
        LATITUD:this.clientes[i].LATITUD,
        LONGITUD:this.clientes[i].LONGITUD,
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




  switchModaldetalle(expression,cliente){
    switch(expression){
      case 'planificacion-rutas':
  
         this.detalleClientes(cliente);
      
        break;
      case 'rutas-facturas':
this.mostrarClienteFactura(cliente);
        break;
      default:
        // code block
    }
  }
  

  async detalleClientes(cliente){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'medium-modal',
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
         cssClass: 'medium-modal',
         componentProps: {
           cliente: cliente
         }
       });
       return await modal.present();
     }



  

}


