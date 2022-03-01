import { Injectable } from '@angular/core';
import { DetalleClientesPage } from '../pages/detalle-clientes/detalle-clientes.page';
import { ModalController } from '@ionic/angular';
import { ServicioClientePage } from '../pages/servicio-cliente/servicio-cliente.page';
import { ClientesRutasPage } from '../pages/clientes-rutas/clientes-rutas.page';

@Injectable({
  providedIn: 'root'
})
export class ServicioClienteService {

  constructor(
public modalCtrl: ModalController

  ) { }



  async detalleClientes(cliente){
    const modal = await this.modalCtrl.create({
      component: ClientesRutasPage,
      cssClass: 'large-modal',
      componentProps:{
        cliente: cliente
      }
    });
    return await modal.present();
  }




}
